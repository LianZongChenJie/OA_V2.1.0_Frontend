<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="message-dialog"
    @close="handleClose"
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="isView ? {} : rules" 
      label-width="100px"
      style="margin-top:15px"
    >

      <!-- 接收人类型 -->
      <el-form-item label="接收人类型" prop="type" required>
        <el-radio-group v-model="form.type" :disabled="isView" @change="handleTypeChange">
          <el-radio :label="1">同事</el-radio>
          <el-radio :label="2">部门</el-radio>
          <el-radio :label="3">岗位</el-radio>
          <el-radio :label="4">全部</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 收件人/收件部门/收件岗位 - 根据类型动态显示 -->
      <el-form-item 
        v-if="form.type !== 4" 
        :label="receiverLabel" 
        prop="uids" 
        required
      >
        <!-- 同事选择器 -->
        <el-select
          v-if="form.type === 1"
          v-model="form.uids"
          multiple
          :disabled="isView"
          placeholder="请选择收件人"
          filterable
          clearable
          collapse-tags
          collapse-tags-tooltip
          style="width:100%"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>

        <!-- 部门选择器 -->
        <DeptCascader
          v-if="form.type === 2"
          v-model="form.dids"
          :emit-path="false"
          :multiple="true"
          :readonly="isView"
          placeholder="请选择收件部门"
        />

        <!-- 岗位选择器 -->
        <el-select
          v-if="form.type === 3"
          v-model="form.uids"
          multiple
          :disabled="isView"
          placeholder="请选择收件岗位"
          filterable
          clearable
          collapse-tags
          collapse-tags-tooltip
          style="width:100%"
        >
          <el-option
            v-for="item in postOptions"
            :key="item.postId"
            :label="item.postName"
            :value="item.postId"
          />
        </el-select>
      </el-form-item>

      <!-- 抄送人 - 仅在类型为同事时显示 -->
      <el-form-item 
        v-if="form.type === 1" 
        label="抄送人" 
        prop="copyUids"
      >
        <el-select
          v-model="form.copyUids"
          multiple
          :disabled="isView"
          placeholder="请选择抄送人"
          filterable
          clearable
          collapse-tags
          collapse-tags-tooltip
          style="width:100%"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>

      <!-- 消息主题 -->
      <el-form-item label="消息主题" prop="title" required>
        <el-input 
          v-model="form.title" 
          placeholder="请输入消息主题" 
          :disabled="isView"
          maxlength="100"
          show-word-limit
          style="width:100%"
        />
      </el-form-item>

      <!-- 消息内容 -->
      <el-form-item label="消息内容" prop="content" required>
        <el-input
          v-model="form.content"
          type="textarea"
          rows="6"
          placeholder="请输入消息内容"
          :disabled="isView"
          maxlength="500"
          show-word-limit
          style="width:100%"
        />
      </el-form-item>

      <!-- 附件（可选） -->
      <el-form-item label="附件" prop="attachments">
        <el-upload
          v-if="!isView"
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          multiple
          :limit="5"
        >
          <el-button type="primary" plain>上传附件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              支持上传图片、文档、压缩包等文件，单个文件不超过10MB
            </div>
          </template>
        </el-upload>
        <div v-if="form.fileNames && form.fileNames.length" class="file-list">
          <div v-for="(file, index) in form.fileNames" :key="index" class="file-item">
            <el-icon><Document /></el-icon>
            <span>{{ file }}</span>
          </div>
        </div>
      </el-form-item>

    </el-form>

    <template #footer>
      <div style="text-align:center">
        <el-button v-if="!isView" type="primary" @click="handleSubmit(true)">立即发送</el-button>
        <el-button v-if="!isView" @click="handleSubmit(false)">存草稿</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, nextTick } from "vue";
import { listUser } from "@/api/system/user.js";
import { listPost } from "@/api/system/post.js";
import { Document } from '@element-plus/icons-vue'
import { getDetail } from "@/api/message/garbage/index.js";
import DeptCascader from "@/components/DeptCascader/index.vue";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const userOptions = ref([]);
const postOptions = ref([]);
const uploadFiles = ref([]);

const form = reactive({
  id: undefined,
  type: 1,
  uids: [],
  dids: [],
  copyUids: [],
  title: "",
  content: "",
  isDraft: 1,
  attachments: [],
  fileNames: []
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看消息";
  return isEdit.value ? "编辑消息" : "新建消息";
});

