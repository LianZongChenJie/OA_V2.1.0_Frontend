<template>
  <div class="seal-apply-dialogs">
    <!-- 新增/编辑弹窗 -->
    <AddEdit ref="addEditRef" @success="handleSuccess" />

    <!-- 详情弹窗 -->
    <Detail ref="detailRef" @success="handleSuccess" />
  </div>
</template>

<script setup name="AddSealApply">
import { ref } from "vue";
import AddEdit from "./addEdit.vue";
import Detail from "./detail.vue";

const addEditRef = ref(null);
const detailRef = ref(null);

const emit = defineEmits(["success"]);

const open = () => addEditRef.value?.open();
const openEdit = (data) => addEditRef.value?.openEdit(data);
const openView = (data) => detailRef.value?.openView(data);
const handleSuccess = () => emit("success");

defineExpose({ open, openEdit, openView });
</script>
