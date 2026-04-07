<template>
  <div class="tabs-container">
    <TableList
      :api="getPageList"
      :params="{ cateId }"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="name"
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
import { reactive, ref, getCurrentInstance, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import {
  getPageList,
  getDetail,
  updateStatus,
} from "@/api/base/contract/procurement/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const props = defineProps({
  cateId: {
    type: [String, Number],
    default: null
  }
});

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
function handleEdit(row) {
  addDialogRef.value.openEdit(row);
}

/** 查看按钮操作 */
async function handleView(row) {
  // 获取详情数据
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}

/** 禁用/启用按钮操作 */
async function handleDisable(row) {
  const newStatus = row.status === 1 ? 0 : 1;
  proxy.$modal
    .confirm(`确定要${row.status === 1 ? "禁用" : "启用"}该行政数据吗?`)
    .then(async () => {
      const res = await updateStatus({ id: row.id, status: newStatus });

      if (res) {
        proxy.$modal.msgSuccess(`${newStatus === 1 ? "启用" : "禁用"}成功`);
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
const operationColumn = getOperationColumn(
  handleEdit,
  handleView,
  handleDisable,
);
</script>
<style lang="scss" scoped>
.tabs-container {
  height: calc(100% - 10px);
}
</style>
