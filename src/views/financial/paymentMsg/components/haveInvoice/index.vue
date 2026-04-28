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
import { ref, getCurrentInstance, computed } from "vue";
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
function handleSuccess() {
  tableList.value.refresh();
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

// 如果发票存在且付款状态不是"全款完成"(假设值为2)，则显示新增按钮
const headerButs = computed(() => {
  // payStatus: 2 表示全款完成，此时不显示新增按钮
  if (props.invoiceId && props.payStatus !== 2) {
    return getHeaderButs(handleAdd);
  }
  return [];
});
const operationColumn = getOperationColumn(handleDelete);
</script>
<style lang="scss" scoped>
.tabs-container {
  height: calc(100% - 50px);
}
</style>
