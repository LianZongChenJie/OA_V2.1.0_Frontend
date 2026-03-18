<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="name"
      ref="tableList"
    >
      <template #status="{ row }">
        <dict-tag :options="approval_module_status" :value="row.status" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>
<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail } from "@/api/base/common/approvalModule/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { approval_module_status } = proxy.useDict("approval_module_status");

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

/** 禁用/启用按钮操作 */
function handleDisable(row) {
  proxy.$modal
    .confirm(`确定要${row.status === 1 ? '禁用' : '启用'}该审批模块吗?`)
    .then(() => {
      // 这里需要调用禁用/启用API
      proxy.$modal.msgSuccess(`${row.status === 1 ? '禁用' : '启用'}成功`);
      tableList.value.refresh();
    })
    .catch(() => {});
}

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleDisable);
</script>
<style lang="scss" scoped></style>
