<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      row-key="name"
    />
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import { getPageList } from "@/api/base/common/messageModule/index.js";
import { columns, operationColumn } from "./config/columns";

console.log("==columns==>", columns);
console.log("==operationColumn==>", operationColumn);

const route = useRoute();
const router = useRouter();
</script>
<style lang="scss" scoped></style>
