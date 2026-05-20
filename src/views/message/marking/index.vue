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
      <!-- 自定义星标列 -->
      <template #isStar="{ row }">
        <span 
          class="star-icon" 
          :class="{ 'star-active': row.isStar === 1 }"
          @click="handleToggleStar(row)"
        >
          {{ row.isStar === 1 ? '★' : '☆' }}
        </span>
      </template>
      
      <!-- 自定义消息类型列 -->
      <template #typesStr="{ row }">
        <span :class="{ 'system-msg': row.fromUid === 0, 'user-msg': row.fromUid !== 0 }">
          {{ row.fromUid === 0 ? '系统消息' : '用户消息' }}
        </span>
      </template>
      
      <!-- 自定义已读状态列 -->
      <template #isReadStr="{ row }">
        <span :class="{ 'unread': row.readTime === 0, 'read': row.readTime !== 0 }">
          {{ row.readTime === 0 ? '未读' : '已读' }}
        </span>
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, del, setStar } from "@/api/message/marking/index.js";
import { getFullColumns, getOperationColumn, getHeaderButs, searchFields } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();

const tableList = ref(null);
const addDialogRef = ref(null);
const tableKey = ref(0);

const getPageListFix = async (params) => {
  const res = await getPageList(params);
  return res;
};

// 查看消息
async function handleView(row) {
  try {
    const res = await getDetail(row.id);
    const detailData = res.data || res;
    addDialogRef.value.openView(detailData);
    tableList.value?.refresh();
  } catch (error) {
    proxy.$modal.msgError(error.message || "获取详情失败");
  }
}

// 删除单条
function handleDelete(row) {
  const messageId = row.id;
  if (!messageId) {
    proxy.$modal.msgError("消息ID不存在");
    return;
  }
  
  proxy.$modal.confirm('是否确认删除该消息？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return del(messageId, 'msg');
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功");
    tableList.value?.refresh();
  }).catch(() => {});
}

// 切换星标状态
async function handleToggleStar(row) {
  try {
    const newStatus = row.isStar === 1 ? 0 : 1;
    await setStar(row.id, newStatus);
    proxy.$modal.msgSuccess(newStatus === 1 ? "已设为星标" : "已取消星标");
    tableList.value?.refresh();
  } catch (error) {
    proxy.$modal.msgError(error.message || "操作失败");
  }
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

// 批量删除
function handleBatchDelete() {
  const ids = getSelectedIds();
  
  if (ids.length === 0) {
    proxy.$modal.msgWarning("请选择要删除的消息");
    return;
  }
  
  proxy.$modal.confirm(`是否确认删除选中的 ${ids.length} 条消息？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return del(ids, 'msg');
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功");
    tableList.value?.refresh();
    if (tableList.value?.clearSelection) {
      tableList.value.clearSelection();
    }
  }).catch(() => {});
}

// 批量设为星标
function handleBatchStar() {
  const ids = getSelectedIds();
  
  if (ids.length === 0) {
    proxy.$modal.msgWarning("请选择要标记的消息");
    return;
  }
  
  proxy.$modal.confirm(`是否确认将选中的 ${ids.length} 条消息设为星标？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return setStar(ids, 0);
  }).then(() => {
    proxy.$modal.msgSuccess("设置成功");
    tableList.value?.refresh();
    if (tableList.value?.clearSelection) {
      tableList.value.clearSelection();
    }
  }).catch(() => {});
}

function handleSuccess() {
  tableList.value?.refresh();
}

const operationColumn = getOperationColumn(handleView, handleDelete);
const headerButs = getHeaderButs(
  handleBatchDelete,
  handleBatchStar,
);
</script>

<style scoped>
.star-icon {
  cursor: pointer;
  font-size: 18px;
  color: #ccc;
  transition: color 0.3s;
}

.star-icon:hover {
  color: #ffc063;
}

.star-icon.star-active {
  color: #ffc063;
}

/* 消息类型样式（可选） */
.system-msg {
  color: #409eff;
}

.user-msg {
  color: #ffc063;
}

/* 已读状态样式  */
.read {
  color: #67c23a;
  font-weight: normal;
}

.unread {
  color: #f56c6c;
  font-weight: bold;
}
</style>