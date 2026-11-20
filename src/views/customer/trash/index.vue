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
      <template #customerStatus="{ row }">
        <span v-if="Number(row.customerStatus) === 0">未设置</span>
        <dict-tag v-else :options="customer_status" :value="row.customerStatus" />
      </template>
    </TableList>

    <DetailDialog ref="detailRef" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, receiveCustomer } from "@/api/customer/trash";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";
import DetailDialog from "./components/detail.vue";

const { proxy } = getCurrentInstance();
const { customer_status } = proxy.useDict("customer_status");

const tableList = ref(null);
const detailRef = ref(null);
const headerButs = getHeaderButs();

/** 详情按钮操作 */
function handleDetail(row) {
  detailRef.value.open(row.id);
}

/** 领取按钮操作 */
async function handleReceive(row) {
  try {
    await proxy.$modal.confirm("确认领取该客户吗？领取后客户将归属到你的客户列表");
    await receiveCustomer(row.id);
    proxy.$modal.msgSuccess("领取成功");
    tableList.value.refresh();
  } catch (e) {
    console.error("领取失败", e);
  }
}

// 操作列配置（按钮样式与客户列表 cusList 保持一致）
const operationColumn = getOperationColumn(handleDetail, handleReceive);
</script>
