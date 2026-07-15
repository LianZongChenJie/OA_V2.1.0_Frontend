<template>
  <div class="app-container resume-chat-container">
    <el-container style="height: 100%">
      <!-- 主区域：对话框 -->
      <el-main class="chat-main">
        <div class="chat-header">
          <div class="header-left">
            <span class="header-title">简历智能问答</span>
            <span class="header-subtitle">基于简历库的 AI 智能检索与问答</span>
          </div>
          <div class="header-right">
            <el-select
              v-model="currentModelId"
              placeholder="选择模型"
              size="large"
              style="width: 240px"
            >
              <el-option
                v-for="item in modelOptions"
                :key="item.modelId"
                :label="`${item.provider}/${item.modelCode}`"
                :value="item.modelId"
              />
            </el-select>
          </div>
        </div>

        <div class="chat-history" ref="chatHistoryRef">
          <div
            class="chat-content"
            ref="chatContentRef"
            :class="{ 'is-empty': messageList.length === 0 }"
          >
            <div v-if="messageList.length === 0" class="welcome-screen">
              <div class="welcome-icon">
                <el-icon size="60"><Document /></el-icon>
              </div>
              <h2>你好！我是简历智能助手</h2>
              <p>你可以问我关于简历的任何问题，比如：</p>
              <div class="example-questions">
                <el-tag
                  v-for="(q, idx) in exampleQuestions"
                  :key="idx"
                  class="example-tag"
                  @click="askQuestion(q)"
                >
                  {{ q }}
                </el-tag>
              </div>
            </div>

            <div
              v-for="(msg, index) in messageList"
              :key="index"
              :class="[
                'message-row',
                msg.role === 'user' ? 'message-user' : 'message-ai',
              ]"
            >
              <div class="message-avatar">
                <el-avatar
                  :icon="msg.role === 'user' ? 'UserFilled' : 'Document'"
                  :size="40"
                  :class="msg.role === 'user' ? 'avatar-user' : 'avatar-ai'"
                ></el-avatar>
              </div>
              <div class="message-content-wrapper">
                <div class="message-sender">
                  {{ msg.role === 'user' ? '我' : '简历助手' }}
                </div>
                <div class="message-bubble">
                  <div v-if="msg.role === 'user'" class="user-text">
                    {{ msg.content }}
                  </div>
                  <AiMessage
                    v-else
                    :content="msg.content"
                    :reasoning-content="msg.reasoningContent"
                    :loading="loading && index === messageList.length - 1"
                  />
                </div>
                <!-- 关联简历 -->
                <div v-if="msg.role === 'assistant' && msg.relatedResumes && msg.relatedResumes.length > 0" class="related-resumes">
                  <div class="related-title">
                    <el-icon><Connection /></el-icon>
                    <span>关联简历 ({{ msg.relatedResumes.length }})</span>
                  </div>
                  <div class="resume-cards">
                    <div
                      v-for="(resume, rIdx) in msg.relatedResumes"
                      :key="rIdx"
                      class="resume-card"
                      @click="viewResumeDetail(resume.id)"
                    >
                      <div class="resume-card-header">
                        <span class="resume-name">{{ resume.name || '未知' }}</span>
                        <span class="resume-position">{{ resume.position || '未知职位' }}</span>
                      </div>
                      <div class="resume-card-info">
                        <el-tag size="small" type="info">{{ resume.education || '未知学历' }}</el-tag>
                        <el-tag size="small" type="info">{{ resume.workYears || 0 }}年经验</el-tag>
                        <span class="resume-school">{{ resume.school || '未知院校' }}</span>
                      </div>
                      <div v-if="resume.skills && resume.skills.length > 0" class="resume-skills">
                        <el-tag
                          v-for="(skill, sIdx) in resume.skills.slice(0, 5)"
                          :key="sIdx"
                          size="small"
                          type="success"
                          effect="plain"
                          class="skill-tag"
                        >
                          {{ skill }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <div class="input-wrapper">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="3"
              resize="none"
              placeholder="请输入您的问题... (Enter 发送，Shift + Enter 换行)"
              @keydown.enter.exact.prevent="handleSend"
              :disabled="loading"
            />
            <div class="input-actions">
              <div class="left-actions">
                <span class="hint-text">
                  自动检索简历库中最相关的 {{ topK }} 份简历
                </span>
              </div>
              <el-button
                :type="loading ? 'danger' : 'primary'"
                :icon="loading ? 'VideoPause' : 'Promotion'"
                @click="handleMainAction"
                :disabled="!loading && !inputMessage.trim()"
              >
                {{ loading ? '停止' : '发送' }}
              </el-button>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>

    <!-- 简历详情抽屉 -->
    <el-drawer
      v-model="detailDrawerVisible"
      title="简历详情"
      direction="rtl"
      size="600px"
    >
      <div v-if="currentResumeDetail" class="resume-detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ currentResumeDetail.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ currentResumeDetail.gender || '-' }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ currentResumeDetail.age || '-' }}岁</el-descriptions-item>
          <el-descriptions-item label="学历">{{ currentResumeDetail.education || '-' }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{ currentResumeDetail.major || '-' }}</el-descriptions-item>
          <el-descriptions-item label="院校">{{ currentResumeDetail.school || '-' }}</el-descriptions-item>
          <el-descriptions-item label="工作年限">{{ currentResumeDetail.workYears || '-' }}年</el-descriptions-item>
          <el-descriptions-item label="当前职位">{{ currentResumeDetail.currentPosition || '-' }}</el-descriptions-item>
        </el-descriptions>

        <div class="detail-section" v-if="currentResumeDetail.technicalSkills && currentResumeDetail.technicalSkills.length > 0">
          <h4>专业技能</h4>
          <div class="tag-list">
            <el-tag
              v-for="(skill, idx) in parseSkills(currentResumeDetail.technicalSkills)"
              :key="idx"
              type="success"
              class="skill-tag"
            >
              {{ skill }}
            </el-tag>
          </div>
        </div>

        <div class="detail-section" v-if="currentResumeDetail.workExperiences && currentResumeDetail.workExperiences.length > 0">
          <h4>工作经历</h4>
          <el-timeline>
            <el-timeline-item
              v-for="(work, idx) in currentResumeDetail.workExperiences"
              :key="idx"
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
      </div>
    </el-drawer>
  </div>
</template>

<script setup name="ResumeChat">
import { ref, reactive, computed, getCurrentInstance, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Connection, UserFilled, Promotion, VideoPause } from '@element-plus/icons-vue'
import { listModelAll } from '@/api/ai/model'
import { getResume } from '@/api/ai/resume'
import { getToken } from '@/utils/auth'
import AiMessage from '../chat/components/AiMessage.vue'

const { proxy } = getCurrentInstance()

// 模型列表
const modelOptions = ref([])
const currentModelId = ref(undefined)

// 消息列表
const messageList = ref([])
const inputMessage = ref('')
const loading = ref(false)
const topK = ref(5)

// 会话
const currentSessionId = ref(null)
const abortController = ref(null)

// 简历详情
const detailDrawerVisible = ref(false)
const currentResumeDetail = ref(null)

// DOM引用
const chatHistoryRef = ref(null)
const chatContentRef = ref(null)

// 示例问题
const exampleQuestions = [
  '帮我找一下有Java开发经验的候选人',
  '有哪些本科以上学历的候选人？',
  '工作3年以上的前端开发有哪些？',
  '有没有在互联网公司工作过的候选人？',
]

// 加载模型列表
function loadModels() {
  listModelAll().then((res) => {
    if (res.code === 200) {
      modelOptions.value = res.data || []
      // 默认选第一个
      if (modelOptions.value.length > 0 && !currentModelId.value) {
        currentModelId.value = modelOptions.value[0].modelId
      }
    }
  })
}

// 发送消息
async function handleSend() {
  if (!inputMessage.value.trim()) return
  if (!currentModelId.value) {
    ElMessage.warning('请先选择一个模型')
    return
  }

  const text = inputMessage.value.trim()
  inputMessage.value = ''

  // 添加用户消息
  messageList.value.push({
    role: 'user',
    content: text,
  })

  // 添加AI消息占位
  messageList.value.push({
    role: 'assistant',
    content: '',
    reasoningContent: '',
    relatedResumes: [],
    metrics: null,
  })

  const aiMsgIndex = messageList.value.length - 1
  scrollToBottom()

  abortController.value = new AbortController()
  loading.value = true

  try {
    const response = await fetch(
      import.meta.env.VITE_APP_BASE_API + '/resume-kb/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + getToken(),
        },
        signal: abortController.value.signal,
        body: JSON.stringify({
          modelId: currentModelId.value,
          message: text,
          sessionId: currentSessionId.value,
          topK: topK.value,
          stream: true,
        }),
      },
    )

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let aiContent = ''
    let buffer = ''

    while (true) {
      if (!abortController.value) break
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()

      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const data = JSON.parse(line)
          if (data.type === 'content') {
            aiContent += data.content
            messageList.value[aiMsgIndex].content = aiContent
          } else if (data.type === 'meta') {
            currentSessionId.value = data.session_id
          } else if (data.type === 'related') {
            messageList.value[aiMsgIndex].relatedResumes = data.related_resumes || []
          } else if (data.type === 'metrics') {
            messageList.value[aiMsgIndex].metrics = data.metrics
          } else if (data.type === 'error') {
            ElMessage.error(data.error)
          }
        } catch (e) {
          console.error('Parse error', e)
        }
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      // 用户终止
    } else {
      ElMessage.error('请求失败: ' + err.message)
    }
  } finally {
    loading.value = false
    abortController.value = null
  }
}

