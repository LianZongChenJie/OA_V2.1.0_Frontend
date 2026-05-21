
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
        <dict-tag :options="message_module_status" :value="row.status" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getMessageModuleDetail, changeStatus } from "@/api/base/common/messageModule/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns.js";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");

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
  const res = await getMessageModuleDetail(row.id);
  if (res) {
    addDialogRef.value.openEdit(res.data || res);
  }
}

/** 查看按钮操作 */
async function handleView(row) {
  // 获取详情数据
  const res = await getMessageModuleDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

async function handleChangeStatus(row) {
  const action = row.status === 1 ? '禁用' : '启用';
  const newStatus = row.status === 1 ? 0 : 1;
  
  proxy.$modal
    .confirm(`确定要${action}该消息模版吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
      try {
        await changeStatus({ id: row.id, status: newStatus });
        proxy.$modal.msgSuccess(`${action}成功`);
        tableList.value.refresh();
      } catch (error) {
        proxy.$modal.msgError(`${action}失败`);
      }
    })
    .catch(() => {
      proxy.$modal.msgInfo('已取消操作');
    });
}

/** 复制按钮操作 */
async function handleCopy(row) {
  const res = await getMessageModuleDetail(row.id);
  if (res) {
    addDialogRef.value.openCopy(res.data || res);
  }
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView, handleChangeStatus, handleCopy);
</script>

<style lang="scss" scoped></style>