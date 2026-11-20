<template>
  <div class="search-bar">
    <el-form :model="searchParams" :inline="true" label-position="top" @submit.prevent>
      <div class="search-box">
        <div class="search-conditions-wrapper">
          <div class="search-conditions" :class="{ collapsed: !showMore }">
            <el-form-item label="年度" class="search-items">
              <el-date-picker
                v-model="searchParams.statMonth"
                type="month"
                value-format="YYYY-MM"
                placeholder="请选择年度"
                clearable
              />
            </el-form-item>
            <el-form-item label="客户名称" class="search-items">
              <el-input
                v-model="searchParams.customerName"
                placeholder="请输入客户名称"
                clearable
                @keydown.enter.stop="handleSearch"
              />
            </el-form-item>
            <el-form-item label="项目名称" class="search-items">
              <el-input
                v-model="searchParams.projectName"
                placeholder="请输入项目名称"
                clearable
                @keydown.enter.stop="handleSearch"
              />
            </el-form-item>
            <el-form-item label="合同是否签订" class="search-items">
              <el-select v-model="searchParams.contractSigned" placeholder="请选择合同是否签订" clearable>
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否结项" class="search-items">
              <el-select v-model="searchParams.projectClosed" placeholder="请选择是否结项" clearable>
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="search-more">
          <el-button link class="expand-btn" @click="toggleExpand">
            <el-icon :class="{ rotate: showMore }"><ArrowDown /></el-icon>
          </el-button>
        </div>
        <div class="search-actions">
          <el-form-item>
            <div class="action-buttons">
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button type="danger" @click="handleReset">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  initialParams: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['search', 'reset'])

const searchParams = ref({ ...props.initialParams })
const showMore = ref(false)

function handleSearch() {
  emit('search', { ...searchParams.value })
}

function handleReset() {
  searchParams.value = { ...props.initialParams }
  emit('reset', { ...searchParams.value })
}

function toggleExpand() {
  showMore.value = !showMore.value
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
}

.search-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  justify-content: space-between;
}

.search-conditions-wrapper {
  flex: 1;
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-conditions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.search-conditions.collapsed {
  max-height: 75px;
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

.search-more {
  display: flex;
  align-items: center;
  width: 20px;
}

.search-actions {
  display: flex;
  width: 60px;
}

.search-bar :deep(.el-form-item) {
  margin-bottom: 8px;
  width: 100%;
}

.search-bar :deep(.el-form-item__label) {
  padding-bottom: 4px;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-actions :deep(.el-button) {
  width: 100%;
  margin-left: 0;
}

.expand-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--el-color-primary);
  font-size: 14px;
}

.expand-btn .el-icon {
  transition: transform 0.3s ease;
}

.expand-btn .el-icon.rotate {
  transform: rotate(180deg);
}

.search-bar :deep(.el-input),
.search-bar :deep(.el-select),
.search-bar :deep(.el-date-editor),
.search-bar :deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100% !important;
}
</style>
