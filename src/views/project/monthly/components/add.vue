<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="760px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="130px" :disabled="isView">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="年度" prop="statMonth">
            <el-date-picker
              v-model="form.statMonth"
              type="month"
              value-format="YYYY-MM"
              placeholder="请选择年度/月份"
              style="width: 100%"
              :clearable="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="form.customerName" placeholder="请输入客户名称" maxlength="255" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="form.projectName" placeholder="请输入项目名称" maxlength="255" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同是否签订" prop="contractSigned">
            <el-select v-model="form.contractSigned" placeholder="请选择" style="width: 100%">
              <el-option label="否" :value="0" />
              <el-option label="是" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预计投入成本" prop="plannedCost">
            <el-input-number v-model="form.plannedCost" :precision="2" :controls="false" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际投入成本" prop="actualCost">
            <el-input-number v-model="form.actualCost" :precision="2" :controls="false" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预计项目利润" prop="plannedProfit">
            <el-input-number v-model="form.plannedProfit" :precision="2" :controls="false" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际项目利润" prop="actualProfit">
            <el-input-number v-model="form.actualProfit" :precision="2" :controls="false" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际开票金额" prop="invoicedAmount">
            <el-input-number v-model="form.invoicedAmount" :precision="2" :controls="false" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际收款金额" prop="receivedAmount">
            <el-input-number v-model="form.receivedAmount" :precision="2" :controls="false" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="合同收款约定" prop="collectionAgreement">
            <el-input
              v-model="form.collectionAgreement"
              type="textarea"
              :rows="2"
              maxlength="500"
              placeholder="请输入合同收款约定"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否结项" prop="projectClosed">
            <el-select v-model="form.projectClosed" placeholder="请选择" style="width: 100%">
              <el-option label="否" :value="0" />
              <el-option label="是" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-input :model-value="form.createTimeStr || '-'" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更新时间">
            <el-input :model-value="form.updateTimeStr || '-'" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" :rows="2" maxlength="1000" placeholder="请输入备注" />
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
import { add, edit } from '@/api/project/monthly/index.js'

const { proxy } = getCurrentInstance()
const emit = defineEmits(['success'])

const visible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const title = ref('新增月度项目台账')
const formRef = ref(null)

const defaultForm = () => ({
  id: undefined,
  statMonth: dayjs().subtract(1, 'month').format('YYYY-MM'),
  customerName: '',
  projectName: '',
  contractSigned: 0,
  plannedCost: 0,
  actualCost: 0,
  plannedProfit: 0,
  actualProfit: 0,
  collectionAgreement: '',
  invoicedAmount: 0,
  receivedAmount: 0,
  projectClosed: 0,
  remark: '',
  createTimeStr: '',
  updateTimeStr: ''
})

const form = reactive(defaultForm())

const rules = {
  statMonth: [{ required: true, message: '请选择年度/月份', trigger: 'change' }],
  customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
}

function reset() {
  Object.assign(form, defaultForm())
  formRef.value?.clearValidate()
}

function open() {
  reset()
  isEdit.value = false
  isView.value = false
  title.value = '新增月度项目台账'
  visible.value = true
}

function openEdit(row) {
  reset()
  isEdit.value = true
  isView.value = false
  title.value = '编辑月度项目台账'
  Object.assign(form, row)
  visible.value = true
}

function openView(row) {
  reset()
  isEdit.value = false
  isView.value = true
  title.value = '查看月度项目台账'
  Object.assign(form, row)
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
