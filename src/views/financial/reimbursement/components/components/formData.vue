<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="readonly ? {} : rules"
    label-width="120px"
  >
    <!-- 报销基本信息 -->
    <div class="form-section-title">报销基本信息</div>

    <!-- 第一行：报销员工 + 报销部门 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="报销员工" prop="info.adminId">
          <el-input v-model="form.info.adminName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="报销部门" prop="info.did">
          <el-input v-model="form.info.deptName" disabled />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第二行：报销主体 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="报销主体" prop="info.subjectId">
          <el-select
            v-model="form.info.subjectId"
            :disabled="readonly"
            placeholder="请选择报销主体"
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
        <el-form-item label="凭证编号" prop="info.code">
          <el-input
            v-model="form.info.code"
            placeholder="请输入凭证编号"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第三行：单据日期 + 入账月份 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="单据日期" prop="info.expenseTime">
          <el-date-picker
            v-model="form.info.expenseTime"
            type="date"
            placeholder="请选择单据日期"
            :disabled="readonly"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="入账月份" prop="info.incomeMonth">
          <el-date-picker
            v-model="form.info.incomeMonth"
            type="month"
            placeholder="请选择入账月份"
            :disabled="readonly"
            style="width: 100%"
            value-format="YYYY-MM"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第四行：关联项目 + 冲抵借支 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="关联项目" prop="info.projectId">
          <el-select
            v-model="form.info.projectId"
            :disabled="readonly"
            placeholder="请选择关联项目"
            clearable
            filterable
            style="width: 100%"
            @change="handleProjectChange"
          >
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="冲抵借支" prop="info.loanId">
          <el-select
            v-model="form.info.loanId"
            :disabled="readonly"
            placeholder="请选择冲抵借支"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in loanOptions"
              :key="item.id"
              :label="`${item.title}(${item.code})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 报销总金额 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="报销总金额">
          <el-input
            :model-value="totalCost"
            disabled
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 报销选项信息 -->
    <div class="form-section-title">报销选项信息</div>

    <!-- 报销选项列表 -->
    <div v-for="(item, index) in form.interfix" :key="index" class="interfix-item">
      <div class="interfix-header">
        <span class="interfix-title">报销明细 {{ index + 1 }}</span>
        <el-button
          v-if="!readonly"
          type="danger"
          size="small"
          link
          @click="removeInterfix(index)"
        >
          删除
        </el-button>
      </div>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="报销金额"
            :prop="`interfix.${index}.amount`"
            :rules="[
              { required: true, message: '请输入报销金额', trigger: 'blur' }
            ]"
          >
            <el-input-number
              v-model="item.amount"
              :min="0"
              :precision="2"
              placeholder="请输入金额"
              :disabled="readonly"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="报销项目"
            :prop="`interfix.${index}.cateId`"
            :rules="[
              { required: true, message: '请选择报销项目', trigger: 'change' }
            ]"
          >
            <el-select
              v-model="item.cateId"
              :disabled="readonly"
              placeholder="请选择报销项目"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="dict in reimbursementCateOptions"
                :key="dict.id"
                :label="dict.title"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注信息" :prop="`interfix.${index}.remarks`">
            <el-input
              v-model="item.remarks"
              placeholder="请输入备注"
              :disabled="readonly"
              maxlength="500"
              show-word-limit
              type="textarea"
              :rows="2"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </div>

    <!-- 新增报销选项按钮 -->
    <el-row :gutter="20" v-if="!readonly">
      <el-col :span="24">
        <el-button type="primary" link @click="addInterfix">
          <el-icon><Plus /></el-icon>
          新增报销明细
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup name="ReimbursementFormData">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { getPageList as getEnterprisePageList } from "@/api/base/common/businessEntity/index.js";
import { getList as getLoanList } from "@/api/financial/cashAdvance";
import { getPageList as getProjectList } from "@/api/project/itemList";
import { getPageList as getReimbursementCateList } from "@/api/finance/reimbursement";
import useUserStore from "@/store/modules/user";
import { Plus } from "@element-plus/icons-vue";

const userStore = useUserStore();

const props = defineProps({
  // 是否只读
  readonly: {
    type: Boolean,
    default: false,
  },
});

const formRef = ref(null);

// 计算报销总金额
const totalCost = computed(() => {
  return form.interfix.reduce((sum, item) => {
    return sum + (Number(item.amount) || 0);
  }, 0).toFixed(2);
});

// 下拉选项数据
const enterpriseOptions = ref([]);
const loanOptions = ref([]);
const reimbursementCateOptions = ref([]);
const projectOptions = ref([]);

