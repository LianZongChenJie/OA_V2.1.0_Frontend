<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"

      row-key="name"
      ref="tableList"
    >
      <template #isTenderSubmitted="{ row }">
        <dict-tag :options="s_f_c" :value="row.isTenderSubmitted" />
      </template>
      <template #isDepositPaid="{ row }">
        <dict-tag :options="s_f_c" :value="row.isDepositPaid" />
      </template>
      <template #isDepositRefunded="{ row }">
        <dict-tag :options="s_f_c" :value="row.isDepositRefunded" />
      </template>
      <template #bidResult="{ row }">
        <dict-tag :options="bid_result" :value="row.bidResult" />
      </template>
    </TableList>
    <AddDialog
      ref="addDialogRef"
      @success="handleSuccess"

    />
  </div>
</template>
<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, del } from "@/api/bidding/bidInfo";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";
import AddDialog from "./components/add.vue";



const { proxy } = getCurrentInstance();
const { s_f_c, bid_result } = proxy.useDict(
  "s_f_c",
  "bid_result",
);

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
  if (res && res.data) {
    // 接口返回结构: data.tender + data.attachments
    const detailData = res.data.tender || {};
    detailData.attachments = res.data.attachments || [];
    addDialogRef.value.openEdit(detailData);
  }
}

/** 查看按钮操作 */
async function handleView(row) {
  // 获取详情数据
  const res = await getDetail(row.id);
  if (res && res.data) {
    // 接口返回结构: data.tender + data.attachments
    const detailData = res.data.tender || {};
    detailData.attachments = res.data.attachments || [];
    addDialogRef.value.openView(detailData);
  }
}

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

/** 删除按钮操作 */
async function handleDelete(row) {
  try {
    await proxy.$modal.confirm("确认删除该条信息么？");
    await del(row.id);
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
<style lang="scss" scoped>
</style>
