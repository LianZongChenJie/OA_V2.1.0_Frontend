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
      <el-form-item label="姓名" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="姓名关键词"
            clearable
            style="width: 160px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学历" prop="education">
        <el-select
            v-model="queryParams.education"
            placeholder="请选择学历"
            clearable
            style="width: 140px"
        >
          <el-option label="博士" value="博士" />
          <el-option label="硕士" value="硕士" />
          <el-option label="本科" value="本科" />
          <el-option label="大专" value="大专" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="ageRange">
        <el-input-number
            v-model="queryParams.minAge"
            :min="18"
            :max="65"
            placeholder="最小"
            style="width: 90px"
        />
        <span style="margin: 0 8px">-</span>
        <el-input-number
            v-model="queryParams.maxAge"
            :min="18"
            :max="65"
            placeholder="最大"
            style="width: 90px"
        />
      </el-form-item>
      <el-form-item label="技能" prop="skill">
        <el-input
            v-model="queryParams.skill"
            placeholder="如 Java"
            clearable
            style="width: 140px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司" prop="company">
        <el-input
            v-model="queryParams.company"
            placeholder="公司名"
            clearable
            style="width: 160px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="职位" prop="position">
        <el-input
            v-model="queryParams.position"
            placeholder="职位名"
            clearable
            style="width: 160px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目经验" prop="projectKeyword">
        <el-input
            v-model="queryParams.projectKeyword"
            placeholder="项目名称或技术"
            clearable
            style="width: 180px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="全文" prop="keyword">
        <el-input
            v-model="queryParams.keyword"
            placeholder="任意关键词"
            clearable
            style="width: 180px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">
          搜索
        </el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Upload"
            @click="handleUpload"
        >
          上传简历
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
        >
          删除
        </el-button>
      </el-col>
      <right-toolbar
          v-model:showSearch="showSearch"
          @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- 简历表格 -->
    <el-table
        v-loading="loading"
        :data="resumeList"
        @selection-change="handleSelectionChange"
        stripe
        size="small"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="姓名" prop="name" width="100" show-overflow-tooltip />
      <el-table-column label="性别" prop="gender" width="70" align="center" />
      <el-table-column label="年龄" prop="age" width="70" align="center" />
      <el-table-column label="学历" prop="education" width="90" align="center" />
      <el-table-column label="专业" prop="major" width="120" show-overflow-tooltip />
      <el-table-column label="院校" prop="school" width="160" show-overflow-tooltip />
      <el-table-column label="当前公司" prop="currentCompany" width="160" show-overflow-tooltip />
      <el-table-column label="当前职位" prop="currentPosition" width="140" show-overflow-tooltip />
      <el-table-column label="工作年限" prop="workYears" width="90" align="center" />
      <el-table-column label="技能标签" min-width="200">
        <template #default="scope">
          <div 
              :title="parseSkills(scope.row.technicalSkills).join('、')" 
              class="tag-cell-wrapper"
          >
            <span class="tag-inner">
              <el-tag
                  v-for="(skill, index) in parseSkills(scope.row.technicalSkills)"
                  :key="index"
                  size="small"
                  class="skill-tag"
              >
                {{ skill }}
              </el-tag>
            </span>
            <span class="ellipsis-marker">...</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标签" min-width="180">
        <template #default="scope">
          <div 
              :title="parseTags(scope.row.tags).join('、')" 
              class="tag-cell-wrapper"
          >
            <span class="tag-inner">
              <el-tag
                  v-for="(tag, index) in parseTags(scope.row.tags)"
                  :key="index"
                  size="small"
                  type="info"
                  class="info-tag"
              >
                {{ tag }}
              </el-tag>
            </span>
            <span class="ellipsis-marker">...</span>
          </div>
        </template>
      </el-table-column>
      <!-- 格式化创建时间 -->
      <el-table-column label="创建时间" width="160" align="center">
        <template #default="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right" align="center">
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
              @click="handleDeleteRow(scope.row)"
              v-hasPermi="['resume-kb:remove']"
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

    <!-- 上传弹窗 -->
    <el-dialog
        title="上传简历"
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
          accept=".pdf,.doc,.docx,.txt"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 PDF、Word、TXT 格式，文件大小不超过 10MB
          </div>
        </template>
      </el-upload>

      <!-- 上传进度条 -->
      <div v-if="upload.loading" style="margin-top: 16px;">
        <el-progress
            :percentage="upload.progress"
            :status="upload.progressStatus"
            :stroke-width="16"
            :text-inside="true"
        />
        <div style="margin-top: 8px; color: #909399; font-size: 13px; text-align: center;">
          {{
            upload.phase === 'upload'
                ? '正在上传文件... ' + upload.progress + '%'
                : upload.phase === 'parse'
                    ? '正在智能解析简历，请稍候... ' + upload.progress + '%'
                    : '解析完成'
          }}
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitUpload" :loading="upload.loading">
            确 定
          </el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 简历详情弹窗 -->
    <el-dialog
        title="简历详情"
        v-model="detail.open"
        width="800px"
        append-to-body
        :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border v-if="detail.data">
        <el-descriptions-item label="姓名">{{ detail.data.name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ detail.data.gender || '-' }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ detail.data.age || '-' }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">{{ detail.data.birthDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="学历">{{ detail.data.education || '-' }}</el-descriptions-item>
        <el-descriptions-item label="专业">{{ detail.data.major || '-' }}</el-descriptions-item>
        <el-descriptions-item label="院校">{{ detail.data.school || '-' }}</el-descriptions-item>
        <el-descriptions-item label="毕业时间">{{ detail.data.graduationDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="学位">{{ detail.data.degree || '-' }}</el-descriptions-item>
        <el-descriptions-item label="学制">{{ detail.data.schoolSystem || '-' }}</el-descriptions-item>
        <el-descriptions-item label="学习形式">{{ detail.data.studyForm || '-' }}</el-descriptions-item>
        <el-descriptions-item label="工作年限">{{ detail.data.workYears || '-' }}</el-descriptions-item>
        <el-descriptions-item label="当前公司">{{ detail.data.currentCompany || '-' }}</el-descriptions-item>
        <el-descriptions-item label="当前职位">{{ detail.data.currentPosition || '-' }}</el-descriptions-item>
        <el-descriptions-item label="联系方式" :span="2">
          <el-tag size="small">{{ detail.data.phone || '-' }}</el-tag>
          <el-tag size="small" style="margin-left: 8px">{{ detail.data.email || '-' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ detail.data.idCardNumber || '-' }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ detail.data.idCardAddress || '-' }}</el-descriptions-item>
        <!-- 详情增加格式化创建时间 -->
        <el-descriptions-item label="创建时间">{{ formatDate(detail.data.createTime) || '-' }}</el-descriptions-item>
      </el-descriptions>

      <!-- 技能标签 -->
      <div class="detail-section" v-if="detail.data && detail.data.technicalSkills">
        <h4>专业技能</h4>
        <div class="tag-list">
          <el-tag
              v-for="(skill, index) in parseSkills(detail.data.technicalSkills)"
              :key="index"
              type="success"
              class="skill-tag"
          >
            {{ skill }}
          </el-tag>
        </div>
      </div>

      <!-- 工作经历 -->
      <div class="detail-section" v-if="detail.data && detail.data.workExperiences && detail.data.workExperiences.length > 0">
        <h4>工作经历</h4>
        <el-timeline>
          <el-timeline-item
              v-for="(work, index) in detail.data.workExperiences"
              :key="index"
              :timestamp="formatWorkTime(work)"
              placement="top"
          >
            <el-card>
              <h5>{{ work.company }} — {{ work.position }}</h5>
              <p>{{ work.description }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 项目经验 -->
      <div class="detail-section" v-if="detail.data && detail.data.projectExperiences && detail.data.projectExperiences.length > 0">
        <h4>项目经验</h4>
        <el-timeline>
          <el-timeline-item
              v-for="(project, index) in detail.data.projectExperiences"
              :key="index"
              :timestamp="formatWorkTime(project)"
              placement="top"
          >
            <el-card>
              <h5>{{ project.projectName }} — {{ project.role }}</h5>
              <p>{{ project.description }}</p>
              <div v-if="project.technologies && project.technologies.length > 0" class="tech-list">
                <el-tag
                    v-for="(tech, tIndex) in project.technologies"
                    :key="tIndex"
                    size="small"
                    type="warning"
                >
                  {{ tech }}
                </el-tag>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 证书信息 -->
      <div class="detail-section" v-if="detail.data && parseCertifications(detail.data.certifications).length > 0">
        <h4>证书信息</h4>
        <el-table :data="parseCertifications(detail.data.certifications)" stripe size="small" border>
          <el-table-column label="证书名称" prop="name" min-width="160" show-overflow-tooltip />
          <el-table-column label="证书编号" prop="number" min-width="140" show-overflow-tooltip />
          <el-table-column label="发证日期" prop="issueDate" width="120" align="center" />
          <el-table-column label="发证机构" prop="issuer" min-width="140" show-overflow-tooltip />
        </el-table>
      </div>

      <!-- 标签 -->
      <div class="detail-section" v-if="detail.data && detail.data.tags">
        <h4>智能标签</h4>
        <div class="tag-list">
          <el-tag
              v-for="(tag, index) in parseTags(detail.data.tags)"
              :key="index"
              type="info"
              class="info-tag"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detail.open = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ResumeKb">
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { listResume, searchResume, getResume, delResume, uploadResume } from '@/api/ai/resume'

const { proxy } = getCurrentInstance()

// 遮罩层
const loading = ref(false)
// 选中数组
const ids = ref([])
// 非单个禁用
const single = ref(true)
// 非多个禁用
const multiple = ref(true)
// 显示搜索条件
const showSearch = ref(true)
// 总条数
const total = ref(0)
// 简历表格数据
const resumeList = ref([])

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: undefined,
  education: undefined,
  minAge: undefined,
  maxAge: undefined,
  skill: undefined,
  major: undefined,
  company: undefined,
  position: undefined,
  projectKeyword: undefined,
  keyword: undefined,
})

