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
  if (!result?.row) return;
  const { type, row } = result;

  if (type === 'edit') {
    threeListRef.value?.refreshRow(row.id, row);
  } else if (type === 'add' && row.pid != null) {
    threeListRef.value?.addChildToRow(row.pid, row);
  } else {
    threeListRef.value?.refresh();
  }
}

// 新增子节点
const add = (row) => {
  dialogRef.value?.add(row);
};

// 编辑子节点
const edit = (row, parentRow) => {
  dialogRef.value?.edit(row, parentRow);
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
  const exportColumns = [
    { key: "id", title: "ID" },
    { key: "name", title: "名称" },
    { key: "shortname", title: "简称" },
    { key: "level", title: "级别" },
    { key: "pid", title: "父ID" },
    { key: "longitude", title: "经度" },
    { key: "latitude", title: "纬度" },
    { key: "sort", title: "排序" },
  ];

  try {
    const res = await exportAreaData(level);
    if (res.code === 200 && res.data) {
      exportExcel(res.data, `导出${levelMap[level]}级数据`, levelMap[level], exportColumns);
    }
  } catch (error) {
    console.error("导出失败:", error);
  }
}

// 工具栏按钮配置
const toolbarButtons = ref([
  { label: "导出省", icon: "Download", onClick: () => handleExport(1) },
  { label: "导出市", icon: "Download", onClick: () => handleExport(2) },
  { label: "导出区", icon: "Download", onClick: () => handleExport(3) },
]);
</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;
}
</style>
