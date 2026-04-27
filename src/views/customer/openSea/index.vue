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
      <template #customerStatus="{ row }">
        <dict-tag :options="customer_status" :value="row.customerStatus" />
      </template>
      <template #intentStatus="{ row }">
        <dict-tag :options="customer_intent_status" :value="row.intentStatus" />
      </template>
    </TableList>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getCustomer, restoreCustomer } from "@/api/customer/openSea";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";

const { proxy } = getCurrentInstance();
const { customer_status, customer_intent_status } = proxy.useDict("customer_status", "customer_intent_status");

const tableList = ref(null);
const headerButs = getHeaderButs();

/** 领取按钮操作 */
async function handleReceive(row) {
  try {
    await proxy.$modal.confirm("确认领取该客户吗？");
    await getCustomer(row.id);
    proxy.$modal.msgSuccess("领取成功");
    tableList.value.refresh();
  } catch (e) {
    console.error("领取失败", e);
  }
}

/** 还原按钮操作 */
async function handleRestore(row) {
  try {
    await proxy.$modal.confirm("确认还原该客户吗？");
    await restoreCustomer(row.id);
    proxy.$modal.msgSuccess("还原成功");
    tableList.value.refresh();
  } catch (e) {
    console.error("还原失败", e);
  }
}

const operationColumn = getOperationColumn(
  handleReceive,
  handleRestore,
);
</script>
