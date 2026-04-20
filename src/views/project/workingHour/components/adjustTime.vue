<template>
  <el-dialog title="调整工时" v-model="dialogVisible" width="480px" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="工作时间范围">
        <div style="display:flex;gap:8px;align-items:center">
          <el-date-picker v-model="form.workDate" type="date" value-format="YYYY-MM-DD" />
          <el-time-picker v-model="form.startTime" value-format="HH:mm" />
          <span>至</span>
          <el-time-picker v-model="form.endTime" value-format="HH:mm" />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="close">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { updateChange } from '@/api/project/workingHour/index.js'

const dialogVisible = ref(false)
const formRef = ref(null)

const form = reactive({
  id: null,
  workDate: '',
  startTime: '',
  endTime: '',
  hours: ''
})

const rules = {
  workDate: [{ required: true }],
  startTime: [{ required: true }],
  endTime: [{ required: true }]
}

const emit = defineEmits(['success'])

function open(row) {
  form.id = row.id
  form.workDate = row.workDate
  form.startTime = row.startTime
  form.endTime = row.endTime
  dialogVisible.value = true
}

function close() {
  dialogVisible.value = false
}

async function submit() {
  await formRef.value.validate()
  const st = form.startTime.split(':')
  const et = form.endTime.split(':')
  const h = ((et[0]-st[0])*60 + (et[1]-st[1]))/60
  form.hours = h.toFixed(2)
  await updateChange(form)
  close()
  emit('success')
}

defineExpose({ open })
</script>