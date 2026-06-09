<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :basic-search-fields="basicSearchFields"
      :advanced-search-fields="advancedSearchFields"
      :query-form="queryForm"
      row-key="id"
      ref="tableList"
    >

      <template #attachments="{ row }">
        <el-button
          v-if="row.attachments && row.attachments.length > 0"
          type="text"
          icon="download"
          @click="handleDownloadResume(row)"
        >
          下载简历
        </el-button>
        <span v-else style="color:#999">无附件</span>
      </template>
    </TableList>

    <AddDialog ref="addDialogRef" @success="handleSuccess" />
    <EntryDialog ref="entryDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, deleteDeptChange } from "@/api/personnel/resume/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";
import EntryDialog from "./components/EntryDialog.vue";
import { downloadFile } from "@/utils/download";
import request from "@/utils/request";

const { proxy } = getCurrentInstance();
const { supplier_status } = proxy.useDict("supplier_status");

const tableList = ref(null);
const addDialogRef = ref(null);
const entryDialogRef = ref(null);

// 新增
function handleAdd() {
  addDialogRef.value.open();
}

// 编辑
async function handleEdit(row) {
  const res = await getDetail(row.id);
  addDialogRef.value.openEdit(res.data);
}

// 查看
async function handleView(row) {
  const res = await getDetail(row.id);
  addDialogRef.value.openView(res.data);
}

// 删除
async function handleDelete(row) {
  proxy.$modal.confirm("确定要删除该简历信息吗？").then(async () => {
    await deleteDeptChange(row.id);
    proxy.$modal.msgSuccess("删除成功");
    tableList.value.refresh();
  }).catch(() => {});
}

// ====================== 面试结果 ======================
async function handlePass(row) {
  try {
    await proxy.$modal.confirm("确认面试【已通过】？");
    await request({
      url: "/resume/interview",
      method: "POST",
      data: { resumeId: row.id, result: "已通过" }
    });
    proxy.$modal.msgSuccess("操作成功");
    tableList.value.refresh();
  } catch (err) {
    console.error("失败", err);
  }
}

async function handleReject(row) {
  try {
    await proxy.$modal.confirm("确认面试【未通过】？");
    await request({
      url: "/resume/interview",
      method: "POST",
      data: { resumeId: row.id, result: "未通过" }
    });
    proxy.$modal.msgSuccess("操作成功");
    tableList.value.refresh();
  } catch (err) {
    console.error("失败", err);
  }
}

// ====================== 确认入职（打开弹窗） ======================
function handleEntry(row) {
  entryDialogRef.value.open(row);
}

// 下载附件
async function handleDownloadResume(row) {
  const res = await getDetail(row.id);
  const files = res.data.attachments || [];
  if (!files.length) {
    proxy.$modal.msgWarning("暂无附件");
    return;
  }
  const file = files[0];
  const baseUrl = import.meta.env.VITE_APP_BASE_API || "";
  const url = baseUrl + `/employee/care/download/${file.id}`;
  downloadFile(url, file.fileName || "简历");
}

// 刷新
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(
  handleEdit,
  handleView,
  handleDelete,
  handlePass,
  handleReject,
  handleEntry
);
</script>

<style lang="scss" scoped>
</style>