<template>
  <div class="sales-contract-dialogs">
    <!-- 新增/编辑弹窗 -->
    <AddEdit ref="addEditRef" @success="handleSuccess" />

    <!-- 详情弹窗 -->
    <Detail ref="detailRef" @success="handleSuccess" />
  </div>
</template>

<script setup name="AddSalesContract">
import { ref } from "vue";
import AddEdit from "./addEdit.vue";
import Detail from "./detail.vue";

// 接收父组件传递的属性（即使不使用也要声明以避免警告）
const props = defineProps({
  type: {
    type: [Number, String],
    default: undefined
  },
  label: {
    type: String,
    default: ""
  }
});

const addEditRef = ref(null);
const detailRef = ref(null);

/** 显示弹窗 - 新增模式 */
function open() {
  addEditRef.value?.open();
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  addEditRef.value?.openEdit(data);
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  detailRef.value?.openView(data);
}

/** 处理成功事件 */
function handleSuccess() {
  emit("success");
}

const emit = defineEmits(["success"]);

defineExpose({
  open,
  openEdit,
  openView,
});
</script>
