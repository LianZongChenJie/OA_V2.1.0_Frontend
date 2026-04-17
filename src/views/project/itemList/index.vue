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
    />
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
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

// 状态映射（可移到 config 文件）
const statusMap = {
  0: "未设置",
  1: "未开始",
  2: "进行中",
  3: "已完成",
  4: "已关闭"
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
const formatTableData = (rows) => {
  if (!rows?.length) return [];
  return rows.map(row => ({
    ...row,
    statusText: statusMap[row.status] || "未知",
    tasksUnfinish: 0,
    tasksFinish: 0,
    tasksPensent: "0%",
  }));
};

// ========== API 封装 ==========
const getPageListFix = async (params) => {
  // 过滤空参数
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );
  const res = await getPageList(cleanParams);
  if (res?.rows) res.rows = formatTableData(res.rows);
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
  proxy.$modal.confirm("确定删除？").then(async () => {
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