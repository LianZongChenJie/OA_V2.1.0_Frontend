<template>
  <div class="main-content">
    <TableList
      :api="getPageList"
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
import { getPageList, getDetail, updateStatus } from "@/api/base/administration/seal/index.js";
import { columns, getHeaderButs, getOperationColumn } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");
const { deptDict } = proxy.useDict("dept"); // 🔴 加载部门字典

const route = useRoute();
const router = useRouter();
const tableList = ref(null);
const addDialogRef = ref(null);

/** 新增按钮操作 */
function handleAdd() {
  addDialogRef.value.open();
}

/** 编辑按钮操作 */
async function handleEdit(row) {
  const res = await getDetail(row.id);
  if (res) {
    let data = res.data || res;
    // 🔴 修复：把 dids 字符串转数组，弹窗才能回显部门名称
    data.dids = data.dids ? data.dids.split(',') : [];
    addDialogRef.value.openEdit(data);
  }
}

/** 查看按钮操作 */
async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) {
    let data = res.data || res;
    // 🔴 修复：把 dids 字符串转数组
    data.dids = data.dids ? data.dids.split(',') : [];
    addDialogRef.value.openView(data);
  }
}

/** 禁用/启用按钮操作 */
async function handleDisable(row) {
  const newStatus = row.status === 1 ? 0 : 1;
  proxy.$modal
    .confirm(`确定要${row.status === 1 ? '禁用' : '启用'}该印章吗?`)
    .then(async () => {
      // ✅ 修复：第一个参数传 id，第二个参数传状态对象
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

// 🔴 修复表格显示部门名称（不是ID）
const formatColumns = () => {
  return columns.map(col => {
    if (col.fieldName === 'dids') {
      return {
        ...col,
        formatter: (row) => {
          if (!row.dids) return '-';
          return row.dids.split(',')
            .filter(id => id)
            .map(id => {
              const dept = deptDict.find(d => d.value == id);
              return dept ? dept.label : id;
            })
            .join('、');
        }
      };
    }
    return col;
  });
};

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleDisable, handleDisable);
</script>
<style lang="scss" scoped></style>