<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="40%"
    append-to-body
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="140px"
    >
      <el-form-item label="类型名称" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入类型名称"
          :disabled="isView"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false">{{
          isView ? "关 闭" : "取 消"
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddReimbursementType">
import { ref, reactive, computed, getCurrentInstance, nextTick } from "vue";
import {
  addReimbursement,
  updateReimbursement,
} from "@/api/finance/reimbursement/index.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const isView = ref(false); // 是否为查看模式

const form = reactive({
  id: undefined,
  title: "",
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看报销类型";
  return isEdit.value ? "编辑报销类型" : "新增报销类型";
});

const rules = {
  title: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
};

/** 表单重置 */
function reset() {
  // 重置表单数据
  form.id = undefined;
  form.title = "";

  // 重置模式状态
  isEdit.value = false;
  isView.value = false;

  // 重置表单验证
  if (formRef.value) {
    formRef.value.resetFields();
  }
}

/** 关闭弹窗 */
function handleClose() {
  reset();
  dialogVisible.value = false;
}

/** 显示弹窗 - 新增模式 */
function open() {
  // 先重置表单数据和状态
  form.id = undefined;
  form.title = "";
  isEdit.value = false;
  isView.value = false;

  // 打开弹窗
  dialogVisible.value = true;

  // 在弹窗渲染完成后重置表单验证
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetFields();
    }
  });
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  // 重置表单验证
  if (formRef.value) {
    formRef.value.clearValidate();
  }

  // 填充表单数据
  form.id = data.id;
  form.title = data.title || "";

  isEdit.value = true;
  isView.value = false;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  // 重置表单验证
  if (formRef.value) {
    formRef.value.clearValidate();
  }

  // 填充表单数据
  form.id = data.id;
  form.title = data.title || "";

  isEdit.value = false;
  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? updateReimbursement : addReimbursement;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      apiMethod(form).then(() => {
        proxy.$modal.msgSuccess(successMsg);
        handleClose(); // 关闭弹窗并重置
        emit("success");
      });
    }
  });
}

const emit = defineEmits(["success"]);

defineExpose({
  open,
  openEdit,
  openView,
});
</script>

<style scoped>
</style>

