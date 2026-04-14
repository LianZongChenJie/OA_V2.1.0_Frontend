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
      <!-- 时间格式化用本地函数，不依赖全局 $formatDate -->
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
        // 把会议室名称赋值进去
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
  // 🔥 直接用列表里的真实对象，不请求详情
  const realRow = Array.isArray(row) ? row[0] : row;
  addDialogRef.value.openEdit(realRow);
}

// 查看
async function handleView(row) {
  // 🔥 直接用列表里的真实对象
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