<template>
  <div class="table-pro">
    <SearchBar
      v-if="hasSearchableColumns"
      :columns="searchableColumns"
      :initial-params="searchParams"
      @search="handleSearch"
      @reset="resetSearch"
      @toggle-expand="handleToggleExpand"
    />
    <div class="table-container" :style="tableContainerStyle">
      <el-table
        ref="table"
        class="table-box"
        :data="tableData"
        :row-key="rowKey"
        border
        stripe
        v-loading="loading"
        v-bind="$attrs"
      >
        <!-- 数据列 -->
        <el-table-column
          v-for="column in columns"
          :key="column.fieldName"
          :prop="column.fieldName"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :align="column.align || 'left'"
          :sortable="column.sortable"
        >
          <template #default="{ row }">
            <slot
              :name="column.fieldName"
              :row="row"
              :value="row[column.fieldName]"
            >
              {{ formatValue(row[column.fieldName], column.format) }}
            </slot>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          v-if="showOperationColumn"
          :label="operationColumnConfig.label"
          :width="operationColumnConfig.width"
          :min-width="operationColumnConfig.minWidth"
          :fixed="operationColumnConfig.fixed"
          :align="operationColumnConfig.align || 'center'"
        >
          <template #default="{ row }">
            <slot
              :name="operationColumnConfig.slotName || 'actions'"
              :row="row"
            >
              <div class="operation-buttons">
                <el-button
                  v-for="(action, index) in operationColumnConfig.actions"
                  :key="index"
                  v-show="action.isShow?.(row) !== false"
                  :type="action.type || 'primary'"
                  :size="action.size || 'small'"
                  :disabled="action.disabled?.(row)"
                  @click="action.onClick(row)"
                >
                  {{ action.label }}
                </el-button>
              </div>
            </slot>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div v-if="isApiMode && pagination && total > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="currentPageSize"
          :page-sizes="pageSizes"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script></script>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import SearchBar from "./SearchBar.vue";

/**
 * 通用表格组件
 * @description 支持自定义列定义、主键配置、操作按钮等
 * @description 支持通过 api 接口获取数据，支持分页
 */

/**
 * 列配置
 * @typedef {Object} TableColumn
 * @property {string} fieldName - 列字段名
 * @property {string} label - 列标题
 * @property {number} [width] - 列宽度
 * @property {number} [minWidth] - 最小宽度
 * @property {'left'|'right'} [fixed] - 固定列
 * @property {'left'|'center'|'right'} [align] - 对齐方式
 * @property {boolean|'custom'} [sortable] - 是否支持排序
 * @property {Function} [format] - 值格式化函数
 * @property {Object} [searchable] - 搜索配置
 */

/**
 * 操作按钮配置
 * @typedef {Object} TableAction
 * @property {string} label - 按钮文字
 * @property {'primary'|'success'|'warning'|'danger'|'info'} [type] - 按钮类型
 * @property {'large'|'default'|'small'} [size] - 按钮尺寸
 * @property {Function} onClick - 点击事件
 * @property {Function} [disabled] - 是否禁用
 * @property {Function} [isShow] - 是否显示
 */

/**
 * 操作列配置
 * @typedef {Object} OperationColumn
 * @property {TableAction[]} actions - 操作按钮数组
 * @property {string} [label] - 操作列标题
 * @property {number} [width] - 操作列宽度
 * @property {number} [minWidth] - 操作列最小宽度
 * @property {'left'|'right'} [fixed] - 操作列固定位置
 * @property {'left'|'center'|'right'} [align] - 操作列对齐方式
 * @property {boolean} [show] - 是否显示操作列
 * @property {string} [slotName] - 自定义操作列插槽名称
 */

// 接收的属性
const props = defineProps({
  /** 表格数据（本地数据模式）
   * @type {Array}
   */
  data: {
    type: Array,
    default: () => [],
  },
  /** API 接口函数（远程数据模式）
   * @type {Function}
   * @description 接收一个函数，该函数返回 Promise，响应格式为 { rows, total, pageNum, pageSize }
   */
  api: {
    type: Function,
    default: null,
  },
  /** 额外的请求参数
   * @type {Object}
   */
  params: {
    type: Object,
    default: () => ({}),
  },
  /** 是否分页
   * @type {Boolean}
   */
  pagination: {
    type: Boolean,
    default: true,
  },
  /** 每页显示条数
   * @type {Number}
   */
  pageSize: {
    type: Number,
    default: 20,
  },
  /** 当前页码
   * @type {Number}
   */
  pageNum: {
    type: Number,
    default: 1,
  },
  /** 页码配置
   * @type {Array}
   */
  pageSizes: {
    type: Array,
    default: () => [20, 20, 50, 100],
  },
  /** 列配置
   * @type {TableColumn[]}
   */
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  /** 行唯一标识字段名
   * @type {string}
   */
  rowKey: {
    type: String,
    default: "id",
  },
  /** 操作列配置
   * @type {OperationColumn}
   */
  operationColumn: {
    type: Object,
    default: () => ({
      actions: [],
      label: "操作",
      show: true,
    }),
  },
});

// 搜索相关逻辑
const searchParams = ref({});
// 搜索栏展开状态
const isSearchExpanded = ref(false);

