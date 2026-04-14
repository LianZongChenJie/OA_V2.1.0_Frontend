<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="notice-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="100px"
    >
      <!-- 第一行：新闻标题 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="新闻标题" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入新闻标题"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：排序 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="form.sort"
              :min="0"
              :disabled="isView"
              controls-position="right"
              style="width: 100%"
              placeholder="请输入排序"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：新闻内容（独占一行） -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="新闻内容" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="8"
              placeholder="请输入新闻内容"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">
          确 定
        </el-button>
        <el-button @click="dialogVisible = false">
          {{ isView ? "关 闭" : "取 消" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddNotice">
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { add, edit } from "@/api/administration/news";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const form = reactive({
  id: undefined,
  title: "",
  sort: 1,
  content: "",
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看新闻";
  return isEdit.value ? "编辑新闻" : "新增新闻";
});

const rules = {
  title: [{ required: true, message: "请输入新闻标题", trigger: "blur" }],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
  content: [{ required: true, message: "请输入新闻内容", trigger: "blur" }],
};

function reset() {
  form.id = undefined;
  form.title = "";
  form.sort = 1;
  form.content = "";
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
  form.title = data.title || "";
  form.sort = data.sort || 1;
  form.content = data.content || "";
  isEdit.value = true;
  dialogVisible.value = true;
}

function openView(data) {
  reset();
  form.id = data.id;
  form.title = data.title || "";
  form.sort = data.sort || 1;
  form.content = data.content || "";
  isView.value = true;
  dialogVisible.value = true;
}

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? edit : add;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";
      apiMethod({ ...form }).then(() => {
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

<style>
.notice-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.notice-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>
