<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :params="{ tab: type }"
      row-key="name"
      ref="tableList"
    >
      <template #status="{ row }">
        <dict-tag :options="note_status" :value="row.status" />
      </template>
      <template #sourse="{ row }">
        <dict-tag :options="note_sourse" :value="row.sourse" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, del } from "@/api/administration/notice";
import { getColumns, getHeaderButs, getOperationColumn } from "./config/colums";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { note_status, note_sourse } = proxy.useDict("note_status", "note_sourse");

const tableList = ref(null);
const addDialogRef = ref(null);

function handleAdd() {
  addDialogRef.value.open();
}

async function handleEdit(row) {
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openEdit(res.data || res);
  }
}

async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}

function handleSuccess() {
  tableList.value.refresh();
}

async function handleDelete(row) {
  try {
    await proxy.$modal.confirm('确认删除该公告吗？');
    await del(row.id);
    proxy.$modal.msgSuccess("删除成功");
    handleSuccess();
  } catch (e) {
    console.error('删除失败', e);
  }
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete);
const columns = getColumns();
</script>
<style lang="scss" scoped>
.main-content {
  height: 100%;
}
</style>
