<template>
  <div class="main-content">
    <div class="main">
      <StatSummary :fields="config.summaryFields" :data="summary" />

      <TableList
        ref="tableRef"
        class="stat-table"
        :api="api.page"
        :columns="config.columns"
        :operation-column="operationColumn"
        :toolbar-buttons="headerButtons"
        row-key="id"
        @search="handleSearch"
        @reset="handleReset"
      >
        <template v-for="field in dictFields" #[field]="{ row }">
          <dict-tag
            :options="tableDictOptions[field]"
            :value="Number(row[field])"
          />
        </template>
        <template #planTime="{ row }">
          <span>{{ planTimeText(row) }}</span>
        </template>
      </TableList>

      <DetailDialog
        v-model:visible="detailVisible"
        :title="`${config.title}详情`"
        :fields="config.detailFields"
        :data="detailData"
        :dict-options="detailDictOptions"
        :show-approval="props.moduleKey === 'loan'"
        :show-offset="props.moduleKey === 'loan'"
        @export="handleApprovalExport"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import TableList from '@/components/tableList/index.vue'
import auth from '@/plugins/auth.js'
import useUserStore from '@/store/modules/user'
import { blobValidate } from '@/utils/ruoyi'
import * as statApi from '@/api/financial/stat'
import statConfig from '../config'
import StatSummary from './StatSummary.vue'
import DetailDialog from './DetailDialog.vue'
import { printLoanApprovalSheet } from '../utils/approvalPrint'

const props = defineProps({
  moduleKey: { type: String, required: true }
})

const apiMap = {
  loan: {
    page: statApi.getLoanRecordPage,
    summary: statApi.getLoanRecordSummary,
    detail: statApi.getLoanRecordDetail,
    export: statApi.exportLoanRecord,
    pay: statApi.markLoanPaid,
    back: statApi.markLoanReturned
  },
  expense: {
    page: statApi.getExpenseRecordPage,
    summary: statApi.getExpenseRecordSummary,
    detail: statApi.getExpenseRecordDetail,
    export: statApi.exportExpenseRecord
  },
  invoice: {
    page: statApi.getInvoiceRecordPage,
    summary: statApi.getInvoiceRecordSummary,
    detail: statApi.getInvoiceRecordDetail,
    export: statApi.exportInvoiceRecord
  },
  ticket: {
    page: statApi.getTicketRecordPage,
    summary: statApi.getTicketRecordSummary,
    detail: statApi.getTicketRecordDetail,
    export: statApi.exportTicketRecord
  },
  income: {
    page: statApi.getIncomeRecordPage,
    summary: statApi.getIncomeRecordSummary,
    detail: statApi.getIncomeRecordDetail,
    export: statApi.exportIncomeRecord
  },
  payment: {
    page: statApi.getPaymentRecordPage,
    summary: statApi.getPaymentRecordSummary,
    detail: statApi.getPaymentRecordDetail,
    export: statApi.exportPaymentRecord
  }
}

const { proxy } = getCurrentInstance()
const userStore = useUserStore()
const tableRef = ref(null)
const summary = ref({})
const query = ref({})
const detailVisible = ref(false)
const detailData = ref(null)

const config = computed(() => statConfig[props.moduleKey])
const api = computed(() => apiMap[props.moduleKey])
const permsPrefix = computed(() => `finance:stat:${props.moduleKey}`)
const dictFields = computed(() => Object.keys(config.value.dictMap || {}))
const dictKeys = computed(() => [...new Set(Object.values(config.value.dictMap || {}))])

const dictRefs = dictKeys.value.length ? proxy.useDict(...dictKeys.value) : {}

const detailDictOptions = computed(() => Object.fromEntries(
  dictKeys.value.map((key) => [key, dictRefs[key]?.value || []])
))

const tableDictOptions = computed(() => Object.fromEntries(
  Object.entries(config.value.dictMap || {}).map(([field, key]) => [
    field,
    dictRefs[key]?.value || []
  ])
))