const form = reactive({
  id: undefined,
  info: {
    adminId: "",
    did: "",
    subjectId: "",
    code: "",
    expenseTime: "",
    incomeMonth: "",
    projectId: "",
    projectName: "",
    loanId: "",
  },
  interfix: [
    {
      amount: undefined,
      cateId: "",
      remarks: "",
      adminId: ""
    }
  ],
});

// 验证规则
const rules = {
  'info.subjectId': [{ required: true, message: "请选择报销主体", trigger: "change" }],
  'info.code': [{ required: true, message: "请输入凭证编号", trigger: "blur" }],
  'info.expenseTime': [{ required: true, message: "请选择单据日期", trigger: "change" }],
  'info.incomeMonth': [{ required: true, message: "请选择入账月份", trigger: "change" }],
};

/** 获取企业主体列表 */
function getEnterpriseList() {
  getEnterprisePageList({ pageNum: 1, pageSize: 20 }).then((response) => {
    enterpriseOptions.value = response.rows || [];
  });
}

/** 获取借支列表（用于冲抵借支） */
function getLoanOptions() {
  getLoanList({ pageNum: 1, pageSize: 200,checkStatus:2 }).then((response) => {
    loanOptions.value = response.rows || [];
  });
}

/** 获取项目列表 */
function getProjectOptions() {
  getProjectList({ pageNum: 1, pageSize: 1000 }).then((response) => {
    projectOptions.value = response.rows || [];
  });
}

/** 获取报销项目列表 */
function fetchReimbursementCateList() {
  getReimbursementCateList({ pageNum: 1, pageSize: 1000 }).then((response) => {
    reimbursementCateOptions.value = response.rows || [];
  });
}

/** 项目选择变更 */
function handleProjectChange(projectId) {
  if (projectId) {
    form.info.projectId = projectId;
    const selectedProject = projectOptions.value.find(
      (item) => item.id === projectId,
    );
    if (selectedProject) {
      form.info.projectName = selectedProject.name;
    }
  } else {
    form.info.projectId = "";
    form.info.projectName = "";
  }
}

/** 新增报销明细 */
function addInterfix() {
  form.interfix.push({
    amount: undefined,
    cateId: "",
    remarks: "",
    adminId: userStore.id
  });
}

/** 删除报销明细 */
function removeInterfix(index) {
  if (form.interfix.length === 1) {
    ElMessage.warning("至少保留一条报销明细");
    return;
  }
  form.interfix.splice(index, 1);
}

/** 重置表单 */
function resetForm() {
  form.id = undefined;
  form.info = {
    adminId: userStore.id,
    adminName: userStore.nickName,
    did: userStore.deptId,
    deptName: userStore.deptName,
    subjectId: "",
    code: "",
    expenseTime: "",
    incomeMonth: "",
    projectId: "",
    projectName: "",
    loanId: "",
  };
  form.interfix = [
    {
      amount: undefined,
      cateId: "",
      remarks: "",
      adminId: userStore.id
    }
  ];
  formRef.value?.clearValidate();
}

/** 填充表单数据 */
function setFormData(data) {
  form.id = data.id;
  form.info = {
    adminId: data.adminId || "",
    adminName: data.adminName || "",
    did: data.did || "",
    deptName: data.deptName || "",
    subjectId: data.subjectId || "",
    code: data.code || "",
    expenseTime: data.expenseTime || "",
    incomeMonth: data.incomeMonth || "",
    projectId: data.projectId || "",
    projectName: data.projectName || "",
    loanId: data.loanId || "",
  };

  // 处理报销明细数据 - 兼容多种可能的字段名
  const detailList = data.interfix || data.items || data.details || data.list || [];
  if (detailList.length > 0) {
    form.interfix = detailList.map(item => ({
      amount: item.amount,
      cateId: item.cateId,
      remarks: item.remarks,
      adminId: item.adminId || form.info.adminId
    }));
  } else {
    form.interfix = [
      {
        amount: undefined,
        cateId: "",
        remarks: "",
        adminId: form.info.adminId
      }
    ];
  }
}

/** 获取表单数据 */
function getFormData() {
  return { ...form };
}

/** 初始化数据 */
onMounted(() => {
  // 初始化当前用户信息
  form.info.adminId = userStore.id;
  form.info.adminName = userStore.nickName;
  form.info.did = userStore.deptId;
  form.info.deptName = userStore.deptName;
  form.interfix.forEach(item => {
    item.adminId = userStore.id;
  });

  getEnterpriseList();
  getLoanOptions();
  fetchReimbursementCateList();
  getProjectOptions();
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

.interfix-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #fafafa;
}

.interfix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.interfix-title {
  font-weight: bold;
  color: #303133;
}

</style>
