<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
  >
    <FormData ref="formDataRef" :readonly="false" />

    <!-- 审批记录 -->
    <RecordSteps v-if="isEdit && currentData?.records?.length" :records="currentData.records" />

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
        <el-button @click="dialogVisible = false"> 取 消 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick } from "vue";
import { add, edit } from "@/api/administration/seal/apply";
import RecordSteps from "@/components/RecordSteps/index.vue";
import FormData from "./formData.vue";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["success"]);

const dialogVisible = ref(false);
const formDataRef = ref(null);
const isEdit = ref(false);
const currentData = ref(null);

const dialogTitle = computed(() =>
  isEdit.value ? "编辑用章申请" : "新增用章申请",
);

const handleClose = async () => {
  await formDataRef.value?.resetForm();
  isEdit.value = false;
  currentData.value = null;
};

const open = async () => {
  isEdit.value = false;
  dialogVisible.value = true;
  await nextTick();
  formDataRef.value?.resetForm();
};

const openEdit = async (data) => {
  isEdit.value = true;
  currentData.value = data;
  dialogVisible.value = true;
  await nextTick();
  await formDataRef.value?.resetForm();
  formDataRef.value?.setFormData(data);
};

const handleSubmit = () => {
  formDataRef.value?.formRef.validate((valid) => {
    if (!valid) return;
    const data = formDataRef.value?.getFormData();
    (isEdit.value ? edit : add)(data).then(() => {
      proxy.$modal.msgSuccess(isEdit.value ? "编辑成功" : "新增成功");
      dialogVisible.value = false;
      emit("success");
    });
  });
};

defineExpose({ open, openEdit });
</script>

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
.documents-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.documents-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>
