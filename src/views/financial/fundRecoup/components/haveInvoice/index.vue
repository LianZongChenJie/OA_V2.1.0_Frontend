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
import { getPageList, del } from "@/api/financial/fundRecoup";
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
    params.id = props.invoiceId;
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

const headerButs = props.invoiceId ? getHeaderButs(handleAdd) : [];
// const operationColumn = getOperationColumn(handleDelete);
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
  height: calc(100% - 80px);
}
</style>
