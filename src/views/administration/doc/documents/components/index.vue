<template>
  <div class="tabs-container">
    <TableList
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :params="{ tab: type }"
      row-key="name"
      ref="tableList"
    >
      <template #status="{ row }">
        <dict-tag :options="message_module_status" :value="row.status" />
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" :type="type" :label="label" />
  </div>
</template>
<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail } from "@/api/administration/doc/documents";
import { columns, getHeaderButs, getOperationColumn } from "./config/colums";
import AddDialog from "./components/add.vue";

const props = defineProps({
  type: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const { proxy } = getCurrentInstance();
const { message_module_status } = proxy.useDict("message_module_status");

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
  // 获取详情数据
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openEdit(res.data || res);
  }
}

/** 查看按钮操作 */
async function handleView(row) {
  // 获取详情数据
  const res = await getDetail(row.id);
  if (res) {
    addDialogRef.value.openView(res.data || res);
  }
}

/** 新增成功回调 */
function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit);
</script>
<style lang="scss" scoped>
.tabs-container {
  height: calc(100% - 50px);
}
</style>
