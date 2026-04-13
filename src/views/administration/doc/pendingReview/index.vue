<template>
  <div class="main-content">
    <TableList
      :api="getPageListForReview"
      :columns="columns"
      :operation-column="operationColumn"
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
    <AddDialog ref="addDialogRef" @success="handleSuccess" label="待审核" />
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageListForReview, getDetail } from "@/api/administration/doc/documents";
import { columns, getOperationColumn } from "./config/colums";
import AddDialog from "../documents/components/components/add.vue";

const { proxy } = getCurrentInstance();
const { secrets_level, urgency_level } = proxy.useDict("secrets_level", "urgency_level");

const tableList = ref(null);
const addDialogRef = ref(null);

/** 查看按钮操作 */
async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res);
  }
}

/** 成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

const operationColumn = getOperationColumn(handleView);
</script>
