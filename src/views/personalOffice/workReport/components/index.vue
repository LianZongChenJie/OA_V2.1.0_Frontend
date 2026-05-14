<template>
  <div class="tabs-container">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :params="params"
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
import { ref, getCurrentInstance, computed, watch } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, deleteenterPrise } from "@/api/personalOffice/workReport/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";
import AddDialog from "./components/add.vue";

const props = defineProps({
  send: {
    type: Number,
    default: 1, // 1-发送的汇报，0-接收的汇报
  },
  activeTab: {
    type: String,
    default: "CustomerStatus",
  },
});

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");

const tableList = ref(null);
const addDialogRef = ref(null);


const params = computed(() => ({
  send: props.send
}));

// 根据当前标签页决定是否显示新增按钮（只有发送的汇报显示）
const showAddButton = computed(() => {
  return props.send === 1;
});

/** 新增按钮操作 */
function handleAdd() {
  addDialogRef.value.open();
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

/** 删除方法 */
async function handleDelete(row) {
  try {
    await proxy.$modal.confirm('确认删除该工作汇报吗？');
    await deleteenterPrise(row.id);
    proxy.$modal.msgSuccess("删除成功");
    handleSuccess();
  } catch (e) {
    console.error('删除失败', e);
  }
}

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

/** 刷新表格（供父组件调用） */
function refreshTable() {
  tableList.value?.refresh();
}

// 根据是否显示新增按钮动态生成头部按钮
const headerButs = computed(() => {
  if (!showAddButton.value) return [];
  return getHeaderButs(handleAdd);
});

// 操作列配置（接收的汇报不显示编辑按钮）
const operationColumn = computed(() => {
  if (props.send === 1) {
    return getOperationColumn(handleEdit, handleView, handleDelete);
  } else {
    return {
      label: '操作',
      width: 120,
      fixed: 'right',
      show: true,
      actions: [
        {
          label: '查看',
          type: 'primary',
          size: 'small',
          onClick: (row) => handleView(row),
          icon: 'eye-open',
        },
      ],
    };
  }
});

defineExpose({ refreshTable });
</script>

<style lang="scss" scoped>
.tabs-container {
  height: calc(100% - 80px);
}
</style>