const headerButtons = computed(() => {
  if (!auth.hasPermi(`${permsPrefix.value}:export`)) return []
  return [
    {
      label: '导出',
      type: 'warning',
      icon: 'download',
      onClick: handleExport
    }
  ]
})

const operationColumn = computed(() => {
  const actions = [
    {
      label: '详情',
      type: 'primary',
      icon: 'eye-open',
      isShow: () => auth.hasPermi(`${permsPrefix.value}:query`),
      onClick: handleView
    }
  ]

  if (props.moduleKey === 'loan') {
    actions.push(
      {
        label: '已打款',
        type: 'warning',
        icon: 'money',
        isShow: (row) =>
          auth.hasPermi('finance:stat:loan:pay') &&
          Number(row.checkStatus) === 2 &&
          Number(row.payStatus) === 0,
        onClick: handlePay
      },
      {
        label: '已归还',
        type: 'success',
        icon: 'pass',
        isShow: (row) =>
          auth.hasPermi('finance:stat:loan:back') &&
          Number(row.checkStatus) === 2 &&
          Number(row.payStatus) === 1 &&
          Number(row.backStatus) === 0 &&
          Number(row.balanceStatus) !== 2,
        onClick: handleBack
      }
    )
  }

  return {
    label: '操作',
    width: props.moduleKey === 'loan' ? 180 : 80,
    fixed: 'right',
    show: true,
    actions
  }
})

function formatDate(value) {
  return value?.split(' ')[0] || ''
}

function returnStatusText(row) {
  if (Number(row.payStatus || 0) === 0) return ''
  if (Number(row.balanceStatus) === 2) return '无需归还'
  return Number(row.backStatus) === 1 ? '已归还' : '待归还'
}

function planTimeText(row) {
  const dateText = formatDate(row.planTime) || '-'
  const statusText = returnStatusText(row)
  return statusText ? `${dateText}（${statusText}）` : dateText
}

async function loadSummary() {
  try {
    const res = await api.value.summary(query.value)
    summary.value = res?.data || res || {}
  } catch (error) {
    console.error(error)
    summary.value = {}
  }
}

function handleSearch(params) {
  query.value = params || {}
  loadSummary()
}

function handleReset() {
  query.value = {}
  loadSummary()
}

async function handleView(row) {
  try {
    const res = await api.value.detail(row.id)
    detailData.value = res?.data || res || row
    detailVisible.value = true
  } catch (error) {
    console.error(error)
    proxy.$modal.msgError('获取详情失败')
  }
}

async function handleExport() {
  try {
    const res = await api.value.export(query.value)
    if (!(await blobValidate(res))) {
      proxy.$modal.msgError('导出失败')
      return
    }
    const filename = `${config.value.title}_${dayjs().format('YYYYMMDD')}.xlsx`
    saveAs(new Blob([res]), filename)
  } catch (error) {
    console.error(error)
    proxy.$modal.msgError('导出失败')
  }
}

function handleApprovalExport() {
  const success = printLoanApprovalSheet(detailData.value, userStore.nickName)
  if (!success) proxy.$modal.msgError('请允许浏览器弹出窗口后再打印')
}

function handlePay(row) {
  proxy.$modal.confirm('确认该借支已打款？').then(async () => {
    await api.value.pay(row.id, userStore.nickName)
    proxy.$modal.msgSuccess('操作成功')
    refresh()
  }).catch(() => {})
}

function handleBack(row) {
  proxy.$modal.confirm('确认该借支已归还？').then(async () => {
    await api.value.back(row.id)
    proxy.$modal.msgSuccess('操作成功')
    refresh()
  }).catch(() => {})
}

function refresh() {
  tableRef.value?.refresh()
  loadSummary()
}

onMounted(loadSummary)
</script>

<style scoped>
.main {
  height: 100%;
  padding: 16px;
  background-color: #fff;
}

.stat-table :deep(.search-bar) {
  padding-left: 0;
  padding-right: 0;
  margin-bottom: 12px;
}

.stat-table :deep(.table-header) {
  padding-left: 0;
  padding-right: 0;
}
</style>
