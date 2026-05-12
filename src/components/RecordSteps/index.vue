<template>
  <div class="form-section-title">审批记录</div>
  <el-steps direction="vertical" :active="records.length" class="record-steps" style="margin-bottom: 20px">
    <el-step
      v-for="(record, index) in records"
      :key="index"
    >
      <template #title>
        <span class="step-title">{{ record.typeName }}</span>
        <span class="step-time">{{ record.checkTime }}</span>
      </template>
      <template #description>
        <div class="step-content">
          <div class="step-amount" v-if="record.cost">
            <span class="label">金额:</span>
            <span class="value">¥ {{ record.cost }}</span>
          </div>
          <div class="step-remark" v-if="record.content">
            <span class="label">备注:</span>
            <span class="value">{{ record.content }}</span>
          </div>
        </div>
      </template>
    </el-step>
  </el-steps>
</template>

<script setup name="RecordSteps">
defineProps({
  records: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.form-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0 15px 0;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}
.record-steps {
  padding: 10px 0;
}
.record-steps .step-title {
  font-weight: 600;
  color: #303133;
}
.record-steps .step-time {
  margin-left: 12px;
  font-size: 12px;
  color: #909399;
}
.record-steps .step-content {
  background: #f5f7fa;
  padding: 12px 15px;
  border-radius: 6px;
  margin-top: 8px;
}
.record-steps .step-amount {
  margin-bottom: 8px;
}
.record-steps .step-amount .label,
.record-steps .step-remark .label {
  color: #909399;
  margin-right: 8px;
}
.record-steps .step-amount .value {
  color: #67c23a;
  font-weight: 600;
  font-size: 15px;
}
.record-steps .step-remark .value {
  color: #606266;
}
</style>
