<template>
  <div class="three-list">
    <div class="three-list-header">
      <div class="three-list-toolbar">
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
      <div class="three-list-actions">
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
    <div class="three-list-content" v-loading="loading">
      <el-table
        ref="table"
        :data="tableData"
        row-key="id"
        border
        stripe
        :lazy="lazyLoad || demandExpand"
        :load="demandExpand ? loadChildrenOnDemand : loadChildren"
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
            <!-- 级别列使用特殊渲染 -->
            <template v-if="column.slotName === 'level'" #default="{ row }">
              <el-tag :type="getLevelType(row.level)" size="small">
                {{ row.level }}
              </el-tag>
            </template>
            <!-- 自定义插槽 -->
            <template v-else-if="column.slotName" #default="{ row }">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { RefreshRight } from "@element-plus/icons-vue";

/**
 * 树形列表组件
 * @description 支持通过 api 接口获取树形数据，支持懒加载
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
  /** API 接口函数（用于初始加载根节点）
   * @type {Function}
   */
  api: {
    type: Function,
    required: true,
  },
  /** 懒加载接口函数（用于展开时加载子节点）
   * @type {Function}
   */
  loadApi: {
    type: Function,
    default: null,
  },
  /** 是否启用懒加载
   * @type {Boolean}
   */
  lazyLoad: {
    type: Boolean,
    default: false,
  },
  /** 是否启用按需展开（数据量大时启用）
   * @type {Boolean}
   */
  demandExpand: {
    type: Boolean,
    default: false,
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
const rawData = ref([]); // 原始完整数据
const table = ref(null);

// 是否启用懒加载
const lazyLoad = computed(() => props.lazyLoad);

// 按需展开模式：初始只显示根节点
const demandExpand = computed(() => props.demandExpand);

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
  {
    fieldName: "shortname",
    label: "简称",
    width: 120,
    align: "left",
  },
  {
    fieldName: "level",
    label: "级别",
    width: 80,
    align: "center",
    slotName: "level",
  }
];

// 使用的列配置
const tableColumns = computed(() => {
  if (props.columns && props.columns.length > 0) {
    return props.columns;
  }
  return defaultColumns;
});

/**
 * 获取级别对应的标签类型
 */
const getLevelType = (level) => {
  if (level === undefined || level === null || level === '') {
    return 'info';
  }
  const typeMap = {
    1: 'success',
    2: 'success',
    3: 'warning',
    4: 'info',
  };
  const numLevel = Number(level);
  const type = typeMap[numLevel];
  // 确保返回有效的type值
  return type || 'info';
};

/**
 * 获取远程数据（根节点）
 */
const fetchData = async () => {
  loading.value = true;
  try {
    const res = await props.api(props.params);
    if (res.code === 200 && res.success) {
      rawData.value = res.data || [];

      if (props.demandExpand) {
        // 按需展开模式：只显示根节点，children 暂不处理
        tableData.value = processRootData(rawData.value);
      } else {
        tableData.value = rawData.value;
      }
    } else {
      tableData.value = [];
      rawData.value = [];
    }
  } catch (error) {
    console.error("树形数据请求失败:", error);
    tableData.value = [];
    rawData.value = [];
  } finally {
    loading.value = false;
  }
};

/**
 * 处理根节点数据（按需展开模式）
 */
const processRootData = (data) => {
  if (!data || !Array.isArray(data)) return [];

  // 构建 id -> children 的映射
  const childrenMap = new Map();
  const flattenData = [];

  const flatten = (list) => {
    for (const item of list) {
      flattenData.push(item);
      if (item.children && item.children.length > 0) {
        childrenMap.set(item.id, item.children);
        flatten(item.children);
      }
    }
  };

  flatten(data);

  // 返回根节点（一级数据，pid=0 或没有 pid）
  return data.map(item => ({
    ...item,
    children: childrenMap.has(item.id) ? item.children : []
  }));
};

/**
 * 懒加载子节点（按需展开模式）
 */
const loadChildrenOnDemand = (row, treeNode, resolve) => {
  // 从原始数据中查找该节点的子节点
  const findChildren = (data, parentId) => {
    for (const item of data) {
      if (item.id === parentId) {
        return item.children || [];
      }
      if (item.children && item.children.length > 0) {
        const found = findChildren(item.children, parentId);
        if (found) return found;
      }
    }
    return [];
  };

  const children = findChildren(rawData.value, row.id);
  resolve(children || []);
};

/**
 * 懒加载子节点数据
 */
const loadChildren = async (row, treeNode, resolve) => {
  if (!props.loadApi) {
    // 如果没有单独定义 loadApi，使用原 api 传递 pid 参数
    props.api({ ...props.params, pid: row.id })
      .then((res) => {
        if (res.code === 200 && res.success) {
          resolve(res.data || []);
        } else {
          resolve([]);
        }
      })
      .catch(() => {
        resolve([]);
      });
  } else {
    // 使用专门的懒加载接口
    props.loadApi({ ...props.params, pid: row.id })
      .then((res) => {
        if (res.code === 200 && res.success) {
          resolve(res.data || []);
        } else {
          resolve([]);
        }
      })
      .catch(() => {
        resolve([]);
      });
  }
};

/**
 * 刷新数据
 */
const refresh = () => {
  fetchData();
  emit("refresh");
};

/**
 * 展开/折叠所有节点
 */
const expandAll = () => {
  table.value?.expandAll();
};

const collapseAll = () => {
  table.value?.collapseAll();
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
  fetchData();
});
</script>

<style scoped>
.three-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.three-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 4px 4px 0 0;
}

.three-list-toolbar {
  display: flex;
  gap: 8px;
}

.three-list-actions {
  display: flex;
  gap: 8px;
}

.three-list-content {
  flex: 1;
  background-color: #fff;
  border-radius: 0 0 4px 4px;
  overflow: auto;
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
