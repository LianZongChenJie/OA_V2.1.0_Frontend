<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="40%"
    append-to-body
    class="approval-module-dialog"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="isView ? {} : rules" label-width="120px">
      <el-form-item :label="label" prop="title">
        <el-input v-model="form.title" :placeholder="`请输入${label}`" :disabled="isView" />
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

<script setup name="Addlevel">
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/base/hr/routineHr/index.js";

const props = defineProps({
  type: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// ✅ 修复：types 强制字符串
const form = reactive({
  id: undefined,
  title: "",
  types: String(props.type),
  status: 1,
});

const dialogTitle = computed(() => {
  if (isView.value) return `查看${props.label}`;
  return isEdit.value ? `编辑${props.label}` : `新增${props.label}`;
});

const rules = computed(() => ({
  title: [{ required: true, message: `请输入${props.label}`, trigger: "blur" }],
}));

function reset() {
  form.id = undefined;
  form.title = "";
  form.types = String(props.type); // ✅ 修复
  form.status = 1;

  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
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
  form.title = data.title;
  form.types = String(data.types || props.type); // ✅ 修复
  form.status = data.status;

  isEdit.value = true;
  dialogVisible.value = true;
}

function openView(data) {
  reset();
  form.id = data.id;
  form.title = data.title;
  form.types = String(data.types || props.type); // ✅ 修复
  form.status = data.status;

  isView.value = true;
  dialogVisible.value = true;
}

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? updateenterPrise : addenterPrise;
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
</style>  

<style>
.approval-module-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}
.approval-module-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>