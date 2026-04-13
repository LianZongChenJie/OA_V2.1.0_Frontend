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
        <span>{{ $formatDate(row.createTime) }}</span>
      </template>
      <template #updateTime="{ row }">
        <span>{{ $formatDate(row.updateTime) }}</span>
      </template>

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
import { getPageList, getDetail, deletereward } from "@/api/administration/conference/room/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");

const tableList = ref(null);
const addDialogRef = ref(null);


const getPageListFix = async (params) => {
  const res = await getPageList(params);

  if (res.rows && Array.isArray(res.rows)) {
    res.rows = res.rows.map(item => {
      if (!Array.isArray(item)) return item;
      
      const data = item[0] || {};
      data.keepName = item[1] || '';
      return data;
    }).filter(Boolean);
  }

  return res;
};

// 新增
function handleAdd() {
  addDialogRef.value.open();
}

async function handleEdit(row) {
  const res = await getDetail(row.id);
  if (res) addDialogRef.value.openEdit(res.data || res);
}
async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) addDialogRef.value.openView(res.data || res);
}

// 删除
async function handleDelete(row) {
  proxy.$modal.confirm("确定删除会议室吗？").then(async () => {
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