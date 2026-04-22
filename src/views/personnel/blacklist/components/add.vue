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
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" :disabled="isView" />
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" :disabled="isView" />
      </el-form-item>

      <el-form-item label="身份证号" prop="idcard">
        <el-input v-model="form.idcard" placeholder="请输入身份证号" :disabled="isView" />
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

<script setup idcard="AddMessageModule">
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { addDeptChange, updateDeptChange } from "@/api/personnel/blacklist/index.js";

const { proxy } = getCurrentInstance();
const { message_module_types } = proxy.useDict("message_module_types");

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const form = reactive({
  id: undefined,
  name: "",
  mobile: "",
  idcard: "",
  types: 1,
  remark: "",
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看黑名单";
  return isEdit.value ? "编辑黑名单" : "新增黑名单";
});

const rules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: "请输入正确的手机号格式", 
      trigger: "blur" 
    }
  ]
};

function reset() {
  form.id = undefined;
  form.name = "";
  form.mobile = "";
  form.idcard = "";
  form.types = 1;
  form.remark = "";

  isEdit.value = false;
  isView.value = false;
  proxy.resetForm("formRef");
}

function handleClose() {
  reset();
}

function open() {
  reset();
  dialogVisible.value = true;
}

function openEdit(data) {
  reset();
  form.id = data.id;
  form.name = data.name;
  form.mobile = data.mobile;
  form.idcard = data.idcard;
  form.types = data.types;
  form.remark = data.remark || "";

  isEdit.value = true;
  dialogVisible.value = true;
}

function openView(data) {
  reset();
  form.id = data.id;
  form.name = data.name;
  form.mobile = data.mobile;
  form.idcard = data.idcard;
  form.types = data.types;
  form.remark = data.remark || "";

  isView.value = true;
  dialogVisible.value = true;
}

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? updateDeptChange : addDeptChange;
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