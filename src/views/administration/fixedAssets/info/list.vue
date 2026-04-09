<template>
  <div class="tabs-container">
    <TableList
      :api="getPageList"
      :params="{ cateId }"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      row-key="name"
      ref="tableList"
    >
      <template #status="{ row }">
        <dict-tag :options="assets_status" :value="row.status" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
    <StatusDialog ref="statusDialogRef" @success="handleSuccess" />
  </div>
</template>
<script setup>
import { reactive, ref, getCurrentInstance, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import {
  getPageList,
  getDetail,
  updateStatus,
  del,
} from "@/api/administration/fixedAssets/info";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";
import StatusDialog from "./components/statusDialog.vue";

const props = defineProps({
  cateId: {
    type: [String, Number],
    default: null
  },
  refreshTree: {
    type: Function,
    default: null
  }
});

const { proxy } = getCurrentInstance();
const { assets_status } = proxy.useDict("assets_status");

const route = useRoute();
const router = useRouter();
const tableList = ref(null);
const addDialogRef = ref(null);
const statusDialogRef = ref(null);

/** 新增按钮操作 */
function handleAdd() {
  addDialogRef.value.open();
}

/** 编辑按钮操作 */
function handleEdit(row) {
  addDialogRef.value.openEdit(row);
}

/** 查看按钮操作 */
async function handleView(row) {
  // 获取详情数据
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}

/** 设置状态按钮操作 */
function handleDisable(row) {
  statusDialogRef.value.open(row);
}

/** 删除按钮操作 */
async function handleDelete(row) {
  proxy.$modal
    .confirm("确定要删除该采购品吗？")
    .then(async () => {
      const res = await del(row.id);

      if (res) {
        proxy.$modal.msgSuccess("删除成功");
        tableList.value.refresh();
        // 刷新分类树
        props.refreshTree?.();
      }
    })
    .catch(() => {});
}

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
  // 刷新分类树
  props.refreshTree?.();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(
  handleEdit,
  handleView,
  handleDisable,
  handleDelete,
);
</script>
<style lang="scss" scoped>
.tabs-container {
  height: calc(100% - 10px);
}
</style>
