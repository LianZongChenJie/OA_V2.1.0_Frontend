<template>
  <div class="main-content">
    <!-- 关键改动：添加 v-if，确保用户数据加载完再渲染表格 -->
    <TableList
      v-if="isUserLoaded"
      :key="tableKey"
      :api="getPageListFix"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="id"
      :search-enum="searchEnum"
    >
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, nextTick } from "vue";
import TableList from "@/components/tableList/index.vue";

import { getPageList, getDetail, deletereward } from "@/api/project/itemList/index.js";
import { getPageList as getProjectCategoryList } from "@/api/base/project/projectClassify/index.js";
import { listUser } from "@/api/system/user.js";

import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();

const tableList = ref(null);
const addDialogRef = ref(null);
const tableKey = ref(0);
// 新增：控制是否渲染表格的标志
const isUserLoaded = ref(false);

const searchEnum = ref({
  projectCategoryList: [],
  userList: [],
});

// 缓存
const cateCache = ref([]);
const allUserCache = ref([]);

// 状态映射
const statusMap = {
  0: "未设置",
  1: "未开始",
  2: "进行中",
  3: "已完成",
  4: "已关闭"
};

// ======================================
// 加载分类
// ======================================
const fetchProjectCategory = async () => {
  try {
    const res = await getProjectCategoryList({ pageNum: 1, pageSize: 100 });
    const list = res.rows || res.data?.rows || [];
    cateCache.value = list;
    searchEnum.value.projectCategoryList = list.map(item => ({
      label: item.title || "未命名",
      value: item.id,
    }));
  } catch (err) {}
};

// ======================================
// 加载用户（修改：加载完后才修改 isUserLoaded）
// ======================================
const fetchUserList = async () => {
  try {
    const res = await listUser({ pageSize: 1000 });
    const users = res.rows || res.data?.rows || [];
    allUserCache.value = users;
    
    // 搜索下拉：使用全部用户
    searchEnum.value.userList = users.map(u => ({
      label: u.nickName || u.userName || "",
      value: u.userId,
    }));
  } catch (err) {}
  finally {
    // 无论成功失败，最后都标记加载完成
    isUserLoaded.value = true;
  }
};


// 表格数据格式化（修复创建人字段名）
const formatTableData = (rows) => {
  if (!rows || !rows.length) return [];

  return rows.map(row => {
    // 1. 状态
    row.statusText = statusMap[row.status] || "未知";

    // 6. 任务相关（占位）
    row.tasksUnfinish = 0;
    row.tasksFinish = 0;
    row.tasksPensent = "0%";

    return row;
  });
};

// ======================================
// 初始化
// ======================================
onMounted(async () => {
  // 并行加载，提高速度
  await Promise.all([fetchProjectCategory(), fetchUserList()]);
  await nextTick();
  tableKey.value++;
});

// 列表请求（修复版）
const getPageListFix = async (params) => {
  // ✅ 过滤：删除值为 undefined / null / 空字符串 的参数
  const cleanParams = {};
  Object.keys(params).forEach(key => {
    const val = params[key];
    if (val !== undefined && val !== null && val !== '') {
      cleanParams[key] = val;
    }
  });

  const res = await getPageList(cleanParams);
  if (res?.rows) {
    res.rows = formatTableData(res.rows);
  }
  return res;
};

// 操作
function handleAdd() { addDialogRef.value.open(); }
async function handleEdit(row) {
  const res = await getDetail(row.id);
  addDialogRef.value.openEdit(res.data || res);
}
async function handleView(row) {
  const res = await getDetail(row.id);
  addDialogRef.value.openView(res.data || res);
}
async function handleDelete(row) {
  proxy.$modal.confirm("确定删除？").then(async () => {
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