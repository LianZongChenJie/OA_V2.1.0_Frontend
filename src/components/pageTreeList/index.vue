<template>
  <div class="page-tree-list">
    <!-- 搜索栏 -->
    <SearchBar
      v-if="hasSearchableColumns"
      :columns="searchableColumns"
      :initial-params="searchParams"
      @search="handleSearch"
      @reset="resetSearch"
    />
    <div class="page-tree-list-header">
      <div class="page-tree-list-toolbar">
        <el-button
          v-for="(btn, index) in toolbarButtons"
          :key="index"
          :type="btn.type || 'primary'"
          :size="btn.size || 'small'"
          :icon="btn.icon"
          :disabled="btn.disabled"
          @click="btn.onClick"
          plain
        >
          {{ btn.label }}
        </el-button>
      </div>
      <div class="page-tree-list-actions">
        <el-tooltip content="刷新" placement="top">
          <el-button
            type="default"
            :icon="RefreshRight"
            :loading="loading"
            circle
            @click="refresh"
          />
        </el-tooltip>
      </div>
    </div>
    <div class="page-tree-list-content" v-loading="loading">
      <el-table
        ref="tableRef"
        :data="tableData"
        row-key="id"
        border
        stripe
        :lazy="true"
        :load="loadChildren"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        v-bind="$attrs"
      >
        <!-- 动态渲染列 -->
        <template v-for="column in tableColumns" :key="column.fieldName">
          <el-table-column
            v-if="column.isShow === false ? false : true"
            :prop="column.fieldName"
            :label="column.label"
            :width="column.width"
            :min-width="column.minWidth"
            :align="column.align || 'left'"
          >
            <!-- 自定义插槽 -->
            <template v-if="column.slotName" #default="{ row }">
              <slot :name="column.slotName" :row="row" :column="column" />
            </template>
          </el-table-column>
        </template>

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
                  <svg-icon
                    v-if="action.icon"
                    :icon-class="action.icon"
                    class="btn-icon"
                  />
                  <span>{{ action.label }}</span>
                </el-button>
              </div>
            </slot>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 30, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import { RefreshRight } from "@element-plus/icons-vue";
import SearchBar from "@/components/tableList/SearchBar.vue";

/**
 * 分页树形列表组件
 * @description 支持分页显示的树形列表，初始加载根节点（pid=0），展开时加载子节点
 */

/**
 * 操作按钮配置
 * @typedef {Object} ListAction
 * @property {string} label - 按钮文字
 * @property {'primary'|'success'|'warning'|'danger'|'info'} [type] - 按钮类型
 * @property {'large'|'default'|'small'} [size] - 按钮尺寸
 * @property {string} [icon] - 图标名称
 * @property {Function} onClick - 点击事件
 * @property {Function} [disabled] - 是否禁用
 * @property {Function} [isShow] - 是否显示
 */

/**
 * 操作列配置
 * @typedef {Object} OperationColumn
 * @property {ListAction[]} actions - 操作按钮数组
 * @property {string} [label] - 操作列标题
 * @property {number} [width] - 操作列宽度
 * @property {number} [minWidth] - 操作列最小宽度
 * @property {'left'|'right'} [fixed] - 操作列固定位置
 * @property {'left'|'center'|'right'} [align] - 操作列对齐方式
 * @property {boolean} [show] - 是否显示操作列
 * @property {string} [slotName] - 自定义操作列插槽名称
 */

/**
 * 表格列配置
 * @typedef {Object} TableColumn
 * @property {string} fieldName - 数据字段名
 * @property {string} label - 列标题
 * @property {number} [width] - 列宽度
 * @property {number} [minWidth] - 列最小宽度
 * @property {'left'|'center'|'right'} [align] - 对齐方式
 * @property {string} [slotName] - 自定义插槽名称
 * @property {boolean} [isShow] - 是否显示（可选函数或布尔值）
 */

const props = defineProps({
  /** 分页列表接口（用于初始加载根节点，pid=0）
   * @type {Function}
   */
  getPageList: {
    type: Function,
    required: true,
  },
  /** 树形接口（用于展开时加载子节点）
   * @type {Function}
   */
  getThree: {
    type: Function,
    required: true,
  },
  /** 额外的请求参数
   * @type {Object}
   */
  params: {
    type: Object,
    default: () => ({}),
  },
  /** 表格列配置（不传则使用默认列）
   * @type {TableColumn[]}
   */
  columns: {
    type: Array,
    default: null,
  },
  /** 工具栏按钮配置
   * @type {Array}
   */
  toolbarButtons: {
    type: Array,
    default: () => [],
  },
  /** 操作列配置
   * @type {OperationColumn}
   */
  operationColumn: {
    type: Object,
    default: () => ({
      actions: [],
      label: "操作",
      show: false,
    }),
  },
});

