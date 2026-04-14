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
    >
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, nextTick } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, deletereward } from "@/api/administration/conference/notes/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";
import { listUser } from "@/api/system/user.js";

const { proxy } = getCurrentInstance();

const tableList = ref(null);
const addDialogRef = ref(null);
const tableKey = ref(0); 

const searchEnum = ref({
  anchorId: []
});

// 获取主持人列表
const fetchAnchorList = async () => {
  try {
    const res = await listUser({ pageSize: 1000 });
    
    // 兼容多种返回格式
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
    console.error('获取主持人列表失败:', e);
    proxy.$modal?.msgError('加载主持人列表失败');
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

async function handleDelete(row) {
  proxy.$modal.confirm("确定删除该会议记录吗？").then(async () => {
    await deletereward(row.id);
    proxy.$modal.msgSuccess("删除成功");
    tableList.value.refresh();
  }).catch(() => {});
}

function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete);
</script>