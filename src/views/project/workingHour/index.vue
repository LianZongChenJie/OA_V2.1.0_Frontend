<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="id"
      ref="tableList"
    />

    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";

// 使用 workingHour 接口
import { getPageList, getDetail, deletereward } from "@/api/project/workingHour/index.js";

// 表格配置
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";

// 弹窗
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();

const tableList = ref(null);
const addDialogRef = ref(null);
function handleAdd() {
  addDialogRef.value.open();
}

async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) addDialogRef.value.openView(res.data || res);
}

async function handleDelete(row) {
  proxy.$modal.confirm("确定删除该记录吗？").then(async () => {
    await deletereward(row.id);
    proxy.$modal.msgSuccess("删除成功");
    tableList.value.refresh();
  }).catch(() => {});
}

function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleDelete, handleView);
</script>