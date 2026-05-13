<template>
  <div class="tabs-container">
    <TableList
      :api="getPageList"
      :columns="currColumns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :params="tableParams"
      row-key="id"
      ref="tableList"
    />
    <AddDialog
      ref="addDialogRef"
      @success="handleSuccess"
      :type="type"
      :label="label"
      :invoiceId="invoiceId"
    />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, computed, onMounted, watch } from "vue";
import TableList from "@/components/tableList/index.vue";
//src/api/financial/paymentMsg/index.js
import { getPageList, del } from "@/api/financial/paymentMsg";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";
import AddDialog from "./components/add.vue";

const props = defineProps({
  type: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  invoiceId: {
    type: [String, Number],
    default: null,
  },
  payStatus: {
    type: [String, Number],
    default: null,
  },
  invoiceAmount: {
    type: [String, Number],
    default: null,
  },
});

const currColumns = computed(() => {
  if (props.invoiceId) {
    return columns.map((item) => {
      delete item.searchable;
      return item;
    });
  }
  return columns;
});

const { proxy } = getCurrentInstance();
const tableList = ref(null);
const addDialogRef = ref(null);
const paymentTotalAmount = ref(0); // 已付款总金额
const paymentListData = ref([]); // 付款列表数据

// 表格参数，包含 invoiceId（如果存在）
const tableParams = computed(() => {
  const params = { tab: props.type };
  if (props.invoiceId) {
    params.ticketId = props.invoiceId;
  }
  return params;
});

/** 新增按钮操作 */
function handleAdd() {
  addDialogRef.value.open();
}

/** 新增成功回调 */
async function handleSuccess() {
  tableList.value.refresh();
  // 重新获取付款列表数据，计算总额
  await fetchPaymentList();
}

/** 删除按钮操作 */
async function handleDelete(row) {
  try {
    await proxy.$modal.confirm("确认删除该发票吗？");
    await del(row.id);
    proxy.$modal.msgSuccess("删除成功");
    handleSuccess();
  } catch (e) {
    console.error("删除失败", e);
  }
}

/** 计算已付款总金额 */
function calculatePaymentTotal() {
  if (paymentListData.value && paymentListData.value.length > 0) {
    paymentTotalAmount.value = paymentListData.value.reduce((sum, item) => {
      return sum + (Number(item.amount) || 0);
    }, 0);
  } else {
    paymentTotalAmount.value = 0;
  }
}

/** 获取付款列表数据 */
async function fetchPaymentList() {
  if (!props.invoiceId) return;

  try {
    const res = await getPageList({
      tab: props.type,
      ticketId: props.invoiceId,
      pageNum: 1,
      pageSize: 1000, // 获取所有数据
    });
    if (res && res.rows) {
      paymentListData.value = res.rows;
      calculatePaymentTotal();
    }
  } catch (e) {
    console.error("获取付款列表失败", e);
  }
}

// 监听 invoiceId 变化，重新获取数据
watch(() => props.invoiceId, (newVal) => {
  if (newVal) {
    fetchPaymentList();
  }
}, { immediate: true });

// 如果发票存在且付款状态不是"全款完成"(假设值为2)，则显示新增按钮
const headerButs = computed(() => {
  // 如果存在发票金额和已付款总金额，进行比较
  if (props.invoiceAmount && props.invoiceAmount !== null) {
    // 如果已付款总金额 >= 发票金额，则隐藏新增按钮
    if (paymentTotalAmount.value >= Number(props.invoiceAmount)) {
      return [];
    }
    return getHeaderButs(handleAdd);
  }
  // 原有逻辑：payStatus: 2 表示全款完成，此时不显示新增按钮
  if (props.invoiceId && props.payStatus !== 2) {
    return getHeaderButs(handleAdd);
  }
  return [];
});

// 操作栏与新增按钮同步显示
const operationColumn = computed(() => {
  // 与新增按钮使用相同的条件 props.invoiceId && props.payStatus !== 2
  if (props.invoiceId ) {
    return getOperationColumn(handleDelete);
  }
  return null;
});
</script>
<style lang="scss" scoped>
.tabs-container {
  height: calc(100% - 50px);
}
</style>
