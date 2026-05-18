<template>
  <div class="tabs-container">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :params="{ invoiceType: 0, tab: 0 }"
      row-key="id"
      ref="tableList"
    >
      <template #invoiceType="{ row }">
        <dict-tag :options="invoice_type" :value="Number(row.invoiceType)" />
      </template>
      <template #checkStatus="{ row }">
        <dict-tag :options="check_status" :value="Number(row.checkStatus)" />
      </template>
      <template #openStatus="{ row }">
        <dict-tag :options="open_status" :value="Number(row.openStatus)" />
      </template>
      <template #enterStatus="{ row }">
        <dict-tag :options="enter_status" :value="Number(row.enterStatus)" />
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
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, del } from "@/api/financial/invoiceMsg";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";
import AddDialog from "./components/add.vue";
import useUserStore from "@/store/modules/user";

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
const userStore = useUserStore();
const { invoice_type, check_status, open_status, enter_status } = proxy.useDict(
  "invoice_type",
  "check_status",
  "open_status",
  "enter_status",
);

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
    await proxy.$modal.confirm("确认删除该发票吗？");
    await del(row.id);
    proxy.$modal.msgSuccess("删除成功");
    handleSuccess();
  } catch (e) {
    console.error("删除失败", e);
  }
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(
  handleEdit,
  handleView,
  handleDelete,
  userStore.id,
);
</script>
<style lang="scss" scoped>
.tabs-container {
  height: calc(100% - 80px);
}
</style>
