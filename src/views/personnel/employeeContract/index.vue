<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :basic-search-fields="basicSearchFields"
      :advanced-search-fields="advancedSearchFields"
      :query-form="queryForm"
      row-key="id"
      ref="tableList"
    >
      <template #status="{ row }">
        <dict-tag :options="supplier_status" :value="row.status" />
      </template>
    </TableList>

    <!-- 选择合同类型弹窗 -->
    <el-dialog
      title="请选择合同类型"
      v-model="categoryDialogVisible"
      width="520px"
      append-to-body
      center
    >
      <div class="type-list">
        <div
          class="type-item"
          v-for="item in typeList"
          :key="item.value"
          @click="selectType(item.value)"
        >
          <span class="icon">📄</span>
          <span class="label">{{ item.label }}</span>
        </div>
      </div>
    </el-dialog>

    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getMessageModuleDetail, updateStatus, deleteMessageModule } from "@/api/base/contract/supplier/index.js";
import { columns, getHeaderButs, getOperationColumn, basicSearchFields, advancedSearchFields, queryForm } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const tableList = ref(null);
const addDialogRef = ref(null);
const { supplier_status } = proxy.useDict("supplier_status");

// 类型选择弹窗
const categoryDialogVisible = ref(false);
const typeList = ref([
  { label: "劳动合同", value: "劳动合同" },
  { label: "劳务合同", value: "劳务合同" },
  { label: "实习协议", value: "实习协议" },
  { label: "保密协议", value: "保密协议" },
]);

// 点击新增 → 弹出选择
function handleAdd() {
  categoryDialogVisible.value = true;
}

// 选择类型 → 打开表单
function selectType(val) {
  categoryDialogVisible.value = false;
  addDialogRef.value.open(val);
}

// 编辑
async function handleEdit(row) {
  const res = await getMessageModuleDetail(row.id);
  addDialogRef.value.openEdit(res.data);
}

// 查看
async function handleView(row) {
  const res = await getMessageModuleDetail(row.id);
  addDialogRef.value.openView(res.data);
}

// 删除
async function handleDelete(row) {
  proxy.$modal.confirm("确定要删除该合同吗？删除后无法恢复！").then(async () => {
    await deleteMessageModule(row.id);
    proxy.$modal.msgSuccess("删除成功");
    tableList.value.refresh();
  }).catch(() => {});
}

// 刷新
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete);
</script>

<style lang="scss" scoped>
.type-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 10px 0;
}

.type-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  height: 100px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.3s;

  &:hover {
    border-color: #409eff;
    background: #f0f7ff;
    color: #409eff;
  }

  .icon {
    font-size: 24px;
  }
}
</style>