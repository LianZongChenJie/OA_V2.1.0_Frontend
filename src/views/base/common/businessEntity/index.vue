<template>
  <div style="padding: 20px; position: relative;">
    <h3>多选下拉框测试</h3>
    <el-select
      ref="selectRef"
      v-model="value"
      multiple
      placeholder="Choose tags for your article"
      :teleported="false"
      style="width: 240px; margin-top: 20px;"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <p style="margin-top: 20px;">已选择: {{ value }}</p>
  </div>
</template>
<script setup>
import { ref } from "vue";

const value = ref([]);

const options = [
  {
    value: "HTML",
    label: "HTML",
  },
  {
    value: "CSS",
    label: "CSS",
  },
  {
    value: "JavaScript",
    label: "JavaScript",
  },
];
</script>
<style scoped>
/* 使用 :teleported="false" 时，下拉框在当前组件内 */
:deep(.el-select-dropdown) {
  z-index: 9999 !important;
}
</style>
