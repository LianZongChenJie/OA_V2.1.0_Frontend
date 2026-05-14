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
      <template #balanceStatus="{ row }">
        <dict-tag :options="balance_status" :value="Number(row.balanceStatus)" />
      </template>
       <template #checkStatus="{ row }">
        <dict-tag :options="check_status" :value="Number(row.checkStatus)" />
      </template>
      <template #types="{ row }">
        <dict-tag :options="cash_advance_types" :value="Number(row.types)" />
      </template>
      <template #payStatus="{ row }">
        <dict-tag :options="cash_pay_status" :value="Number(row.payStatus)" />
      </template>
      <template #backStatus="{ row }">
        <dict-tag :options="cash_back_status" :value="Number(row.backStatus)" />
      </template>
      <template #effTime="{ row }">
        {{ row.startTime }} ~ {{ row.endTime }}
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" :type="type" :label="label" />
  </div>
</template>
<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, del, back, pay } from "@/api/financial/cashAdvance";
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
const { balance_status, cash_advance_types, cash_pay_status,check_status,cash_back_status } = proxy.useDict("balance_status", "cash_advance_types", "cash_pay_status","check_status","cash_back_status");

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
    await proxy.$modal.confirm('确认删除该借支吗？');
    await del(row.id);
    proxy.$modal.msgSuccess("删除成功");
    handleSuccess();
  } catch (e) {
    console.error('删除失败', e);
  }
}

/** 还款按钮操作 */
async function handleBack(row) {
  try {
    await proxy.$modal.confirm('确认还款吗？');
    await back({ id: row.id });
    proxy.$modal.msgSuccess("还款成功");
    handleSuccess();
  } catch (e) {
    console.error('还款失败', e);
  }
}

/** 打款按钮操作 */
async function handlePay(row) {
  try {
    await proxy.$modal.confirm('确认打款吗？');
    await pay({ id: row.id });
    proxy.$modal.msgSuccess("打款成功");
    handleSuccess();
  } catch (e) {
    console.error('打款失败', e);
  }
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete, handleBack, handlePay, userStore.id);
</script>
<style lang="scss" scoped>
.tabs-container {
  height: calc(100% - 80px);
}
</style>
