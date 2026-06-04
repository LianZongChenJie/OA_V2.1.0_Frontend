<template>
  <el-cascader
    ref="cascaderRef"
    :model-value="modelValue"
    :props="cascaderProps"
    :disabled="disabled"
    placeholder="请选择所属城市"
    clearable
    style="width: 100%"
    @change="handleCityChange"
  />
</template>

<script setup>
import { ref } from "vue";
import { getThreeList } from "@/api/base/common/division";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "city-change"]);

const cascaderRef = ref(null);
let pendingCityId = null;

// 地区级联配置（远程懒加载）
const cascaderProps = {
  value: "id",
  label: "name",
  children: "children",
  checkStrictly: true,
  emitPath: true,
  lazy: true,
  lazyLoad(node, resolve) {
    const params = node.level === 0 ? { pid: 0 } : { pid: node.data.id };
    getThreeList(params).then((res) => {
      const nodes = (res.data || []).map((item) => ({
        ...item,
        leaf: item.hasChildren === false || item.level >= 3,
      }));
      resolve(nodes);
    });
  },
};

/** 城市选择变更：输出完整路径名称和选中值 */
function handleCityChange(value) {
  emit("update:modelValue", value);
  const nodes = cascaderRef.value?.getCheckedNodes();
  if (nodes && nodes.length > 0) {
    const node = nodes[0];
    const cityName = node.pathLabels ? node.pathLabels.join(",") : node.label || "";
    emit("city-change", cityName);
  } else {
    emit("city-change", "");
  }
}

/** 弹窗打开后设置级联值（用于编辑回显） */
function handleOpened() {
  if (pendingCityId) {
    // 不能直接修改 modelValue，通过 change 事件同步
    emit("update:modelValue", pendingCityId);
    pendingCityId = null;
  }
}

/** 设置待处理的 cityId */
function setPendingCityId(cityIdArray) {
  pendingCityId = cityIdArray;
}

defineExpose({
  cascaderRef,
  handleOpened,
  setPendingCityId,
});
</script>