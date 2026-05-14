<template>
  <div class="tabs-container">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :params="{ tab: type }"
      row-key="id"
      ref="tableList"
    >
      <template #checkStatus="{ row }">
        <dict-tag :options="check_status" :value="Number(row.checkStatus)" />
      </template>
      <template #types="{ row }">
        <dict-tag :options="seal_contract_types" :value="Number(row.types)" />
      </template>
      <template #effTime="{ row }">
        {{ row.startTime }} ~ {{ row.endTime }}
      </template>
    </TableList>
    <AddDialog
      ref="addDialogRef"
      @success="handleSuccess"
      :type="type"
      :label="label"
    />
  </div>
</template>
<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import {
  getPageList,
  getDetail,
  del,
  archive,
  stop,
  invalid,
} from "@/api/contract/salesContract";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";
import AddDialog from "./components/add.vue";

const props = defineProps({
  type: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const { proxy } = getCurrentInstance();
const { check_status, seal_contract_types } = proxy.useDict(
  "check_status",
  "seal_contract_types",
);

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

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

/** 删除按钮操作 */
async function handleDelete(row) {
  try {
    await proxy.$modal.confirm("确认删除该合同吗？");
    await del(row.id);
    proxy.$modal.msgSuccess("删除成功");
    handleSuccess();
  } catch (e) {
    console.error("删除失败", e);
  }
}

/** 归档按钮操作 */
async function handleArchive(row) {
  try {
    await proxy.$modal.confirm("确认归档该合同吗？");
    await archive({
      contractType: "sale",
      contractId: row.id,
    });
    proxy.$modal.msgSuccess("归档成功");
    handleSuccess();
  } catch (e) {
    console.error("归档失败", e);
  }
}

/** 终止按钮操作 */
async function handleStop(row) {
  proxy.$prompt("请输入终止原因", "终止合同", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /\S+/,
    inputErrorMessage: "终止原因不能为空",
  }).then(async ({ value }) => {
    try {
      await stop({
        type: "sale",
        id: row.id,
        stopStatus: 1,
        stopRemark: value,
      });
      proxy.$modal.msgSuccess("终止成功");
      handleSuccess();
    } catch (e) {
      console.error("终止失败", e);
    }
  }).catch(() => {});
}

/** 作废按钮操作 */
async function handleVoid(row) {
  proxy.$prompt("请输入作废原因", "作废合同", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /\S+/,
    inputErrorMessage: "作废原因不能为空",
  }).then(async ({ value }) => {
    try {
      await invalid({
        type: "sale",
        id: row.id,
        voidStatus: 1,
        voidRemark: value,
      });
      proxy.$modal.msgSuccess("作废成功");
      handleSuccess();
    } catch (e) {
      console.error("作废失败", e);
    }
  }).catch(() => {});
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(
  handleEdit,
  handleView,
  handleDelete,
  handleArchive,
  handleStop,
  handleVoid,
);
</script>
<style lang="scss" scoped>
.tabs-container {
  height: calc(100% - 80px);
}
</style>