const emit = defineEmits(["refresh"]);

// 状态
const loading = ref(false);
const tableData = ref([]);
const tableRef = ref(null);

// 分页配置
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
});

// 计算操作列配置
const operationColumnConfig = computed(() => {
  return {
    ...props.operationColumn,
    show: props.operationColumn.show !== false,
  };
});

// 是否显示操作列
const showOperationColumn = computed(() => {
  return (
    operationColumnConfig.value.show &&
    operationColumnConfig.value.actions &&
    operationColumnConfig.value.actions.length > 0
  );
});

// 默认列配置
const defaultColumns = [
  {
    fieldName: "id",
    label: "ID",
    width: 120,
    align: "left",
  },
  {
    fieldName: "name",
    label: "名称",
    minWidth: 150,
    align: "left",
  },
];

// 使用的列配置
const tableColumns = computed(() => {
  if (props.columns && props.columns.length > 0) {
    return props.columns;
  }
  return defaultColumns;
});

// 计算可搜索的列（columns 中包含 searchable 属性的列）
const searchableColumns = computed(() => {
  return props.columns
    .filter((column) => column.searchable)
    .map((column) => ({
      ...column.searchable,
      fieldName: column.fieldName,
    }));
});

// 是否有可搜索的列
const hasSearchableColumns = computed(() => {
  return searchableColumns.value.length > 0;
});

// 搜索参数
const searchParams = ref({});

// 处理搜索
const handleSearch = (params) => {
  searchParams.value = { ...params };
  pagination.page = 1;
  fetchRootData();
};

// 重置搜索
const resetSearch = () => {
  searchParams.value = {};
  pagination.page = 1;
  fetchRootData();
};

/**
 * 获取根节点数据（分页，pid=0）
 */
const fetchRootData = async () => {
  loading.value = true;
  try {
    const res = await props.getPageList({
      ...props.params,
      ...searchParams.value,
      pageNum: pagination.page,
      pageSize: pagination.limit,
      pid: 0, // 初始查询 pid=0 的数据
    });
    if (res.code === 200 && res.success) {
      const rows = res.rows || res.data?.rows || [];
      // 为每个节点添加 children 数组，确保显示展开图标
      // hasChildren 设置为 true 表示有子节点需要懒加载
      tableData.value = rows.map(item => ({
        ...item,
        children: [],
        hasChildren: true
      }));
      pagination.total = res.total || res.data?.total || 0;
    } else {
      tableData.value = [];
      pagination.total = 0;
    }
  } catch (error) {
    console.error("分页列表请求失败:", error);
    tableData.value = [];
    pagination.total = 0;
  } finally {
    loading.value = false;
  }
};

/**
 * 懒加载子节点（展开时调用 getThree 接口）
 */
const loadChildren = async (row, treeNode, resolve) => {
  try {
    const res = await props.getThree({
      ...props.params,
      pid: row.id, // 根据当前行的 id 作为 pid 查询子节点
    });
    if (res.code === 200 && res.success) {
      resolve(res.rows || res.data || []);
    } else {
      resolve([]);
    }
  } catch (error) {
    console.error("加载子节点失败:", error);
    resolve([]);
  }
};

/**
 * 刷新数据
 */
const refresh = () => {
  fetchRootData();
  emit("refresh");
};

/**
 * 分页大小变化
 */
const handleSizeChange = (val) => {
  pagination.limit = val;
  fetchRootData();
};

/**
 * 页码变化
 */
const handleCurrentChange = (val) => {
  pagination.page = val;
  fetchRootData();
};

/**
 * 展开/折叠所有节点
 */
const expandAll = () => {
  tableRef.value?.expandAll();
};

const collapseAll = () => {
  tableRef.value?.collapseAll();
};

// 暴露方法给父组件
defineExpose({
  refresh,
  expandAll,
  collapseAll,
  loading,
});

// 组件挂载时加载数据
onMounted(() => {
  fetchRootData();
});
</script>

<style scoped>
.page-tree-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-tree-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 4px 4px 0 0;
}

.page-tree-list-toolbar {
  display: flex;
  gap: 8px;
}

.page-tree-list-actions {
  display: flex;
  gap: 8px;
}

.page-tree-list-content {
  flex: 1;
  background-color: #fff;
  border-radius: 0 0 4px 4px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.page-tree-list-content .el-table {
  flex: 1;
}

.pagination-wrapper {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
}

.operation-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-icon {
  margin-right: 4px;
  vertical-align: -2px;
}

:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>