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
      :readonly="false"
    />

    <!-- 审批记录 -->
    <RecordSteps
      v-if="currentData && Number(currentData.checkStatus) !== 0 && currentData.records && currentData.records.length > 0"
      :records="currentData.records"
    />

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

<script setup name="AddEditInvoice">
import { ref, computed, getCurrentInstance, nextTick } from "vue";
import { add, update } from "@/api/financial/receiptMsg";
import RecordSteps from "@/components/RecordSteps/index.vue";
import FormData from "./formData.vue";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formDataRef = ref(null);
const currentData = ref(null);
const isEdit = ref(false); // 是否为编辑模式

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑收票" : "新增收票";
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
  dialogVisible.value = true;

  // 等待 DOM 更新后重置表单
  nextTick(() => {
    formDataRef.value?.resetForm();
  });
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  isEdit.value = true;
  dialogVisible.value = true;

  // 保存原始数据用于权限判断
  currentData.value = data;

  // 等待 DOM 更新后设置数据
  nextTick(() => {
    formDataRef.value?.resetForm();
    formDataRef.value?.setFormData(data);
  });
}

/** 提交表单 */
function handleSubmit() {
  formDataRef.value?.formRef.validate((valid) => {
    if (valid) {
      const formData = formDataRef.value?.getFormData();

      // 将数组转换为后端需要的格式
      const submitData = {
        ...formData,
      };

      const apiMethod = isEdit.value ? update : add;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      apiMethod(submitData).then(() => {
        proxy.$modal.msgSuccess(successMsg);
        dialogVisible.value = false;
        emit("success");
      });
    }
  });
}

const emit = defineEmits(["success"]);

defineExpose({
  open,
  openEdit,
});
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

.form-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0 15px 0;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}
</style>
