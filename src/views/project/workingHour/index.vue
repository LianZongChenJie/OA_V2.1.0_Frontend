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
      <template #workTimeRange="{ row }">
        <span>{{ row.startTimeStr?.substring(0, 16) }} 至 {{ row.endTimeStr?.substring(0, 16) }}</span>
      </template>
    </TableList>

    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, deletereward } from "@/api/project/workingHour/index.js";

// 表格配置
import { columns,  getOperationColumn } from "./config/columns";

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

const handleEdit = async (row) => {
  const res = await getDetail(row.id);
  addDialogRef.value.openEdit(res.data || res);
};

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

const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete);
</script>