<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="message-dialog"
    @close="handleClose"
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      label-width="100px"
      style="margin-top:15px"
    >

      <!-- 消息类型 -->
      <el-form-item label="消息类型" prop="typesStr">
        <el-input 
          v-model="form.typesStr" 
          disabled
          style="width:100%"
        />
      </el-form-item>

      <!-- 发件人 -->
      <el-form-item label="发件人" prop="fromName">
        <el-input 
          v-model="form.fromName" 
          disabled
          style="width:100%"
        />
      </el-form-item>

      <!-- 消息主题 -->
      <el-form-item label="消息主题" prop="title">
        <el-input 
          v-model="form.title" 
          type="textarea"
          rows="3"
          disabled
          style="width:100%"
        />
      </el-form-item>

      <!-- 发件时间 -->
      <el-form-item label="发件时间" prop="createTime">
        <el-input 
          v-model="form.createTime" 
          disabled
          style="width:100%"
        />
      </el-form-item>

    </el-form>

    <template #footer>
      <div style="text-align:center">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);

const form = reactive({
  typesStr: "",      // 消息类型（系统消息/用户消息）
  fromName: "",      // 发件人
  title: "",         // 消息主题
  createTime: ""     // 发件时间
});

const dialogTitle = computed(() => "查看消息");

function reset() {
  Object.assign(form, {
    typesStr: "",
    fromName: "",
    title: "",
    createTime: ""
  });
}

function handleClose() {
  reset();
  dialogVisible.value = false;
}

// 查看消息
function openView(data) {
  reset();
  
  // 设置四个字段的值
  form.typesStr = data.fromUid === 0 ? '系统消息' : '用户消息';
  form.fromName = data.fromName || (data.fromUid === 0 ? '系统' : '');
  form.title = data.title || '';
  form.createTime = data.createTime || '';
  
  dialogVisible.value = true;
}

// 收件箱不需要编辑和新增
function open() {
  console.warn("收件箱不支持新增消息");
}

function openEdit(data) {
  openView(data);
}

defineExpose({ open, openEdit, openView });
</script>

<style scoped>
.message-dialog.el-dialog {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.message-dialog .el-dialog__body {
  overflow-y: auto;
  max-height: calc(90vh - 120px);
}
:deep(.el-textarea__inner) {
  min-height: 80px;
}
</style>