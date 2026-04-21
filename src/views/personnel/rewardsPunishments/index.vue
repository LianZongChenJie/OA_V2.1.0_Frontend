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
        <dict-tag :options="supplier_status" :value="row.status" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, deleteDeptChange } from "@/api/personnel/rewardsPunishments/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { supplier_status } = proxy.useDict("supplier_status");

const tableList = ref(null);
const addDialogRef = ref(null);

const loadUsers = async () => {
  const res = await listUser({ pageSize: 1000 });
  const users = res.rows || res.data?.rows || [];
  searchEnum.userList = users.map(u => ({
    label: u.nickName || u.userName || "",
    value: u.userId,
  }));
  return users;
};

// 新增
function handleAdd() {
  addDialogRef.value.open();
}

// 编辑
async function handleEdit(row) {
  const res = await getDetail(row.id); 
  addDialogRef.value.openEdit(res.data);
}

// 查看
async function handleView(row) {
  const res = await getDetail(row.id); 
  addDialogRef.value.openView(res.data);
}


// 删除
async function handleDelete(row) {
  proxy.$modal.confirm("确定要删除该奖罚项目吗？").then(async () => {
    await deleteDeptChange(row.id);
    proxy.$modal.msgSuccess("删除成功");
    tableList.value.refresh();
  }).catch(() => {});
}

// 成功回调
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn( 
  handleEdit,
  handleView, 
  handleDelete
);
</script>

<style lang="scss" scoped>
</style>