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
import { getPageList, getDetail, del, restore } from "@/api/message/garbage/index.js";
import { columns, getOperationColumn } from "./config/columns";
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

// 还原功能 
async function handleRestore(row) {
  proxy.$modal.confirm('是否确认还原该消息？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let table = '';
    if (row.source === '收件箱') {
      table = 'msg';
    } else if (row.source === '发件箱' || row.source === '草稿箱') {
      table = 'msgmessage';
    }
    
    return restore(Number(row.id), table); 
  }).then(() => {
    proxy.$modal.msgSuccess("还原成功");
    tableList.value?.refresh();
  }).catch(() => {});
}
// 查看功能
async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) addDialogRef.value.openView(res.data || res);
}

function handleDelete(row) {
  const messageId = row.id;
  if (!messageId) {
    proxy.$modal.msgError("消息ID不存在");
    return;
  }
  
  // 清除
  let table = '';
  if (row.source === '收件箱') {
    table = 'msg';
  } else if (row.source === '发件箱' || row.source === '草稿箱') {
    table = 'message';
  }
  
  proxy.$modal.confirm('是否确认删除该消息？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return del(messageId, table);
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功");
    tableList.value?.refresh();
  }).catch(() => {});
}

// 修改操作列配置，
const operationColumn = getOperationColumn(handleRestore, handleView, handleDelete);

// 添加/编辑成功后的刷新
function handleSuccess() {
  tableList.value?.refresh();
}

</script>