// 上传弹窗
const upload = reactive({
  open: false,
  loading: false,
  fileList: [],
  progress: 0,
  progressStatus: '',
  phase: '',
})
const uploadRef = ref(null)
const uploadAction = ref(import.meta.env.VITE_APP_BASE_API + '/resume-kb/upload')
const uploadHeaders = ref({
  Authorization: 'Bearer ' + localStorage.getItem('access_token'),
})

// 详情弹窗
const detail = reactive({
  open: false,
  data: null,
})

/**
 * 通用日期格式化函数
 * @param {String|Number} time 时间戳/日期字符串
 * @param {String} fmt 格式，默认 yyyy-MM-dd HH:mm:ss
 * @returns {String} 格式化后日期
 */
function formatDate(time, fmt = 'yyyy-MM-dd HH:mm:ss') {
  if (!time) return '-'
  let date
  // 兼容10位/13位时间戳
  if (/^\d+$/.test(String(time))) {
    const num = Number(time)
    date = new Date(num.toString().length === 10 ? num * 1000 : num)
  } else {
    date = new Date(time)
  }
  if (date.toString() === 'Invalid Date') return time

  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  // 修复RegExp.$1连续调用语法报错
  let matchY = fmt.match(/(y+)/)
  if (matchY) {
    fmt = fmt.replace(matchY[1], (date.getFullYear() + '').substr(4 - matchY[1].length))
  }
  for (let k in o) {
    let reg = new RegExp('(' + k + ')')
    let match = fmt.match(reg)
    if (match) {
      let val = o[k]
      fmt = fmt.replace(match[1], match[1].length === 1 ? val : ('00' + val).substr(String(val).length))
    }
  }
  return fmt
}

