<template>
  <el-dialog
    title="Excel导入"
    v-model="dialogVisible"
    width="500px"
    append-to-body
    @close="handleClose"
  >
    <div class="import-content">
      <!-- 下载模板区域 -->
      <div class="section">
        <div class="section-label">下载模板</div>
        <div class="section-body">
          <el-button
            type="default"
            :icon="Download"
            @click="handleDownloadTemplate"
            :loading="downloadLoading"
          >
            下载Excel模板
          </el-button>
          <div class="tips">请先下载模板，按照模板格式填写数据后再导入</div>
        </div>
      </div>

      <el-divider />

      <!-- 选择文件区域 -->
      <div class="section">
        <div class="section-label">选择文件</div>
        <div class="section-body">
          <el-upload
            ref="uploadRef"
            class="upload-excel"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :limit="1"
            accept=".xlsx,.xls"
            :file-list="fileList"
          >
            <el-button type="success" :icon="UploadFilled">
              选择Excel文件
            </el-button>
          </el-upload>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleImport" :loading="importLoading" :disabled="!selectedFile">
          确认导入
        </el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="ImportDialog">
import { ref } from "vue";
import { Download, UploadFilled } from "@element-plus/icons-vue";
import { getCurrentInstance } from "vue";
import axios from 'axios'
import { saveAs } from 'file-saver'
import { getToken } from '@/utils/auth'
import { blobValidate } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance();

const props = defineProps({
  // 下载模板接口URL
  downloadTemplateUrl: {
    type: String,
    required: true,
  },
  // 下载模板接口参数
  downloadTemplateParams: {
    type: Object,
    default: () => ({}),
  },
  // 上传Excel接口
  uploadExcelApi: {
    type: Function,
    required: true,
  },
  // 上传Excel接口参数
  uploadExcelParams: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["success"]);

const dialogVisible = ref(false);
const downloadLoading = ref(false);
const importLoading = ref(false);
const uploadRef = ref(null);
const fileList = ref([]);
const selectedFile = ref(null);

const baseURL = import.meta.env.VITE_APP_BASE_API

/** 打开弹窗 */
function open() {
  dialogVisible.value = true;
  reset();
}

/** 关闭弹窗 */
function handleClose() {
  reset();
}

/** 重置状态 */
function reset() {
  fileList.value = [];
  selectedFile.value = null;
  uploadRef.value?.clearFiles();
}

/** 下载模板 */
async function handleDownloadTemplate() {
  downloadLoading.value = true;
  try {
    const url = baseURL + props.downloadTemplateUrl;
    const res = await axios({
      method: 'get',
      url: url,
      params: props.downloadTemplateParams,
      responseType: 'blob',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const isBlob = blobValidate(res.data);
    if (isBlob) {
      const blob = new Blob([res.data]);
      saveAs(blob, decodeURIComponent(res.headers['download-filename'] || '导入模板.xlsx'));
    } else {
      const resText = await res.data.text();
      const rspObj = JSON.parse(resText);
      proxy.$modal.msgError(rspObj.msg || '下载模板失败');
    }
  } catch (error) {
    console.error("下载模板失败", error);
    proxy.$modal.msgError('下载模板失败');
  } finally {
    downloadLoading.value = false;
  }
}

/** 文件选择变化 */
function handleFileChange(file) {
  selectedFile.value = file.raw;
}

/** 文件移除 */
function handleFileRemove() {
  selectedFile.value = null;
}

/** 确认导入 */
async function handleImport() {
  if (!selectedFile.value) {
    proxy.$modal.msgWarning("请选择Excel文件");
    return;
  }

  // 检查文件类型
  const fileName = selectedFile.value.name;
  const fileExt = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
  if (![".xlsx", ".xls"].includes(fileExt)) {
    proxy.$modal.msgWarning("请上传Excel文件(.xlsx或.xls格式)");
    return;
  }

  importLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    // 添加额外参数
    Object.keys(props.uploadExcelParams).forEach((key) => {
      formData.append(key, props.uploadExcelParams[key]);
    });

    const res = await props.uploadExcelApi(formData);
    if (res.code === 200) {
      proxy.$modal.msgSuccess("导入成功");
      dialogVisible.value = false;
      emit("success");
    } else {
      proxy.$modal.msgError(res.msg || "导入失败");
    }
  } catch (error) {
    console.error("导入失败", error);
    proxy.$modal.msgError("导入失败");
  } finally {
    importLoading.value = false;
  }
}

defineExpose({
  open,
});
</script>

<style scoped>
.import-content {
  padding: 10px 20px;
}

.section {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.section-label {
  width: 80px;
  color: #606266;
  font-size: 14px;
  line-height: 32px;
  flex-shrink: 0;
}

.section-body {
  flex: 1;
}

.tips {
  margin-top: 8px;
  color: #909399;
  font-size: 13px;
}

.upload-excel {
  display: inline-block;
}

:deep(.el-divider) {
  margin: 20px 0;
}
</style>
