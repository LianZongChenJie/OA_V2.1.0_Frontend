<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="id"
      ref="tableList"
    >
      <template #status="{ row }">
        <dict-tag :options="message_module_status" :value="row.status" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getMessageModuleDetail, updateStatus, deleteMessageModule } from "@/api/base/contract/supplier/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");

const tableList = ref(null);
const addDialogRef = ref(null);

// 新增
function handleAdd() {
  addDialogRef.value.open();
}

// 编辑前先调用详情接口
async function handleEdit(row) {
  const res = await getMessageModuleDetail(row.id);
  res.data.status = row.status;
  addDialogRef.value.openEdit(res.data);
}

// 查看前先调用详情接口
async function handleView(row) {
  const res = await getMessageModuleDetail(row.id);
  res.data.status = row.status;
  addDialogRef.value.openView(res.data);
}

/** 禁用/启用按钮操作 */
async function handleDisable(row) {
  const newStatus = row.status === 1 ? 0 : 1;
  proxy.$modal
    .confirm(`确定要${row.status === 1 ? '禁用' : '启用'}该行政数据吗?`)
    .then(async () => {
      const res = await updateStatus(row.id, { status: newStatus });
      
      if (res) {
        proxy.$modal.msgSuccess(`${newStatus === 1 ? '启用' : '禁用'}成功`);
        tableList.value.refresh();
      }
    })
    .catch(() => {});
}

// 删除
async function handleDelete(row) {
  proxy.$modal.confirm("确定要删除该供应商吗？删除后无法恢复！").then(async () => {
    await deleteMessageModule(row.id);
    proxy.$modal.msgSuccess("删除成功");
    tableList.value.refresh();
  }).catch(() => {});
}

// 成功回调
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(
  handleEdit, 
  handleView, 
  handleDisable, 
  handleDisable, 
  handleDelete
);
</script>

<style lang="scss" scoped>
</style>