<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="id"
      ref="tableList"
    >
      <template #status="{ row }">
        <dict-tag :options="message_module_status" :value="row.status" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, updateStatus } from "@/api/base/administration/seal/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";
import { listUser } from "@/api/system/user.js";
import { deptTreeSelect } from "@/api/system/user.js";

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");

const tableList = ref(null);
const addDialogRef = ref(null);

// 缓存：用户ID => 用户名
const userMap = ref({});
// 缓存：部门ID => 部门名称
const deptMap = ref({});

// 加载所有用户
async function loadUsers() {
  const res = await listUser({ pageSize: 1000 });
  const map = {};
  (res.rows || []).forEach(u => {
    map[u.userId] = u.nickName;
  });
  userMap.value = map;
}

// 加载所有部门
async function loadDepts() {
  const res = await deptTreeSelect();
  const map = {};
  const walk = (list) => {
    list.forEach(item => {
      map[item.id] = item.label;
      if (item.children) walk(item.children);
    });
  };
  walk(res.data || []);
  deptMap.value = map;
}

// 初始化
onMounted(() => {
  loadUsers();
  loadDepts();
});

// 新增
function handleAdd() {
  addDialogRef.value.open();
}

// 编辑
async function handleEdit(row) {
  const res = await getDetail(row.id);
  if (res) {
    let data = res.data || res;
    data.dids = data.dids ? data.dids.split(",") : [];
    addDialogRef.value.openEdit(data);
  }
}

// 禁用/启用
async function handleDisable(row) {
  const newStatus = row.status === 1 ? 0 : 1;
  await updateStatus(row.id, { status: newStatus });
  proxy.$modal.msgSuccess("操作成功");
  tableList.value.refresh();
}

function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleDisable, handleDisable);
</script>

<style lang="scss" scoped>
.main-content {
  padding: 20px;
}
</style>