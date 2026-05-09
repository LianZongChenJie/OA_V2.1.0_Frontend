<template>
  <div class="main-content">
    <TableList
      :key="tableKey"
      :api="getPageListFix"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="id"
      ref="tableList"
      :search-enum="searchEnum"
      selection
    >
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, nextTick } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, del} from "@/api/message/sender/index.js";
import { columns, getOperationColumn, getHeaderButs } from "./config/columns";
import AddDialog from "./components/add.vue";
import { listUser } from "@/api/system/user.js";

const { proxy } = getCurrentInstance();

const tableList = ref(null);
const addDialogRef = ref(null);
const tableKey = ref(0); 

const searchEnum = ref({
  anchorId: []
});

// 获取人列表
const fetchAnchorList = async () => {
  try {
    const res = await listUser({ pageSize: 1000 });
    
    let users = [];
    if (res.rows && Array.isArray(res.rows)) {
      users = res.rows;
    } else if (res.data && res.data.rows) {
      users = res.data.rows;
    } else if (Array.isArray(res)) {
      users = res;
    } else if (res.data && Array.isArray(res.data)) {
      users = res.data;
    } else {
      users = [];
    }
    
    const userList = users.filter(u => String(u.status) === '0');
    
    searchEnum.value.anchorId = userList.map(u => ({
      label: u.realName || u.nickName || u.userName || u.name || '未命名',
      value: u.userId
    }));
    
    tableKey.value++;
    
  } catch (e) {
    console.error('获取人列表失败:', e);
  }
};

onMounted(() => {
  fetchAnchorList();
});

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

// 删除单条发件箱消息 - 修复：使用 row.id 而不是 row.messageId
function handleDelete(row) {
  // 使用 id 字段（因为列表返回的是 id）
  const messageId = row.id;
  if (!messageId) {
    proxy.$modal.msgError("消息ID不存在");
    return;
  }
  
  proxy.$modal.confirm('是否确认删除该消息？').then(() => {
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
  
  proxy.$modal.confirm(`是否确认删除选中的${ids.length}条消息？`).then(() => {
    return del(ids, 'message');
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功");
    tableList.value?.refresh();
    // 清空选中状态
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