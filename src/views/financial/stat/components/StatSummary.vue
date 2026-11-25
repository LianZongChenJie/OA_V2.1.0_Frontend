<template>
  <el-row :gutter="12" class="stat-summary">
    <el-col v-for="field in fields" :key="field.fieldName" :span="colSpan">
      <el-card shadow="never" class="stat-card">
        <div class="stat-label">{{ field.label }}</div>
        <div class="stat-value">{{ formatValue(field, data?.[field.fieldName]) }}</div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  fields: { type: Array, default: () => [] },
  data: { type: Object, default: () => ({}) }
})

const colSpan = computed(() => {
  if (!props.fields.length) return 24
  return Math.max(6, Math.floor(24 / props.fields.length))
})

function formatValue(field, value) {
  const numberValue = Number(value || 0)
  if (field.type === 'count') return numberValue.toLocaleString('zh-CN')
  if (field.type === 'money') {
    return numberValue.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }
  return value ?? '-'
}
</script>

<style scoped>
.stat-summary {
  margin-bottom: 12px;
}

.stat-card {
  border-radius: 4px;
}

.stat-label {
  color: #606266;
  font-size: 13px;
}

.stat-value {
  margin-top: 6px;
  color: #303133;
  font-size: 22px;
  font-weight: 600;
}
</style>
