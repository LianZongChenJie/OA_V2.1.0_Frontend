<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form
        :model="queryParams"
        ref="queryRef"
        :inline="true"
        v-show="showSearch"
        class="search-form"
    >
      <el-form-item label="招标项目" prop="tenderName">
        <el-input
            v-model="queryParams.tenderName"
            placeholder="项目名称关键词"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="招标编号" prop="tenderCode">
        <el-input
            v-model="queryParams.tenderCode"
            placeholder="招标编号"
            clearable
            style="width: 180px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="招标单位" prop="companyName">
        <el-input
            v-model="queryParams.companyName"
            placeholder="招标单位名称"
            clearable
            style="width: 180px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作区域 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Upload"
            @click="handleUpload"
        >
          上传招标文件
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 列表 -->
    <el-table
        v-loading="loading"
        :data="tenderList"
        @selection-change="handleSelectionChange"
        size="small"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="招标项目" prop="tenderName" min-width="220" show-overflow-tooltip />
      <el-table-column label="招标编号" prop="tenderCode" width="160" />
      <el-table-column label="招标单位" prop="companyName" width="180" show-overflow-tooltip />
      <el-table-column label="状态" prop="status" width="100" align="center">
        <template #default="scope">
          <el-tag :type="statusTagType(scope.row.status)" size="small">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="总页数" prop="totalPages" width="80" align="center" />
      <el-table-column label="创建时间" width="160" align="center">
        <template #default="scope">
          <span>{{ proxy.parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="primary"
              link
              icon="View"
              @click="handleView(scope.row)"
          >详情</el-button>
          <el-button
              type="success"
              link
              icon="Connection"
              @click="handleMatch(scope.row)"
          >匹配</el-button>
          <el-button
              type="warning"
              link
              icon="Document"
              @click="handleGenerate(scope.row)"
              :disabled="scope.row.status !== 2"
          >生成</el-button>
          <el-button
              type="danger"
              link
              icon="Delete"
              @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 上传弹窗 -->
    <el-dialog v-model="uploadDialog" title="上传招标文件" width="500px" append-to-body :close-on-click-modal="false">
      <el-upload
          ref="uploadRef"
          drag
          v-model:file-list="fileList"
          :limit="1"
          :auto-upload="false"
          :on-exceed="handleExceed"
          accept=".pdf,.docx,.doc,.txt"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将招标文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 PDF / Word / TXT 格式，文件不超过 50MB
          </div>
        </template>
      </el-upload>

      <!-- 上传进度 -->
      <el-progress
          v-if="uploadProgress > 0"
          :percentage="uploadProgress"
          :status="uploadProgress === 100 ? 'success' : ''"
          style="margin-top: 15px"
      />
      <!-- 解析进度 -->
      <el-progress
          v-if="parseProgress > 0 && uploadProgress === 100"
          :percentage="parseProgress"
          :status="parseProgress === 100 ? 'success' : ''"
          :indeterminate="parseProgress < 100"
          style="margin-top: 10px"
      />
      <div v-if="parseProgress > 0 && parseProgress < 100" style="text-align: center; color: #909399; margin-top: 5px; font-size: 12px;">
        AI 正在分析招标文件，请耐心等待...
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitUpload" :loading="uploading">
            确 定
          </el-button>
          <el-button @click="uploadDialog = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailDialog" title="招标文件详情" width="900px" top="5vh">
      <el-tabs v-model="detailTab">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="info">
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="招标项目">{{ detailData.tender?.tenderName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="招标编号">{{ detailData.tender?.tenderCode || '-' }}</el-descriptions-item>
            <el-descriptions-item label="招标单位">{{ detailData.tender?.companyName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="总页数">{{ detailData.tender?.totalPages || 0 }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="statusTagType(detailData.tender?.status)" size="small">
                {{ statusText(detailData.tender?.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ proxy.parseTime(detailData.tender?.createTime) || '-' }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <!-- 人员配置要求 -->
        <el-tab-pane :label="`人员要求 (${detailData.requirements?.length || 0})`" name="requirements">
          <el-table :data="detailData.requirements || []" size="small" border>
            <el-table-column label="类型" prop="requirementType" width="80" align="center">
              <template #default="scope">
                <el-tag size="small" :type="reqTypeTag(scope.row.requirementType)">{{ scope.row.requirementType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="要求项" prop="requirementKey" width="120" />
            <el-table-column label="运算符" prop="operator" width="80" align="center" />
            <el-table-column label="要求值" prop="requirementValue" min-width="200" show-overflow-tooltip />
            <el-table-column label="权重" prop="scoreWeight" width="80" align="center">
              <template #default="scope">
                <el-text type="warning" tag="b">{{ scope.row.scoreWeight }}分</el-text>
              </template>
            </el-table-column>
            <el-table-column label="描述" prop="description" min-width="200" show-overflow-tooltip />
          </el-table>
        </el-tab-pane>

        <!-- 匹配结果 -->
        <el-tab-pane :label="`匹配结果 (${matchResult.matchList?.length || 0})`" name="match">
          <div style="margin-bottom: 10px;">
            <el-button type="primary" size="small" @click="refreshMatchResult" :loading="matchLoading">
              刷新匹配结果
            </el-button>
            <el-button type="success" size="small" @click="reMatch" :loading="matchLoading">
              重新匹配
            </el-button>
            <span style="margin-left: 10px; color: #909399; font-size: 12px;">
              已选 {{ selectedCount }} 人
            </span>
          </div>
          <el-table :data="matchResult.matchList || []" size="small" border>
            <el-table-column label="排序" prop="sortOrder" width="60" align="center" />
            <el-table-column label="姓名" prop="resumeName" width="80" />
            <el-table-column label="性别" prop="resumeGender" width="60" align="center" />
            <el-table-column label="年龄" prop="resumeAge" width="60" align="center" />
            <el-table-column label="学历" prop="resumeEducation" width="70" align="center" />
            <el-table-column label="工作年限" prop="resumeWorkYears" width="80" align="center">
              <template #default="scope">{{ scope.row.resumeWorkYears }}年</template>
            </el-table-column>
            <el-table-column label="当前公司" prop="resumeCurrentCompany" width="150" show-overflow-tooltip />
            <el-table-column label="当前职位" prop="resumeCurrentPosition" width="120" show-overflow-tooltip />
            <el-table-column label="匹配得分" prop="matchScore" width="90" align="center">
              <template #default="scope">
                <el-text :type="scope.row.matchScore >= 50 ? 'success' : 'info'" tag="b">
                  {{ scope.row.matchScore }}分
                </el-text>
              </template>
            </el-table-column>
            <el-table-column label="匹配原因" prop="matchReason" min-width="200" show-overflow-tooltip />
            <el-table-column label="操作" width="80" align="center">
              <template #default="scope">
                <el-button
                    :type="scope.row.isSelected ? 'success' : 'info'"
                    size="small"
                    link
                    @click="toggleSelect(scope.row)"
                >
                  {{ scope.row.isSelected ? '取消' : '选择' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import {
  listTenderDocument,
  uploadTenderDocument,
  getTenderDetail,
  getTenderRequirements,
  matchPersonnel,
  getMatchResult,
  selectPersonnel,
  generateBidFile,
  downloadBidFile,
  delTenderDocument,
} from '@/api/ai/tender'

const { proxy } = getCurrentInstance()

// 列表数据
const loading = ref(false)
const tenderList = ref([])
const total = ref(0)
const showSearch = ref(true)
const selectedIds = ref([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  tenderName: '',
  tenderCode: '',
  companyName: '',
})

// 上传相关
const uploadDialog = ref(false)
const uploadRef = ref(null)
const uploadProgress = ref(0)
const parseProgress = ref(0)
const uploading = ref(false)
const fileList = ref([])  // 绑定 el-upload 的 v-model:file-list
let parseTimer = null

// 详情相关
const detailDialog = ref(false)
const detailTab = ref('info')
const detailData = reactive({
  tender: {},
  requirements: [],
})
const matchResult = reactive({
  matchList: [],
})
const matchLoading = ref(false)
const selectedCount = ref(0)
const currentTenderId = ref(0)

// 状态映射
const statusText = (status) => {
  const map = { 0: '已解析', 1: '匹配中', 2: '已完成' }
  return map[status] || '未知'
}
const statusTagType = (status) => {
  const map = { 0: 'info', 1: 'warning', 2: 'success' }
  return map[status] || 'info'
}
const reqTypeTag = (type) => {
  const map = { '学历': '', '工作': 'success', '技能': 'warning', '证书': 'danger', '业绩': 'info' }
  return map[type] || ''
}

// 获取列表
function getList() {
  loading.value = true
  listTenderDocument(queryParams).then(res => {
    console.log('招标文件列表接口返回:', res)
    tenderList.value = res.rows || []
    total.value = res.total || 0
    console.log('列表数据条数:', tenderList.value.length)
  }).finally(() => {
    loading.value = false
  })
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

function handleSelectionChange(selection) {
  selectedIds.value = selection.map(item => item.id)
}

// 上传
function handleUpload() {
  uploadProgress.value = 0
  parseProgress.value = 0
  uploading.value = false
  uploadDialog.value = true
  // 清空文件列表（v-model 绑定方式）
  fileList.value = []
}

function handleExceed() {
  proxy.$modal.msgWarning('只能上传一个文件，请先移除已选文件')
}

function submitUpload() {
  // 使用 v-model 绑定的 fileList，而非 uploadRef.value.uploadFiles
  if (!fileList.value || fileList.value.length === 0) {
    proxy.$modal.msgWarning('请先选择招标文件')
    return
  }

  const file = fileList.value[0].raw
  const formData = new FormData()
  formData.append('file', file)

  uploading.value = true
  uploadProgress.value = 0
  parseProgress.value = 0

  uploadTenderDocument(formData, (progressEvent) => {
    if (progressEvent.total) {
      uploadProgress.value = Math.round((progressEvent.loaded / progressEvent.total) * 100)
    }
  }).then(res => {
    uploadProgress.value = 100
    // 模拟解析进度
    parseProgress.value = 10
    parseTimer = setInterval(() => {
      if (parseProgress.value < 90) {
        parseProgress.value += Math.random() * 15
      }
    }, 500)

    // 实际后端已经返回结果，直接处理
    clearInterval(parseTimer)
    parseProgress.value = 100
    uploading.value = false
    uploadDialog.value = false

    proxy.$modal.msgSuccess(res.msg || '上传解析成功')
    getList()
  }).catch(err => {
    uploading.value = false
    clearInterval(parseTimer)
    proxy.$modal.msgError('上传失败: ' + (err.msg || err.message || '未知错误'))
  })
}

// 详情
function handleView(row) {
  currentTenderId.value = row.id
  detailTab.value = 'info'
  detailDialog.value = true
  loadDetail(row.id)
}

function loadDetail(tenderId) {
  getTenderDetail(tenderId).then(res => {
    if (res.data) {
      detailData.tender = res.data.tender
      detailData.requirements = res.data.requirements || []
    }
  })
  // 同时加载匹配结果
  loadMatchResult(tenderId)
}

// 匹配
function handleMatch(row) {
  proxy.$modal.confirm(`确认对"${row.tenderName}"执行人员匹配吗？这将根据招标要求从简历库筛选推荐人员。`).then(() => {
    matchLoading.value = true
    matchPersonnel(row.id).then(res => {
      proxy.$modal.msgSuccess('匹配完成')
      // 打开详情查看结果
      currentTenderId.value = row.id
      detailDialog.value = true
      detailTab.value = 'match'
      loadDetail(row.id)
      getList()
    }).catch(err => {
      proxy.$modal.msgError('匹配失败: ' + (err.msg || err.message || ''))
    }).finally(() => {
      matchLoading.value = false
    })
  }).catch(() => {})
}

function reMatch() {
  if (!currentTenderId.value) return
  handleMatch({ id: currentTenderId.value, tenderName: detailData.tender?.tenderName || '' })
}

function loadMatchResult(tenderId) {
  matchLoading.value = true
  getMatchResult(tenderId).then(res => {
    if (res.data) {
      matchResult.matchList = res.data.matchList || []
      selectedCount.value = res.data.selectedCount || 0
    }
  }).finally(() => {
    matchLoading.value = false
  })
}

function refreshMatchResult() {
  if (currentTenderId.value) {
    loadMatchResult(currentTenderId.value)
  }
}

// 选择/取消人员
function toggleSelect(row) {
  const newStatus = row.isSelected ? 0 : 1
  selectPersonnel({
    mappingId: row.id,
    isSelected: newStatus,
  }).then(res => {
    row.isSelected = newStatus
    selectedCount.value += newStatus ? 1 : -1
    proxy.$modal.msgSuccess(res.msg || '操作成功')
  }).catch(err => {
    proxy.$modal.msgError('操作失败: ' + (err.msg || err.message || ''))
  })
}

// 生成投标文件
function handleGenerate(row) {
  proxy.$modal.confirm(`确认根据已选中人员生成投标文件吗？`).then(() => {
    const loadingInstance = proxy.$loading({ text: '正在生成投标文件...' })
    generateBidFile({ tenderId: row.id, outputFormat: 'docx' }).then(res => {
      loadingInstance.close()
      proxy.$modal.msgSuccess('投标文件生成成功')
      // 触发下载
      downloadBidFile(row.id).then(blob => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = res.data?.fileName || '投标文件.docx'
        link.click()
        window.URL.revokeObjectURL(url)
      })
    }).catch(err => {
      loadingInstance.close()
      proxy.$modal.msgError('生成失败: ' + (err.msg || err.message || ''))
    })
  }).catch(() => {})
}

// 删除
function handleDelete(row) {
  proxy.$modal.confirm(`确认删除"${row.tenderName}"吗？关联的匹配数据将一并删除。`).then(() => {
    delTenderDocument(row.id).then(res => {
      proxy.$modal.msgSuccess('删除成功')
      getList()
    }).catch(err => {
      proxy.$modal.msgError('删除失败: ' + (err.msg || err.message || ''))
    })
  }).catch(() => {})
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
}
.mb8 {
  margin-bottom: 8px;
}
</style>
