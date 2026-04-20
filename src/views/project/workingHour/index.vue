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

// 使用 workingHour 接口
import { getPageList, getDetail, deletereward } from "@/api/project/workingHour/index.js";

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

// 下拉枚举：项目列表 + 负责人
const searchEnum = ref({
  projectList: [],
  userList: [],
});

// 加载项目列表
const fetchProjectList = async () => {
  try {
    const res = await getProjectList({ pageNum: 1, pageSize: 100 });
    let list = [];
    if (res.data?.rows) list = res.data.rows;
    else if (res.rows) list = res.rows;
    else if (Array.isArray(res)) list = res;

    searchEnum.value.projectList = list.map((item) => ({
      label: item.name || item.title || "未命名",
      value: item.id,
    }));
  } catch (err) {
    console.error("加载项目列表失败", err);
  }
};

// 加载负责人下拉
const fetchUserList = async () => {
  try {
    const res = await listUser({ pageSize: 1000 });
    let users = [];
    if (res.data?.rows) users = res.data.rows;
    else if (res.rows) users = res.rows;
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
  fetchProjectList();
  fetchUserList();
  tableKey.value++;
});

// 格式化 workingHour 接口数据，适配 columns 配置
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
    
  });
};

// 列表请求适配
const getPageListFix = async (params) => {
  try {
    const res = await getPageList(params);
    console.log('workingHour接口返回:', res);
    
    // workingHour 接口返回格式: { code: 200, data: { rows: [], total: number } }
    if (res?.code === 200 && res?.data?.rows) {
      const formattedRows = formatTaskData(res.data.rows);
      return {
        rows: formattedRows,
        total: res.data.total || 0
      };
    }
    
    // 兼容其他格式
    if (res?.rows) {
      const formattedRows = formatTaskData(res.rows);
      return {
        rows: formattedRows,
        total: res.total || 0
      };
    }
    
    return { rows: [], total: 0 };
  } catch (error) {
    console.error('获取任务列表失败:', error);
    return { rows: [], total: 0 };
  }
};

// 操作
function handleAdd() {
  addDialogRef.value.open();
}

function handleAdjustHour(row) {
  // 调整工时逻辑
  console.log('调整工时', row);
}

function handleEdit(row) {
  // 编辑逻辑
  console.log('编辑', row);
}

async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) addDialogRef.value.openView(res.data || res);
}

async function handleDelete(row) {
  proxy.$modal.confirm("确定删除该记录吗？").then(async () => {
    await deletereward(row.id);
    proxy.$modal.msgSuccess("删除成功");
    tableList.value.refresh();
  }).catch(() => {});
}

function handleSuccess() {
  tableList.value.refresh();
}

// 注意：这里有4个参数：调整工时、编辑、删除、查看
const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleAdjustHour, handleEdit, handleDelete, handleView);
</script>