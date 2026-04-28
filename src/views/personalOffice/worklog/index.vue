<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :params="{ tab: type }"
      row-key="name"
      ref="tableList"
    >
      <template #status="{ row }">
        <dict-tag :options="note_status" :value="row.status" />
      </template>
      <template #sourse="{ row }">
        <dict-tag :options="note_sourse" :value="row.sourse" />
      </template>
      <!-- 日程时间范围插槽 -->
      <template #workTimeRange="{ row }">
        <span v-if="row.startTime && row.endTime">
          {{ formatDate(row.startTime) }} 至 {{ formatDate(row.endTime) }}
        </span>
        <span v-else-if="row.start_time && row.end_time">
          {{ formatDate(row.start_time) }} 至 {{ formatDate(row.end_time) }}
        </span>
        <span v-else-if="row.startDate && row.endDate">
          {{ formatDate(row.startDate) }} 至 {{ formatDate(row.endDate) }}
        </span>
        <span v-else-if="row.start && row.end">
          {{ formatDate(row.start) }} 至 {{ formatDate(row.end) }}
        </span>
        <span v-else>-</span>
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, del } from "@/api/personalOffice/worklog/index.js";
import { getColumns, getHeaderButs, getOperationColumn } from "./config/colums";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { note_status, note_sourse } = proxy.useDict("note_status", "note_sourse");

const tableList = ref(null);
const addDialogRef = ref(null);
const type = ref("");

// 格式化日期函数
const formatDate = (dateValue) => {
  if (!dateValue) return '-';
  
  // 如果是时间戳（秒级）
  if (typeof dateValue === 'number') {
    if (dateValue === 0) return '-';
    const date = new Date(dateValue * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  
  // 如果是时间戳（毫秒级）
  if (typeof dateValue === 'number' && dateValue > 9999999999) {
    const date = new Date(dateValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  
  // 如果是字符串格式
  if (typeof dateValue === 'string') {
    // 如果已经是完整的日期时间字符串
    if (dateValue.includes(' ') && dateValue.includes('-')) {
      return dateValue;
    }
    // 如果只有日期
    if (dateValue.includes('-') && !dateValue.includes(' ')) {
      return dateValue;
    }
    // 尝试解析
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) {
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  
  // 如果是 Date 对象
  if (dateValue instanceof Date) {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    const hours = String(dateValue.getHours()).padStart(2, '0');
    const minutes = String(dateValue.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  
  return '-';
};

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

function handleSuccess() {
  tableList.value.refresh();
}

async function handleDelete(row) {
  try {
    await proxy.$modal.confirm('确认删除该公告吗？');
    await del(row.id);
    proxy.$modal.msgSuccess("删除成功");
    handleSuccess();
  } catch (e) {
    console.error('删除失败', e);
  }
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete);
const columns = getColumns();
</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;
}
</style>