/** 查询简历列表 */
function getList() {
  loading.value = true
  const params = {...queryParams}
  // 移除空值
  Object.keys(params).forEach((key) => {
    if (params[key] === undefined || params[key] === '' || params[key] === null) {
      delete params[key]
    }
  })

  searchResume(params)
      .then((res) => {
        if (res.code === 200) {
          const result = res.data || {}
          resumeList.value = result.resumes || []
          total.value = result.total || 0
        } else {
          ElMessage.error(res.msg || '查询失败')
        }
      })
      .catch((err) => {
        ElMessage.error('查询失败：' + (err.message || err))
      })
      .finally(() => {
        loading.value = false
      })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef')
  queryParams.pageNum = 1
  queryParams.pageSize = 10
  queryParams.name = undefined
  queryParams.education = undefined
  queryParams.minAge = undefined
  queryParams.maxAge = undefined
  queryParams.skill = undefined
  queryParams.major = undefined
  queryParams.company = undefined
  queryParams.position = undefined
  queryParams.projectKeyword = undefined
  queryParams.keyword = undefined
  getList()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 上传按钮操作 */
function handleUpload() {
  upload.open = true
  upload.fileList = []
  upload.progress = 0
  upload.progressStatus = ''
  upload.phase = ''
}

/** 文件上传前校验 */
function beforeUpload(file) {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ]
  const isAllowed = allowedTypes.includes(file.type)
  if (!isAllowed) {
    ElMessage.error('请上传 PDF、Word 或 TXT 格式的简历文件')
    return false
  }
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB')
    return false
  }
  return true
}

