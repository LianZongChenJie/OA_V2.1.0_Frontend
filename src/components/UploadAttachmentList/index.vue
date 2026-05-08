<template>
  <div class="upload-attachment-list">
    <!-- 编辑模式：上传按钮 + 文件列表 -->
    <template v-if="!disabled">
      <el-upload
        ref="uploadRef"
        :action="uploadUrl"
        :headers="headers"
        :auto-upload="true"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-remove="handleRemove"
        :on-change="handleChange"
        :file-list="fileList"
        multiple
        :limit="limit"
        :accept="accept"
        :data="extraData"
      >
        <el-button type="primary" size="small">
          <el-icon><Upload /></el-icon>
          点击上传
        </el-button>
        <template #tip>
          <div class="el-upload__tip">
            支持上传jpg/png/pdf/doc/docx等格式文件，单个文件不超过{{ limitSize }}MB
          </div>
        </template>
      </el-upload>
      <!-- 已上传文件列表 -->
      <div v-if="fileList.length > 0" class="uploaded-list">
        <div v-for="(file, index) in fileList" :key="index" class="uploaded-item">
          <el-icon class="file-icon"><Document /></el-icon>
          <span class="file-name" :title="file.fileName">{{ file.fileName }}</span>
          <el-icon class="delete-icon" @click="handleDeleteFile(index)"><Close /></el-icon>
        </div>
      </div>
    </template>

    <!-- 查看模式：仅展示文件列表 -->
    <template v-else>
      <div class="file-list-view">
        <div v-if="fileList && fileList.length > 0" class="file-items">
          <div v-for="(file, index) in fileList" :key="index" class="file-item">
            <el-icon class="file-icon"><Document /></el-icon>
            <el-link type="primary" @click="handleDownload(file)">
              {{ file.fileName }}
            </el-link>
          </div>
        </div>
        <div v-else class="no-file">暂无附件</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, computed, getCurrentInstance } from "vue";
import { Upload, Document, Close } from "@element-plus/icons-vue";
import { getToken } from "@/utils/auth";

const props = defineProps({
  // 双向绑定附件列表
  modelValue: {
    type: Array,
    default: () => [],
  },
  // 是否禁用（查看模式）
  disabled: {
    type: Boolean,
    default: false,
  },
  // 文件数量限制
  limit: {
    type: Number,
    default: 10,
  },
  // 文件大小限制(MB)
  limitSize: {
    type: Number,
    default: 10,
  },
  // 允许的文件类型
  accept: {
    type: String,
    default: ".jpg,.jpeg,.png,.pdf,.doc,.docx",
  },
  // 上传接口地址
  action: {
    type: String,
    default: "uploadAtta",
  },
  // 额外的上传参数
  extraData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

// 获取全局实例
const { proxy } = getCurrentInstance();

// 上传地址
const uploadUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_APP_BASE_API || "";
  return baseUrl + "/" + props.action;
});

// 请求头
const headers = ref({
  Authorization: "Bearer " + getToken(),
});

// 文件列表 - 存储后端返回的完整数据
const fileList = ref([]);
const uploadRef = ref(null);

// 监听外部值变化
watch(
  () => props.modelValue,
  (val) => {
    if (val && Array.isArray(val)) {
      fileList.value = val.map((item, index) => ({
        sort: item.sort || index + 1,
        fileName: item.fileName || item.name || "",
        filePath: item.filePath || item.url || "",
        fileSize: item.fileSize || item.size || 0,
        fileExt: item.fileExt || item.ext || "",
        fileMime: item.fileMime || item.mime || "",
      }));
    } else {
      fileList.value = [];
    }
  },
  { immediate: true }
);

// 文件上传成功
function handleSuccess(response, file, fileListData) {
  if (response.code === 200 && response.data) {
    const fileData = response.data;
    // 添加排序号
    fileData.sort = fileList.value.length + 1;
    fileList.value.push(fileData);
    emitFileList(fileList.value);
    proxy.$modal.msgSuccess("上传成功");
  } else {
    proxy.$modal.msgError(response.msg || "上传失败");
  }
}

// 文件上传失败
function handleError(err, file, fileListData) {
  proxy.$modal.msgError("上传失败");
}

// 文件变化
function handleChange(file, fileListData) {
  // 不需要处理，因为上传成功时已经处理
}

// 文件删除（el-upload 组件自带的删除）
function handleRemove(file, fileListData) {
  fileList.value = fileListData.map((f) => f.response?.data || f);
  emitFileList(fileList.value);
}

// 删除已上传的文件（手动删除按钮）
function handleDeleteFile(index) {
  fileList.value.splice(index, 1);
  // 更新排序
  fileList.value.forEach((item, i) => {
    item.sort = i + 1;
  });
  emitFileList(fileList.value);
}

// 文件下载
function handleDownload(file) {
  const url = file.filePath;
  if (url) {
    window.open(url, "_blank");
  } else {
    proxy.$modal.msgWarning("文件地址不存在");
  }
}

// 发送文件列表到父组件
function emitFileList(list) {
  emit("update:modelValue", list);
  emit("change", list);
}

// 暴露方法给父组件调用
defineExpose({
  // 清空文件列表
  clearFiles: () => {
    fileList.value = [];
    uploadRef.value?.clearFiles();
  },
  // 获取当前文件列表
  getFileList: () => fileList.value,
});
</script>

<style scoped lang="scss">
.upload-attachment-list {
  width: 100%;
}

.file-list-view {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  min-height: 40px;
}

.file-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  color: #909399;
  font-size: 16px;
}

.no-file {
  color: #909399;
  font-size: 14px;
}

.el-upload__tip {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
}

.uploaded-list {
  margin-top: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 8px;
}

.uploaded-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  margin-bottom: 4px;
  background-color: #f5f7fa;
  border-radius: 4px;

  &:last-child {
    margin-bottom: 0;
  }

  .file-icon {
    margin-right: 8px;
    color: #409eff;
  }

  .file-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    color: #606266;
  }

  .delete-icon {
    margin-left: 8px;
    cursor: pointer;
    color: #909399;
    font-size: 14px;

    &:hover {
      color: #f56c6c;
    }
  }
}
</style>