<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="car-dialog"
    @close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="isView ? {} : rules" 
      label-width="110px"
      style="margin-top: 15px"
      :key="dialogVisible"
    >
      <!-- 第一行：文件名称 + 关联项目 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="文件名称" prop="title" required label-suffix="：">
            <el-input 
              v-model="form.title" 
              placeholder="请输入文件名称" 
              :disabled="isView" 
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联项目" prop="projectId" required label-suffix="：">
            <el-select
              v-model="form.projectId"
              :disabled="isView"
              placeholder="请选择项目"
              filterable
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- 附件上传 -->
      <el-form-item label="相关附件" label-suffix="：">
        <el-upload
          :action="uploadUrl"
          :file-list="attachFileList"
          :on-success="handleAttachUploadSuccess"
          :before-upload="beforeUpload"
          :disabled="isView"
          multiple
        >
          <el-button type="primary" icon="Plus">上传附件</el-button>
        </el-upload>
      </el-form-item>

      <!-- 文件内容 -->
      <el-form-item label="文件内容" prop="content" required label-suffix="：">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          placeholder="请输入文件内容"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div style="text-align: center">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">立即提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { addenterPrise, updateenterPrise } from "@/api/project/document/index.js";
import { getPageList } from "@/api/project/itemList/index.js";

const { proxy } = getCurrentInstance();

// 弹窗状态
const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 数据列表
const projectList = ref([]);
const attachFileList = ref([]); 

// 上传地址
const uploadUrl = import.meta.env.VITE_APP_BASE_API + "/common/upload";

// 精简表单
const form = reactive({
  id: undefined,
  title: "",        
  projectId: "",   
  content: "",     
  fileIds: ""      
});

// 加载项目列表
async function loadProjectList() {
  try {
    const res = await getPageList({ pageSize: 1000 });
    projectList.value = res.rows || [];
  } catch (err) {
    console.error("加载项目失败:", err);
  }
}

// 上传前校验
function beforeUpload(file) {
  const isLt = file.size / 1024 / 1024 < 50;
  if (!isLt) {
    ElMessage.error("文件大小不能超过 50MB");
  }
  return isLt;
}

// 附件上传成功
function handleAttachUploadSuccess(res) {
  if (res.code !== 200) {
    ElMessage.error("上传失败");
    return;
  }
  ElMessage.success("上传成功");
  // 同步附件ID
  const ids = attachFileList.value.map(i => i.response?.data).filter(Boolean);
  form.fileIds = ids.join(",");
}

// 标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看文档";
  return isEdit.value ? "编辑文档" : "新增文档";
});

// 精简校验规则
const rules = {
  title: [{ required: true, message: "请输入文件名称", trigger: "blur" }],
  projectId: [{ required: true, message: "请选择关联项目", trigger: "change" }],
  content: [{ required: true, message: "请输入文件内容", trigger: "blur" }]
};

// 提交
function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return;

    const data = {
      id: form.id || undefined,
      title: form.title,
      projectId: form.projectId,
      content: form.content,
      fileIds: form.fileIds
    };

    const api = isEdit.value ? updateenterPrise : addenterPrise;
    api(data).then(() => {
      ElMessage.success("操作成功");
      handleClose();
      emit("success");
    }).catch(err => {
      console.error("提交失败", err);
    });
  });
}

// 重置
function resetForm() {
  Object.assign(form, {
    id: undefined,
    title: "",
    projectId: "",
    content: "",
    fileIds: ""
  });
  attachFileList.value = [];
  nextTick(() => formRef.value?.clearValidate());
  isEdit.value = false;
  isView.value = false;
}

// 关闭
function handleClose() {
  resetForm();
  dialogVisible.value = false;
}

// 打开
function open() {
  resetForm();
  loadProjectList();
  dialogVisible.value = true;
}

// 编辑
function openEdit(data) {
  resetForm();
  loadProjectList();
  Object.assign(form, data);
  isEdit.value = true;
  dialogVisible.value = true;
}

// 查看
function openView(data) {
  resetForm();
  loadProjectList();
  Object.assign(form, data);
  isView.value = true;
  dialogVisible.value = true;
}

onMounted(() => {
  loadProjectList();
});

const emit = defineEmits(["success"]);
defineExpose({ open, openEdit, openView });
</script>

<style>
.car-dialog.el-dialog {
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}
.car-dialog .el-dialog__body {
  overflow-y: auto;
}
.car-dialog .el-form-item__label {
  white-space: nowrap !important;
}
</style>