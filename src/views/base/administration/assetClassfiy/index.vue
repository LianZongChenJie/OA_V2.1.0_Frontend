<template>
  <div class="main-content">
    <PageTreeList
      ref="pageTreeListRef"
      :get-page-list="getPageList"
      :get-three="getTree"
      :toolbar-buttons="toolbarButtons"
      :columns="columns"
      :operation-column="getOperationColumn(add, edit, del)"
    />

    <!-- 新增/编辑节点弹窗 -->
    <AssetClassifyFormDialog ref="dialogRef" @success="handleDialogSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import PageTreeList from "@/components/pageTreeList/index.vue";
import AssetClassifyFormDialog from "./components/AssetClassifyFormDialog.vue";
import { getPageList, getTree, deleteAssetClassify } from "@/api/base/administration/assetClassfiy";
import { columns, getOperationColumn } from "./config/columns";

const { proxy } = getCurrentInstance();
const pageTreeListRef = ref(null);
const dialogRef = ref(null);

// 弹窗成功回调
function handleDialogSuccess(pid) {
  if (pid !== undefined && pid !== 0) {
    // 如果有 pid 且不为 0，说明是新增/编辑子节点，只刷新对应父节点的子节点
    pageTreeListRef.value?.refreshChildren(pid);
  } else {
    // pid 为 0 或 undefined 时刷新整个列表（新增根节点或编辑根节点）
    pageTreeListRef.value?.refresh();
  }
}

// 新增子节点
const add = (row) => {
  dialogRef.value?.add(row);
};

// 编辑子节点
const edit = (row) => {
  // 查找上级节点名称
  let parentName = '根节点';
  if (row.pid !== 0 && row.pid !== undefined) {
    const parentNode = pageTreeListRef.value?.findNodeById(row.pid);
    if (parentNode) {
      parentName = parentNode.title;
    }
  }
  dialogRef.value?.edit(row, parentName);
};

// 删除子节点
const del = (row) => {
  proxy.$modal.confirm('是否确认删除分类 "' + row.title + '"？').then(() => {
    return deleteAssetClassify(row.id);
  }).then(() => {
    proxy.$modal.msgSuccess("删除成功");
    pageTreeListRef.value?.refresh();
  }).catch(() => {});
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
</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;
}
</style>
