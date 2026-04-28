<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="readonly ? {} : rules"
    label-width="120px"
  >
    <!-- 第一行：预回款金额 + 收款主体 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="预回款金额" prop="amount">
          <el-input-number
            v-model="form.amount"
            :min="0"
            :precision="2"
            placeholder="请输入预回款金额"
            :disabled="readonly"
            style="width: 100%; padding-right: 30px"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="收款主体" prop="invoiceSubject">
          <el-select
            v-model="form.invoiceSubject"
            :disabled="readonly"
            placeholder="请选择收款主体"
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
    </el-row>

    <!-- 第二行：付款主体类型 + 付款方名称 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="付款主体类型" prop="types">
          <el-select
            v-model="form.types"
            :disabled="readonly"
            placeholder="请选择付款主体类型"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="dict in invoice_title_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="付款方名称" prop="invoiceTitle">
          <el-input
            v-model="form.invoiceTitle"
            placeholder="请输入付款方名称"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第三行：纳税人识别号 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="纳税人识别号" prop="invoiceTax">
          <el-input
            v-model="form.invoiceTax"
            placeholder="请输入纳税人识别号或者身份证"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第四行：关联合同 + 关联项目 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="关联合同" prop="contractId">
          <el-select
            v-model="form.contractId"
            :disabled="readonly"
            placeholder="请选择关联合同"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in contractOptions"
              :key="item.id"
              :label="item.contractName || item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="关联项目" prop="projectId">
          <el-select
            v-model="form.projectId"
            :disabled="readonly"
            placeholder="请选择关联项目"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.projectName || item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 开票类型(隐藏) -->
    <el-form-item label="开票类型" prop="invoiceType" v-show="false">
      <el-select
        v-model="form.invoiceType"
        :disabled="readonly"
        placeholder="请选择开票类型"
        clearable
        style="width: 100%"
      >
        <el-option
          v-for="dict in invoice_type"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup name="InvoiceFormData">
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import { getPageList as getContractPageList } from "@/api/contract/salesContract";
import { getPageList as getProjectPageList } from "@/api/project/itemList";
import { getPageList as getEnterprisePageList } from "@/api/base/common/businessEntity/index.js";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const { invoice_title_type, invoice_type } = proxy.useDict("invoice_title_type", "invoice_type");
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
const contractOptions = ref([]);
const projectOptions = ref([]);
const enterpriseOptions = ref([]);

// 当前登录用户信息
const currentUserInfo = ref({
  userId: "",
  deptId: ""
});

// 表单数据
const form = reactive({
  id: undefined,
  types: "",
  invoiceType: "0",
  invoiceTitle: "",
  invoiceTax: "",
  amount: undefined,
  invoiceSubject: "",
  contractId: "",
  projectId: "",
  adminId: "",
  did: "",
});

// 验证规则
const rules = {
  types: [{ required: true, message: "请选择付款主体类型", trigger: "change" }],
  invoiceTitle: [{ required: true, message: "请输入付款方名称", trigger: "blur" }],
  invoiceTax: [{ required: true, message: "请输入纳税人识别号", trigger: "blur" }],
  amount: [{ required: true, message: "请输入预回款金额", trigger: "blur" }],
  invoiceSubject: [{ required: true, message: "请选择收款主体", trigger: "change" }],
};

/** 获取合同列表 */
function getContractList() {
  getContractPageList({ pageNum: 1, pageSize: 1000 }).then((response) => {
    contractOptions.value = response.rows || [];
  });
}

/** 获取项目列表 */
function getProjectList() {
  getProjectPageList({ pageNum: 1, pageSize: 1000 }).then((response) => {
    projectOptions.value = response.rows || [];
  });
}

/** 获取企业主体列表 */
function getEnterpriseList() {
  getEnterprisePageList({ pageNum: 1, pageSize: 20 }).then((response) => {
    enterpriseOptions.value = response.rows || [];
  });
}

/** 重置表单 */
function resetForm() {
  form.id = undefined;
  form.types = "";
  form.invoiceType = "0";
  form.invoiceTitle = "";
  form.invoiceTax = "";
  form.amount = undefined;
  form.invoiceSubject = "";
  form.contractId = "";
  form.projectId = "";
  form.adminId = currentUserInfo.value.userId;
  form.did = currentUserInfo.value.deptId;
  formRef.value?.clearValidate();
}

/** 填充表单数据 */
function setFormData(data) {
  form.id = data.id;
  form.types = data.types !== undefined && data.types !== null ? String(data.types) : "";
  form.invoiceType = data.invoiceType !== undefined && data.invoiceType !== null ? String(data.invoiceType) : "0";
  form.invoiceTitle = data.invoiceTitle || "";
  form.invoiceTax = data.invoiceTax || "";
  form.amount = data.amount || undefined;
  form.invoiceSubject = data.invoiceSubject || "";
  form.contractId = data.contractId || "";
  form.projectId = data.projectId || "";
  form.adminId = data.adminId || "";
  // did 始终设置为当前登录人所在的部门
  form.did = currentUserInfo.value.deptId;
}

/** 获取表单数据 */
function getFormData() {
  return { ...form };
}

/** 设置当前登录用户信息 */
function setCurrentUserInfo() {
  currentUserInfo.value = {
    userId: userStore.id || "",
    deptId: userStore.deptId || ""
  };
  form.adminId = currentUserInfo.value.userId;
  form.adminName = userStore.nickName || "";
  form.did = currentUserInfo.value.deptId;
}

/** 初始化数据 */
onMounted(() => {
  setCurrentUserInfo();
  getContractList();
  getProjectList();
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
</style>
