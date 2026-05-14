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
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getContractPageList } from "@/api/contract/archivingContract";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";

const { proxy } = getCurrentInstance();
const { procurement_contract_types } = proxy.useDict("procurement_contract_types");

const tableList = ref(null);

const headerButs = getHeaderButs();
const operationColumn = getOperationColumn();
</script>
<style lang="scss" scoped>
.tabs-container {
  height: calc(100% - 80px);
}
.table-pro{
  background-color: #f5f7fa;
}
</style>