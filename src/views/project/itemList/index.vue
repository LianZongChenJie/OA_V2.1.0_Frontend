<template>
  <div class="main-content">
    <TableList
      v-if="isUserLoaded"
      ref="tableList"
      :api="getPageListFix"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="id"
      :search-enum="searchEnum"
    >
      <!-- 创建时间插槽：时间戳转日期格式 -->
      <template #createTime="{ row }">
        <span>{{ formatTimestamp(row.createTime) }}</span>
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, deletereward } from "@/api/project/itemList/index.js";
import { getPageList as getProjectCategoryList } from "@/api/base/project/projectClassify/index.js";
import { listUser } from "@/api/system/user.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();

// ========== 响应式数据 ==========
const tableList = ref(null);
const addDialogRef = ref(null);
const isUserLoaded = ref(false);

// 搜索下拉数据
const searchEnum = reactive({
  projectCategoryList: [],
  userList: [],
});

// 状态映射
const statusMap = {
  0: "未设置",
  1: "未开始",
  2: "进行中",
  3: "已完成",
  4: "已关闭"
};

// ========== 时间戳格式化函数 ==========
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// ========== 数据加载 ==========
const loadCategories = async () => {
  const res = await getProjectCategoryList({ pageNum: 1, pageSize: 100 });
  const list = res.rows || res.data?.rows || [];
  searchEnum.projectCategoryList = list.map(item => ({
    label: item.title || "未命名",
    value: item.id,
  }));
  return list;
};

const loadUsers = async () => {
  const res = await listUser({ pageSize: 1000 });
  const users = res.rows || res.data?.rows || [];
  searchEnum.userList = users.map(u => ({
    label: u.nickName || u.userName || "",
    value: u.userId,
  }));
  return users;
};

// ========== 表格数据处理 ==========
const getPageListFix = async (params) => {
  const res = await getPageList(params);
  if (res?.rows) {
    res.rows = res.rows.map(item => ({
      ...item,
      tasksOngoing: item.tasksOngoing ?? 0,
      tasksFinish: item.tasksFinish ?? 0,
      tasksPensent: item.tasksPensent || (item.tasksTotal > 0 ? `${Math.round((item.tasksFinish / item.tasksTotal) * 100)}%` : '0%')
    }));
  }
  return res;
};

// ========== 操作方法 ==========
const handleAdd = () => addDialogRef.value.open();

const handleEdit = async (row) => {
  const res = await getDetail(row.id);
  addDialogRef.value.openEdit(res.data || res);
};

const handleView = async (row) => {
  const res = await getDetail(row.id);
  addDialogRef.value.openView(res.data || res);
};

const handleDelete = (row) => {
  proxy.$modal.confirm("确定删除该项目吗？").then(async () => {
    await deletereward(row.id);
    ElMessage.success("删除成功");
    tableList.value?.refresh();
  }).catch(() => {});
};

const handleSuccess = () => {
  tableList.value?.refresh();
};

// ========== 初始化 ==========
onMounted(async () => {
  await Promise.all([loadCategories(), loadUsers()]);
  isUserLoaded.value = true;
});

// ========== 配置 ==========
const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete);
</script>