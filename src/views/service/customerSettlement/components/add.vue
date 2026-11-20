<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="900px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px" :disabled="isView">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="年度" prop="statYear">
            <el-date-picker
              v-model="form.statYear"
              type="year"
              value-format="YYYY"
              placeholder="请选择年度"
              style="width: 100%"
              :clearable="false"
              :disabled="isEdit || isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="月份" prop="statMonth">
            <el-select
              v-model="form.statMonth"
              placeholder="请选择月份"
              style="width: 100%"
              :disabled="isEdit || isView"
            >
              <el-option v-for="month in 12" :key="month" :label="`${month}月`" :value="month" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerName">
            <el-input
              v-model="form.customerName"
              placeholder="请输入客户名称"
              maxlength="255"
              :disabled="isEdit || isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="employeeName">
            <el-input
              v-model="form.employeeName"
              placeholder="请输入姓名"
              maxlength="255"
              :disabled="isEdit || isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职位" prop="positionName">
            <el-input
              v-model="form.positionName"
              placeholder="请输入职位"
              maxlength="100"
              :disabled="isEdit || isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="级别" prop="levelName">
            <el-input
              v-model="form.levelName"
              placeholder="请输入级别"
              maxlength="100"
              :disabled="isEdit || isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单价（元）" prop="unitPrice">
            <el-input-number v-model="form.unitPrice" :precision="2" :min="0" :controls="false" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际出勤（天）" prop="actualAttendanceDays">
            <el-input-number
              v-model="form.actualAttendanceDays"
              :precision="2"
              :min="0"
              :controls="false"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请假（天）" prop="leaveDays">
            <el-input-number v-model="form.leaveDays" :precision="2" :min="0" :controls="false" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="加班（天）" prop="overtimeDays">
            <el-input-number v-model="form.overtimeDays" :precision="2" :min="0" :controls="false" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调休（天）" prop="compOffDays">
            <el-input-number v-model="form.compOffDays" :precision="2" :min="0" :controls="false" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否结算" prop="isSettled">
            <el-select v-model="form.isSettled" placeholder="请选择" style="width: 100%">
              <el-option label="否" :value="0" />
              <el-option label="是" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际应结算费用（元）" prop="payableAmount">
            <el-input-number
              v-model="form.payableAmount"
              :precision="2"
              :min="0"
              :controls="false"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际结算费用" prop="settledAmount">
            <el-input-number
              v-model="form.settledAmount"
              :precision="2"
              :min="0"
              :controls="false"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" :rows="3" maxlength="1000" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button v-if="!isView" type="primary" :loading="submitting" @click="handleSubmit">确 定</el-button>
      <el-button @click="visible = false">{{ isView ? '关 闭' : '取 消' }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import { add, edit } from '@/api/service/customerSettlement/index.js'

const { proxy } = getCurrentInstance()
const emit = defineEmits(['success'])

const visible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const title = ref('新增服务客户结算')
const formRef = ref(null)

const defaultForm = () => ({
  id: undefined,
  statYear: dayjs().format('YYYY'),
  statMonth: dayjs().month() + 1,
  customerName: '',
  employeeName: '',
  positionName: '',
  levelName: '',
  unitPrice: 0,
  actualAttendanceDays: 0,
  leaveDays: 0,
  overtimeDays: 0,
  compOffDays: 0,
  payableAmount: 0,
  settledAmount: 0,
  isSettled: 0,
  remark: ''
})

const form = reactive(defaultForm())

const rules = {
  statYear: [{ required: true, message: '请选择年度', trigger: 'change' }],
  statMonth: [{ required: true, message: '请选择月份', trigger: 'change' }],
  customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  employeeName: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
}

function reset() {
  Object.assign(form, defaultForm())
  formRef.value?.clearValidate()
}

function normalizeDetail(row = {}) {
  const data = { ...row }
  if (data.statYear !== undefined && data.statYear !== null && data.statYear !== '') {
    data.statYear = String(data.statYear).slice(0, 4)
  }
  const numberFields = [
    'statMonth',
    'unitPrice',
    'actualAttendanceDays',
    'leaveDays',
    'overtimeDays',
    'compOffDays',
    'payableAmount',
    'settledAmount',
    'isSettled'
  ]
  numberFields.forEach((key) => {
    if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
      const value = Number(data[key])
      if (!Number.isNaN(value)) {
        data[key] = value
      }
    }
  })
  return data
}

function open() {
  reset()
  isEdit.value = false
  isView.value = false
  title.value = '新增服务客户结算'
  visible.value = true
}

function openEdit(row) {
  reset()
  isEdit.value = true
  isView.value = false
  title.value = '编辑服务客户结算'
  Object.assign(form, normalizeDetail(row))
  visible.value = true
}

function openView(row) {
  reset()
  isEdit.value = false
  isView.value = true
  title.value = '查看服务客户结算'
  Object.assign(form, normalizeDetail(row))
  visible.value = true
}

async function handleSubmit() {
  await formRef.value.validate()
  submitting.value = true
  try {
    const payload = { ...form }
    delete payload.createTimeStr
    delete payload.updateTimeStr
    delete payload.seq
    if (!isEdit.value) {
      delete payload.id
    }
    if (isEdit.value) {
      await edit(payload)
      proxy.$modal.msgSuccess('修改成功')
    } else {
      await add(payload)
      proxy.$modal.msgSuccess('新增成功')
    }
    visible.value = false
    emit('success')
  } finally {
    submitting.value = false
  }
}

defineExpose({ open, openEdit, openView })
</script>
