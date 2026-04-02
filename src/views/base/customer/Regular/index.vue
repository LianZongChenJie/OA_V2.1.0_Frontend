<template>
  <div class="main-content">
    <!-- 标签切换栏 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="custom-tabs">
      <el-tab-pane label="客户状态" name="1" />
      <el-tab-pane label="客户意向" name="2" />
      <el-tab-pane label="跟进方式" name="3" />
      <el-tab-pane label="销售阶段" name="4" />
    </el-tabs>

    <TableList
      :api="customGetPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="name"
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
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, updateStatus } from "@/api/base/customer/regular/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");

const route = useRoute();
const router = useRouter();
const tableList = ref(null);
const addDialogRef = ref(null);

// 标签切换核心逻辑
const activeTab = ref("1");

const customGetPageList = (query) => {
  return getPageList({
    pageNum: 1,
    pageSize: 10,
    types: Number(activeTab.value),
    ...query
  });
};

const handleTabChange = () => {
  tableList.value.refresh();
};

/** 新增按钮操作 */
function handleAdd() {
  addDialogRef.value.open(activeTab.value);
}

/** 编辑按钮操作 */
async function handleEdit(row) {
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openEdit(res.data || res);
  }
}

/** 查看按钮操作 */
async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}

/** 禁用/启用按钮操作 */
async function handleDisable(row) {
  const newStatus = row.status === 1 ? 0 : 1;
  proxy.$modal
    .confirm(`确定要${row.status === 1 ? '禁用' : '启用'}该数据吗?`)
    .then(async () => {
      const res = await updateStatus(row.id, { status: newStatus });
      
      if (res) {
        proxy.$modal.msgSuccess(`${newStatus === 1 ? '启用' : '禁用'}成功`);
        tableList.value.refresh();
      }
    })
    .catch(() => {});
}

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleDisable, handleDisable);
</script>

<style lang="scss" scoped>

.custom-tabs {
  margin-bottom: 0 !important; // 移除标签栏底部外边距
  ::v-deep .el-tabs__content {
    display: none; // 隐藏标签页默认的内容容器（彻底消除留白）
  }
  ::v-deep .el-tabs__header {
    margin-bottom: 0 !important; // 移除标签头底部的默认边距
    border-bottom: 1px solid #e4e7ed; // 保留底部边框，和截图样式一致
  }
  ::v-deep .el-tabs__item {
    height: 48px; // 统一标签高度，和截图UI对齐
    line-height: 48px;
  }
}

// 给表格加顶部间距，避免和标签栏贴太近
.main-content {
  padding: 16px;
  .el-table {
    margin-top: 16px;
  }
}
</style>