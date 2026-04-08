<template>
  <div class="search-bar">
    <el-form :model="searchParams" :inline="true" label-position="top">
      <div class="search-box">
        <div class="search-conditions-wrapper">
          <div class="search-conditions" :class="{ collapsed: !showMore }">
            <el-form-item
              v-for="column in searchableColumns"
              :key="column.fieldName"
              :label="column.label || column.fieldName"
              :label-width="column.labelWidth || 'auto'"
              class="search-items"
            >
              <el-input
                v-if="column.type === 'input' || !column.type"
                v-model="searchParams[column.fieldName]"
                :placeholder="
                  column.placeholder ||
                  `请输入${column.label || column.fieldName}`
                "
                clearable
              />
              <el-select
                v-else-if="column.type === 'select'"
                v-model="searchParams[column.fieldName]"
                :placeholder="
                  column.placeholder ||
                  `请选择${column.label || column.fieldName}`
                "
                clearable
              >
                <el-option
                  v-for="option in (column.dictKey
                    ? dictData[column.dictKey]
                    : column.options) || []"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <el-date-picker
                v-else-if="column.type === 'date'"
                v-model="searchParams[column.fieldName]"
                type="date"
                :placeholder="
                  column.placeholder ||
                  `请选择${column.label || column.fieldName}`
                "
                :value-format="column.dateFormat || 'YYYY-MM-DD'"
                clearable
              />
              <el-date-picker
                v-else-if="column.type === 'dateRange'"
                v-model="searchParams[column.fieldName]"
                type="daterange"
                :start-placeholder="column.placeholder || '开始日期'"
                :end-placeholder="column.placeholder || '结束日期'"
                :value-format="column.dateFormat || 'YYYY-MM-DD'"
                range-separator="至"
                clearable
              />
              <div
                v-else-if="column.type === 'numberRange'"
                class="number-range"
                :style="{ minWidth: column.minWidth || 'auto' }"
              >
                <el-input-number
                  v-model="searchParams[column.fieldName]"
                  placeholder="最小值"
                  :controls="false"
                />
                <span class="range-separator">至</span>
                <el-input-number
                  v-model="searchParams[column.fieldName]"
                  placeholder="最大值"
                  :controls="false"
                />
              </div>
              <component
                v-else-if="column.component"
                :is="column.component"
                v-model="searchParams[column.fieldName]"
              />
            </el-form-item>
          </div>
        </div>
        <div class="search-more">
          <el-button
            v-if="searchableColumns.length > 4"
            link
            class="expand-btn"
            @click="toggleExpand"
          >
            <!-- {{ showMore ? '收起' : '更多' }} -->
            <el-icon :class="{ rotate: showMore }">
              <ArrowDown />
            </el-icon>
          </el-button>
        </div>
        <div class="search-actions">
          <el-form-item>
            <div class="action-buttons">
              <el-button type="primary" @click="$emit('search', searchParams)"
                >搜索</el-button
              >
              <el-button type="danger" @click="resetSearch">重置</el-button>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { getDicts } from "@/api/system/dict/data";
import useDictStore from "@/store/modules/dict";

/**
 * 搜索列配置
 * @typedef {Object} SearchableColumn
 * @property {string} fieldName - 搜索字段名
 * @property {'input'|'select'|'date'|'daterange'|'number'} [type] - 搜索类型
 * @property {Array<{label: string, value: any}>} [options] - 搜索选项(select类型专用)
 * @property {string} [placeholder] - 搜索占位文本
 * @property {any} [component] - 自定义搜索组件
 * @property {string} [dateFormat] - 日期格式(date/daterange类型专用)
 * @property {boolean} [numberRange] - 数字范围(number类型专用)
 * @property {string} [labelWidth] - 标签宽度
 * @property {string} [label] - 标签名称
 * @property {string|number} [width] - 宽度
 * @property {string|number} [minWidth] - 最小宽度
 * @property {number} [order] - 排序
 */

const props = defineProps({
  /** 搜索列配置
   * @type {SearchableColumn[]}
   */
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  /** 初始搜索参数
   * @type {Object}
   */
  initialParams: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["search", "reset", "toggle-expand"]);

// 搜索参数
const searchParams = ref({});
// 是否展开搜索条件
const showMore = ref(false);
// 字典数据存储
const dictData = ref({});

// 初始化搜索参数
watch(
  () => props.initialParams,
  (newParams) => {
    searchParams.value = { ...newParams };
  },
  { immediate: true, deep: true },
);

// 获取字典数据
const loadDictData = async () => {
  const dictKeys = [];
  props.columns.forEach((column) => {
    if (column.dictKey) {
      dictKeys.push(column.dictKey);
    }
  });

  // 去重
  const uniqueKeys = [...new Set(dictKeys)];

  // 从 store 中获取已缓存的字典
  const store = useDictStore();
  uniqueKeys.forEach((dictKey) => {
    const cached = store.getDict(dictKey);
    if (cached) {
      dictData.value[dictKey] = cached;
    }
  });

  // 获取未缓存的字典
  const uncachedKeys = uniqueKeys.filter((key) => !dictData.value[key]);
  for (const dictKey of uncachedKeys) {
    try {
      const res = await getDicts(dictKey);
      if (res && res.data) {
        dictData.value[dictKey] = res.data.map((p) => ({
          label: p.dictLabel,
          value: p.dictValue,
        }));
        store.setDict(dictKey, dictData.value[dictKey]);
      }
    } catch (e) {
      console.error(`获取字典${dictKey}失败`, e);
    }
  }
};

onMounted(() => {
  loadDictData();
});

// 计算可搜索的列
const searchableColumns = computed(() => {
  const sortedColumns = props.columns;
  return sortedColumns.sort(
    (a, b) => Number(a.order || 9999) - Number(b.order || 9999),
  );
});

// 重置搜索
const resetSearch = () => {
  searchParams.value = {};
  emit("reset");
};

// 切换展开/收起搜索条件
const toggleExpand = () => {
  showMore.value = !showMore.value;
  emit("toggle-expand", showMore.value);
};
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
  grid-template-columns: repeat(4, 1fr); /* 4列，每列等宽 */
  gap: 10px; /* 元素之间的间距 */
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

/* 调整label在上方时的间距 */
.search-bar :deep(.el-form-item) {
  margin-bottom: 8px;
}

.search-bar :deep(.el-form-item__label) {
  padding-bottom: 4px;
  line-height: 1.5;
}

.number-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-separator {
  color: var(--el-text-color-secondary);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

:deep(.number-range) {
  width: 100% !important;
}

:deep(.el-input-number) {
  width: 100% !important;
}
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}
</style>
