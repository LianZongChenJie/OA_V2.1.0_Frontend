<template>
  <div class="main-content birthday-wall">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div>
            <span class="title">员工生日照片墙</span>
            <span class="sub-title">
              {{ monthText }} · 本月 {{ currentMonthList.length }} 人 · 全部 {{ birthdayList.length }} 人
            </span>
          </div>
        </div>
      </template>

      <el-skeleton :loading="loading" animated>
        <div class="section-title">
          <span class="section-name">本月寿星</span>
          <el-tag type="danger" effect="dark" size="small">{{ monthText }}</el-tag>
        </div>

        <div v-if="currentMonthList.length" class="birthday-grid current-grid">
          <div
            v-for="item in currentMonthList"
            :key="`current-${item.userId}`"
            class="birthday-card current-card"
            :class="{
              'passed-card': birthdayStatus(item) === 'passed',
              'today-card': birthdayStatus(item) === 'today'
            }"
          >
            <el-tag
              v-if="birthdayStatus(item) === 'passed'"
              class="status-tag"
              type="success"
              effect="dark"
              size="small"
            >
              本月生日已过
            </el-tag>
            <el-tag
              v-else-if="birthdayStatus(item) === 'today'"
              class="status-tag"
              type="danger"
              effect="dark"
              size="small"
            >
              今天生日!
            </el-tag>
            <el-avatar :size="88" :src="avatarUrl(item.avatar)">
              {{ (item.nickName || '').slice(0, 1) }}
            </el-avatar>
            <div class="name">{{ item.nickName || '-' }}</div>
            <div class="dept">{{ item.deptName || '-' }}</div>
            <el-tag type="warning" effect="light" size="small">{{ item.birthdayText || '未维护' }}</el-tag>
          </div>
        </div>
        <el-alert
          v-else
          title="本月暂无生日员工"
          type="info"
          show-icon
          :closable="false"
        />

        <el-divider />

        <div class="section-title">
          <span class="section-name">全部员工生日</span>
          <span class="section-tip">按生日日期排序，未维护生日排最后</span>
        </div>

        <div v-if="birthdayList.length" class="birthday-grid">
          <div
            v-for="item in birthdayList"
            :key="item.userId"
            class="birthday-card"
            :class="{ 'current-card': item.isCurrentMonth }"
          >
            <el-tag v-if="item.isCurrentMonth" class="current-tag" type="danger" effect="dark" size="small">
              本月
            </el-tag>
            <el-avatar :size="72" :src="avatarUrl(item.avatar)">
              {{ (item.nickName || '').slice(0, 1) }}
            </el-avatar>
            <div class="name">{{ item.nickName || '-' }}</div>
            <div class="dept">{{ item.deptName || '-' }}</div>
            <el-tag :type="item.isCurrentMonth ? 'danger' : 'info'" effect="light" size="small">
              {{ item.birthdayText || '未维护' }}
            </el-tag>
          </div>
        </div>
        <el-empty v-else description="暂无员工数据" />
      </el-skeleton>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, getCurrentInstance } from 'vue'
import { getBirthdayWallList } from '@/api/personnel/birthdayWall/index.js'
import { isHttp } from '@/utils/validate.js'

const { proxy } = getCurrentInstance()

const loading = ref(true)
const birthdayList = ref([])

function avatarUrl(avatar) {
  if (!avatar) return ''
  if (isHttp(avatar)) return avatar
  return import.meta.env.VITE_APP_BASE_API + avatar
}

const monthText = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月`
})

const currentMonthList = computed(() => birthdayList.value.filter((item) => item.isCurrentMonth))

function birthdayStatus(item) {
  if (!item.isCurrentMonth || !item.birthdayDay) {
    return ''
  }
  const today = new Date().getDate()
  if (item.birthdayDay < today) {
    return 'passed'
  }
  if (item.birthdayDay === today) {
    return 'today'
  }
  return 'upcoming'
}

async function loadData() {
  loading.value = true
  try {
    const res = await getBirthdayWallList()
    birthdayList.value = res.data || []
  } catch (error) {
    proxy.$modal.msgError(error.message || '获取生日墙失败')
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style lang="scss" scoped>
.birthday-wall {
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.sub-title {
  margin-left: 12px;
  color: #909399;
  font-size: 14px;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-name {
  margin-right: 10px;
  font-size: 16px;
  font-weight: 600;
}

.section-tip {
  color: #909399;
  font-size: 13px;
}

.birthday-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.current-grid {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.birthday-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fff;
}

.current-card {
  border-color: #f56c6c;
  background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%);
  box-shadow: 0 2px 12px rgba(245, 108, 108, 0.15);
}

.current-tag {
  position: absolute;
  top: 8px;
  right: 8px;
}

.status-tag {
  position: absolute;
  top: 8px;
  left: 8px;
}

.passed-card {
  border-color: #67c23a;
  background: linear-gradient(180deg, #f0f9eb 0%, #ffffff 100%);
  box-shadow: 0 2px 12px rgba(103, 194, 58, 0.12);
}

.today-card {
  border-color: #f56c6c;
  background: linear-gradient(180deg, #fff0f3 0%, #ffffff 100%);
  box-shadow: 0 4px 16px rgba(245, 108, 108, 0.2);
}

.name {
  font-size: 16px;
  font-weight: 600;
}

.dept {
  color: #909399;
  font-size: 13px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}
</style>
