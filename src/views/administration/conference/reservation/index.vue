<template>
  <div class="main-content">
    <TableList
      :api="getPageListFix"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="id"
      ref="tableList"
    >
      <template #createTime="{ row }">
        <span>{{ row.createTime }}</span>
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, deletereward } from "@/api/administration/conference/reservation/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const tableList = ref(null);
const addDialogRef = ref(null);

const getPageListFix = async (params) => {
  const res = await getPageList(params);
  if (res.rows && Array.isArray(res.rows)) {
    res.rows = res.rows.map(item => {
      if (Array.isArray(item)) {
        const data = item[0] || {};
        data.roomName = item[1] || ""; 
        return data;
      }
      return item;
    });
  }
  return res;
};

function handleAdd() {
  addDialogRef.value.open();
}

// 编辑
async function handleEdit(row) {
  const realRow = Array.isArray(row) ? row[0] : row;
  addDialogRef.value.openEdit(realRow);
}

// 查看
async function handleView(row) {
  const realRow = Array.isArray(row) ? row[0] : row;
  addDialogRef.value.openView(realRow);
}

async function handleDelete(row) {
  proxy.$modal.confirm("确定删除该会议室预定吗？").then(async () => {
    await deletereward(row.id);
    proxy.$modal.msgSuccess("删除成功");
    tableList.value.refresh();
  }).catch(() => {});
}

function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete);
</script>