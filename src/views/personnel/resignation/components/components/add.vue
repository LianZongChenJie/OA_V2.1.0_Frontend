<template>
  <div class="resignation-dialogs">
    <AddEdit ref="addEditRef" @success="handleSuccess" />
    <Detail ref="detailRef" @success="handleSuccess" />
  </div>
</template>

<script setup name="AddResignation">
import { ref } from "vue";
import AddEdit from "./addEdit.vue";
import Detail from "./detail.vue";

const addEditRef = ref(null);
const detailRef = ref(null);

/** 显示弹窗 - 新增模式 */
function open() {
  addEditRef.value?.open();
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  addEditRef.value?.open(data);
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
