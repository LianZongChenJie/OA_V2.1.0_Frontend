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

// 任务接口
import { getPageList, getDetail, deletereward } from "@/api/project/task/index.js";

// 项目接口
import { getPageList as getProjectCategoryList } from "@/api/project/itemList/index.js";

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

// 下拉枚举：项目类别 + 负责人
const searchEnum = ref({
  projectCategoryList: [], // 项目类别
  userList: [], // 负责人
});


// 加载：项目类别下拉

const fetchProjectCategory = async () => {
  try {
    const res = await getProjectCategoryList({ pageNum: 1, pageSize: 100 });
    let list = [];
    if (res.rows) list = res.rows;
    else if (res.data?.rows) list = res.data.rows;
    else if (Array.isArray(res)) list = res;

    searchEnum.value.projectCategoryList = list.map((item) => ({
      label: item.title || item.name || "未命名",
      value: item.id,
    }));
  } catch (err) {
    console.error("加载项目类别失败", err);
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
  fetchProjectCategory(); // 项目类别
  fetchUserList(); // 负责人
  tableKey.value++;
});

// 列表请求适配
const getPageListFix = async (params) => {
  const res = await getPageList(params);
  return res;
};

// 操作
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
  proxy.$modal.confirm("确定删除该项目吗？").then(async () => {
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