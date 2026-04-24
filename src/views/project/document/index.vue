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
import { ref, getCurrentInstance, onMounted } from "vue";
import TableList from "@/components/tableList/index.vue";

// 文档接口
import { getPageList, getDetail, deletereward } from "@/api/project/document/index.js";

// 项目列表接口
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

// 格式化时间戳为日期时间字符串（年月日 时分秒）
const formatDateTime = (timestamp) => {
  if (!timestamp || timestamp === 0) return '-';
  const milliseconds = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
  const date = new Date(milliseconds);
  
  if (isNaN(date.getTime())) return '-';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 下拉枚举：项目列表 + 用户列表
const searchEnum = ref({
  projectList: [],    
  userList: [],        
});

// 加载：项目列表
const fetchProjectList = async () => {
  try {
    const res = await getProjectList({ pageNum: 1, pageSize: 1000 });
    let list = [];
    if (res.rows) list = res.rows;
    else if (res.data?.rows) list = res.data.rows;
    else if (Array.isArray(res)) list = res;

    searchEnum.value.projectList = list.map((item) => ({
      label: item.name || item.title || "未命名",
      value: item.id,
    }));
    
    console.log("项目列表加载成功:", searchEnum.value.projectList.length);
  } catch (err) {
    console.error("加载项目列表失败", err);
    searchEnum.value.projectList = [];
  }
};

// 加载：用户列表
const fetchUserList = async () => {
  try {
    const res = await listUser({ pageSize: 1000 });
    let users = [];
    if (res.rows) users = res.rows;
    else if (res.data?.rows) users = res.data.rows;
    else if (Array.isArray(res)) users = res;

    searchEnum.value.userList = users
      .filter((u) => u.status === "0" || u.status === 0)
      .map((u) => ({
        label: u.realName || u.nickName || u.userName || "未命名",
        value: u.userId,
      }));
    
    console.log("用户列表加载成功:", searchEnum.value.userList.length);
  } catch (err) {
    console.error("加载用户列表失败", err);
    searchEnum.value.userList = [];
  }
};

// 初始化加载
onMounted(() => {
  fetchProjectList();
  fetchUserList();
  tableKey.value++;
});

// 格式化任务数据
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
  try {
    const res = await getPageList(params);
    if (res?.rows) {
      res.rows = formatTaskData(res.rows);
    }
    return res;
  } catch (err) {
    console.error("获取文档列表失败:", err);
    return { rows: [], total: 0 };
  }
};


// 操作函数
function handleAdd() {
  addDialogRef.value.open();
}

const handleEdit = async (row) => {
  try {
    const res = await getDetail(row.id);
    addDialogRef.value.openEdit(res.data || res);
  } catch (err) {
    console.error("获取文档详情失败:", err);
    proxy.$modal.msgError("获取文档详情失败");
  }
};

async function handleView(row) {
  try {
    const res = await getDetail(row.id);
    if (res) addDialogRef.value.openView(res.data || res);
  } catch (err) {
    console.error("获取文档详情失败:", err);
    proxy.$modal.msgError("获取文档详情失败");
  }
}

async function handleDelete(row) {
  proxy.$modal.confirm("确定删除该文档吗？").then(async () => {
    try {
      await deletereward(row.id);
      proxy.$modal.msgSuccess("删除成功");
      tableList.value.refresh();
    } catch (err) {
      console.error("删除失败:", err);
      proxy.$modal.msgError("删除失败");
    }
  }).catch(() => {});
}

function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete);
</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;
}
</style>