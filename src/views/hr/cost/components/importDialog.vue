<template>
  <el-dialog
    v-model="visible"
    title="导入人力总成本"
    width="500px"
    append-to-body
    @close="reset"
  >
    <div class="import-content">
      <div class="warning-tip">
        注意：导入将覆盖所选月份的已有数据；请谨慎操作。
      </div>
      <div class="section">
        <div class="section-label">导入月份</div>
        <div class="section-body">
          <el-date-picker
            v-model="importMonth"
            type="month"
            value-format="YYYY-MM"
            placeholder="请选择导入月份"
            :disabled-date="disableImportMonth"
            :clearable="false"
          />
        </div>
      </div>
      <el-divider />
      <div class="section">
        <div class="section-label">下载模板</div>
        <div class="section-body">
          <el-button
            type="default"
            :loading="templateLoading"
            @click="handleDownloadTemplate"
            >下载Excel模板</el-button
          >
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
      <el-button
        type="primary"
        :loading="importLoading"
        :disabled="!selectedFile || !importMonth"
        @click="handleImport"
        >确认导入</el-button
      >
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import { ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { getTemplate, importXls } from "@/api/hr/cost/index.js";
import { blobValidate } from "@/utils/ruoyi";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["success"]);
const currentMonth = dayjs().format("YYYY-MM");
const lastMonth = dayjs().subtract(1, "month").format("YYYY-MM");
const allowedMonths = [currentMonth, lastMonth];

const visible = ref(false);
const templateLoading = ref(false);
const importLoading = ref(false);
const uploadRef = ref(null);
const fileList = ref([]);
const selectedFile = ref(null);
const importMonth = ref("");

function disableImportMonth(date) {
  return !allowedMonths.includes(dayjs(date).format("YYYY-MM"));
}

function reset() {
  fileList.value = [];
  selectedFile.value = null;
  importMonth.value = "";
  uploadRef.value?.clearFiles();
}

function open() {
  reset();
  visible.value = true;
}

async function handleDownloadTemplate() {
  templateLoading.value = true;
  try {
    const res = await getTemplate();
    if (!(await blobValidate(res))) {
      proxy.$modal.msgError("下载模板失败");
      return;
    }
    saveAs(new Blob([res]), "人力总成本导入模板.xlsx");
  } catch (error) {
    console.error(error);
    proxy.$modal.msgError("下载模板失败");
  } finally {
    templateLoading.value = false;
  }
}

function handleFileChange(file) {
  selectedFile.value = file.raw;
}

function handleFileRemove() {
  selectedFile.value = null;
}

async function handleImport() {
  if (!importMonth.value) {
    proxy.$modal.msgWarning("请选择导入月份");
    return;
  }
  if (!/\.(xlsx|xls)$/i.test(selectedFile.value?.name || "")) {
    proxy.$modal.msgWarning("请上传 .xlsx 或 .xls 文件");
    return;
  }
  try {
    await ElMessageBox.confirm(
      `本次导入会覆盖 ${importMonth.value} 的已有数据，且只接受该月份数据，是否继续？`,
      "导入确认",
      {
        type: "warning",
        confirmButtonText: "继续导入",
        cancelButtonText: "取消",
      },
    );
  } catch {
    return;
  }
  importLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("file", selectedFile.value);
    formData.append("statMonth", importMonth.value);
    const res = await importXls(formData);
    proxy.$modal.msgSuccess(
      `${res.message || "导入完成"}：成功 ${res.successCount || 0} 条，失败 ${res.failCount || 0} 条`,
    );
    visible.value = false;
    emit("success");
  } catch (error) {
    console.error(error);
    proxy.$modal.msgError("导入失败");
  } finally {
    importLoading.value = false;
  }
}

defineExpose({ open });
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
.warning-tip {
  margin-bottom: 14px;
  padding: 8px 10px;
  color: #f56c6c;
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.5;
}
</style>
