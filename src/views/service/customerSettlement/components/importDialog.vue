<template>
  <el-dialog v-model="visible" title="导入服务客户结算" width="500px" append-to-body @close="reset">
    <div class="import-content">
      <div class="section">
        <div class="section-label">下载模板</div>
        <div class="section-body">
          <el-button type="default" :loading="templateLoading" @click="handleDownloadTemplate">
            下载Excel模板
          </el-button>
          <div class="tips">请按模板表头填写数据；年度为 YYYY，月份为 1~12。</div>
        </div>
      </div>
      <el-divider />
      <div class="section">
        <div class="section-label">选择文件</div>
        <div class="section-body">
          <el-upload
            ref="uploadRef"
            action="#"
            :auto-upload="false"
            :limit="1"
            accept=".xlsx,.xls"
            :file-list="fileList"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
          >
            <el-button type="success">选择Excel文件</el-button>
          </el-upload>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button type="primary" :loading="importLoading" :disabled="!selectedFile" @click="handleImport">
        确认导入
      </el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { saveAs } from 'file-saver'
import { getTemplate, importXls } from '@/api/service/customerSettlement/index.js'
import { blobValidate } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()
const emit = defineEmits(['success'])

const visible = ref(false)
const templateLoading = ref(false)
const importLoading = ref(false)
const uploadRef = ref(null)
const fileList = ref([])
const selectedFile = ref(null)

function reset() {
  fileList.value = []
  selectedFile.value = null
  uploadRef.value?.clearFiles()
}

function open() {
  reset()
  visible.value = true
}

async function handleDownloadTemplate() {
  templateLoading.value = true
  try {
    const res = await getTemplate()
    if (!(await blobValidate(res))) {
      proxy.$modal.msgError('下载模板失败')
      return
    }
    saveAs(new Blob([res]), '服务客户结算导入模板.xlsx')
  } catch (error) {
    console.error(error)
    proxy.$modal.msgError('下载模板失败')
  } finally {
    templateLoading.value = false
  }
}

function handleFileChange(file) {
  selectedFile.value = file.raw
}

function handleFileRemove() {
  selectedFile.value = null
}

async function handleImport() {
  const name = selectedFile.value?.name || ''
  if (!/\.(xlsx|xls)$/i.test(name)) {
    proxy.$modal.msgWarning('请上传 .xlsx 或 .xls 文件')
    return
  }
  importLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    const res = await importXls(formData)
    proxy.$modal.msgSuccess(`导入完成：成功 ${res.successCount || 0} 条，失败 ${res.failCount || 0} 条`)
    visible.value = false
    emit('success')
  } catch (error) {
    console.error(error)
    proxy.$modal.msgError('导入失败')
  } finally {
    importLoading.value = false
  }
}

defineExpose({ open })
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
</style>
