<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="name"
      ref="tableList"
      :row-class-name="getRowClassName"
    >
      <template #isTenderSubmitted="{ row }">
        <dict-tag :options="s_f_c" :value="row.isTenderSubmitted" />
      </template>
      <template #isDepositPaid="{ row }">
        <dict-tag :options="s_f_c" :value="row.isDepositPaid" />
      </template>
      <template #isDepositRefunded="{ row }">
        <dict-tag :options="s_f_c" :value="row.isDepositRefunded" />
      </template>
      <template #bidResult="{ row }">
        <dict-tag :options="bid_result" :value="row.bidResult" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
    <ImportDialog
      ref="importDialogRef"
      download-template-url="/tender/import/template"
      :upload-excel-api="importData"
      @success="handleSuccess"
    />
  </div>
</template>
<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, del, importData, exportData } from "@/api/bidding/bidInfo";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";
import AddDialog from "./components/add.vue";
import ImportDialog from "./components/importDialog.vue";
import { downloadFile } from "@/utils/download";

const { proxy } = getCurrentInstance();
const { s_f_c, bid_result } = proxy.useDict("s_f_c", "bid_result");

const route = useRoute();
const tableList = ref(null);
const addDialogRef = ref(null);
const importDialogRef = ref(null);

/** 新增按钮操作 */
function handleAdd() {
  addDialogRef.value.open();
}

/** 导入按钮操作 */
function handleImport() {
  importDialogRef.value.open();
}

/** 编辑按钮操作 */
async function handleEdit(row) {
  // 获取详情数据
  const res = await getDetail(row.id);
  if (res && res.data) {
    // 接口返回结构: data.tender + data.attachments
    const detailData = res.data.tender || {};
    detailData.attachments = res.data.attachments || [];
    addDialogRef.value.openEdit(detailData);
  }
}

/** 查看按钮操作 */
async function handleView(row) {
  // 获取详情数据
  const res = await getDetail(row.id);
  if (res && res.data) {
    // 接口返回结构: data.tender + data.attachments
    const detailData = res.data.tender || {};
    detailData.attachments = res.data.attachments || [];
    addDialogRef.value.openView(detailData);
  }
}

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

/** 删除按钮操作 */
async function handleDelete(row) {
  try {
    await proxy.$modal.confirm("确认删除该条信息么？");
    await del(row.id);
    proxy.$modal.msgSuccess("删除成功");
    handleSuccess();
  } catch (e) {
    console.error("删除失败", e);
  }
}

/** 导出按钮操作 */
async function handleExport() {
  const queryParams = tableList.value.getQueryParams();
  try {
    const res = await exportData(queryParams);
    downloadFile(
      window.URL.createObjectURL(new Blob([res])),
      `招标信息导出_${proxy.parseTime(new Date(), '{y}-{m}-{d}')}.xlsx`
    );
  } catch (e) {
    proxy.$modal.msgError("导出失败");
  }
}

const headerButs = getHeaderButs(handleAdd, handleImport, handleExport);
const operationColumn = getOperationColumn(
  handleEdit,
  handleView,
  handleDelete,
);

/** 根据是否投标和中标结果设置行样式 */
function getRowClassName({ row }) {
  // isTenderSubmitted='是'表示已投标
  if (row.isTenderSubmitted === "是") {
    // 查找中标选项的值
    const winnerOption = bid_result.value.find((item) => item.label === "中标");
    if (winnerOption && row.bidResult === winnerOption.value) {
      return "row-winner";
    }
    return "row-submitted";
  }
  return "row-not-submitted";
}
</script>
<style lang="scss" scoped>
:deep(.row-submitted) {
  background-color: #fff !important;
  .el-table__cell {
    background-color: #fff !important;
  }
}
:deep(.row-winner) {
  background-color: var(--el-color-danger-light-7) !important;
  .el-table__cell {
    background-color: var(--el-color-danger-light-7) !important;
  }
}
:deep(.row-not-submitted) {
  background-color: var(--el-color-success-light-5) !important;
  .el-table__cell {
    background-color: var(--el-color-success-light-5) !important;
  }
}
</style>
