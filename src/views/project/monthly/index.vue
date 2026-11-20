<template>
  <div class="main-content">
    <SearchBar :initial-params="searchInitialParams" @search="handleSearch" @reset="handleSearch" />

    <TableList
      ref="tableList"
      :api="getPageList"
      :columns="columns"
      :operation-column="operationColumn"
      :toolbar-buttons="headerButs"
      :params="queryParams"
      row-key="id"
    >
      <template #contractSigned="{ row }">
        {{ row.contractSigned === 1 ? '是' : '否' }}
      </template>
      <template #projectClosed="{ row }">
        {{ row.projectClosed === 1 ? '是' : '否' }}
      </template>
    </TableList>

    <AddDialog ref="addDialogRef" @success="handleSuccess" />
    <ImportDialog ref="importDialogRef" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import TableList from '@/components/tableList/index.vue'
import SearchBar from './components/searchBar.vue'
import useUserStore from '@/store/modules/user'
import { getPageList, getDetail, del, exportXls } from '@/api/project/monthly/index.js'
import { columns, getHeaderButs, getOperationColumn } from './config/columns'
import AddDialog from './components/add.vue'
import ImportDialog from './components/importDialog.vue'
import { blobValidate } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()
const userStore = useUserStore()
const permissions = computed(() => userStore.permissions || [])

const tableList = ref(null)
const addDialogRef = ref(null)
const importDialogRef = ref(null)

const searchInitialParams = {
  statMonth: dayjs().subtract(1, 'month').format('YYYY-MM')
}
const queryParams = ref({ ...searchInitialParams })

const headerButs = computed(() => getHeaderButs(handleAdd, handleImport, handleExport, permissions.value))
const operationColumn = computed(() =>
  getOperationColumn(handleEdit, handleView, handleDelete, permissions.value)
)

function handleSearch(params) {
  queryParams.value = { ...params }
}

function handleSuccess() {
  tableList.value?.refresh()
}

function handleAdd() {
  addDialogRef.value?.open()
}

async function handleEdit(row) {
  const res = await getDetail(row.id)
  addDialogRef.value?.openEdit(res.data || res)
}

async function handleView(row) {
  const res = await getDetail(row.id)
  addDialogRef.value?.openView(res.data || res)
}

function handleDelete(row) {
  proxy.$modal.confirm(`确认删除 ${row.projectName} 该条记录吗？`).then(async () => {
    await del(row.id)
    proxy.$modal.msgSuccess('删除成功')
    handleSuccess()
  }).catch(() => {})
}

function handleImport() {
  importDialogRef.value?.open()
}

async function handleExport() {
  try {
    const res = await exportXls({ ...queryParams.value })
    if (!(await blobValidate(res))) {
      proxy.$modal.msgError('导出失败')
      return
    }
    saveAs(new Blob([res]), `月度项目台账_${queryParams.value.statMonth || 'all'}.xlsx`)
  } catch (error) {
    console.error(error)
    proxy.$modal.msgError('导出失败')
  }
}
</script>
