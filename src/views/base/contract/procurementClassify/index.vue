<template>
  <div class="main-content">
    <PageTreeList
      ref="pageTreeListRef"
      :get-page-list="getPageList"
      :get-three="getTree"
      :toolbar-buttons="toolbarButtons"
      :columns="columns"
      :operation-column="operationColumn"
    />

    <!-- 新增/编辑节点弹窗 -->
    <AddFormDialog ref="dialogRef" @success="handleDialogSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import PageTreeList from "@/components/pageTreeList/index.vue";
import AddFormDialog from "./components/AddFormDialog.vue";
import {
  getPageList,
  getTree,
  deleteClassify,
} from "@/api/base/contract/procurementClassify";
import { columns, getOperationColumn } from "./config/columns";

const { proxy } = getCurrentInstance();
const pageTreeListRef = ref(null);
const dialogRef = ref(null);

// 弹窗成功回调
async function handleDialogSuccess(pid) {
  if (pid !== undefined && pid !== 0) {
    // 如果有 pid 且不为 0，说明是新增/编辑子节点，只刷新对应父节点的子节点
    pageTreeListRef.value?.refreshChildren(pid);
  } else {
    // pid 为 0 或 undefined 时刷新整个列表（新增根节点或编辑根节点）
    pageTreeListRef.value?.refresh();
  }
}

// 删除子节点
const del = (row) => {
  proxy.$modal
    .confirm(`是否确认删除分类 "${row.title}"？`)
    .then(() => {
      return deleteClassify(row.id);
    })
    .then(() => {
      proxy.$modal.msgSuccess("删除成功");
      // 删除根节点刷新整个表格，删除子节点只刷新父节点
      if (row.pid === 0 || row.pid === "0") {
        pageTreeListRef.value?.refresh();
      } else {
        pageTreeListRef.value?.refreshChildren(row.pid);
      }
    })
    .catch(() => {});
};

const toolbarButtons = ref([
  {
    label: "新增",
    type: "primary",
    icon: "Plus",
    onClick: () => {
      dialogRef.value?.add(null);
    },
  },
]);

// 查找节点名称
const findNodeName = (pid) => {
  return pageTreeListRef.value?.findNodeById?.(pid)?.title;
};

// 操作列配置
const operationColumn = getOperationColumn(
  (row) => dialogRef.value?.add(row),
  (row) => dialogRef.value?.edit(row, findNodeName(row.pid)),
  del,
);
</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;
}
</style>
