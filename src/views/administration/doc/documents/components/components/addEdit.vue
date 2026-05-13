<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
  >
    <FormData
      ref="formDataRef"
      :readonly="isView"
    />

    <!-- 审批记录 -->
    <RecordSteps v-if="isEdit && currentData?.records?.length" :records="currentData.records" />

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">
          确 定
        </el-button>
        <el-button @click="dialogVisible = false">
          取 消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddEditDocuments">
import { ref, computed, nextTick } from "vue";
import { add, edit } from "@/api/administration/doc/documents/index.js";
import RecordSteps from "@/components/RecordSteps/index.vue";
import FormData from "./formData.vue";

const dialogVisible = ref(false);
const formDataRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);
const currentData = ref(null);

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑公文" : "新增公文";
});

/** 关闭弹窗 */
function handleClose() {
  formDataRef.value?.resetForm();
  isEdit.value = false;
  isView.value = false;
  currentData.value = null;
}

/** 显示弹窗 - 新增模式 */
function open() {
  isEdit.value = false;
  isView.value = false;
  dialogVisible.value = true;
  nextTick(() => {
    formDataRef.value?.resetForm();
  });
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  isEdit.value = true;
  isView.value = false;
  currentData.value = data;
  dialogVisible.value = true;
  nextTick(() => {
    formDataRef.value?.resetForm();
    formDataRef.value?.setFormData(data);
  });
}

const emit = defineEmits(["success"]);

/** 提交表单 */
async function handleSubmit() {
  const valid = await formDataRef.value?.formRef.validate().catch(() => false);
  if (valid) {
    const submitData = formDataRef.value?.getSubmitData();
    const apiMethod = isEdit.value ? edit : add;

    apiMethod(submitData).then(() => {
      dialogVisible.value = false;
      emit("success");
    });
  }
}

defineExpose({
  open,
  openEdit
});
</script>

<style scoped>
</style>

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