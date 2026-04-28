<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="readonly ? {} : rules"
    label-width="120px"
  >
    <!-- 收票信息 -->
    <div class="form-section-title">收票信息</div>

    <!-- 第一行：发票金额 + 发票号码 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="发票金额" prop="amount">
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
        <el-form-item label="发票号码" prop="code">
          <el-input
            v-model="form.code"
            placeholder="请输入发票号码"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第二行：发票类型 + 发票日期 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="发票类型" prop="invoiceType">
          <el-select
            v-model="form.invoiceType"
            :disabled="readonly"
            placeholder="请选择发票类型"
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
      <el-col :span="12">
        <el-form-item label="发票日期" prop="openTime">
          <el-date-picker
            v-model="form.openTime"
            type="date"
            placeholder="请选择发票日期"
            :disabled="readonly"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第三行：发票抬头 + 开票主体(供应商) -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="发票抬头" prop="invoiceTitle">
          <el-select
            v-model="form.invoiceTitle"
            :disabled="readonly"
            placeholder="请选择发票抬头"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in enterpriseOptions"
              :key="item.id"
              :label="item.title"
              :value="item.title"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="开票主体" prop="supplierId">
          <el-select
            v-model="form.supplierId"
            :disabled="readonly"
            placeholder="请选择供应商"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in customerOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 其他信息 -->
    <div class="form-section-title">其他信息</div>

    <!-- 第四行：关联合同 + 关系项目 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="关联合同" prop="purchaseId">
          <el-select
            v-model="form.purchaseId"
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
        <el-form-item label="关系项目" prop="projectId">
          <el-select
            v-model="form.projectId"
            :disabled="readonly"
            placeholder="请选择关系项目"
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

    <!-- 第五行：备注信息 -->
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
import { getPageList as getCustomerPageList } from "@/api/customer/list";
import { deptTreeSelect } from "@/api/system/user.js";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const { invoice_type } = proxy.useDict("invoice_type");
const userStore = useUserStore();

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
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
const customerOptions = ref([]);
const deptOptions = ref([]);

// 当前登录用户信息
const currentUserInfo = ref({
  userId: "",
  deptId: ""
});

// 表单数据
const form = reactive({
  id: undefined,
  amount: undefined,
  code: "",
  invoiceType: "",
  openTime: "",
  invoiceTitle: "",
  supplierId: "",
  purchaseId: "",
  projectId: "",
  remark: "",
  adminId: "",
  did: "",
});

// 验证规则
const rules = {
  amount: [{ required: true, message: "请输入发票金额", trigger: "blur" }],
  invoiceType: [{ required: true, message: "请选择发票类型", trigger: "change" }],
  invoiceTitle: [{ required: true, message: "请选择发票抬头", trigger: "change" }],
  supplierId: [{ required: true, message: "请选择供应商", trigger: "change" }],
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

/** 获取客户列表 */
function getCustomerList() {
  getCustomerPageList({ pageNum: 1, pageSize: 100 }).then((response) => {
    customerOptions.value = response.rows || [];
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
  form.amount = undefined;
  form.code = "";
  form.invoiceType = "";
  form.openTime = "";
  form.invoiceTitle = "";
  form.supplierId = "";
  form.purchaseId = "";
  form.projectId = "";
  form.remark = "";
  form.adminId = currentUserInfo.value.userId;
  form.did = currentUserInfo.value.deptId;
  formRef.value?.clearValidate();
}

/** 填充表单数据 */
function setFormData(data) {
  form.id = data.id;
  form.amount = data.amount || undefined;
  form.code = data.code || "";
  form.invoiceType = data.invoiceType !== undefined && data.invoiceType !== null ? String(data.invoiceType) : "";
  form.openTime = data.openTime || "";
  form.invoiceTitle = data.invoiceTitle || "";
  form.supplierId = data.supplierId || "";
  form.purchaseId = data.purchaseId || "";
  form.projectId = data.projectId || "";
  form.remark = data.remark || "";
  form.adminId = data.adminId || currentUserInfo.value.userId;
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
  form.did = currentUserInfo.value.deptId;
}

/** 初始化数据 */
onMounted(() => {
  setCurrentUserInfo();
  getContractList();
  getProjectList();
  getEnterpriseList();
  getCustomerList();
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