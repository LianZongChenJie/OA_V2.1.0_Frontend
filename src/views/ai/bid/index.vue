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
      <el-form-item label="投标项目" prop="bidName">
        <el-input
            v-model="queryParams.bidName"
            placeholder="项目名称关键词"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目编号" prop="bidCode">
        <el-input
            v-model="queryParams.bidCode"
            placeholder="项目编号"
            clearable
            style="width: 180px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="投标公司" prop="companyName">
        <el-input
            v-model="queryParams.companyName"
            placeholder="投标公司名称"
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
          上传投标文件
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 列表 -->
    <el-table
        v-loading="loading"
        :data="bidList"
        @selection-change="handleSelectionChange"
        size="small"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="投标项目" prop="bidName" min-width="180" show-overflow-tooltip />
      <el-table-column label="项目编号" prop="bidCode" width="140" />
      <el-table-column label="投标公司" prop="companyName" width="160" show-overflow-tooltip />
      <el-table-column label="解析进度" width="180" align="center">
        <template #default="scope">
          <div v-if="scope.row.status === 0">
            <el-progress
                :percentage="scope.row.parseProgress || 0"
                :stroke-width="8"
                :status="(scope.row.parseProgress || 0) >= 100 ? 'success' : ''"
                style="width: 140px; display: inline-block;"
            />
            <div style="font-size: 12px; color: #909399; margin-top: 2px;">
              {{ scope.row.parseMessage || '解析中...' }}
            </div>
          </div>
          <div v-else-if="scope.row.status === 2">
            <el-tag type="danger" size="small">解析失败</el-tag>
          </div>
          <div v-else>
            <el-tag type="success" size="small">已完成</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="简历数量" prop="resumeCount" width="80" align="center">
        <template #default="scope">
          <el-tag type="success" size="small">{{ scope.row.resumeCount || 0 }} 人</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="总页数" prop="totalPages" width="70" align="center" />
      <el-table-column label="创建时间" width="150" align="center">
        <template #default="scope">
          <span>{{ proxy.parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="primary"
              link
              icon="View"
              @click="handleView(scope.row)"
          >
            查看
          </el-button>
          <el-button
              type="danger"
              link
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['bid-kb:remove']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 上传投标文件弹窗 -->
    <el-dialog
        title="上传投标文件"
        v-model="upload.open"
        width="500px"
        append-to-body
        :close-on-click-modal="false"
    >
      <el-upload
          ref="uploadRef"
          drag
          :action="uploadAction"
          :headers="uploadHeaders"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :before-upload="beforeUpload"
          :limit="1"
          :auto-upload="false"
          v-model:file-list="upload.fileList"
          accept=".pdf"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将投标文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            仅支持 PDF 格式，系统将自动拆分简历并解析入库
          </div>
        </template>
      </el-upload>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitUpload" :loading="upload.loading">
            确 定
          </el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 投标文件详情弹窗（含简历列表） -->
    <el-dialog
        :title="'投标文件详情 - ' + detail.bidName"
        v-model="detail.open"
        width="1100px"
        append-to-body
        :close-on-click-modal="false"
    >
      <!-- 投标文件基本信息 -->
      <el-card class="box-card" style="margin-bottom: 16px;">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="投标项目">{{ detail.bid?.bidName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="项目编号">{{ detail.bid?.bidCode || '-' }}</el-descriptions-item>
          <el-descriptions-item label="投标公司">{{ detail.bid?.companyName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="原始文件">{{ detail.bid?.fileName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="总页数">{{ detail.bid?.totalPages || 0 }} 页</el-descriptions-item>
          <el-descriptions-item label="简历数量">
            <el-tag type="success">{{ detail.bid?.resumeCount || 0 }} 人</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 关联简历列表 -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>人员简历列表（{{ detail.resumeList?.length || 0 }} 人）</span>
          </div>
        </template>
        <el-table
            :data="detail.resumeList"
            size="small"
            :max-height="400"
        >
          <el-table-column label="姓名" prop="name" width="100" />
          <el-table-column label="性别" prop="gender" width="60" align="center" />
          <el-table-column label="年龄" prop="age" width="70" align="center" />
          <el-table-column label="学历" prop="education" width="80" align="center" />
          <el-table-column label="专业" prop="major" width="140" show-overflow-tooltip />
          <el-table-column label="毕业院校" prop="school" width="180" show-overflow-tooltip />
          <el-table-column label="当前公司" prop="currentCompany" width="180" show-overflow-tooltip />
          <el-table-column label="当前职位" prop="currentPosition" width="140" show-overflow-tooltip />
          <el-table-column label="工作年限" prop="workYears" width="90" align="center" />
          <el-table-column label="技能标签" min-width="200">
            <template #default="scope">
              <div :title="parseSkills(scope.row.technicalSkills).join('、')" class="tag-cell-wrapper">
                <el-tag
                    v-for="(skill, index) in parseSkills(scope.row.technicalSkills)"
                    :key="index"
                    size="small"
                    class="skill-tag"
                >
                  {{ skill }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template #default="scope">
              <el-button
                  type="primary"
                  link
                  icon="View"
                  @click="handleViewResume(scope.row)"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>

    <!-- 单份简历详情弹窗 -->
    <el-dialog
        title="简历详情"
        v-model="resumeDetail.open"
        width="800px"
        append-to-body
        :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border v-if="resumeDetail.data">
        <el-descriptions-item label="姓名">{{ resumeDetail.data.name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ resumeDetail.data.gender || '-' }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ resumeDetail.data.age || '-' }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">{{ resumeDetail.data.birthDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="学历">{{ resumeDetail.data.education || '-' }}</el-descriptions-item>
        <el-descriptions-item label="专业">{{ resumeDetail.data.major || '-' }}</el-descriptions-item>
        <el-descriptions-item label="毕业院校">{{ resumeDetail.data.school || '-' }}</el-descriptions-item>
        <el-descriptions-item label="毕业时间">{{ resumeDetail.data.graduationDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="学位">{{ resumeDetail.data.degree || '-' }}</el-descriptions-item>
        <el-descriptions-item label="学制">{{ resumeDetail.data.schoolSystem || '-' }}</el-descriptions-item>
        <el-descriptions-item label="学习形式">{{ resumeDetail.data.studyForm || '-' }}</el-descriptions-item>
        <el-descriptions-item label="工作年限">{{ resumeDetail.data.workYears || '-' }} 年</el-descriptions-item>
        <el-descriptions-item label="当前公司">{{ resumeDetail.data.currentCompany || '-' }}</el-descriptions-item>
        <el-descriptions-item label="当前职位">{{ resumeDetail.data.currentPosition || '-' }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ resumeDetail.data.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ resumeDetail.data.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ resumeDetail.data.idCardNumber || '-' }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ resumeDetail.data.idCardAddress || '-' }}</el-descriptions-item>
      </el-descriptions>

      <!-- 证书信息 -->
      <div class="detail-section" v-if="resumeDetail.data && parseCertifications(resumeDetail.data.certifications).length > 0">
        <h4>证书信息</h4>
        <el-table :data="parseCertifications(resumeDetail.data.certifications)" stripe size="small" border>
          <el-table-column label="证书名称" prop="name" min-width="160" show-overflow-tooltip />
          <el-table-column label="证书编号" prop="number" min-width="140" show-overflow-tooltip />
          <el-table-column label="发证日期" prop="issueDate" width="120" align="center" />
          <el-table-column label="发证机构" prop="issuer" min-width="140" show-overflow-tooltip />
        </el-table>
      </div>

      <div class="detail-section" v-if="resumeDetail.data?.technicalSkills">
        <h4>技术技能</h4>
        <div class="tag-list">
          <el-tag
              v-for="(skill, index) in parseSkills(resumeDetail.data.technicalSkills)"
              :key="index"
              type="primary"
              size="small"
          >
            {{ skill }}
          </el-tag>
        </div>
      </div>

      <div class="detail-section" v-if="resumeDetail.data?.tags">
        <h4>标签</h4>
        <div class="tag-list">
          <el-tag
              v-for="(tag, index) in parseTags(resumeDetail.data.tags)"
              :key="index"
              type="info"
              size="small"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>

      <div class="detail-section" v-if="resumeDetail.data?.fullText">
        <h4>简历原文</h4>
        <el-input
            type="textarea"
            :rows="10"
            v-model="resumeDetail.data.fullText"
            readonly
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="BidDocument">
import { ref, reactive, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import {
  listBidDocument,
  getBidDetail,
  delBidDocument,
  uploadBidDocument,
  getBidProgress,
} from '@/api/ai/bid'
import { getResume } from '@/api/ai/resume'
import { getToken } from '@/utils/auth'

const { proxy } = getCurrentInstance()

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  bidName: undefined,
  bidCode: undefined,
  companyName: undefined,
})

const bidList = ref([])
const loading = ref(false)
const total = ref(0)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
// 自动刷新定时器
let autoRefreshTimer = null

// 上传相关
const uploadRef = ref(null)
const uploadAction = ref(import.meta.env.VITE_APP_BASE_API + '/bid/upload')
const uploadHeaders = ref({ Authorization: 'Bearer ' + getToken() })
const upload = reactive({
  open: false,
  loading: false,
  fileList: [],
})

// 详情弹窗
const detail = reactive({
  open: false,
  bid: null,
  bidName: '',
  resumeList: [],
})

// 简历详情弹窗
const resumeDetail = reactive({
  open: false,
  data: null,
})

/** 查询投标文件列表 */
function getList() {
  loading.value = true
  listBidDocument(queryParams)
      .then((response) => {
        bidList.value = response.rows
        total.value = response.total
        loading.value = false
        checkAutoRefresh()
      })
      .catch(() => {
        loading.value = false
      })
}

/** 检查是否需要自动刷新：有 status=0（处理中）的项则 5 秒一刷新，否则停止 */
function checkAutoRefresh() {
  const hasParsing = bidList.value.some((item) => item.status === 0)
  if (hasParsing && !autoRefreshTimer) {
    autoRefreshTimer = setInterval(() => {
      getList()
    }, 5000)
  } else if (!hasParsing && autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 上传投标文件 */
function handleUpload() {
  upload.open = true
  upload.fileList = []
  upload.loading = false
}

/** 上传前校验 */
function beforeUpload(file) {
  const isPdf = file.type === 'application/pdf'
  if (!isPdf) {
    ElMessage.error('仅支持 PDF 格式的投标文件！')
    return false
  }
  return true
}

/** 提交上传 */
function submitUpload() {
  if (!upload.fileList || upload.fileList.length === 0) {
    ElMessage.warning('请先选择投标文件')
    return
  }

  upload.loading = true

  // 使用表单数据上传
  const formData = new FormData()
  formData.append('file', upload.fileList[0].raw)

  uploadBidDocument(formData)
      .then((response) => {
        // 上传成功，后端已启动后台解析任务
        upload.loading = false
        upload.open = false
        ElMessage.success(response.message || '投标文件已上传，后台解析中...')
        // 立即刷新列表，列表页会自动轮询解析进度
        getList()
      })
      .catch((error) => {
        upload.loading = false
        ElMessage.error('上传失败：' + (error.message || '未知错误'))
      })
}

/** 上传成功回调 */
function handleUploadSuccess(response) {
  // 实际由 submitUpload 处理
}

/** 上传失败回调 */
function handleUploadError(error) {
  upload.loading = false
  ElMessage.error('上传失败：' + (error.message || '未知错误'))
}

/** 查看投标文件详情 */
function handleView(row) {
  detail.open = true
  detail.bidName = row.bidName || '投标文件'
  detail.bid = row
  detail.resumeList = []

  getBidDetail(row.id)
      .then((response) => {
        if (response.data) {
          detail.bid = response.data.bid || row
          detail.resumeList = response.data.resumeList || []
        }
      })
      .catch((error) => {
        ElMessage.error('查询详情失败：' + (error.message || '未知错误'))
      })
}

/** 查看单份简历详情 */
function handleViewResume(row) {
  resumeDetail.open = true
  resumeDetail.data = null

  getResume(row.id)
      .then((response) => {
        resumeDetail.data = response.data
      })
      .catch((error) => {
        ElMessage.error('查询简历失败：' + (error.message || '未知错误'))
      })
}

/** 删除投标文件 */
function handleDelete(row) {
  ElMessageBox.confirm('确认删除该投标文件及其关联的 ' + row.resumeCount + ' 份简历吗？', '提示', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        delBidDocument(row.id)
            .then(() => {
              ElMessage.success('删除成功')
              getList()
            })
            .catch((error) => {
              ElMessage.error('删除失败：' + (error.message || '未知错误'))
            })
      })
      .catch(() => {})
}

/** 解析技能标签 */
function parseSkills(skills) {
  if (!skills) return []
  if (typeof skills === 'string') {
    try {
      return JSON.parse(skills)
    } catch {
      return skills.split(',').filter((s) => s.trim())
    }
  }
  if (Array.isArray(skills)) return skills
  return []
}

/** 解析标签 */
function parseTags(tags) {
  if (!tags) return []
  if (typeof tags === 'string') {
    try {
      return JSON.parse(tags)
    } catch {
      return tags.split(/[,，;；]/).filter((t) => t.trim())
    }
  }
  if (Array.isArray(tags)) return tags
  return []
}

/** 解析证书列表（兼容对象数组和字符串数组两种格式） */
function parseCertifications(certs) {
  if (!certs) return []
  let arr = certs
  if (typeof certs === 'string') {
    try {
      arr = JSON.parse(certs)
    } catch {
      return certs.split(/[,，;；]/).filter((c) => c.trim()).map((name) => ({ name, number: '', issueDate: '', issuer: '' }))
    }
  }
  if (!Array.isArray(arr)) return []
  return arr.map((c) => {
    if (typeof c === 'string') {
      return { name: c, number: '', issueDate: '', issuer: '' }
    }
    return {
      name: c.name || c.certificateName || '',
      number: c.number || c.certificateNumber || '',
      issueDate: c.issueDate || c.issue_date || c.date || '',
      issuer: c.issuer || c.issuingAuthority || c.authority || '',
    }
  })
}

// 页面加载时查询列表
onMounted(() => {
  getList()
})

// 页面卸载时清除定时器
onUnmounted(() => {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
})
</script>

<style scoped lang="scss">
.search-form {
  .el-form-item {
    margin-bottom: 12px;
  }
}

.skill-tag {
  margin: 2px;
  line-height: 1.2;
}

.tag-cell-wrapper {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  line-height: 1;
}

.detail-section {
  margin-top: 20px;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
    padding-left: 8px;
    border-left: 4px solid #409eff;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
}

:deep(.el-table__body tr.el-table__row) {
  height: 48px !important;
}

:deep(.el-table .cell) {
  padding: 0 8px !important;
  line-height: 48px;
  white-space: nowrap;
}

:deep(.el-tag--small) {
  height: 20px;
  padding: 0 5px;
  line-height: 18px;
  vertical-align: middle;
}
</style>