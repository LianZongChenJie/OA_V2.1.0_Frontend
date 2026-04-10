<template>
  <div class="main-content">
    <TableList
      :api="getPageListFix"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :search-fields="searchFields"
      :query-form="queryForm"
      row-key="id"
      ref="tableList"
    >
      <!-- 购买日期 -->
      <template #buyTime="{ row }">
        <span>{{ row.buyTime?.substring(0, 10) || '-' }}</span>
      </template>

      <!-- 保险到期 -->
      <template #insureTime="{ row }">
        <span>{{ row.insureTime?.substring(0, 10) || '-' }}</span>
      </template>
      <template #insureWarn="{ row }">
        <el-tag :type="getInsureTagType(row.insureTime)">
          {{ getInsureWarnText(row.insureTime) }}
        </el-tag>
      </template>

      <!-- 车审到期 -->
      <template #reviewTime="{ row }">
        <span>{{ row.reviewTime?.substring(0, 10) || '-' }}</span>
      </template>
      <template #reviewWarn="{ row }">
        <el-tag :type="getReviewTagType(row.reviewTime)">
          {{ getReviewWarnText(row.reviewTime) }}
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
import { getPageList, getDetail, deletereward } from "@/api/administration/car/data/index.js";
import { columns, getHeaderButs, getOperationColumn, searchFields, queryForm } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");

const route = useRoute();
const router = useRouter();
const tableList = ref(null);
const addDialogRef = ref(null);

// ==========================
// 保险到期提醒逻辑
// ==========================
function getInsureWarnText(time) {
  if (!time) return "正常";
  const left = getDayLeft(time);
  if (left < 0) return "已到期";
  if (left <= 3) return "即将到期";
  return "正常";
}
function getInsureTagType(time) {
  if (!time) return "success";
  const left = getDayLeft(time);
  if (left < 0) return "danger";
  if (left <= 3) return "warning";
  return "success";
}

// ==========================
// 车审到期提醒逻辑
// ==========================
function getReviewWarnText(time) {
  if (!time) return "正常";
  const left = getDayLeft(time);
  if (left < 0) return "已到期";
  if (left <= 3) return "即将到期";
  return "正常";
}
function getReviewTagType(time) {
  if (!time) return "success";
  const left = getDayLeft(time);
  if (left < 0) return "danger";
  if (left <= 3) return "warning";
  return "success";
}

// ==========================
// 计算剩余天数（通用工具）
// ==========================
function getDayLeft(timeStr) {
  const now = new Date();
  const target = new Date(timeStr);
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}


function handleAdd() {
  addDialogRef.value.open();
}
async function handleEdit(row) {
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openEdit(res.data || res);
  }
}
async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}
async function handleDelete(row) {
  proxy.$modal.confirm("确定删除该车辆吗？").then(async () => {
    await deletereward(row.id);
    proxy.$modal.msgSuccess("删除成功");
    tableList.value.refresh();
  }).catch(() => {});
}

function handleSuccess() {
  tableList.value.refresh();
}

const getPageListFix = async (params) => {
  const res = await getPageList(params);
  res.rows = res.rows.map(item => {
    if (Array.isArray(item)) {
      let car = item[0] || {};
      let name = item[1] || "";
      car.driverName = name;
      return car;
    }
    return item;
  }).filter(item => item && item.id);
  return res;
};

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete);
</script>

<style lang="scss" scoped>
</style>