// 主按钮操作（发送/停止）
function handleMainAction() {
  if (loading.value) {
    // 停止
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
  } else {
    // 发送
    handleSend()
  }
}

// 点击示例问题
function askQuestion(question) {
  inputMessage.value = question
  nextTick(() => {
    handleSend()
  })
}

// 查看简历详情
function viewResumeDetail(resumeId) {
  if (!resumeId) return
  getResume(resumeId).then((res) => {
    if (res.code === 200) {
      currentResumeDetail.value = res.data
      detailDrawerVisible.value = true
    } else {
      ElMessage.error(res.msg || '获取简历详情失败')
    }
  })
}

// 解析技能标签
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

// 格式化工作时间
function formatWorkTime(work) {
  if (!work) return ''
  const start = work.startDate || ''
  const end = work.endDate || '至今'
  return start + ' - ' + end
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (chatHistoryRef.value) {
      chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
    }
  })
}

// 页面加载
onMounted(() => {
  loadModels()
})
</script>

<style scoped lang="scss">
.resume-chat-container {
  height: calc(100vh - 140px);
  padding: 0;
}

.chat-container {
  height: 100%;
}

.chat-main {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #ebeef5;
  background: #fff;

  .header-left {
    .header-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
    .header-subtitle {
      font-size: 13px;
      color: #909399;
      margin-left: 12px;
    }
  }
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f7fa;
}

