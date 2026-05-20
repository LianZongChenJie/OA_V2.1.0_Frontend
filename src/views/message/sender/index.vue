<template>
  <div class="main-content">
    <TableList
      :show-selection="true"
      :key="tableKey"
      :api="getPageListFix"
      :columns="getFullColumns()"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="id"
      ref="tableList"
      :search-fields="searchFields"
    >
      <!-- 自定义消息类型列 -->
      <template #typesStr="{ row }">
        <span
          :class="{
            'system-msg': row.fromUid === 0,
            'user-msg': row.fromUid !== 0,
          }"
        >
          {{ row.typesStr || (row.fromUid === 0 ? "系统消息" : "用户消息") }}
        </span>
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, del } from "@/api/message/sender/index.js";
import { getFullColumns, getOperationColumn, getHeaderButs, searchFields } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();

const tableList = ref(null);
const addDialogRef = ref(null);
const tableKey = ref(0);

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

function handleAdd() {
  addDialogRef.value.open();
}

async function handleEdit(row) {
  const res = await getDetail(row.id);
  if (res) addDialogRef.value.openEdit(res.data || res);
}

async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) addDialogRef.value.openView(res.data || res);
}

// 删除单条发件箱消息
function handleDelete(row) {
  const messageId = row.id;
  if (!messageId) {
    proxy.$modal.msgError("消息ID不存在");
    return;
  }
  
  proxy.$modal.confirm('确认删除该消息吗？').then(() => {
    return del(messageId, 'message');
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功");
    tableList.value?.refresh();
  }).catch(() => {});
}

// 获取选中的消息ID
function getSelectedIds() {
  let ids = [];
  if (tableList.value?.getSelectedRows) {
    const rows = tableList.value.getSelectedRows();
    ids = rows.map(row => row.id).filter(id => id);
  }
  return ids;
}

// 批量删除发件箱消息
function handleBatchDelete() {
  const ids = getSelectedIds();
  
  if (ids.length === 0) {
    proxy.$modal.msgWarning("请选择要删除的消息");
    return;
  }
  
  proxy.$modal.confirm(`确认删除选中的${ids.length}条消息吗？`).then(() => {
    return del(ids, 'message');
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功");
    tableList.value?.refresh();
    if (tableList.value?.clearSelection) {
      tableList.value.clearSelection();
    }
  }).catch(() => {});
}

function handleSuccess() {
  tableList.value?.refresh();
}

const headerButs = getHeaderButs(handleAdd, handleBatchDelete);
const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete);
</script>

<style scoped>
/* 消息类型样式 */
.system-msg {
  color: #409eff;
}

.user-msg {
  color: #ffc063;
}
</style>