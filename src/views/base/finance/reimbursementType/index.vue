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
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import {
  getPageList,
  getDetail,
  updateStatus,
} from "@/api/finance/reimbursement/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");

const route = useRoute();
const router = useRouter();
const tableList = ref(null);
const addDialogRef = ref(null);

/** 新增按钮操作 */
function handleAdd() {
  addDialogRef.value.open();
}

/** 编辑按钮操作 */
async function handleEdit(row) {
  // 获取详情数据
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openEdit(res.data || res);
  }
}

/** 查看按钮操作 */
async function handleView(row) {
  // 获取详情数据
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}

/** 禁用按钮操作 */
function handleDisable(row) {
  proxy.$modal.confirm('确定要禁用该类型吗？').then(() => {
    updateStatus({ id: row.id, status: 0 }).then(() => {
      proxy.$modal.msgSuccess("禁用成功");
      tableList.value.refresh();
    });
  }).catch(() => {});
}

/** 启用按钮操作 */
function handleEnable(row) {
  proxy.$modal.confirm('确定要启用该类型吗？').then(() => {
    updateStatus({ id: row.id, status: 1 }).then(() => {
      proxy.$modal.msgSuccess("启用成功");
      tableList.value.refresh();
    });
  }).catch(() => {});
}

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView, handleDisable, handleEnable);
</script>
<style lang="scss" scoped></style>
