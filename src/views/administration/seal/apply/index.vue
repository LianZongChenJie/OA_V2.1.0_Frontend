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
        <dict-tag :options="seal_check_status" :value="row.checkStatus" />
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
import { getPageList, getDetail, del } from "@/api/administration/seal/apply";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { seal_check_status,seal_type } = proxy.useDict("seal_check_status","seal_type");

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
    await proxy.$modal.confirm("确认删除该公文吗？");
    await del(row.id);
    proxy.$modal.msgSuccess("删除成功");
    handleSuccess();
  } catch (e) {
    console.error("删除失败", e);
  }
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(
  handleEdit,
  handleView,
  handleDelete,
);
</script>