const receiverLabel = computed(() => {
  switch (form.type) {
    case 1: return "收件人";
    case 2: return "收件部门";
    case 3: return "收件岗位";
    default: return "收件人";
  }
});

const rules = {
  type: [{ required: true, message: "请选择接收人类型", trigger: "change" }],
  uids: [
    { 
      required: true, 
      message: "请选择收件人", 
      trigger: "change",
      validator: (rule, value, callback) => {
        if (form.type === 4) {
          callback();
        } else if (!value || value.length === 0) {
          callback(new Error(`请选择${receiverLabel.value}`));
        } else {
          callback();
        }
      }
    }
  ],
  title: [
    { required: true, message: "请输入消息主题", trigger: "blur" },
    { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }
  ],
  content: [
    { required: true, message: "请输入消息内容", trigger: "blur" },
    { min: 1, max: 500, message: "长度在 1 到 500 个字符", trigger: "blur" }
  ]
};

onMounted(() => {
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(u => u.status === "0");
  });
  
  listPost({ pageSize: 1000 }).then(res => {
    postOptions.value = res.rows || [];
  });
});

function handleTypeChange() {
  form.uids = [];
  form.copyUids = [];
  nextTick(() => {
    formRef.value?.clearValidate(['uids']);
  });
}

function handleFileChange(file, fileList) {
  uploadFiles.value = fileList;
  form.attachments = fileList.map(f => f.raw);
  form.fileNames = fileList.map(f => f.name);
}

function handleFileRemove(file, fileList) {
  uploadFiles.value = fileList;
  form.attachments = fileList.map(f => f.raw);
  form.fileNames = fileList.map(f => f.name);
}

// 提交表单 - 修复：根据 isEdit 状态调用不同接口
function handleSubmit(isSend = true) {
  formRef.value.validate(valid => {
    if (!valid) return;
    
    const submitData = {
      type: form.type,
      uids: Array.isArray(form.uids) ? form.uids.join(",") : form.uids,
      copyUids: Array.isArray(form.copyUids) ? form.copyUids.join(",") : form.copyUids,
      title: form.title,
      content: form.content,
      isDraft: isSend ? 1 : 2
    };
    
    // 编辑时带上 id
    if (form.id) {
      submitData.id = form.id;
    }
    
    // 根据是否编辑状态调用不同接口
    const apiCall = isEdit.value ? update(submitData) : add(submitData);
    
    apiCall.then(() => {
      const successMsg = isSend ? "发送成功" : "已保存至草稿箱";
      proxy.$modal.msgSuccess(successMsg);
      dialogVisible.value = false;
      emit("success");
    }).catch(error => {
      proxy.$modal.msgError(error.message || "操作失败");
    });
  });
}

function reset() {
  Object.assign(form, {
    id: undefined,
    type: 1,
    uids: [],
    copyUids: [],
    title: "",
    content: "",
    isDraft: 1,
    attachments: [],
    fileNames: []
  });
  uploadFiles.value = [];
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
}

function handleClose() {
  reset();
  dialogVisible.value = false;
}

function open() {
  reset();
  dialogVisible.value = true;
}

function openEdit(data) {
  reset();
  isEdit.value = true;  // 确保设置为编辑模式
  Object.assign(form, {
    ...data,
    type: data.type || 1,
    uids: data.uids ? data.uids.split(',').map(item => {
      return isNaN(Number(item)) ? item : Number(item);
    }) : [],
    copyUids: data.copyUids ? data.copyUids.split(',').map(Number) : [],
    isDraft: data.isDraft || 1,
    fileNames: data.fileNames ? (Array.isArray(data.fileNames) ? data.fileNames : data.fileNames.split(',')) : []
  });
  dialogVisible.value = true;
}

function openView(data) {
  reset();
  isView.value = true;
  Object.assign(form, {
    ...data,
    type: data.type || 1,
    uids: data.uids ? data.uids.split(',').map(item => {
      return isNaN(Number(item)) ? item : Number(item);
    }) : [],
    copyUids: data.copyUids ? data.copyUids.split(',').map(Number) : [],
    fileNames: data.fileNames ? (Array.isArray(data.fileNames) ? data.fileNames : data.fileNames.split(',')) : []
  });
  dialogVisible.value = true;
}

const emit = defineEmits(["success"]);
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
.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
.file-list {
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px;
  background: #f5f7fa;
}
.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 13px;
}
.file-item .el-icon {
  color: #409eff;
}
:deep(.el-upload__tip) {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
:deep(.el-alert) {
  padding: 8px 12px;
}
</style>