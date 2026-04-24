<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="70%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
  >
    <FormData
      ref="formDataRef"
      :readonly="false"
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

<script setup name="AddEditSalesContract">
import { ref, computed, getCurrentInstance, nextTick } from "vue";
import { add, edit } from "@/api/financial/reimbursement";
import FormData from "./formData.vue";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formDataRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑报销" : "新增报销";
});

/** 关闭弹窗 */
function handleClose() {
  formDataRef.value?.resetForm();
  isEdit.value = false;
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

      // 转换为后端需要的扁平化格式
      const submitData = {
        adminId: formData.info.adminId,
        did: formData.info.did,
        subjectId: formData.info.subjectId,
        code: formData.info.code,
        expenseTime: formData.info.expenseTime,
        incomeMonth: formData.info.incomeMonth,
        projectId: formData.info.projectId,
        loanId: formData.info.loanId,
        interfix: formData.interfix.map(item => ({
          amount: item.amount,
          cateId: item.cateId,
          remarks: item.remarks,
          adminId: item.adminId
        }))
      };

      // 编辑时添加 id
      if (isEdit.value && formData.id) {
        submitData.id = formData.id;
      }

      const apiMethod = isEdit.value ? edit : add;
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
</style>
