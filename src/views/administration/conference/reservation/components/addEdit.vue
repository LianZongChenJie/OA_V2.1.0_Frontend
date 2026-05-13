<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="conference-dialog"
    @close="handleClose"
    :close-on-click-modal="false"
  >
    <FormData
      ref="formDataRef"
      :readonly="false"
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

<script setup name="ConferenceAddEdit">
import { ref, computed, nextTick } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/administration/conference/reservation/index.js";
import RecordSteps from "@/components/RecordSteps/index.vue";
import { getCurrentInstance } from "vue";
import FormData from "./formData.vue";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formDataRef = ref(null);
const isEdit = ref(false);
const currentData = ref(null);

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑会议预订" : "新增会议预订";
});

/** 关闭弹窗 */
function handleClose() {
  formDataRef.value?.resetForm();
  isEdit.value = false;
  currentData.value = null;
}

/** 显示弹窗 - 新增模式 */
function open() {
  isEdit.value = false;
  currentData.value = null;
  dialogVisible.value = true;
  nextTick(() => {
    formDataRef.value?.resetForm();
  });
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  isEdit.value = true;
  currentData.value = data;
  dialogVisible.value = true;
  nextTick(() => {
    formDataRef.value?.resetForm();
    formDataRef.value?.setFormData(data);
  });
}

const emit = defineEmits(["success"]);

/** 提交表单 */
function handleSubmit() {
  formDataRef.value?.validate().then(async (valid) => {
    if (!valid) return;

    const submitData = formDataRef.value?.getSubmitData();

    // 如果是编辑模式，保留原有ID
    if (isEdit.value && currentData.value?.id) {
      submitData.id = currentData.value.id;
    }

    const apiMethod = isEdit.value ? updateenterPrise : addenterPrise;
    await apiMethod(submitData);

    proxy.$modal.msgSuccess(isEdit.value ? "编辑成功" : "新增成功");
    dialogVisible.value = false;
    emit("success");
  }).catch(() => {});
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
.conference-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.conference-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.el-dialog__footer {
  border-top: 1px solid #f7f7f7;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
}
</style>