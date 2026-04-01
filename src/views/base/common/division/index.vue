<template>
  <div class="main-content">
    <ThreeList
      ref="threeListRef"
      :api="getThreeList"
      :demand-expand="true"
      :toolbar-buttons="toolbarButtons"
      :columns="columns"
      :operation-column="getOperationColumn(add, edit, del)"
    />

    <!-- 新增/编辑节点弹窗 -->
    <DivisionFormDialog ref="dialogRef" @success="handleDialogSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import ThreeList from "@/components/threeList/index.vue";
import DivisionFormDialog from "./components/DivisionFormDialog.vue";
import { getThreeList, exportAreaData } from "@/api/base/common/division";
import { exportExcel } from "@/utils/export";
import { columns, getOperationColumn } from "./config/columns";

const { proxy } = getCurrentInstance();
const threeListRef = ref(null);
const dialogRef = ref(null);

// 弹窗成功回调
function handleDialogSuccess() {
  threeListRef.value?.refresh();
}

// 新增子节点
const add = (row) => {
  dialogRef.value?.add(row);
};

// 编辑子节点
const edit = (row) => {
  dialogRef.value?.edit(row);
};

// 删除子节点
const del = (row) => {
  console.log("====del===>", row);
};

// 导出区域数据
async function handleExport(level) {
  const levelMap = { 1: "省", 2: "市", 3: "区" };
  try {
    const res = await exportAreaData(level);
    if (res.code === 200 && res.data) {
      // 定义列配置
      const columns = [
        { key: "id", title: "ID" },
        { key: "name", title: "名称" },
        { key: "shortname", title: "简称" },
        { key: "level", title: "级别" },
        { key: "pid", title: "父ID" },
        { key: "longitude", title: "经度" },
        { key: "latitude", title: "纬度" },
        { key: "sort", title: "排序" },
      ];
      exportExcel(
        res.data,
        `导出${levelMap[level]}级数据`,
        levelMap[level],
        columns,
      );
    }
  } catch (error) {
    console.error("导出失败:", error);
  }
}

// 工具栏按钮配置
const toolbarButtons = ref([
  {
    label: "导出省",
    icon: "Download",
    onClick: () => {
      handleExport(1);
    },
  },
  {
    label: "导出市",
    icon: "Download",
    onClick: () => {
      handleExport(2);
    },
  },
  {
    label: "导出区",
    icon: "Download",
    onClick: () => {
      handleExport(3);
    },
  },
]);
</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;
}
</style>
