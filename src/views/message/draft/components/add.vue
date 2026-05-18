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
      :rules="isView ? {} : getRules" 
      label-width="100px"
      style="margin-top:15px"
    >

      <!-- 接收人类型 -->
      <el-form-item label="接收人类型" prop="types" required>
        <el-radio-group v-model="form.types" :disabled="isView" @change="handleTypesChange">
          <el-radio :label="1">同事</el-radio>
          <el-radio :label="2">部门</el-radio>
          <el-radio :label="3">岗位</el-radio>
          <el-radio :label="4">全部</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 收件人/收件部门/收件岗位 - 根据类型动态显示 -->
      <el-form-item 
        v-if="form.types !== 4" 
        :label="receiverLabel" 
        :prop="receiverProp"
        :required="!isView && form.types !== 4"
      >
        <!-- 同事选择器 -->
        <el-select
          v-if="form.types === 1"
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
        <el-tree-select
          v-if="form.types === 2"
          v-model="form.dids"
          :data="deptOptions"
          :props="{ value: 'id', label: 'label', children: 'children' }"
          :disabled="isView"
          multiple
          check-strictly
          placeholder="请选择收件部门"
          clearable
          collapse-tags
          collapse-tags-tooltip
          style="width:100%"
        />

        <!-- 岗位选择器 -->
        <el-select
          v-if="form.types === 3"
          v-model="form.pids"
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
        v-if="form.types === 1" 
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


    </el-form>

    <template #footer>
      <div style="text-align:center">
        <el-button v-if="!isView" type="primary" @click="handleSend">立即发送</el-button>
        <el-button v-if="!isView" @click="handleSaveDraft">存草稿</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, nextTick } from "vue";
import { listUser, deptTreeSelect } from "@/api/system/user.js";
import { listPost } from "@/api/system/post.js";
import { Document } from '@element-plus/icons-vue'
import { add, update, put } from "@/api/message/draft/index.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const userOptions = ref([]);
const deptOptions = ref([]);
const postOptions = ref([]);
const uploadFiles = ref([]);

const form = reactive({
  id: undefined,
  types: 1,
  uids: [],
  dids: [],
  pids: [],
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
  switch (form.types) {
    case 1: return "收件人";
    case 2: return "收件部门";
    case 3: return "收件岗位";
    default: return "收件人";
  }
});

const receiverProp = computed(() => {
  switch (form.types) {
    case 1: return "uids";
    case 2: return "dids";
    case 3: return "pids";
    default: return "uids";
  }
});

const baseRules = {
  types: [{ required: true, message: "请选择接收人类型", trigger: "change" }],
  title: [
    { required: true, message: "请输入消息主题", trigger: "blur" },
    { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }
  ],
  content: [
    { required: true, message: "请输入消息内容", trigger: "blur" },
    { min: 1, max: 500, message: "长度在 1 到 500 个字符", trigger: "blur" }
  ]
};

const getRules = computed(() => {
  if (isView.value) return {};
  
  const rules = { ...baseRules };
  
  if (form.types !== 4) {
    if (form.types === 1) {
      rules.uids = [
        { required: true, message: "请选择收件人", trigger: "blur" }
      ];
    } else if (form.types === 2) {
      rules.dids = [
        { required: true, message: "请选择收件部门", trigger: "blur" }
      ];
    } else if (form.types === 3) {
      rules.pids = [
        { required: true, message: "请选择收件岗位", trigger: "blur" }
      ];
    }
  }
  
  return rules;
});

onMounted(() => {
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(u => u.status === "0");
  });
  
  deptTreeSelect().then(res => {
    deptOptions.value = res.data || [];
  });
  
  listPost({ pageSize: 1000 }).then(res => {
    postOptions.value = res.rows || [];
  });
});

function handleTypesChange() {
  form.uids = [];
  form.dids = [];
  form.pids = [];
  form.copyUids = [];
  
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate(['uids', 'dids', 'pids', 'copyUids']);
    }
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

function buildSubmitData() {
  const submitData = {
    types: form.types,
    title: form.title,
    content: form.content
  };
  
  if (form.types === 1) {
    submitData.uids = Array.isArray(form.uids) ? form.uids.join(",") : form.uids;
    submitData.copyUids = Array.isArray(form.copyUids) ? form.copyUids.join(",") : form.copyUids;
  } else if (form.types === 2) {
    submitData.dids = Array.isArray(form.dids) ? form.dids.join(",") : form.dids;
  } else if (form.types === 3) {
    submitData.pids = Array.isArray(form.pids) ? form.pids.join(",") : form.pids;
  }
  
  if (form.id) {
    submitData.id = form.id;
  }
  
  return submitData;
}

// 立即发送
function handleSend() {
  formRef.value.validate(valid => {
    if (!valid) return;
    
    let apiCall;
    if (form.id) {
      // 编辑发送：只传 messageId
      apiCall = put({ messageId: form.id });
    } else {
      // 新增发送：传完整数据
      const submitData = buildSubmitData();
      apiCall = add(submitData);
    }
    
    apiCall.then(() => {
      proxy.$modal.msgSuccess("发送成功");
      dialogVisible.value = false;
      emit("success");
    }).catch(error => {
      proxy.$modal.msgError(error.message || "发送失败");
    });
  });
}

// 存草稿
function handleSaveDraft() {
  formRef.value.validate(valid => {
    if (!valid) return;
    
    const submitData = buildSubmitData();
    submitData.isDraft = 2;
    
    let apiCall;
    if (form.id) {
      apiCall = update(submitData);
    } else {
      apiCall = add(submitData);
    }
    
    apiCall.then(() => {
      proxy.$modal.msgSuccess("已保存至草稿箱");
      dialogVisible.value = false;
      emit("success");
    }).catch(error => {
      proxy.$modal.msgError(error.message || "保存失败");
    });
  });
}

function reset() {
  Object.assign(form, {
    id: undefined,
    types: 1,
    uids: [],
    dids: [],
    pids: [],
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
  if (formRef.value) {
    formRef.value.clearValidate();
  }
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
  isEdit.value = true;
  Object.assign(form, {
    ...data,
    types: data.types || 1,
    uids: data.uids ? data.uids.split(',').map(item => {
      return isNaN(Number(item)) ? item : Number(item);
    }) : [],
    dids: data.dids ? data.dids.split(',').map(Number) : [],
    pids: data.pids ? data.pids.split(',').map(Number) : [],
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
    types: data.types || 1,
    uids: data.uids ? data.uids.split(',').map(item => {
      return isNaN(Number(item)) ? item : Number(item);
    }) : [],
    dids: data.dids ? data.dids.split(',').map(Number) : [],
    pids: data.pids ? data.pids.split(',').map(Number) : [],
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