// API 模式相关状态
const loading = ref(false);
const remoteData = ref([]);
const total = ref(0);
const currentPage = ref(props.pageNum);
const currentPageSize = ref(props.pageSize);

// 判断是否为 API 模式
const isApiMode = computed(() => !!props.api);

// 实际展示的表格数据
const tableData = computed(() => {
  if (isApiMode.value) {
    return remoteData.value;
  }
  return filteredData.value;
});

// 计算操作列配置
const operationColumnConfig = computed(() => {
  return { ...props.operationColumn };
});

// 是否显示操作列
const showOperationColumn = computed(() => {
  return (
    operationColumnConfig.value.show &&
    operationColumnConfig.value.actions &&
    operationColumnConfig.value.actions.length > 0
  );
});

// 计算可搜索的列
const searchableColumns = computed(() => {
  return props.columns
    .filter((column) => column.searchable)
    .map((column) => ({
      ...column.searchable,
      fieldName: column.fieldName,
    }));
});

// 检查是否有可搜索的列
const hasSearchableColumns = computed(() => {
  return searchableColumns.value.length > 0;
});

// 处理搜索栏展开/收起
const handleToggleExpand = (expanded) => {
  isSearchExpanded.value = expanded;
};

// 获取远程数据
const fetchRemoteData = async () => {
  if (!props.api) return;

  loading.value = true;
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: currentPageSize.value,
      ...props.params,
      ...searchParams.value,
    };
    
    const res = await props.api(params);
    
    // 处理返回数据
    if (res.code === 200 && res.success) {
      remoteData.value = res.rows || [];
      total.value = res.total || 0;
    } else {
      remoteData.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error("表格数据请求失败:", error);
    remoteData.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 分页大小改变
const handleSizeChange = (size) => {
  currentPageSize.value = size;
  currentPage.value = 1;
  fetchRemoteData();
};

// 页码改变
const handleCurrentChange = (page) => {
  currentPage.value = page;
  fetchRemoteData();
};

// 刷新数据（供外部调用）
const refresh = () => {
  if (isApiMode.value) {
    fetchRemoteData();
  }
};

// 暴露方法给父组件
defineExpose({
  refresh,
  loading,
});

// 计算搜索条件的行数（每行4列）
const searchRowsCount = computed(() => {
  if (!hasSearchableColumns.value) return 0;
  return Math.ceil(searchableColumns.value.length / 4);
});

// 计算 table-container 的动态高度
const tableContainerStyle = computed(() => {
  // 如果搜索栏未展开，默认按1行计算
  const effectiveRows = isSearchExpanded.value ? searchRowsCount.value : 1;
  const offsetHeight = effectiveRows * 80 + 50;
  return {
    height: `calc(100% - ${offsetHeight}px)`
  };
});

// 过滤后的数据
const filteredData = computed(() => {
  if (!hasSearchableColumns.value) return props.data;

  return props.data.filter((item) => {
    return searchableColumns.value.every((column) => {
      const searchValue = searchParams.value[column.fieldName];
      if (!searchValue) return true;

      const itemValue = item[column.fieldName];
      // 根据不同类型进行搜索
      switch (column.type) {
        case "select":
          return itemValue === searchValue;
        case "date": {
          const dateStr = new Date(itemValue).toISOString().slice(0, 10);
          const searchDateStr = new Date(searchValue)
            .toISOString()
            .slice(0, 10);
          return dateStr === searchDateStr;
        }
        case "daterange": {
          const [start, end] = searchValue;
          const itemTimestamp = new Date(itemValue).getTime();
          return (
            itemTimestamp >= new Date(start).getTime() &&
            itemTimestamp <= new Date(end).getTime()
          );
        }
        case "number":
          if (column["numberRange"]) {
            const [min, max] = searchValue;
            return itemValue >= min && itemValue <= max;
          }
          return itemValue === searchValue;
        default: // input
          return String(itemValue)
            .toLowerCase()
            .includes(String(searchValue).toLowerCase());
      }
    });
  });
});

// 处理搜索
const handleSearch = () => {
  if (isApiMode.value) {
    currentPage.value = 1;
    fetchRemoteData();
  }
  // 本地模式的搜索逻辑已在 computed 中实现
};

// 重置搜索
const resetSearch = () => {
  searchParams.value = {};
  if (isApiMode.value) {
    currentPage.value = 1;
    fetchRemoteData();
  }
};

/**
 * 格式化单元格值
 */
const formatValue = (value, format) => {
  if (!format) {
    return value ?? "-";
  }
  return format(value, {});
};

// 监听 params 变化，重新请求数据
watch(
  () => props.params,
  () => {
    if (isApiMode.value) {
      currentPage.value = 1;
      fetchRemoteData();
    }
  },
  { deep: true }
);

// 组件挂载时加载数据
onMounted(() => {
  if (isApiMode.value) {
    fetchRemoteData();
  }
});
</script>

<style scoped>
.operation-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

:deep(.el-button + .el-button) {
  margin-left: 0px;
}
.table-pro{
  height: 100%;
}
.table-container {
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}
.pagination-container {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  background-color: #fff;
}
</style>
