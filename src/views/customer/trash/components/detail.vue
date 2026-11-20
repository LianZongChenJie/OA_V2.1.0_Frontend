<template>
  <el-dialog
    v-model="visible"
    title="废弃客户详情"
    width="70%"
    append-to-body
    class="trash-detail-dialog"
    @closed="handleClosed"
  >
    <div v-loading="loading">
      <!-- 基础信息 -->
      <div class="form-section-title">基础信息</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="客户名称">{{ form.name || "-" }}</el-descriptions-item>
        <el-descriptions-item label="客户来源">{{ form.source || "-" }}</el-descriptions-item>
        <el-descriptions-item label="所属行业">{{ form.industry || "-" }}</el-descriptions-item>
        <el-descriptions-item label="客户等级">{{ form.grade || "-" }}</el-descriptions-item>
        <el-descriptions-item label="客户状态">
          <dict-tag
            v-if="form.customerStatus !== undefined && form.customerStatus !== null"
            :options="customer_status"
            :value="form.customerStatus"
          />
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="意向状态">
          <dict-tag
            v-if="form.intentStatus !== undefined && form.intentStatus !== null"
            :options="customer_intent_status"
            :value="form.intentStatus"
          />
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="联系地址">{{ form.address || "-" }}</el-descriptions-item>
        <el-descriptions-item label="所属员工">{{ form.belongName || "-" }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ form.belongDepartment || "-" }}</el-descriptions-item>
        <el-descriptions-item label="共享员工">{{ form.shareNames || "-" }}</el-descriptions-item>
        <el-descriptions-item label="客户介绍" :span="2">{{ form.content || "-" }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ form.remark || "-" }}</el-descriptions-item>
      </el-descriptions>

      <!-- 废弃信息 -->
      <div class="form-section-title">废弃信息</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="删除人">{{ form.deleteName || "-" }}</el-descriptions-item>
        <el-descriptions-item label="删除时间">{{ form.deleteTimeStr || "-" }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ form.createTimeStr || "-" }}</el-descriptions-item>
      </el-descriptions>

      <!-- 首要联系人 -->
      <div class="form-section-title">首要联系人</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ contactInfo?.name || "-" }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ sexText }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ contactInfo?.mobile || "-" }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ contactInfo?.email || "-" }}</el-descriptions-item>
        <el-descriptions-item label="微信">{{ contactInfo?.wechat || "-" }}</el-descriptions-item>
        <el-descriptions-item label="QQ">{{ contactInfo?.qq || "-" }}</el-descriptions-item>
        <el-descriptions-item label="网名">{{ contactInfo?.nickname || "-" }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ contactInfo?.department || "-" }}</el-descriptions-item>
        <el-descriptions-item label="职位">{{ contactInfo?.position || "-" }}</el-descriptions-item>
        <el-descriptions-item label="生日">{{ contactInfo?.birthday || "-" }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ contactInfo?.address || "-" }}</el-descriptions-item>
      </el-descriptions>

      <!-- 跟进记录（只读，复用客户列表详情的展示组件；展示该客户全部创建人的记录） -->
      <div class="trace-section">
        <TraceList
          v-if="form.id"
          :customer-id="form.id"
          :external-list="form.traceList"
          :disabled="true"
        />
      </div>
    </div>

    <template #footer>
      <el-button type="primary" @click="visible = false">关 闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { getDetail } from "@/api/customer/trash";
import TraceList from "@/views/customer/cusList/components/traceList.vue";

const { proxy } = getCurrentInstance();
const { customer_status, customer_intent_status } = proxy.useDict(
  "customer_status",
  "customer_intent_status"
);

const visible = ref(false);
const loading = ref(false);

const form = reactive({
  id: undefined,
  name: "",
  source: "",
  industry: "",
  grade: "",
  customerStatus: undefined,
  intentStatus: undefined,
  address: "",
  belongName: "",
  belongDepartment: "",
  shareNames: "",
  content: "",
  remark: "",
  contactInfo: null,
  deleteName: "",
  deleteTimeStr: "",
  createTimeStr: "",
  traceList: [],
});

// 性别文案
const SEX_MAP = { 0: "未知", 1: "男", 2: "女" };
const sexText = computed(() => {
  if (!form.contactInfo) return "-";
  return SEX_MAP[form.contactInfo.sex] || "未知";
});

const contactInfo = computed(() => form.contactInfo || null);

/** 打开弹窗并加载详情 */
async function open(id) {
  reset();
  visible.value = true;
  loading.value = true;
  try {
    const res = await getDetail(id);
    const data = res?.data || res;
    if (data && data.id) {
      Object.assign(form, data);
      form.contactInfo = data.contactInfo || null;
    }
  } catch (e) {
    console.error("获取废弃客户详情失败", e);
  } finally {
    loading.value = false;
  }
}

/** 重置数据 */
function reset() {
  Object.assign(form, {
    id: undefined,
    name: "",
    source: "",
    industry: "",
    grade: "",
    customerStatus: undefined,
    intentStatus: undefined,
    address: "",
    belongName: "",
    belongDepartment: "",
    shareNames: "",
    content: "",
    remark: "",
    contactInfo: null,
    deleteName: "",
    deleteTimeStr: "",
    createTimeStr: "",
    traceList: [],
  });
}

/** 关闭回调 */
function handleClosed() {
  reset();
}

defineExpose({ open });
</script>

<style scoped>
.form-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin: 18px 0 12px;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}

.form-section-title:first-child {
  margin-top: 0;
}

/* 跟进记录模块与上方区块的间距，跟随 .form-section-title 的 18px */
.trace-section {
  margin-top: 18px;
}

.trash-detail-dialog {
  :deep(.el-dialog) {
    max-height: 88vh;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-dialog__body) {
    max-height: calc(88vh - 120px);
    overflow-y: auto;
  }
}
</style>
