<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="id"
      ref="tableList"
      :before-search="handleBeforeSearch"
    >
      <template #status="{ row }">
        <dict-tag :options="supplier_status" :value="row.status" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import TableList from "@/components/tableList/index.vue";
import { listUser } from "@/api/system/user.js";
import { getPageList, getDetail, deleteDeptChange } from "@/api/personnel/rewardsPunishments/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { supplier_status } = proxy.useDict("supplier_status");

const tableList = ref(null);
const addDialogRef = ref(null);

// 搜索枚举数据
const searchEnum = ref({
  userList: []
});


const handleBeforeSearch = (params) => {
  console.log('处理前参数：', params);

  // 兼容两种格式：数组 / 字符串拼接
  if (params.rewardDate) {
    let arr = [];
    
    // 如果是数组
    if (Array.isArray(params.rewardDate)) {
      arr = params.rewardDate;
    }
    // 如果是字符串
    else if (typeof params.rewardDate === 'string') {
      arr = params.rewardDate.replace(/[\[\]]/g, '').split(',');
    }

    if (arr.length === 2) {
      params.beginTime = arr[0]?.trim();
      params.endTime = arr[1]?.trim();
    }
  }

  // 强制删除旧字段
  delete params.rewardDate;
  delete params['rewardDate[0]'];
  delete params['rewardDate[1]'];

  console.log('处理后参数：', params);
  return params;
};

// 加载用户列表
const loadUsers = async () => {
  const res = await listUser({ pageSize: 1000 });
  const users = res.rows || res.data?.rows || [];
  searchEnum.value.userList = users.map(u => ({
    label: u.nickName || u.userName || "",
    value: u.userId,
  }));
  return users;
};

// 新增
function handleAdd() {
  addDialogRef.value.open();
}

// 编辑
async function handleEdit(row) {
  const res = await getDetail(row.id); 
  addDialogRef.value.openEdit(res.data);
}

// 查看
async function handleView(row) {
  const res = await getDetail(row.id); 
  addDialogRef.value.openView(res.data);
}

// 删除
async function handleDelete(row) {
  proxy.$modal.confirm("确定要删除该奖罚项目吗？").then(async () => {
    await deleteDeptChange(row.id);
    proxy.$modal.msgSuccess("删除成功");
    tableList.value.refresh();
  }).catch(() => {});
}

// 成功回调
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn( 
  handleEdit,
  handleView, 
  handleDelete
);

// 初始化加载用户数据
onMounted(() => {
  loadUsers();
});


import { provide } from "vue";
provide("searchEnum", searchEnum);
</script>

<style lang="scss" scoped>
</style>