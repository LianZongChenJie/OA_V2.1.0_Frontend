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
      <template #checkStatus="{ row }">
        <dict-tag :options="check_status" :value="row.checkStatus" />
      </template>
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
const { check_status } = proxy.useDict("check_status");
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

// 编辑 - 必须调用 getDetail 获取完整数据
async function handleEdit(row) {
  const realRow = Array.isArray(row) ? row[0] : row;
  // 关键：调用 getDetail 获取完整数据（包含审批字段）
  const res = await getDetail(realRow.id);
  if (res) {
    addDialogRef.value.openEdit(res.data || res);
  }
}

// 查看 - 必须调用 getDetail 获取完整数据
async function handleView(row) {
  const realRow = Array.isArray(row) ? row[0] : row;
  // 关键：调用 getDetail 获取完整数据（包含审批字段）
  const res = await getDetail(realRow.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}

async function handleDelete(row) {
  const realRow = Array.isArray(row) ? row[0] : row;
  proxy.$modal.confirm("确定删除该会议室预定吗？").then(async () => {
    await deletereward(realRow.id);
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