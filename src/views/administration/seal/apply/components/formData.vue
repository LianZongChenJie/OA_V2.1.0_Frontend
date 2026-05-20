<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="readonly ? {} : rules"
    label-width="140px"
    :validate-on-rule-change="false"
  >
    <!-- 基础申请信息 -->
    <div class="form-section-title">基础申请信息</div>

    <!-- 第一行：申请主题 + 用章类型 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请主题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入申请主题"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用章类型" prop="sealCateId">
          <el-select
            v-model="form.sealCateId"
            :disabled="readonly"
            placeholder="请选择用章类型"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in seal_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第二行：用印部门 + 盖章次数 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="用印部门" prop="did">
          <el-input
            v-if="currentDeptName"
            v-model="currentDeptName"
            disabled
            placeholder="默认当前登录人所在部门"
          />
          <el-select
            v-else
            v-model="form.did"
            :disabled="true"
            placeholder="加载中..."
            style="width: 100%"
          >
            <el-option
              v-for="item in deptOptions"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptId"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="盖章次数" prop="num">
          <el-input-number
            v-model="form.num"
            :min="1"
            :max="10"
            placeholder="请输入盖章次数"
            :disabled="readonly"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第三行：预期用印日期 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="预期用印日期" prop="useTime">
          <el-date-picker
            v-model="form.useTime"
            type="date"
            placeholder="请选择预期用印日期"
            :disabled="readonly"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第四行：印章是否外借 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="印章是否外借" prop="isBorrow">
          <el-radio-group
            v-model="form.isBorrow"
            :disabled="readonly"
            @change="handleIsBorrowChange"
          >
            <el-radio :label="0">不外借</el-radio>
            <el-radio :label="1">外借</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第五行：借用开始日期 + 借用结束日期 -->
    <el-row :gutter="20" v-if="form.isBorrow === 1">
      <el-col :span="12">
        <el-form-item label="借用开始日期" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="date"
            placeholder="请选择借用开始日期"
            :disabled="readonly"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="借用结束日期" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="date"
            placeholder="请选择借用结束日期"
            :disabled="readonly"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第六行：盖章内容 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="盖章内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入盖章内容"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
</template>

<script setup name="SealApplyFormData">
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import { listDept } from "@/api/system/dept.js";
import { listUser } from "@/api/system/user.js";
import useUserStore from "@/store/modules/user";

const userStore = useUserStore();
const { proxy } = getCurrentInstance();
const { seal_type } = proxy.useDict("seal_type");

defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
});

const formRef = ref(null);

// 下拉选项数据
const deptOptions = ref([]);

// 当前登录用户信息
const currentUserInfo = ref({
  userId: "",
  deptId: ""
});

// 当前部门名称（用于只读显示）
const currentDeptName = ref("");

// 用户列表加载完成的 Promise
let userListPromise = null;

// 用户数据加载完成标志
const isUserDataReady = ref(false);

// 表单数据
const form = reactive({
  id: undefined,
  title: "",
  did: "",
  num: 1,
  useTime: "",
  sealCateId: "",
  isBorrow: 0,
  startTime: "",
  endTime: "",
  content: "",
});

// 自定义校验：印章外借时，开始日期和结束日期必填
const validateBorrowDates = (rule, value, callback) => {
  if (form.isBorrow === 1 && !value) {
    const fieldName =
      rule.field === "startTime" ? "借用开始日期" : "借用结束日期";
    callback(new Error(`请选择${fieldName}`));
  } else {
    callback();
  }
};

const rules = {
  title: [{ required: true, message: "请输入申请主题", trigger: "blur" }],
  did: [{ required: true, message: "请选择用印部门", trigger: "change" }],
  num: [{ required: true, message: "请输入盖章次数", trigger: "blur" }],
  useTime: [
    { required: true, message: "请选择预期用印日期", trigger: "change" },
  ],
  sealCateId: [
    { required: true, message: "请选择用章类型", trigger: "change" },
  ],
  content: [{ required: true, message: "请输入盖章内容", trigger: "blur" }],
  startTime: [{ validator: validateBorrowDates, trigger: "change" }],
  endTime: [{ validator: validateBorrowDates, trigger: "change" }],
};

/** 获取部门列表 */
const getDeptList = () =>
  listDept({ pageNum: 1, pageSize: 1000 }).then((res) => {
    deptOptions.value = res.data || [];
    return deptOptions.value;
  });

/** 获取用户列表 */
const getUserList = async () => {
  const res = await listUser({ pageNum: 1, pageSize: 1000 });
  const users = res.rows || [];
  const currentUser = users.find(u => u.userId === userStore.id);
  currentUserInfo.value = {
    userId: userStore.id || "",
    deptId: currentUser?.deptId || ""
  };
  const currentDept = deptOptions.value.find(d => d.deptId === currentUser?.deptId);
  currentDeptName.value = currentDept?.deptName || "";
  isUserDataReady.value = true;
  return currentUserInfo.value;
};

const handleIsBorrowChange = (val) => {
  if (val === 0) {
    form.startTime = "";
    form.endTime = "";
  }
};

/** 重置表单 */
const resetForm = async () => {
  formRef.value?.clearValidate();
  isUserDataReady.value = false;

  if (!userListPromise) {
    userListPromise = getUserList();
  }
  await userListPromise;

  Object.assign(form, {
    id: undefined,
    title: "",
    did: currentUserInfo.value.deptId,
    num: 1,
    useTime: "",
    sealCateId: "",
    isBorrow: 0,
    startTime: "",
    endTime: "",
    content: "",
  });
};

const setFormData = async (data) => {
  // 确保用户数据加载完成
  if (!isUserDataReady.value) {
    if (!userListPromise) {
      userListPromise = getUserList();
    }
    await userListPromise;
  }
  const info = data?.info || data;
  Object.assign(form, {
    id: info.id,
    title: info.title || "",
    did: currentUserInfo.value.deptId || info.did || "",
    num: info.num || 1,
    useTime: info.useTime || "",
    sealCateId: info.sealCateId != null ? String(info.sealCateId) : "",
    isBorrow: info.isBorrow ?? 0,
    startTime: info.startTime || "",
    endTime: info.endTime || "",
    content: info.content || "",
  });
};

const getFormData = () => ({ ...form });

/** 初始化数据 - 开始加载用户列表 */
onMounted(() => {
  // 先加载部门列表，确保部门名称可用
  getDeptList().then(() => {
    // 预加载用户列表，确保部门信息已加载
    userListPromise = getUserList();
  });
});

// 暴露方法给父组件
defineExpose({
  formRef,
  resetForm,
  setFormData,
  getFormData,
  form,
});
</script>

<style scoped>
.form-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}
</style>
