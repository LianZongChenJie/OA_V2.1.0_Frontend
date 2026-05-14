<template>
  <div class="tabs-container">
    <TableList
      :api="getContractPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="id"
      ref="tableList"
    >
      <template #types="{ row }">
        <dict-tag
          :options="procurement_contract_types"
          :value="Number(row.types)"
        />
      </template>
    </TableList>
    <DetailDialog ref="detailDialogRef" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getContractPageList } from "@/api/contract/voidedContract";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";
import DetailDialog from "./components/detail.vue";

const { proxy } = getCurrentInstance();
const { procurement_contract_types } = proxy.useDict("procurement_contract_types");

const tableList = ref(null);
const detailDialogRef = ref(null);

/** 查看按钮操作 */
function handleView(row) {
  detailDialogRef.value.open(row);
}

const headerButs = getHeaderButs();
const operationColumn = getOperationColumn(handleView);
</script>
<style lang="scss" scoped>
.tabs-container {
  height: calc(100% - 80px);
}
.table-pro{
  background-color: #f5f7fa;
}
</style>