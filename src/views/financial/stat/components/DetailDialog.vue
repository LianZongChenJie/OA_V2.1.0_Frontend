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
          :value="data[field.fieldName] === null || data[field.fieldName] === undefined ? undefined : Number(data[field.fieldName])"
        />
        <span v-else>{{ formatValue(field, data[field.fieldName]) }}</span>
      </el-descriptions-item>
    </el-descriptions>
    <el-empty v-else description="暂无详情数据" />

    <template #footer>
      <el-button @click="handleVisibleChange(false)">关 闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '详情' },
  fields: { type: Array, default: () => [] },
  data: { type: Object, default: null },
  dictOptions: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:visible'])

function handleVisibleChange(value) {
  emit('update:visible', value)
}

function formatValue(field, value) {
  if (value === null || value === undefined || value === '') return '-'
  return typeof field.format === 'function' ? field.format(value) : value
}
</script>
