<template>
  <div class="main-content">
    <TableList
      :api="getPageListFix"
      :columns="columns"
      :operation-column="operationColumn"
      row-key="id"
      ref="tableList"
    >
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail } from "@/api/personalOffice/meeting/index.js";
import { columns, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const tableList = ref(null);
const addDialogRef = ref(null);

const getPageListFix = async (params) => {
  const res = await getPageList(params);

  if (res.rows && Array.isArray(res.rows)) {
    res.rows = res.rows.map(item => {
      if (!Array.isArray(item)) return item;

      const data = item[0] || {};
      data.roomName = item[1] || '';
      data.anchorName = item[2] || '';
      data.recorderName = item[3] || '';
      data.deptName = item[4] || '';
      return data;
    }).filter(Boolean);
  }

  return res;
};

async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) addDialogRef.value.openView(res.data || res);
}

function handleSuccess() {
  tableList.value.refresh();
}

const operationColumn = getOperationColumn(null, handleView, null);
</script>