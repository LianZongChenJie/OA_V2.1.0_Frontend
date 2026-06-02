<template>
  <el-dialog
    title="查看社保管理"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="social-security-detail-dialog"
    @close="handleClose"
    @opened="handleOpened"
  >
    <div>
      <div class="form-section-title">基础信息</div>
      <SocialSecurityForm
        ref="formCompRef"
        v-model="form"
        :user-options="userOptions"
        disabled
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="SocialSecurityDetail">
import { ref, onMounted } from "vue";
import { listUser } from "@/api/system/user.js";
import SocialSecurityForm from "./socialSecurityForm.vue";

const dialogVisible = ref(false);
const formCompRef = ref(null);

// 用户列表（供禁用状态的 select 显示文本）
const userOptions = ref([]);

const form = ref({
  id: undefined,
  cityId: [],
  city: "",
  projectName: "",
  socialDate: 15,
  manager: undefined,
  relatedUsers: [],
  remark: "",
});

/** 加载用户列表 */
function loadUserOptions() {
  listUser({ pageSize: 1000 }).then((response) => {
    userOptions.value = response.rows || [];
  });
}

onMounted(() => {
  loadUserOptions();
});

/** 弹窗打开后设置级联回显 */
function handleOpened() {
  formCompRef.value?.handleOpened();
}

/** 关闭弹窗 */
function handleClose() {
  form.value = {
    id: undefined,
    cityId: [],
    city: "",
    projectName: "",
    socialDate: 15,
    manager: undefined,
    relatedUsers: [],
    remark: "",
  };
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  // 解析城市 ID
  const cityId = data.cityId
    ? String(data.cityId).split(",").map(Number)
    : [];

  // 解析负责人 ID（兼容多种数据格式）
  let manager = data.managerId ? String(data.managerId) : undefined;

  // 如果没有 managerId，尝试从名称反向查找对应的 ID
  if (!manager) {
    const name = data.manager || data.managerName || "";
    if (name) {
      const found = userOptions.value.find((u) => u.nickName === name);
      if (found) {
        manager = String(found.userId);
      }
    }
  }

  // 解析关联人员 ID 数组
  const relatedUsers = data.relatedUsers
    ? String(data.relatedUsers).split(",").filter(Boolean)
    : data.users && data.users.length > 0
      ? data.users.map((u) => String(u.userId))
      : [];

  // 设置待回显的 cityId（级联懒加载需要）
  formCompRef.value?.setPendingCityId(cityId);

  form.value = {
    id: data.id,
    cityId,
    city: data.city || "",
    projectName: data.projectName || "",
    socialDate: data.socialDate || 15,
    manager,
    relatedUsers,
    remark: data.remark || "",
  };

  dialogVisible.value = true;
}

defineExpose({
  openView,
});
</script>

<style scoped>
.form-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0 15px 0;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}
</style>

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
.social-security-detail-dialog .el-dialog {
  max-height: 88vh;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
}

.social-security-detail-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.el-dialog__footer {
  border-top: 1px solid #f7f7f7;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
}
</style>