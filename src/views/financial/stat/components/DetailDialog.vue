<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="60%"
    append-to-body
    @update:model-value="handleVisibleChange"
  >
    <el-descriptions v-if="data" :column="2" border size="small">
      <el-descriptions-item
        v-for="field in fields"
        :key="field.fieldName"
        :label="field.label"
        :span="field.span || 1"
      >
        <dict-tag
          v-if="field.dictKey"
          :options="dictOptions[field.dictKey] || []"
          :value="dictValue(field, data)"
        />
        <span v-else>{{ formatValue(field, field.getValue ? field.getValue(data) : data[field.fieldName], data) }}</span>
      </el-descriptions-item>
    </el-descriptions>
    <el-empty v-else description="暂无详情数据" />

    <div v-if="showOffset && data" class="offset-section">
      <div class="approval-title">冲抵记录</div>
      <el-table :data="offsetRecords" border size="small" empty-text="暂无冲抵记录">
        <el-table-column prop="cost" label="报销总金额(元)" min-width="130" align="right" />
        <el-table-column prop="balanceCost" label="冲抵金额(元)" min-width="120" align="right" />
        <el-table-column prop="payAmount" label="需打款金额(元)" min-width="130" align="right" />
        <el-table-column prop="code" label="报销凭证编号" min-width="170" align="center" />
        <el-table-column prop="expenseTime" label="原始单据日期" min-width="130" align="center" />
        <el-table-column prop="incomeMonth" label="入账月份" min-width="110" align="center" />
        <el-table-column label="操作" width="80" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="openOffsetDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="showApproval && data" class="approval-section">
      <div class="approval-title">审批操作</div>
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item label="审批状态">
          <dict-tag
            :options="dictOptions.check_status || []"
            :value="data.checkStatus === null || data.checkStatus === undefined ? undefined : Number(data.checkStatus)"
          />
        </el-descriptions-item>
        <el-descriptions-item label="当前审批人">
          {{ approval.currentApprover || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="抄送人" :span="2">
          {{ approval.copyUser || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="审批流" :span="2">
          <div class="flow-chain">
            <template v-for="(node, index) in approval.flowNodes" :key="index">
              <span class="flow-node">
                <span class="flow-dot">{{ node.action === '创建' ? '+' : '✓' }}</span>
                {{ node.userName }} {{ node.action }}
              </span>
              <span v-if="index < approval.flowNodes.length - 1" class="flow-arrow">></span>
            </template>
            <span v-if="!approval.flowNodes.length">-</span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="审批记录" :span="2">
          <div class="approval-records">
            <div v-for="(record, index) in approval.records" :key="index" class="approval-record">
              <span class="record-dot" />
              <span>{{ record.time }} {{ record.userName }}「{{ record.action }}」了此申请。</span>
              <span v-if="record.opinion">审批意见：{{ record.opinion }}</span>
            </div>
            <div v-if="!approval.records.length">-</div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <el-dialog
      v-model="offsetDetailVisible"
      title="报销详情"
      width="50%"
      append-to-body
    >
      <el-descriptions v-if="currentOffsetRecord" :column="2" border size="small">
        <el-descriptions-item label="报销总金额(元)">{{ currentOffsetRecord.cost }}</el-descriptions-item>
        <el-descriptions-item label="冲抵金额(元)">{{ currentOffsetRecord.balanceCost }}</el-descriptions-item>
        <el-descriptions-item label="需打款金额(元)">{{ currentOffsetRecord.payAmount }}</el-descriptions-item>
        <el-descriptions-item label="报销凭证编号">{{ currentOffsetRecord.code }}</el-descriptions-item>
        <el-descriptions-item label="原始单据日期">{{ currentOffsetRecord.expenseTime }}</el-descriptions-item>
        <el-descriptions-item label="入账月份">{{ currentOffsetRecord.incomeMonth }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="offsetDetailVisible = false">关 闭</el-button>
      </template>
    </el-dialog>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="showApproval" type="success" @click="emit('export')">
          审批单导出打印
        </el-button>
        <el-button @click="handleVisibleChange(false)">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '详情' },
  fields: { type: Array, default: () => [] },
  data: { type: Object, default: null },
  dictOptions: { type: Object, default: () => ({}) },
  showApproval: { type: Boolean, default: false },
  showOffset: { type: Boolean, default: false }
})

const emit = defineEmits(['update:visible', 'export'])

const approval = computed(() => ({
  currentApprover: '-',
  copyUser: '-',
  flowNodes: [],
  records: [],
  ...(props.data?.approval || {})
}))

const offsetRecords = computed(() => props.data?.offsetRecords || [])
const offsetDetailVisible = ref(false)
const currentOffsetRecord = ref(null)

function openOffsetDetail(row) {
  currentOffsetRecord.value = row
  offsetDetailVisible.value = true
}

function handleVisibleChange(value) {
  emit('update:visible', value)
}

function dictValue(field, data) {
  const value = field.getValue ? field.getValue(data) : data[field.fieldName]
  return value === null || value === undefined || value === '' ? undefined : Number(value)
}

function formatValue(field, value, data) {
  if (value === null || value === undefined || value === '') return '-'
  return typeof field.format === 'function' ? field.format(value, data) : value
}
</script>

<style scoped>
.approval-section,
.offset-section {
  margin-top: 18px;
}

.approval-title {
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #409eff;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.flow-chain {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  line-height: 2;
}

.flow-node {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.flow-dot {
  display: inline-flex;
  width: 16px;
  height: 16px;
  border: 1px solid #67c23a;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  color: #67c23a;
  font-size: 12px;
}

.flow-arrow {
  color: #909399;
}

.approval-records {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.approval-record {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #606266;
}

.record-dot {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  margin-top: 7px;
  border: 1px solid #409eff;
  border-radius: 50%;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
</style>
