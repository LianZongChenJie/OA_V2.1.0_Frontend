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
import { getPageList } from "@/api/customer/openSea";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";

const { proxy } = getCurrentInstance();
const { customer_status, customer_intent_status } = proxy.useDict("customer_status", "customer_intent_status");

const tableList = ref(null);

/** 编辑按钮操作 */
async function handleEdit(row) {
  // 获取详情数据
  const res = await getDetail(row.id);
  if (res) {
    // TODO: 处理编辑逻辑
  }
}

/** 删除按钮操作 */
async function handleDelete(row) {
  try {
    await proxy.$modal.confirm("确认删除该客户吗？");
    await del(row.id);
    proxy.$modal.msgSuccess("删除成功");
    tableList.value.refresh();
  } catch (e) {
    console.error("删除失败", e);
  }
}

const operationColumn = getOperationColumn(
  handleEdit,
  handleDelete,
);
</script>
