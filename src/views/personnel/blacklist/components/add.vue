<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="40%"
    append-to-body
    class="message-module-dialog"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="isView ? {} : rules" label-width="140px">
      <el-form-item label="姓名" prop="title">
        <el-input v-model="form.title" placeholder="请输入姓名" :disabled="isView" />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" :disabled="isView" />
      </el-form-item>

      <el-form-item label="身份证号" prop="name">
        <el-input v-model="form.name" placeholder="请输入身份证号" :disabled="isView" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="2"
          placeholder="请输入备注"
          :disabled="isView"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">{{ isView ? '关 闭' : '取 消' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddMessageModule">
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { addMessageModule, updateMessageModule } from "@/api/base/common/messageModule/index.js";

const { proxy } = getCurrentInstance();
const { message_module_types } = proxy.useDict("message_module_types");

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const isView = ref(false); // 是否为查看模式

const form = reactive({
  id: undefined,
  title: "",
  name: "",
  types: 1,
  remark: "",
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看黑名单";
  return isEdit.value ? "编辑黑名单" : "新增黑名单";
});

const rules = {
  title: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: "请输入正确的手机号格式", 
      trigger: "blur" 
    }
  ]
};

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.title = "";
  form.name = "";
  form.types = 1;
  form.remark = "";

  isEdit.value = false;
  isView.value = false;
  proxy.resetForm("formRef");
}

/** 关闭弹窗 */
function handleClose() {
  reset();
}

/** 显示弹窗 - 新增模式 */
function open() {
  reset();
  dialogVisible.value = true;
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  reset();
  // 填充表单数据
  form.id = data.id;
  form.title = data.title;
  form.name = data.name;
  form.types = data.types;
  form.remark = data.remark || "";

  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  // 填充表单数据
  form.id = data.id;
  form.title = data.title;
  form.name = data.name;
  form.types = data.types;
  form.remark = data.remark || "";

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? updateMessageModule : addMessageModule;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      apiMethod(form).then(() => {
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
  openView,
});
</script>

<style scoped>
.divider {
  margin: 40px 0;
  font-weight: bold;
}
</style>

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
.message-module-dialog.el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.message-module-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>
