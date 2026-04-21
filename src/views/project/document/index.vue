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
    />

    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import TableList from "@/components/tableList/index.vue";

// 任务接口
import { getPageList, getDetail, deletereward } from "@/api/project/document/index.js";

// 项目列表接口（改成获取项目列表）
import { getPageList as getProjectList } from "@/api/project/itemList/index.js";

// 用户接口
import { listUser } from "@/api/system/user.js";

// 表格配置
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";

// 弹窗
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();

const tableList = ref(null);
const addDialogRef = ref(null);
const tableKey = ref(0);

// 状态映射
const statusMap = {
  0: "未设置",
  1: "未开始",
  2: "进行中",
  3: "已完成",
  4: "已关闭"
};

// 下拉枚举：项目列表 + 负责人
const searchEnum = ref({
  projectList: [],     // 改成项目列表
  userList: [],
});

// ==============================================
// 加载：项目列表（已改成获取项目列表）
// ==============================================
const fetchProjectList = async () => {
  try {
    const res = await getProjectList({ pageNum: 1, pageSize: 100 });
    let list = [];
    if (res.rows) list = res.rows;
    else if (res.data?.rows) list = res.data.rows;
    else if (Array.isArray(res)) list = res;

    searchEnum.value.projectList = list.map((item) => ({
      label: item.name || item.title || "未命名",
      value: item.id,
    }));
  } catch (err) {
    console.error("加载项目列表失败", err);
  }
};

// 加载：负责人下拉
const fetchUserList = async () => {
  try {
    const res = await listUser({ pageSize: 1000 });
    let users = [];
    if (res.rows) users = res.rows;
    else if (res.data?.rows) users = res.data.rows;
    else if (Array.isArray(res)) users = res;

    searchEnum.value.userList = users
      .filter((u) => u.status === 0)
      .map((u) => ({
        label: u.realName || u.nickName || u.userName || "未命名",
        value: u.userId,
      }));
  } catch (err) {
    console.error("加载负责人失败", err);
  }
};

onMounted(() => {
  fetchProjectList();   // 调用项目列表
  fetchUserList();
  tableKey.value++;
});


const formatTaskData = (rows) => {
  if (!rows?.length) return [];
  
  return rows.map(row => {
    let endTimeDisplay = row.end_time_str || '-';
    
    if (row.end_time_str && row.status !== 3) {
      const dateStr = row.end_time_str.split(' ')[0];
      const end = new Date(dateStr.replace(/-/g, '/')).getTime();
      const now = Date.now();
      const diffDay = Math.ceil((end - now) / (86400000));
      
      if (diffDay < 0) {
        endTimeDisplay = `${row.end_time_str}（逾期${Math.abs(diffDay)}天）`;
      }
    }
    
    return {
      ...row,
      end_time_display: endTimeDisplay,  
      statusText: statusMap[row.status] || "未知"
    };
  });
};

// 列表请求适配
const getPageListFix = async (params) => {
  const res = await getPageList(params);
  if (res?.rows) {
    res.rows = formatTaskData(res.rows);
  }
  return res;
};

// 操作
function handleAdd() {
  addDialogRef.value.open();
}

const handleEdit = async (row) => {
  const res = await getDetail(row.id);
  addDialogRef.value.openEdit(res.data || res);
};

async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) addDialogRef.value.openView(res.data || res);
}

async function handleDelete(row) {
  proxy.$modal.confirm("确定删除该文档吗？").then(async () => {
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