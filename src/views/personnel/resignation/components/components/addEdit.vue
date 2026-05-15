<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
  >
    <div>
      <FormData ref="formDataRef" :readonly="false" />

      <!-- 审批记录（当 checkStatus != 0 且存在 records 时显示） -->
      <template
        v-if="
          currentData &&
          Number(currentData.checkStatus) !== 0 &&
          currentData.records &&
          currentData.records.length > 0
        "
      >
        <RecordSteps :records="currentData.records" />
      </template>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
        <el-button @click="dialogVisible = false"> 取 消 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddEditResignation">
import { ref, computed, nextTick } from "vue";
import { add, edit } from "@/api/personnel/resignation";
import FormData from "./formData.vue";
import RecordSteps from "@/components/RecordSteps/index.vue";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false);
const formDataRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const currentData = ref(null);

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑离职申请" : "新增离职申请";
});

/** 关闭弹窗 */
function handleClose() {
  formDataRef.value?.resetForm();
  isEdit.value = false;
  currentData.value = null;
}

/** 打开弹窗 */
function open(data = null) {
  isEdit.value = !!data;
  currentData.value = data;
  dialogVisible.value = true;

  nextTick(() => {
    formDataRef.value?.resetForm();
    if (data) {
      formDataRef.value?.setFormData(data);
    }
  });
}

/** 提交表单 */
function handleSubmit() {
  formDataRef.value?.formRef.validate((valid) => {
    if (valid) {
      const formData = formDataRef.value?.getFormData();
      const apiMethod = isEdit.value ? edit : add;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      apiMethod(formData).then(() => {
        ElMessage.success(successMsg);
        dialogVisible.value = false;
        emit("success");
      });
    }
  });
}

const emit = defineEmits(["success"]);

defineExpose({
  open,
});
</script>

<style scoped>
.form-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0 15px 0;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}
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
