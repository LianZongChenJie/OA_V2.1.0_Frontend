<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="name"
      ref="tableList"
    >
      <template #checkStatus="{ row }">
        <dict-tag :options="check_status" :value="row.checkStatus" />
      </template>
       <template #sealStatus="{ row }">
        <dict-tag :options="seal_status" :value="row.sealStatus" />
      </template>
       <template #sealCateId="{ row }">
        <dict-tag :options="seal_type" :value="row.sealCateId" />
      </template>
    </TableList>
    <AddDialog
      ref="addDialogRef"
      @success="handleSuccess"
    />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, del, returnSeal } from "@/api/administration/seal/apply";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { check_status,seal_type,seal_status } = proxy.useDict("check_status","seal_type","seal_status");

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

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

/** 删除按钮操作 */
async function handleDelete(row) {
  try {
    await proxy.$modal.confirm("确认删除该用章申请吗？");
    await del(row.id);
    proxy.$modal.msgSuccess("删除成功");
    handleSuccess();
  } catch (e) {
    console.error("删除失败", e);
  }
}

/** 还章申请按钮操作 */
async function handleReturnSeal(row) {
  try {
    await proxy.$modal.confirm("确认还章吗？");
    await returnSeal(row.id);
    proxy.$modal.msgSuccess("还章成功");
    handleSuccess();
  } catch (e) {
    console.error("还章失败", e);
  }
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(
  handleEdit,
  handleView,
  handleDelete,
  handleReturnSeal,
);
</script>
