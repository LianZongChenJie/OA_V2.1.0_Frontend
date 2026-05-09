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
            支持上传jpg/png/pdf/doc/docx等格式文件，单个文件不超过{{
              limitSize
            }}MB
          </div>
        </template>
      </el-upload>
    </template>

    <!-- 查看模式：仅展示文件列表 -->
    <template v-else>
      <div class="file-list-view">
        <div v-if="fileList && fileList.length > 0" class="file-items">
          <div v-for="(file, index) in fileList" :key="index" class="file-item">
            <el-icon class="file-icon"><Document /></el-icon>
            <el-link type="primary" @click="handleDownload(file)" title="点击下载">
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
import { Upload, Document } from "@element-plus/icons-vue";
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
    default: ".jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx,.zip,.rar",
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

const emit = defineEmits(["update:modelValue", "change", "downloadApi"]);

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
        name: item.fileName || item.name || "",
        ...item
      }));
    } else {
      fileList.value = [];
    }
  },
  { immediate: true },
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

// 文件下载
async function handleDownload(file) {
  emit("downloadApi", file);
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
// 上传列表样式 - 只在有文件时显示边框背景
:deep(.el-upload-list:not(:empty)) {
  margin-top: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 8px;
  background-color: #fafafa;
}

:deep(.el-upload-list) {
  .el-upload-list__item {
    margin: 0;
    margin-bottom: 6px;
    padding: 10px 12px;
    border-radius: 6px;
    background-color: #fff;
    border: 1px solid #e4e7ed;
    transition: all 0.3s ease;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      border-color: #409eff;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
    }

    // 文件图标
    .el-upload-list__item-name {
      display: flex;
      align-items: center;
      padding-left: 0;
      color: #303133;
      font-size: 14px;
      font-weight: 500;
      margin-right: 8px;

      .el-icon {
        margin-right: 8px;
        color: #409eff;
        font-size: 18px;
      }
    }

    // 状态图标（成功/失败）
    .el-icon--close {
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      color: #909399;
      font-size: 16px;
      transition: all 0.3s ease;

      &:hover {
        color: #f56c6c;
        transform: translateY(-50%) scale(1.2);
      }
    }

    // 上传进度条
    .el-progress {
      position: absolute;
      bottom: 6px;
      left: 12px;
      right: 12px;
      width: calc(100% - 24px);

      .el-progress__text {
        font-size: 12px !important;
      }

      .el-progress-bar__outer {
        background-color: #e4e7ed;
      }
    }

    // 上传成功状态
    &.is-success {
      .el-upload-list__item-status-label {
        right: 32px;
        top: 50%;
        transform: translateY(-50%);

        .el-icon-circle-check {
          color: #67c23a;
          font-size: 18px;
        }
      }
    }
  }
}

</style>
