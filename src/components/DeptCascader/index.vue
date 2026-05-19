<template>
  <el-cascader
    v-if="!readonly"
    v-model="selectedValue"
    :options="deptTreeData"
    :props="cascaderProps"
    :placeholder="placeholder"
    clearable
    filterable
    style="width: 100%"
    @change="handleChange"
  >
    <template #default="{ node, data }">
      <span @click="handleNodeClick(node, data)">{{ data.deptName }}</span>
    </template>
  </el-cascader>
  <el-input
    v-else
    v-model="displayText"
    disabled
    style="width: 100%"
  />
</template>

<script setup name="DeptCascader">
import { ref, computed, watch, onMounted } from "vue";
import { listDept } from "@/api/system/dept";
import { handleTree } from "@/utils/ruoyi";

const props = defineProps({
  /** 双向绑定值 */
  modelValue: {
    type: [String, Number, Array],
    default: () => [],
  },
  /** 是否多选模式 */
  multiple: {
    type: Boolean,
    default: false,
  },
  /** 是否只读模式 */
  readonly: {
    type: Boolean,
    default: false,
  },
  /** 占位符 */
  placeholder: {
    type: String,
    default: "请选择部门",
  },
  /** 是否显示完整路径 */
  showAllLevels: {
    type: Boolean,
    default: true,
  },
  /** 是否返回完整路径 */
  emitPath: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const deptTreeData = ref([]);
const deptMap = ref({});

// cascader 配置
const cascaderProps = computed(() => ({
  checkStrictly: !props.multiple, // 单选时允许选择任意节点，多选时只允许选择叶子节点
  multiple: props.multiple,
  emitPath: props.emitPath,
  expandTrigger: "hover",
  value: "deptId",
  label: "deptName",
  children: "children",
}));

// 选中的值处理
const selectedValue = computed({
  get() {
    if (props.multiple) {
      // 多选：确保是数组格式
      if (!props.modelValue) return [];
      if (Array.isArray(props.modelValue)) return props.modelValue;
      return props.modelValue.split(",").filter(Boolean);
    }
    // 单选：根据 emitPath 决定返回数组还是单个值
    if (!props.modelValue) return undefined;
    if (props.emitPath) {
      // 如果 emitPath 为 true，modelValue 应该是数组
      return Array.isArray(props.modelValue) ? props.modelValue : [];
    }
    // 如果 emitPath 为 false，modelValue 是单个值
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

// 显示文本（用于只读模式）
const displayText = computed(() => {
  if (!props.modelValue || (Array.isArray(props.modelValue) && !props.modelValue.length)) {
    return "";
  }

  const getLabel = (deptId) => {
    const dept = deptMap.value[deptId];
    return dept ? dept.deptName : "";
  };

  if (props.multiple) {
    const ids = Array.isArray(props.modelValue)
      ? props.modelValue
      : props.modelValue.split(",").filter(Boolean);
    const labels = ids.map((id) => getLabel(Number(id))).filter(Boolean);
    return labels.join(",");
  }

  // 单选模式
  if (props.emitPath && Array.isArray(props.modelValue)) {
    // emitPath 为 true 时，modelValue 是数组（完整路径），取最后一个值
    const lastId = props.modelValue[props.modelValue.length - 1];
    return getLabel(lastId);
  }
  // emitPath 为 false 时，modelValue 是单个值
  return getLabel(props.modelValue);
});

/** 获取部门列表 */
function getDeptList() {
  listDept().then((response) => {
    // 构建树形结构
    deptTreeData.value = handleTree(response.data || [], "deptId");

    // 构建 id -> dept 的映射，方便回显
    const buildMap = (list) => {
      list.forEach((item) => {
        deptMap.value[item.deptId] = item;
        if (item.children?.length) {
          buildMap(item.children);
        }
      });
    };
    buildMap(deptTreeData.value);
  });
}

/** 选择变更处理 */
function handleChange(val) {
  // 根据选择值更新显示文本
  emit("change", val);
}

/** 节点点击处理 - 如果没有下级则直接选中 */
function handleNodeClick(node, data) {
  if (!data.children || data.children.length === 0) {
    // 叶子节点，直接选中
    selectedValue.value = data.deptId;
    emit("change", data.deptId);
    // 关闭级联面板
    node.parent && node.parent.cascaderPanel && node.parent.cascaderPanel.hide();
  }
}

// 初始化
onMounted(() => {
  getDeptList();
});
</script>

<style scoped>
</style>