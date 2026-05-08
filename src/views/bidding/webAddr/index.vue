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
      <template #hasUk="{ row }">
        <dict-tag :options="have_uk" :value="row.hasUk" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>
<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import {
  getPageList,
  getDetail,
  deleteWebsiteAccount,
} from "@/api/bidding/webAddr";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { have_uk } = proxy.useDict("have_uk");

const route = useRoute();
const tableList = ref(null);
const addDialogRef = ref(null);

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

/** 删除按钮操作 */
async function handleDelete(row) {
  try {
    await proxy.$modal.confirm("确认删除该网址信息吗？");
    await deleteWebsiteAccount(row.id);
    proxy.$modal.msgSuccess("删除成功");
    handleSuccess();
  } catch (e) {
    console.error("删除失败", e);
  }
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(
  handleEdit,
  handleView,
  handleDelete,
);
</script>
<style lang="scss" scoped></style>
