<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="operId"
      ref="tableList"
      :default-sort="{ prop: 'operTime', order: 'descending' }"
      @selection-change="handleSelectionChange"
    >
      <template #businessType="{ row }">
        <dict-tag :options="sys_oper_type" :value="row.businessType" />
      </template>
      <template #status="{ row }">
        <dict-tag :options="sys_common_status" :value="row.status" />
      </template>
      <template #operTime="{ row }">
        <span>{{ parseTime(row.operTime) }}</span>
      </template>
      <template #costTime="{ row }">
        <span>{{ row.costTime }}毫秒</span>
      </template>
    </TableList>
    <DetailDialog ref="detailDialogRef" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, computed } from "vue";
import TableList from "@/components/tableList/index.vue";
import { list, delOperlog, cleanOperlog } from "@/api/monitor/operlog";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns.js";
import DetailDialog from "./components/detail.vue";

const { proxy } = getCurrentInstance();
const { sys_oper_type, sys_common_status } = proxy.useDict("sys_oper_type", "sys_common_status");

const tableList = ref(null);
const detailDialogRef = ref(null);
const ids = ref([]);
const multiple = ref(true);

/** 获取分页列表 */
function getPageList(params) {
  return list(params);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.operId);
  multiple.value = !selection.length;
  // 更新头部按钮的禁用状态
  headerButs.value[0].disabled = multiple.value;
}

/** 查看按钮操作 */
function handleView(row) {
  detailDialogRef.value.open(row);
}

/** 删除按钮操作 */
function handleDelete(row) {
  const operIds = row ? row.operId : ids.value;
  proxy.$modal.confirm('是否确认删除日志编号为"' + operIds + '"的数据项?').then(function () {
    return delOperlog(operIds);
  }).then(() => {
    tableList.value.refresh();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 清空按钮操作 */
function handleClean() {
  proxy.$modal.confirm("是否确认清空所有操作日志数据项?").then(function () {
    return cleanOperlog();
  }).then(() => {
    tableList.value.refresh();
    proxy.$modal.msgSuccess("清空成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  const queryParams = tableList.value.getQueryParams();
  proxy.download("monitor/operlog/export", {
    ...queryParams,
  }, `config_${new Date().getTime()}.xlsx`);
}

const headerButs = computed(() => getHeaderButs(handleDelete, handleClean, handleExport));
const operationColumn = getOperationColumn(handleView);
</script>

<style lang="scss" scoped></style>
