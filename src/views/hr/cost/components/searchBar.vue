<template>
  <div class="search-bar">
    <el-form :model="searchParams" :inline="true" label-position="top" @submit.prevent>
      <div class="search-box">
        <div class="search-conditions-wrapper">
          <div class="search-conditions" :class="{ collapsed: !showMore }">
            <el-form-item label="月份" class="search-items">
              <el-date-picker
                v-model="searchParams.statMonth"
                type="month"
                value-format="YYYY-MM"
                placeholder="请选择月份"
                clearable
              />
            </el-form-item>
            <el-form-item label="组织架构" class="search-items org-item">
              <div class="org-filter">
                <el-tree-select
                  v-model="searchParams.orgId"
                  :data="deptTree"
                  :props="treeProps"
                  node-key="id"
                  check-strictly
                  placeholder="请选择组织架构"
                  clearable
                />
                <el-checkbox v-model="searchParams.includeChildren" class="include-checkbox">包含子部门</el-checkbox>
              </div>
            </el-form-item>
            <el-form-item label="城市" class="search-items">
              <el-cascader
                v-model="searchParams.cityId"
                :options="areaTree"
                :props="cascaderProps"
                placeholder="请选择城市"
                clearable
                :show-all-levels="false"
              />
            </el-form-item>
            <el-form-item label="员工状态" class="search-items">
              <el-select v-model="searchParams.employeeStatus" placeholder="请选择" clearable>
                <el-option label="在职" value="在职" />
                <el-option label="离职" value="离职" />
              </el-select>
            </el-form-item>
            <el-form-item label="姓名" class="search-items">
              <el-input v-model="searchParams.employeeName" placeholder="请输入姓名" clearable @keydown.enter.stop="handleSearch" />
            </el-form-item>
            <el-form-item label="关键字" class="search-items">
              <el-input v-model="searchParams.keywords" placeholder="姓名/身份证/项目" clearable @keydown.enter.stop="handleSearch" />
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
import { onMounted, ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { getFilterOptions } from '@/api/hr/cost/index.js'

const props = defineProps({
  initialParams: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['search', 'reset'])

const searchParams = ref({ includeChildren: true, ...props.initialParams })
const showMore = ref(false)
const deptTree = ref([])
const areaTree = ref([])
const treeProps = { value: 'id', label: 'label', children: 'children' }
const cascaderProps = { value: 'id', label: 'label', children: 'children', emitPath: false, checkStrictly: false }

let filterOptionsPromise = null
function loadFilterOptions() {
  if (!filterOptionsPromise) {
    filterOptionsPromise = getFilterOptions()
  }
  return filterOptionsPromise
}

onMounted(async () => {
  try {
    const res = await loadFilterOptions()
    const data = res.data || res || {}
    deptTree.value = data.deptTree || []
    areaTree.value = data.areaTree || []
  } catch (error) {
    filterOptionsPromise = null
    console.error(error)
  }
})

function handleSearch() {
  emit('search', { ...searchParams.value })
}

function handleReset() {
  searchParams.value = { includeChildren: true, ...props.initialParams }
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

.org-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.org-filter :deep(.el-select) {
  flex: 1;
  min-width: 0;
}

.include-checkbox {
  width: 88px;
  flex-shrink: 0;
  white-space: nowrap;
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

.expand-btn .el-icon.rotate {
  transform: rotate(180deg);
}

.search-bar :deep(.el-input),
.search-bar :deep(.el-select),
.search-bar :deep(.el-date-editor),
.search-bar :deep(.el-cascader) {
  width: 100% !important;
}
</style>
