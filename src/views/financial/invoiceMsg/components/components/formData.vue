<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="readonly ? {} : rules"
    label-width="120px"
  >
    <!-- 发票信息 -->
    <div class="form-section-title">发票信息</div>

    <!-- 第一行：抬头类型 + 开票类型 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="抬头类型" prop="types">
          <el-select
            v-model="form.types"
            :disabled="readonly"
            placeholder="请选择抬头类型"
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
        <el-form-item label="开票类型" prop="invoiceType">
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
      </el-col>
    </el-row>

    <!-- 第二行：发票抬头 + 纳税人识别号 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="发票抬头" prop="invoiceTitle">
          <el-input
            v-model="form.invoiceTitle"
            placeholder="请输入发票抬头"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="纳税人识别号" prop="invoiceTax">
          <el-input
            v-model="form.invoiceTax"
            placeholder="请输入纳税人识别号"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第三行：发票金额 + 开票主体 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="发票金额(元)" prop="amount">
          <el-input-number
            v-model="form.amount"
            :min="0"
            :precision="2"
            placeholder="请输入发票金额"
            :disabled="readonly"
            style="width: 100%; padding-right: 30px"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="开票主体" prop="invoiceSubject">
          <el-select
            v-model="form.invoiceSubject"
            :disabled="readonly"
            placeholder="请选择开票主体"
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

    <!-- 第四行：电话号码 + 地址 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="电话号码" prop="invoicePhone">
          <el-input
            v-model="form.invoicePhone"
            placeholder="请输入电话号码"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="地址" prop="invoiceAddress">
          <el-input
            v-model="form.invoiceAddress"
            placeholder="请输入地址"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 开户行信息 -->
    <div class="form-section-title">开户行信息</div>

    <!-- 第五行：开户行 + 银行账户 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="开户行" prop="invoiceBank">
          <el-input
            v-model="form.invoiceBank"
            placeholder="请输入开户行"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="银行账户" prop="invoiceAccount">
          <el-input
            v-model="form.invoiceAccount"
            placeholder="请输入银行账户"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第六行：银行营业网点 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="银行营业网点" prop="invoiceBanking">
          <el-input
            v-model="form.invoiceBanking"
            placeholder="请输入银行营业网点"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 其他信息 -->
    <div class="form-section-title">其他信息</div>

    <!-- 第八行：关联合同 + 关联项目 -->
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

    <!-- 第八行：备注信息 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="备注信息" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup name="InvoiceFormData">
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import { getPageList as getContractPageList } from "@/api/contract/salesContract";
import { getPageList as getProjectPageList } from "@/api/project/itemList";
import { getPageList as getEnterprisePageList } from "@/api/base/common/businessEntity/index.js";
import { deptTreeSelect } from "@/api/system/user.js";
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
const deptOptions = ref([]);

// 当前登录用户信息
const currentUserInfo = ref({
  userId: "",
  deptId: ""
});

// 当前登录用户部门名称
const deptName = ref("");

// 表单数据
const form = reactive({
  id: undefined,
  types: "",
  invoiceType: "",
  invoiceTitle: "",
  invoiceTax: "",
  amount: undefined,
  invoiceSubject: "",
  invoicePhone: "",
  invoiceAddress: "",
  invoiceBank: "",
  invoiceAccount: "",
  invoiceBanking: "",
  contractId: "",
  projectId: "",
  remark: "",
  adminId: "",
  did: "",
});

// 验证规则
  const rules = {
    types: [{ required: true, message: "请选择抬头类型", trigger: "change" }],
    invoiceType: [{ required: true, message: "请选择开票类型", trigger: "change" }],
    invoiceTitle: [{ required: true, message: "请输入发票抬头", trigger: "blur" }],
    invoiceTax: [{ required: true, message: "请输入纳税人识别号", trigger: "blur" }],
    amount: [{ required: true, message: "请输入发票金额", trigger: "blur" }],
    invoiceSubject: [{ required: true, message: "请选择开票主体", trigger: "change" }],
    invoicePhone: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
    invoiceAddress: [{ required: true, message: "请输入地址", trigger: "blur" }],
    invoiceBank: [{ required: true, message: "请输入开户行", trigger: "blur" }],
    invoiceAccount: [{ required: true, message: "请输入银行账户", trigger: "blur" }],
    invoiceBanking: [{ required: true, message: "请输入银行营业网点", trigger: "blur" }],
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

/** 获取部门树 */
function getDeptTree() {
  deptTreeSelect().then((response) => {
    deptOptions.value = response.data || [];
  });
}

/** 重置表单 */
function resetForm() {
  form.id = undefined;
  form.types = "";
  form.invoiceType = "";
  form.invoiceTitle = "";
  form.invoiceTax = "";
  form.amount = undefined;
  form.invoiceSubject = "";
  form.invoicePhone = "";
  form.invoiceAddress = "";
  form.invoiceBank = "";
  form.invoiceAccount = "";
  form.invoiceBanking = "";
  form.contractId = "";
  form.projectId = "";
  form.remark = "";
  form.adminId = currentUserInfo.value.userId;
  form.did = currentUserInfo.value.deptId;
  formRef.value?.clearValidate();
}

/** 填充表单数据 */
function setFormData(data) {
  form.id = data.id;
  form.types = data.types !== undefined && data.types !== null ? String(data.types) : "";
  form.invoiceType = data.invoiceType !== undefined && data.invoiceType !== null ? String(data.invoiceType) : "";
  form.invoiceTitle = data.invoiceTitle || "";
  form.invoiceTax = data.invoiceTax || "";
  form.amount = data.amount || undefined;
  form.invoiceSubject = data.invoiceSubject || "";
  form.invoicePhone = data.invoicePhone || "";
  form.invoiceAddress = data.invoiceAddress || "";
  form.invoiceBank = data.invoiceBank || "";
  form.invoiceAccount = data.invoiceAccount || "";
  form.invoiceBanking = data.invoiceBanking || "";
  form.contractId = data.contractId || "";
  form.projectId = data.projectId || "";
  form.remark = data.remark || "";
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
  deptName.value = userStore.deptName || "";
}

/** 初始化数据 */
onMounted(() => {
  setCurrentUserInfo();
  getContractList();
  getProjectList();
  getEnterpriseList();
  getDeptTree();
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
