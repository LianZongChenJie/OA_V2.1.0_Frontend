<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="userId"
      ref="tableList"
    >
      <template #status="{ row }">
        <dict-tag :options="employee_status" :value="row.status" />
      </template>
       <template #sex="{ row }">
        <dict-tag :options="sys_user_sex" :value="row.sex" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>
<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, deleteEmployee } from "@/api/personnel/employee/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { employee_status,sys_user_sex } = proxy.useDict("employee_status","sys_user_sex");

const route = useRoute();
const router = useRouter();
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

/** 删除按钮操作 */
async function handleDelete(row) {
  proxy.$modal
    .confirm("确定要永久删除该数据吗？删除后无法恢复！")
    .then(async () => {
      const res = await deleteEmployee(row.id);
      if (res) {
        proxy.$modal.msgSuccess("删除成功");
        tableList.value.refresh();
      }
    })
    .catch(() => {});
}

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleDelete, handleView);
</script>
<style lang="scss" scoped></style>
