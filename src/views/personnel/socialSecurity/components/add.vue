<template>
  <div class="social-security-dialogs">
    <!-- 新增/编辑弹窗 -->
    <AddEdit ref="addEditRef" @success="handleSuccess" />

    <!-- 详情弹窗 -->
    <Detail ref="detailRef" @success="handleSuccess" />
  </div>
</template>

<script setup name="SocialSecurityAdd">
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