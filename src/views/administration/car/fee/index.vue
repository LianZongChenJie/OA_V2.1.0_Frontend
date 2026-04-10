<template>
  <div class="main-content">
    <TableList
      :api="getPageListFix"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :search-fields="searchFields"
      :query-form="queryForm"
      row-key="id"
      ref="tableList"
    >
      <!-- 费用日期只显示年月日 -->
      <template #feeTime="{ row }">
        <span>{{ row.feeTime?.substring(0, 10) || '-' }}</span>
      </template>
        <template #types="{ row }">
    <span>
      {{
        row.types === 1 ? '停车费' :
        row.types === 2 ? '洗车费' :
        row.types === 3 ? '保养费' :
        row.types === 4 ? '维修费' :
        row.types === 5 ? '过路费' :
        row.types === 6 ? '过桥费' :
        row.types === 7 ? '养路费' :
        row.types === 8 ? '保险费' :
        row.types === 9 ? '年检费' :
        row.types === 10 ? '违章费' :
        row.types === 11 ? '其他费' : '未知'
      }}
    </span>
     </template>
      <!-- 记录时间格式化 -->
      <template #updateTime="{ row }">
        <span>{{ row.updateTime || '-' }}</span>
      </template>
    </TableList>
    <AddDialog ref="addDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import { getPageList, getDetail, deletereward } from "@/api/administration/car/fee/index.js";
import { getPageList as getCarPageList } from "@/api/administration/car/data/index.js";
import { listUser } from "@/api/system/user.js";
import { columns, getHeaderButs, getOperationColumn, searchFields, queryForm } from "./config/columns";
import AddDialog from "./components/add.vue";

const { proxy } = getCurrentInstance();
const tableList = ref(null);
const addDialogRef = ref(null);

const carMap = ref({});
const userMap = ref({});

async function loadDict() {
  const carRes = await getCarPageList({ pageSize: 1000 });
  carMap.value = (carRes.rows || []).reduce((map, item) => {
    const car = Array.isArray(item) ? item[0] : item;
    map[car.id] = car.title || '';
    return map;
  }, {});

  const userRes = await listUser({ pageSize: 1000 });
  userMap.value = (userRes.rows || []).reduce((map, item) => {
    map[item.userId] = item.userName || '';
    return map;
  }, {});
}

const getPageListFix = async (params) => {
  const res = await getPageList(params);
  if (Object.keys(carMap.value).length === 0) await loadDict();
  
  res.rows = res.rows.map(item => {
    if (Array.isArray(item)) {
      let repair = item[0] || {};
      repair.carName = carMap.value[repair.carId] || '';
      repair.handledName = userMap.value[repair.handledName] || '';
      return repair;
    }
    item.carName = carMap.value[item.carId] || '';
    item.handledName = item.handledName || userMap.value[item.adminId] || '';
    return item;
  }).filter(item => item && item.id);
  return res;
};

function handleAdd() {
  addDialogRef.value.open();
}
async function handleEdit(row) {
  const res = await getDetail(row.id);
  if (res) addDialogRef.value.openEdit(res.data || res);
}
async function handleView(row) {
  const res = await getDetail(row.id);
  if (res) addDialogRef.value.openView(res.data || res);
}
async function handleDelete(row) {
  proxy.$modal.confirm("确定删除该费用记录？").then(async () => {
    await deletereward(row.id);
    proxy.$modal.msgSuccess("删除成功");
    tableList.value.refresh();
  }).catch(() => {});
}

function handleSuccess() {
  tableList.value.refresh();
}

const headerButs = getHeaderButs(handleAdd);
const operationColumn = getOperationColumn(handleEdit, handleView, handleDelete);
</script>

<style lang="scss" scoped>
</style>