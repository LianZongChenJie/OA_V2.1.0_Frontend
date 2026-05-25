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

<script setup name="AddEditLeave">
import { ref, computed, getCurrentInstance, nextTick } from "vue";
import { add } from "@/api/personalOffice/leaveMsg";
import FormData from "./formData.vue";
import RecordSteps from "@/components/RecordSteps/index.vue";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formDataRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const currentData = ref(null);

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑请假" : "新增请假";
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
  currentData.value = data;
  dialogVisible.value = true;

  // 等待 DOM 更新后设置数据
  nextTick(() => {
    setTimeout(() => {
      if (formDataRef.value) {
        formDataRef.value.resetForm();
        formDataRef.value.setFormData(data);
      }
    }, 100);
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

      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      // 新增和编辑都调用 add 接口
      add(submitData).then(() => {
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
