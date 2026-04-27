<template>
  <div class="sales-contract-dialogs">
    <!-- 新增/编辑弹窗 -->
    <AddEdit ref="addEditRef" @success="handleSuccess" :invoiceId="invoiceId" />
  </div>
</template>

<script setup name="AddInvoice">
import { ref } from "vue";
import AddEdit from "./addEdit.vue";

// 接收父组件传递的属性（即使不使用也要声明以避免警告）
const props = defineProps({
  type: {
    type: [Number, String],
    default: undefined
  },
  label: {
    type: String,
    default: ""
  },
  invoiceId: {
    type: [String, Number],
    default: null
  }
});

const addEditRef = ref(null);

/** 显示弹窗 - 新增模式 */
function open() {
  addEditRef.value?.open();
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  addEditRef.value?.openEdit(data);
}

/** 处理成功事件 */
function handleSuccess() {
  emit("success");
}

const emit = defineEmits(["success"]);

defineExpose({
  open,
  openEdit,
});
</script>
