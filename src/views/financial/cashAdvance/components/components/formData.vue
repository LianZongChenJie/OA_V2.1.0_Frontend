<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="readonly ? {} : rules"
    label-width="120px"
  >
    <!-- 借支基本信息 -->
    <div class="form-section-title">借支基本信息</div>

    <!-- 第一行：借支主题 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="借支主题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入借支主题"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第二行：借支企业主体 + 借支类型 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="借支企业主体" prop="subjectId">
          <el-select
            v-model="form.subjectId"
            :disabled="readonly"
            placeholder="请选择借支企业主体"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in enterpriseOptions"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="借支类型" prop="types">
          <el-select
            v-model="form.types"
            :disabled="readonly"
            placeholder="请选择借支类型"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="dict in cash_advance_types"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第三行：借支金额 + 借支编号 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="借支金额(元)" prop="cost">
          <el-input-number
            v-model="form.cost"
            :min="0"
            :precision="2"
            placeholder="请输入借支金额"
            :disabled="readonly"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="借支编号" prop="code">
          <el-input
            v-model="form.code"
            placeholder="请输入借支编号"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第四行：借支员工 + 借支部门 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="借支员工" prop="adminId">
          <el-select
            v-model="form.adminId"
            :disabled="readonly"
            placeholder="请选择借支员工"
            clearable
            filterable
            style="width: 100%"
            @change="handleAdminIdChange"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="借支部门" prop="did">
          <el-select
            v-model="form.did"
            :disabled="readonly"
            placeholder="请选择借支部门"
            clearable
            style="width: 100%"
            @change="handleDeptChange"
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
    </el-row>

    <!-- 第五行：预计归还日期 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="预计归还日期" prop="planTime">
          <el-date-picker
            v-model="form.planTime"
            type="date"
            placeholder="请选择预计归还日期"
            :disabled="readonly"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 借支理由 -->
    <div class="form-section-title">借支理由</div>

    <!-- 第六行：借支理由 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="借支理由" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请输入借支理由"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup name="CashAdvanceFormData">
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import { listUser } from "@/api/system/user.js";
import { listDept } from "@/api/system/dept.js";
import { getPageList as getEnterprisePageList } from "@/api/base/common/businessEntity/index.js";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const { cash_advance_types } = proxy.useDict("cash_advance_types");
const userStore = useUserStore();

const props = defineProps({
  // 是否只读
  readonly: {
    type: Boolean,
    default: false,
  },
  // 表单数据
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue"]);

const formRef = ref(null);

// 下拉选项数据
const userOptions = ref([]);
const deptOptions = ref([]);
const enterpriseOptions = ref([]);

// 当前登录用户信息
const currentUserInfo = ref({
  userId: "",
  deptId: ""
});

// 表单数据
const form = reactive({
  id: undefined,
  title: "",
  subjectId: "",
  cost: undefined,
  adminId: "",
  did: "",
  code: "",
  types: "",
  planTime: "",
  content: "",
});

// 验证规则
const rules = {
  title: [{ required: true, message: "请输入借支主题", trigger: "blur" }],
  subjectId: [{ required: true, message: "请选择借支企业主体", trigger: "change" }],
  cost: [{ required: true, message: "请输入借支金额", trigger: "blur" }],
  adminId: [{ required: true, message: "请选择借支员工", trigger: "change" }],
  did: [{ required: true, message: "请选择借支部门", trigger: "change" }],
  code: [{ required: true, message: "请输入借支编号", trigger: "blur" }],
  types: [{ required: true, message: "请选择借支类型", trigger: "change" }],
  planTime: [{ required: true, message: "请选择预计归还日期", trigger: "change" }],
  content: [{ required: true, message: "请输入借支理由", trigger: "blur" }],
};

/** 获取用户列表 */
function getUserList() {
  listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
    userOptions.value = response.rows || [];
    // 设置当前登录人信息
    const currentUser = userOptions.value.find(u => u.userId === userStore.id);
    currentUserInfo.value = {
      userId: userStore.id || "",
      deptId: currentUser?.deptId || ""
    };
    form.adminId = currentUserInfo.value.userId;
    form.did = currentUserInfo.value.deptId;
  });
}

/** 获取部门列表 */
function getDeptList() {
  listDept({ pageNum: 1, pageSize: 1000 }).then((response) => {
    deptOptions.value = response.data || [];
  });
}

/** 获取企业主体列表 */
function getEnterpriseList() {
  getEnterprisePageList({ pageNum: 1, pageSize: 20 }).then((response) => {
    enterpriseOptions.value = response.rows || [];
  });
}

/** 借支员工选择变更 */
function handleAdminIdChange(userId) {
  if (userId) {
    form.adminId = userId;
  } else {
    form.adminId = "";
  }
}

/** 部门选择变更 */
function handleDeptChange(deptId) {
  if (deptId) {
    form.did = deptId;
    const selectedDept = deptOptions.value.find(
      (item) => item.deptId === deptId,
    );
    if (selectedDept) {
      form.deptName = selectedDept.deptName;
    }
  } else {
    form.did = "";
    form.deptName = "";
  }
}

/** 重置表单 */
function resetForm() {
  form.id = undefined;
  form.title = "";
  form.subjectId = "";
  form.cost = undefined;
  form.adminId = currentUserInfo.value.userId;
  form.did = currentUserInfo.value.deptId;
  form.code = "";
  form.types = "";
  form.planTime = "";
  form.content = "";
  formRef.value?.clearValidate();
}

/** 填充表单数据 */
function setFormData(data) {
  form.id = data.id;
  form.title = data.title || "";
  form.subjectId = data.subjectId || "";
  form.cost = data.cost || undefined;
  form.adminId = data.adminId || "";
  form.did = data.did || "";
  form.code = data.code || "";
  form.types = data.types !== undefined && data.types !== null ? String(data.types) : "";
  form.planTime = data.planTime || "";
  form.content = data.content || "";
}

/** 获取表单数据 */
function getFormData() {
  return { ...form };
}

/** 初始化数据 */
onMounted(() => {
  getUserList();
  getDeptList();
  getEnterpriseList();
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
  margin: 20px 0 15px 0;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}
</style>
