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
      <template #socialDate="{ row }">
        <span v-if="row.socialDate">{{ "每月" + row.socialDate + "号" }}</span>
      </template>
      <template #relatedUsers="{ row }">
        <el-button type="primary" size="small" icon="user" @click="handlePersonnel(row)"
          >查看人员</el-button
        >
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
    <PersonnelListDialog ref="personnelListRef" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail } from "@/api/personnel/socialSecurity";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";
import PersonnelListDialog from "./components/personnelList.vue";

const tableList = ref(null);
const addDialogRef = ref(null);
const personnelListRef = ref(null);

/** 新增按钮操作 */
function handleAdd() {
  addDialogRef.value.open();
}

/** 编辑按钮操作 */
async function handleEdit(row) {
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openEdit(res.data || res);
  }
}

/** 查看按钮操作 */
async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}

/** 人员按钮操作 */
function handlePersonnel(row) {
  personnelListRef.value.open(row);
}

/** 新增/编辑成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView);
</script>
<style lang="scss" scoped></style>
