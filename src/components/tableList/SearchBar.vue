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
              <el-select
                v-else-if="column.type === 'selectApi'"
                ref="selectApiRefs"
                v-model="searchParams[column.fieldName]"
                :placeholder="
                  column.placeholder ||
                  `请选择${column.label || column.fieldName}`
                "
                :loading="apiLoading[column.fieldName]"
                clearable
                filterable
                remote
                :remote-method="(query) => handleApiSearch(column, query)"
                @visible-change="(visible) => handleApiVisible(visible, column)"
                style="width: 100%"
              ><el-option
                  v-for="option in apiOptions[column.fieldName] || []"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
                <template #footer v-if="hasMoreData(column.fieldName)">
                  <div
                    class="load-more-option"
                    @click.stop="handleLoadMore(column)"
                    :class="{ loading: apiLoading[column.fieldName] }"
                  >
                    <span v-loading="apiLoading[column.fieldName]">{{ apiLoading[column.fieldName] ? '加载中...' : '加载更多' }}</span>
                  </div>
                </template>
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
              <el-button type="primary" @click="handleSearch"
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
 * API 分页选择配置
 * @typedef {Object} ApiSelectConfig
 * @property {Function} api - API 请求函数
 * @property {string} [optionLabel] - 选项标签字段名，默认 'label'
 * @property {string} [optionValue] - 选项值字段名，默认 'value'
 * @property {number} [pageSize] - 每页数量，默认 10
 * @property {Object} [apiParams] - 额外请求参数
 */

/**
 * 搜索列配置
 * @typedef {Object} SearchableColumn
 * @property {string} fieldName - 搜索字段名
 * @property {'input'|'select'|'selectApi'|'date'|'dateRange'|'numberRange'} [type] - 搜索类型
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

// API 选择相关数据
const apiOptions = ref({});
const apiLoading = ref({});
const apiPage = ref({});
const apiTotal = ref({});

// 初始化搜索参数
watch(
  () => props.initialParams,
  (newParams) => {
    // 只在初始时或外部重置时更新，避免搜索后重置
    if (Object.keys(searchParams.value).length === 0) {
      searchParams.value = { ...newParams };
    }
  },
  { deep: true },
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

// 处理搜索
const handleSearch = () => {
  emit("search", { ...searchParams.value });
};

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

// 加载 API 选项数据
const loadApiOptions = async (column, query = "", isLoadMore = false) => {
  const fieldName = column.fieldName;
  const api = column.api;

  if (!api || typeof api !== 'function') return;

  // 如果不是加载更多，重置分页
  if (!isLoadMore) {
    apiPage.value[fieldName] = 1;
    apiOptions.value[fieldName] = [];
  }

  const currentPage = apiPage.value[fieldName] || 1;
  const pageSize = column.pageSize || 10;

  // 构建请求参数
  const params = {
    ...(column.apiParams || {}),
    pageNum: currentPage,
    pageSize: pageSize,
  };

  // 如果有搜索关键词，添加到参数中
  if (query) {
    params.keyword = query;
  }

  apiLoading.value[fieldName] = true;

  try {
    const res = await api(params);
    if (res && res.code === 200) {
      const list = res.rows || [];
      const total = res.total || 0;

      // 格式化选项数据
      const formattedList = list.map((item) => ({
        label: item[column.optionLabel || "label"],
        value: item[column.optionValue || "value"],
        ...item,
      }));

      if (isLoadMore) {
        apiOptions.value[fieldName] = [
          ...(apiOptions.value[fieldName] || []),
          ...formattedList,
        ];
      } else {
        apiOptions.value[fieldName] = formattedList;
      }

      apiTotal.value[fieldName] = total;
    }
  } catch (e) {
    console.error(`加载 ${fieldName} 选项失败`, e);
  } finally {
    apiLoading.value[fieldName] = false;
  }
};

// 处理下拉框显示/隐藏
const handleApiVisible = (visible, column) => {
  if (visible) {
    // 首次展开且没有数据时加载
    if (!apiOptions.value[column.fieldName]?.length) {
      loadApiOptions(column);
    }
  }
};

// 处理远程搜索
const handleApiSearch = (column, query) => {
  loadApiOptions(column, query);
};

// 处理加载更多点击
const handleLoadMore = (column) => {
  const fieldName = column.fieldName;
  if (apiLoading.value[fieldName]) return;

  const currentPage = apiPage.value[fieldName] || 1;
  const pageSize = column.pageSize || 10;
  const total = apiTotal.value[fieldName] || 0;

  // 检查是否还有更多数据
  if (currentPage * pageSize < total) {
    apiPage.value[fieldName] = currentPage + 1;
    loadApiOptions(column, "", true);
  }
};

// 判断是否有更多数据
const hasMoreData = (fieldName) => {
  const currentPage = apiPage.value[fieldName] || 1;
  const pageSize = 10;
  const total = apiTotal.value[fieldName] || 0;
  return currentPage * pageSize < total;
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

/* 加载更多按钮样式 */
.load-more-footer {
  padding: 8px 0;
  border-top: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-fill-color-light);
}

.load-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  color: var(--el-color-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  margin: 0 12px;
}

.load-more-btn:hover {
  background-color: var(--el-color-primary-light-9);
}

.load-more-btn.loading {
  color: var(--el-text-color-secondary);
  cursor: not-allowed;
}

.load-more-btn .el-icon {
  font-size: 14px;
}

.load-more-btn .el-icon.is-loading {
  animation: rotating 2s linear infinite;
}

.load-more-option {
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-option:hover {
  color: var(--el-color-primary);
}

.load-more-option:active {
  background-color: var(--el-color-primary-light-8);
  transform: scale(0.98);
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
