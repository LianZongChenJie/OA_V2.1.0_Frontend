<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="30%"
    append-to-body
    class="approval-module-dialog"
    @close="handleClose"
  >
    <!-- 标签切换：职务 / 职级 -->
    <el-tabs v-model="activeType" class="dialog-tabs">
      <el-tab-pane label="职务" name="duty" />
      <el-tab-pane label="职级" name="level" />
    </el-tabs>

    <el-form ref="formRef" :model="form" :rules="isView ? {} : rules" label-width="120px" style="margin-top: 15px;">
      <!-- 名称 -->
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入名称" :disabled="isView" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">保 存</el-button>
        <el-button @click="dialogVisible = false">{{ isView ? '关 闭' : '取 消' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddRoutine">
import { ref, reactive, computed, getCurrentInstance, watch } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/base/hr/routine/index.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 标签切换绑定值
const activeType = ref("duty");

// 表单数据
const form = reactive({
  id: undefined,
  type: "duty", // 默认职务
  title: "",
});

// 监听标签切换，同步到 form.type
watch(activeType, (val) => {
  form.type = val;
});

// 动态标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看";
  return isEdit.value ? "编辑" : "新增";
});

// 校验规则
const rules = {
  title: [{ required: true, message: "请输入名称", trigger: "blur" }],
};

/** 重置 */
function reset() {
  form.id = undefined;
  form.type = "duty";
  form.title = "";
  activeType.value = "duty";

  isEdit.value = false;
  isView.value = false;
  proxy.resetForm("formRef");
}

/** 关闭 */
function handleClose() {
  reset();
}

/** 新增 */
function open() {
  reset();
  dialogVisible.value = true;
}

/** 编辑 */
function openEdit(data) {
  reset();
  form.id = data.id;
  form.type = data.type || "duty";
  activeType.value = form.type; // 回显标签
  form.title = data.title;
  isEdit.value = true;
  dialogVisible.value = true;
}

/** 查看 */
function openView(data) {
  reset();
  form.id = data.id;
  form.type = data.type || "duty";
  activeType.value = form.type;
  form.title = data.title;
  isView.value = true;
  dialogVisible.value = true;
}

/** 提交 */
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
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
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
