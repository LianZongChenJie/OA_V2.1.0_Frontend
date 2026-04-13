<template>
  <div class="main-content">
    <TableList
      :api="getPageListForAudit"
      :columns="columns"
      :operation-column="operationColumn"
      :params="{ tab: type }"
      row-key="name"
      ref="tableList"
    >
      <template #secrets="{ row }">
        <dict-tag :options="secrets_level" :value="row.secrets" />
      </template>
      <template #urgency="{ row }">
        <dict-tag :options="urgency_level" :value="row.urgency" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" :type="type" :label="label" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageListForAudit, getDetail } from "@/api/administration/doc/documents";
import { columns, getOperationColumn } from "./config/colums";
import AddDialog from "../documents/components/components/add.vue";

const { proxy } = getCurrentInstance();
const { secrets_level, urgency_level } = proxy.useDict("secrets_level", "urgency_level");

const tableList = ref(null);
const addDialogRef = ref(null);

/** 查看按钮操作 */
async function handleView(row) {
  const res = await getDetail(row.id);  // 获取文档详情
  if (res) {  // 如果获取成功
    addDialogRef.value.open(res);  // 打开详情弹窗
  }
}

const operationColumn = getOperationColumn(handleView);
</script>
<style lang="scss" scoped>
.tabs-container {
  height: calc(100% - 50px);
}
</style>
