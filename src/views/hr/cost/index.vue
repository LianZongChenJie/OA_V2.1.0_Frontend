<template>
  <div class="main-content">
    <el-tabs v-model="activeTab" class="hr-cost-tabs">
      <el-tab-pane label="汇总" name="detail">
        <template v-if="activeTab === 'detail'">
          <SearchBar :initial-params="detailQuery" @search="(params) => handleSearch('detail', params)" @reset="(params) => handleSearch('detail', params)" />
          <TableList
            ref="detailTable"
            :api="getPageList"
            :columns="columns"
            :operation-column="operationColumn"
            :toolbar-buttons="headerButs"
            :params="detailQuery"
            row-key="id"
          />
        </template>
      </el-tab-pane>
      <el-tab-pane label="按架构" name="org">
        <template v-if="activeTab === 'org'">
          <SearchBar :initial-params="orgQuery" @search="(params) => handleSearch('org', params)" @reset="(params) => handleSearch('org', params)" />
          <TableList
            ref="orgTable"
            :api="getOrgSummary"
            :columns="orgSummaryColumns"
            :toolbar-buttons="orgHeaderButs"
            :params="orgQuery"
            :page-size="50"
            row-key="name"
          />
        </template>
      </el-tab-pane>
      <el-tab-pane label="按城市" name="city">
        <template v-if="activeTab === 'city'">
          <SearchBar :initial-params="cityQuery" @search="(params) => handleSearch('city', params)" @reset="(params) => handleSearch('city', params)" />
          <TableList
            ref="cityTable"
            :api="getCitySummary"
            :columns="citySummaryColumns"
            :toolbar-buttons="cityHeaderButs"
            :params="cityQuery"
            :page-size="50"
            row-key="name"
          />
        </template>
      </el-tab-pane>
    </el-tabs>

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
import {
  getPageList, getDetail, del, exportXls,
  getOrgSummary, getCitySummary, exportOrgSummary, exportCitySummary
} from '@/api/hr/cost/index.js'
import {
  columns, orgSummaryColumns, citySummaryColumns,
  getHeaderButs, getSummaryButs, getOperationColumn
} from './config/columns'
import AddDialog from './components/add.vue'
import ImportDialog from './components/importDialog.vue'
import { blobValidate } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()
const userStore = useUserStore()
const permissions = computed(() => userStore.permissions || [])

const activeTab = ref('detail')
const detailTable = ref(null)
const orgTable = ref(null)
const cityTable = ref(null)
const addDialogRef = ref(null)
const importDialogRef = ref(null)

const searchInitialParams = {
  statMonth: dayjs().format('YYYY-MM'),
  includeChildren: true
}
const detailQuery = ref({ ...searchInitialParams })
const orgQuery = ref({ ...searchInitialParams })
const cityQuery = ref({ ...searchInitialParams })

const headerButs = computed(() => getHeaderButs(handleAdd, handleImport, handleExportDetail, permissions.value))
const orgHeaderButs = computed(() => getSummaryButs(handleExportOrg, permissions.value))
const cityHeaderButs = computed(() => getSummaryButs(handleExportCity, permissions.value))
const operationColumn = computed(() => getOperationColumn(handleEdit, handleView, handleDelete, permissions.value))

function handleSearch(tab, params) {
  const target = { ...params }
  if (tab === 'org') {
    orgQuery.value = target
  } else if (tab === 'city') {
    cityQuery.value = target
  } else {
    detailQuery.value = target
  }
}

function handleSuccess() {
  detailTable.value?.refresh()
  orgTable.value?.refresh()
  cityTable.value?.refresh()
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
  proxy.$modal.confirm(`确认删除 ${row.employeeName || ''} ${row.statMonth || ''} 的人力成本记录吗？`).then(async () => {
    await del(row.id)
    proxy.$modal.msgSuccess('删除成功')
    handleSuccess()
  }).catch(() => {})
}

function handleImport() {
  importDialogRef.value?.open()
}

async function download(res, filename) {
  if (!(await blobValidate(res))) {
    proxy.$modal.msgError('导出失败')
    return
  }
  saveAs(new Blob([res]), filename)
}

async function handleExportDetail() {
  try {
    const month = detailQuery.value.statMonth || dayjs().format('YYYY-MM')
    await download(await exportXls({ ...detailQuery.value }), `人力总成本_${month}.xlsx`)
  } catch (error) {
    console.error(error)
    proxy.$modal.msgError('导出失败')
  }
}

async function handleExportOrg() {
  try {
    const month = orgQuery.value.statMonth || dayjs().format('YYYY-MM')
    await download(await exportOrgSummary({ ...orgQuery.value }), `人力总成本_按架构_${month}.xlsx`)
  } catch (error) {
    console.error(error)
    proxy.$modal.msgError('导出失败')
  }
}

async function handleExportCity() {
  try {
    const month = cityQuery.value.statMonth || dayjs().format('YYYY-MM')
    await download(await exportCitySummary({ ...cityQuery.value }), `人力总成本_按城市_${month}.xlsx`)
  } catch (error) {
    console.error(error)
    proxy.$modal.msgError('导出失败')
  }
}
</script>

<style scoped>
.hr-cost-tabs :deep(.el-tabs__content) { overflow: visible; }
.hr-cost-tabs :deep(.el-tabs__nav) { padding-left: 16px; }
</style>
