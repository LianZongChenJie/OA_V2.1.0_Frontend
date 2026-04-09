<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :search-fields="searchFields"
      :query-form="queryForm"
      row-key="id"
      ref="tableList"
    >
      <!-- 保险到期日期 + 提醒 -->
      <template #insureTime="{ row }">
        <span>{{ row.insureTime }}</span>
      </template>
      <template #insureWarn="{ row }">
        <el-tag :type="row.insureWarn === '已到期' ? 'danger' : 'success'">
          {{ row.insureWarn || '正常' }}
        </el-tag>
      </template>

      <!-- 车审到期日期 + 提醒 -->
      <template #reviewTime="{ row }">
        <span>{{ row.reviewTime }}</span>
      </template>
      <template #reviewWarn="{ row }">
        <el-tag :type="row.reviewWarn === '已到期' ? 'danger' : 'success'">
          {{ row.reviewWarn || '正常' }}
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
import { getPageList, getMessageModuleDetail } from "@/api/base/common/messageModule/index.js";
// 引入 searchFields、queryForm
import { columns, getHeaderButs, getOperationColumn, searchFields, queryForm } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");

const route = useRoute();
const router = useRouter();
const tableList = ref(null);
const addDialogRef = ref(null);

/** 新增按钮操作 */
function handleAdd() {
  addDialogRef.value.open();
}

/** 编辑按钮操作 */
async function handleEdit(row) {
  const res = await getMessageModuleDetail(row.id);
  if (res) {
    addDialogRef.value.openEdit(res.data || res);
  }
}

/** 查看按钮操作 */
async function handleView(row) {
  const res = await getMessageModuleDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}

/** 删除按钮操作（补充完整） */
async function handleDelete(row) {
  // 你原有删除逻辑写这里
  console.log("删除", row);
}

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
// 补充删除方法
const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete);
</script>

<style lang="scss" scess></style>