/** 提交上传 */
function submitUpload() {
  if (!upload.fileList || upload.fileList.length === 0) {
    ElMessage.warning('请选择要上传的简历文件')
    return
  }
  upload.loading = true
  upload.progress = 0
  upload.progressStatus = ''
  upload.phase = 'upload'

  const file = upload.fileList[0].raw
  const formData = new FormData()
  formData.append('file', file)

  let parseTimer = null

  const onProgress = (progressEvent) => {
    if (progressEvent.total > 0) {
      // 上传阶段：映射到 0% ~ 50%
      const uploadPercent = Math.round((progressEvent.loaded * 50) / progressEvent.total)
      upload.progress = uploadPercent
      if (uploadPercent >= 50) {
        // 上传完成后进入解析阶段
        upload.phase = 'parse'
        if (!parseTimer) {
          parseTimer = setInterval(() => {
            if (upload.phase === 'parse' && upload.progress < 95) {
              upload.progress = Math.min(upload.progress + 2, 95)
            }
          }, 800)
        }
      }
    } else {
      // 无法获取 total，直接进入解析阶段
      upload.phase = 'parse'
      if (!parseTimer) {
        parseTimer = setInterval(() => {
          if (upload.phase === 'parse' && upload.progress < 95) {
            upload.progress = Math.min(upload.progress + 2, 95)
          }
        }, 800)
      }
    }
  }

  uploadResume(formData, onProgress)
      .then((res) => {
        upload.progress = 100
        upload.phase = 'done'
        upload.progressStatus = 'success'
        if (parseTimer) {
          clearInterval(parseTimer)
          parseTimer = null
        }
        if (res.code === 200) {
          ElMessage.success('简历上传并解析成功')
          setTimeout(() => {
            upload.open = false
            upload.progress = 0
            upload.progressStatus = ''
            upload.phase = ''
            getList()
          }, 500)
        } else {
          upload.progressStatus = 'exception'
          ElMessage.error(res.msg || '上传失败')
        }
      })
      .catch((err) => {
        upload.progressStatus = 'exception'
        upload.phase = ''
        if (parseTimer) {
          clearInterval(parseTimer)
          parseTimer = null
        }
        ElMessage.error('上传失败：' + (err.message || err))
      })
      .finally(() => {
        upload.loading = false
      })
}

/** 上传成功 */
function handleUploadSuccess(res) {
  if (res.code === 200) {
    ElMessage.success('上传成功')
    upload.open = false
    getList()
  } else {
    ElMessage.error(res.msg || '上传失败')
  }
}

/** 上传失败 */
function handleUploadError(err) {
  ElMessage.error('上传失败：' + err.message)
}

/** 查看简历详情 */
function handleView(row) {
  loading.value = true
  getResume(row.id)
      .then((res) => {
        if (res.code === 200) {
          detail.data = res.data
          detail.open = true
        } else {
          ElMessage.error(res.msg || '获取详情失败')
        }
      })
      .catch((err) => {
        ElMessage.error('获取详情失败：' + (err.message || err))
      })
      .finally(() => {
        loading.value = false
      })
}

/** 删除简历 */
function handleDeleteRow(row) {
  ElMessageBox.confirm('确认删除该简历吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        return delResume(row.id)
      })
      .then((res) => {
        if (res.code === 200) {
          ElMessage.success('删除成功')
          getList()
        } else {
          ElMessage.error(res.msg || '删除失败')
        }
      })
      .catch((err) => {
        if (err !== 'cancel') {
          ElMessage.error('删除失败：' + (err.message || err))
        }
      })
}

/** 批量删除 */
function handleDelete() {
  const resumeIds = ids.value
  ElMessageBox.confirm('确认删除选中的 ' + resumeIds.length + ' 份简历吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        const promises = resumeIds.map((id) => delResume(id))
        return Promise.all(promises)
      })
      .then(() => {
        ElMessage.success('删除成功')
        getList()
      })
      .catch((err) => {
        if (err !== 'cancel') {
          ElMessage.error('删除失败：' + (err.message || err))
        }
      })
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

/** 格式化工作时间 */
function formatWorkTime(work) {
  if (!work) return ''
  const start = work.startDate || ''
  const end = work.endDate || '至今'
  return start + ' - ' + end
}

// 页面加载时查询列表
getList()
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

.info-tag {
  margin: 2px;
  line-height: 1.2;
}

/* 标签列外层 wrapper，单行显示省略号 */
.tag-cell-wrapper {
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  line-height: 24px;
  padding-right: 18px;
}

.tag-inner {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.ellipsis-marker {
  position: absolute;
  right: 0;
  bottom: 0;
  color: #909399;
  font-size: 12px;
  background: #fff;
  padding-left: 4px;
}

/* 表格固定行高 统一行间距 */
:deep(.el-table__body tr.el-table__row) {
  height: 48px !important;
  max-height: 48px !important;
  overflow: hidden;
  display: table-row;
}

:deep(.el-table .cell) {
  padding: 6px 8px !important;
  line-height: 24px;
  overflow: hidden;
  display: block;
}

:deep(.el-table__body) {
  overflow: hidden;
}

:deep(.el-tag--small) {
  height: 20px;
  padding: 0 5px;
  line-height: 18px;
  vertical-align: middle;
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

  .tech-list {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
}

:deep(.el-timeline-item__content) {
  .el-card {
    h5 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    p {
      color: #606266;
      line-height: 1.6;
    }
  }
}
</style>