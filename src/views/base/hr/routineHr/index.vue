<template>
  <div class="main-content">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="custom-tabs">
      <el-tab-pane label="职务" name="1" />
      <el-tab-pane label="职级" name="2" />
    </el-tabs>

    <TableList
      :api="customGetPageList"
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
import { ref, reactive, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, updateStatus } from "@/api/base/hr/routineHr/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");

const route = useRoute();
const router = useRouter();
const tableList = ref(null);
const addDialogRef = ref(null);

const activeTab = ref("1");

const customGetPageList = (query) => {
  return getPageList({
    ...query,
    types: activeTab.value,
  });
};

const handleTabChange = () => {
  tableList.value.refresh();
};

function handleAdd() {
  addDialogRef.value.open(activeTab.value);
}

async function handleEdit(row) {
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openEdit(res.data || res);
  }
}

async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}


async function handleDisable(row) {
  const newStatus = row.status === 1 ? 0 : 1;
  proxy.$modal
    .confirm(`确定要${row.status === 1 ? "禁用" : "启用"}该数据吗?`)
    .then(async () => {
      const res = await updateStatus(row.id, { status: newStatus });
      if (res) {
        proxy.$modal.msgSuccess(`${newStatus === 1 ? "启用" : "禁用"}成功`);
        tableList.value.refresh();
      }
    })
    .catch(() => {});
}

function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleDisable, handleDisable);
</script>

<style lang="scss" scoped>
.custom-tabs {
  margin-bottom: 0 !important;
  ::v-deep .el-tabs__content {
    display: none;
  }
  ::v-deep .el-tabs__header {
    margin-bottom: 0 !important;
    border-bottom: 1px solid #e4e7ed;
    background-color: #f5f7fa;
  }
  ::v-deep .el-tabs__item {
    height: 48px;
    line-height: 48px;
    padding: 0 20px;
    font-size: 14px;
    color: #606266;
    &.is-active {
      color: #409eff;
      font-weight: 500;
    }
  }
  ::v-deep .el-tabs__active-bar {
    background-color: #409eff;
    height: 2px;
  }
}
.main-content {
  padding: 16px;
}
</style>