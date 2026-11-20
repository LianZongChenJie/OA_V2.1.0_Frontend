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
      <template #isSettled="{ row }">
        {{ row.isSettled === 1 ? '是' : '否' }}
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
import { getPageList, getDetail, del, exportXls } from '@/api/service/customerSettlement/index.js'
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
  statYear: dayjs().format('YYYY')
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
  const name = `${row.customerName || ''}${row.employeeName ? ' / ' + row.employeeName : ''}`
  proxy.$modal.confirm(`确认删除 ${name} 该条结算记录吗？`).then(async () => {
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
    const { statYear, statMonth } = queryParams.value
    const monthPart = statMonth ? `-${String(statMonth).padStart(2, '0')}` : ''
    saveAs(new Blob([res]), `服务客户结算_${statYear || 'all'}${monthPart}.xlsx`)
  } catch (error) {
    console.error(error)
    proxy.$modal.msgError('导出失败')
  }
}
</script>