.chat-content {
  max-width: 900px;
  margin: 0 auto;

  &.is-empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.welcome-screen {
  text-align: center;
  color: #606266;

  .welcome-icon {
    margin-bottom: 20px;
    color: #409eff;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 12px;
    color: #303133;
  }

  p {
    margin-bottom: 20px;
  }

  .example-questions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    max-width: 600px;
    margin: 0 auto;
  }

  .example-tag {
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
    }
  }
}

.message-row {
  display: flex;
  margin-bottom: 24px;

  &.message-user {
    flex-direction: row-reverse;

    .message-content-wrapper {
      align-items: flex-end;
    }

    .message-bubble {
      background: #409eff;
      color: #fff;
      border-radius: 18px 4px 18px 18px;
    }
  }

  &.message-ai {
    .message-bubble {
      background: #fff;
      border-radius: 4px 18px 18px 18px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
  }
}

.message-avatar {
  flex-shrink: 0;
  margin: 0 12px;
}

.avatar-user {
  background: #409eff;
}

.avatar-ai {
  background: #67c23a;
}

.message-content-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 75%;
}

.message-sender {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.message-bubble {
  padding: 12px 16px;
  line-height: 1.6;
  word-break: break-word;
}

.user-text {
  white-space: pre-wrap;
}

.related-resumes {
  margin-top: 12px;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .related-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #606266;
    margin-bottom: 10px;
  }

  .resume-cards {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .resume-card {
    padding: 10px 12px;
    background: #f5f7fa;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #ecf5ff;
      transform: translateX(4px);
    }

    .resume-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;

      .resume-name {
        font-weight: 600;
        color: #303133;
      }

      .resume-position {
        font-size: 13px;
        color: #606266;
      }
    }

    .resume-card-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;

      .resume-school {
        font-size: 12px;
        color: #909399;
      }
    }

    .resume-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .skill-tag {
        font-size: 11px;
      }
    }
  }
}

.chat-input-area {
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid #ebeef5;

  .input-wrapper {
    max-width: 900px;
    margin: 0 auto;
  }

  .input-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;

    .left-actions {
      .hint-text {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

.resume-detail-content {
  padding: 10px;

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

    .skill-tag {
      margin: 2px;
    }
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
