<template>
  <el-dialog
    title="新增回款记录"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
  >
    <FormData
      ref="formDataRef"
      :readonly="false"
      :invoiceId="invoiceId"
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
import { ref, getCurrentInstance, nextTick } from "vue";
import { add } from "@/api/financial/fundRecoup";
import FormData from "./formData.vue";

const { proxy } = getCurrentInstance();

const props = defineProps({
  invoiceId: {
    type: [String, Number],
    default: null,
  },
});

const dialogVisible = ref(false);
const formDataRef = ref(null);

/** 关闭弹窗 */
function handleClose() {
  formDataRef.value?.resetForm();
}

/** 显示弹窗 - 新增模式 */
function open() {
  dialogVisible.value = true;

  // 等待 DOM 更新后重置表单
  nextTick(() => {
    formDataRef.value?.resetForm();
  });
}

/** 提交表单 */
function handleSubmit() {
  formDataRef.value?.formRef.validate((valid) => {
    if (valid) {
      const formData = formDataRef.value?.getFormData();

      // 将数组转换为后端需要的格式
      const submitData = [{
        ...formData,
      }];

      add(submitData).then(() => {
        proxy.$modal.msgSuccess("新增成功");
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
