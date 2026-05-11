<template>
  <div class="main-content">
    <ThreeList
      ref="threeListRef"
      :api="getThreeList"
      :lazy-load="true"
      :toolbar-buttons="toolbarButtons"
      :columns="columns"
      :params="{pid:0}"
      :operation-column="getOperationColumn(add, edit, handleChangeStatus)">
      <template #status="{ row }">
        <el-tag :type="row.status === 0 ? 'danger' : 'success'" size="small">
          {{ row.status === 0 ? '已禁用' : '正常' }}
        </el-tag>
      </template>
    </ThreeList>

    <!-- 新增/编辑节点弹窗 -->
    <DivisionFormDialog ref="dialogRef" @success="handleDialogSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import ThreeList from "@/components/threeList/index.vue";
import DivisionFormDialog from "./components/DivisionFormDialog.vue";
import { getThreeList, exportAreaData, changeStatus } from "@/api/base/common/division";
import { exportExcel } from "@/utils/export";
import { columns, getOperationColumn } from "./config/columns";

const { proxy } = getCurrentInstance();
const threeListRef = ref(null);
const dialogRef = ref(null);

// 弹窗成功回调
function handleDialogSuccess(result) {
  if (!result || !result.row) return;

  if (result.type === 'edit') {
    // 编辑成功，只刷新当前行
    threeListRef.value?.refreshRow(result.row.id, result.row);
  } else if (result.type === 'add') {
    // 新增成功，将子节点直接添加到父节点的 children 中
    const parentId = result.row.pid;
    if (parentId !== undefined && parentId !== null) {
      threeListRef.value?.addChildToRow(parentId, result.row);
    } else {
      // 如果没有父节点ID，刷新整个列表
      threeListRef.value?.refresh();
    }
  } else {
    // 其他操作，刷新整个列表
    threeListRef.value?.refresh();
  }
}

// 新增子节点
const add = (row) => {
  dialogRef.value?.add(row);
};

// 编辑子节点
const edit = (row) => {
  dialogRef.value?.edit(row);
};

// 修改状态（禁用/启用）
const handleChangeStatus = (row, status) => {
  const actionText = status === 0 ? "禁用" : "启用";
  proxy.$modal
    .confirm(`确定要${actionText} "${row.name}" 吗？`)
    .then(() => {
      return changeStatus({ id: row.id, status });
    })
    .then((res) => {
      if (res.code === 200) {
        proxy.$modal.msgSuccess(`${actionText}成功`);
        // 更新当前行状态
        threeListRef.value?.refreshRow(row.id, { ...row, status });
      }
    })
    .catch((error) => {
      if (error !== "cancel") {
        console.error(`${actionText}失败:`, error);
      }
    });
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
