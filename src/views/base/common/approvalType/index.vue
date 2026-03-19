<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :row-filter="rowFilter"
      row-key="name"
      ref="tableList"
    >
      <template #isCopy="{ row }">
        <el-tag :type="row.isCopy === 1 ? 'success' : 'info'">
          {{ row.isCopy === 1 ? "支持" : "不支持" }}
        </el-tag>
      </template>
      <template #isFile="{ row }">
        <el-tag :type="row.isFile === 1 ? 'success' : 'info'">
          {{ row.isFile === 1 ? "支持" : "不支持" }}
        </el-tag>
      </template>
      <template #isExport="{ row }">
        <el-tag :type="row.isExport === 1 ? 'success' : 'info'">
          {{ row.isExport === 1 ? "支持" : "不支持" }}
        </el-tag>
      </template>
      <template #isBack="{ row }">
        <el-tag :type="row.isBack === 1 ? 'success' : 'info'">
          {{ row.isBack === 1 ? "支持" : "不支持" }}
        </el-tag>
      </template>
      <template #isReversed="{ row }">
        <el-tag :type="row.isReversed === 1 ? 'success' : 'info'">
          {{ row.isReversed === 1 ? "支持" : "不支持" }}
        </el-tag>
      </template>
      <template #isList="{ row }">
        <el-tag :type="row.isList === 1 ? 'success' : 'info'">
          {{ row.isList === 1 ? "显示" : "不显示" }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <dict-tag :options="message_module_status" :value="row.status" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>
<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import {
  getPageList,
  getDetail,
} from "@/api/base/common/approvalType/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");

const route = useRoute();
const router = useRouter();
const tableList = ref(null);
const addDialogRef = ref(null);

/** 行过滤函数 - 只显示 isList 为 1 的行 */
const rowFilter = (row) => {
  return row.isList === 1;
};

/** 新增按钮操作 */
function handleAdd() {
  addDialogRef.value.open();
}

/** 编辑按钮操作 */
async function handleEdit(row) {
  // 获取详情数据
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openEdit(res.data || res);
  }
}

/** 查看按钮操作 */
async function handleView(row) {
  // 获取详情数据
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView);
</script>
<style lang="scss" scoped></style>
