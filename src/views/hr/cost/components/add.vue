<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="1100px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="180px"
      :disabled="isView"
    >
      <el-divider content-position="left">基础信息</el-divider>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="月份" prop="statMonth">
            <el-date-picker
              v-model="form.statMonth"
              type="month"
              value-format="YYYY-MM"
              placeholder="请选择月份"
              style="width: 100%"
              :disabled="isEdit || isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="组织架构" prop="orgId">
            <el-tree-select
              v-model="form.orgId"
              :data="deptTree"
              :props="treeProps"
              node-key="id"
              check-strictly
              placeholder="请选择组织架构"
              style="width: 100%"
              :disabled="isEdit || isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="城市" prop="cityId">
            <el-cascader
              v-model="form.cityId"
              :options="areaTree"
              :props="cascaderProps"
              placeholder="请选择城市"
              style="width: 100%"
              :show-all-levels="false"
              :disabled="isEdit || isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="员工状态" prop="employeeStatus">
            <el-select
              v-model="form.employeeStatus"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="在职" value="在职" />
              <el-option label="离职" value="离职" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名" prop="employeeName">
            <el-input
              v-model="form.employeeName"
              placeholder="请输入"
              maxlength="100"
              :disabled="isEdit || isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证号码" prop="idCard">
            <el-input
              v-model="form.idCard"
              placeholder="请输入"
              maxlength="32"
              :disabled="isEdit || isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入职日期" prop="entryDate">
            <el-date-picker
              v-model="form.entryDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入职记录" prop="entryRecordDate">
            <el-select
              v-model="form.entryRecordDate"
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option label="新入职" value="新入职" />
              <el-option label="重新入职" value="重新入职" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目前所在项目" prop="projectName">
            <el-input v-model="form.projectName" placeholder="请输入" maxlength="255" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">薪资与加减项</el-divider>
      <el-row :gutter="16">
        <el-col v-for="field in salaryFields" :key="field.prop" :span="8">
          <el-form-item :label="field.label">
            <el-select
              v-if="field.prop === 'salaryRatio'"
              v-model="form[field.prop]"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="80%" :value="0.8" />
              <el-option label="100%" :value="1" />
            </el-select>
            <el-input-number
              v-else
              v-model="form[field.prop]"
              :precision="2"
              :min="0"
              :controls="false"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">社保公积金</el-divider>
      <el-row :gutter="16">
        <el-col v-for="field in insuranceFields" :key="field.prop" :span="8">
          <el-form-item :label="field.label">
            <el-input-number
              v-model="form[field.prop]"
              :precision="2"
              :min="0"
              :controls="false"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">系统计算字段（只读）</el-divider>
      <el-row :gutter="16">
        <el-col v-for="field in computedFields" :key="field.prop" :span="8">
          <el-form-item :label="field.label">
            <el-input :model-value="formatMoney(form[field.prop])" readonly />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          placeholder="请输入"
          type="textarea"
          :rows="3"
          maxlength="1000"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button
        v-if="!isView"
        type="primary"
        :loading="submitting"
        @click="handleSubmit"
        >确 定</el-button
      >
      <el-button @click="visible = false">{{
        isView ? "关 闭" : "取 消"
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref, watch, getCurrentInstance } from "vue";
import dayjs from "dayjs";
import { add, edit, getFilterOptions } from "@/api/hr/cost/index.js";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["success"]);

const visible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);
const isView = ref(false);
const title = ref("新增");
const formRef = ref(null);
const deptTree = ref([]);
const areaTree = ref([]);
const treeProps = { value: "id", label: "label", children: "children" };
const cascaderProps = {
  value: "id",
  label: "label",
  children: "children",
  emitPath: false,
  checkStrictly: false,
};

const salaryFields = [
  { prop: "contractSalary", label: "合同工资" },
  { prop: "salaryRatio", label: "算薪比例", precision: 2 },
  { prop: "baseSalary", label: "基本工资" },
  { prop: "performanceSalary", label: "绩效工资" },
  { prop: "postSalary", label: "岗位工资" },
  { prop: "attendanceDays", label: "考勤（天）", precision: 2 },
  { prop: "customerFeeTaxIncluded", label: "客户费用单（含税）" },
  { prop: "computerSubsidy", label: "电脑补助（加）" },
  { prop: "mealSubsidy", label: "工作日餐补（加）" },
  { prop: "bonus", label: "奖金（加）" },
  { prop: "subsidy", label: "补助（加）" },
  { prop: "deduction", label: "扣款（减）" },
  { prop: "otherDeduction", label: "其他扣款（减）" },
];

const insuranceFields = [
  { prop: "pensionPersonal", label: "养老个人部分" },
  { prop: "medicalPersonal", label: "医疗个人部分" },
  { prop: "unemploymentPersonal", label: "失业个人部分" },
  { prop: "housingFundPersonal", label: "公积金个人部分" },
  { prop: "incomeTax", label: "个税代扣代缴" },
  { prop: "pensionCompany", label: "养老单位部分" },
  { prop: "unemploymentCompany", label: "失业单位部分" },
  { prop: "injuryCompany", label: "工伤单位部分" },
  { prop: "medicalMaternityCompany", label: "（医疗+生育）单位部分" },
  { prop: "housingFundCompany", label: "公积金单位部分" },
  { prop: "socialBase", label: "社保基数" },
  { prop: "housingFundBase", label: "公积金基数" },
];

const computedFields = [
  { prop: "grossSalary", label: "未扣五险一金薪资总额" },
  { prop: "socialPersonalTotal", label: "社保个人合计" },
  { prop: "taxableSalary", label: "扣除五险一金税前工资" },
  { prop: "bankPayAmount", label: "银行实际支付金额" },
  { prop: "socialCompanyTotal", label: "社保单位合计" },
  { prop: "socialTotal", label: "社保总合计" },
  { prop: "housingFundTotal", label: "公积金总合计" },
  { prop: "companyTotalCost", label: "企业总成本" },
  { prop: "taxExcludedRevenue", label: "不含税收入" },
  { prop: "grossProfit", label: "毛利" },
  { prop: "taxDeclarationAmount", label: "个税申报金额" },
];

const inputFields = [...salaryFields, ...insuranceFields].map(
  (item) => item.prop,
);

const defaultForm = () => ({
  id: undefined,
  statMonth: dayjs().format("YYYY-MM"),
  employeeStatus: "在职",
  cityId: undefined,
  cityName: "",
  orgId: undefined,
  orgName: "",
  employeeName: "",
  idCard: "",
  entryDate: "",
  entryRecordDate: "",
  projectName: "",
  remark: "",
  ...Object.fromEntries(inputFields.map((key) => [key, null])),
  ...Object.fromEntries(computedFields.map((item) => [item.prop, 0])),
  salaryRatio: null,
});

const form = reactive(defaultForm());
const rules = {
  statMonth: [{ required: true, message: "请选择月份", trigger: "change" }],
  orgId: [{ required: true, message: "请选择组织架构", trigger: "change" }],
  cityId: [{ required: true, message: "请选择城市", trigger: "change" }],
  employeeName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  idCard: [{ required: true, message: "请输入身份证号码", trigger: "blur" }],
};

const number = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatMoney = (value) => number(value).toFixed(2);

function recalc() {
  const f = form;
  f.grossSalary =
    number(f.baseSalary) +
    number(f.performanceSalary) +
    number(f.postSalary) +
    number(f.computerSubsidy) +
    number(f.mealSubsidy) +
    number(f.bonus) +
    number(f.subsidy) -
    number(f.deduction) -
    number(f.otherDeduction);
  f.socialPersonalTotal =
    number(f.pensionPersonal) +
    number(f.medicalPersonal) +
    number(f.unemploymentPersonal);
  f.taxableSalary =
    f.grossSalary - f.socialPersonalTotal - number(f.housingFundPersonal);
  f.bankPayAmount = f.taxableSalary - number(f.incomeTax);
  f.socialCompanyTotal =
    number(f.pensionCompany) +
    number(f.unemploymentCompany) +
    number(f.injuryCompany) +
    number(f.medicalMaternityCompany);
  f.socialTotal = f.socialPersonalTotal + f.socialCompanyTotal;
  f.housingFundTotal =
    number(f.housingFundPersonal) + number(f.housingFundCompany);
  f.companyTotalCost =
    f.grossSalary + f.socialCompanyTotal + number(f.housingFundCompany);
  f.taxExcludedRevenue = number(f.customerFeeTaxIncluded) / 1.06;
  f.grossProfit = f.taxExcludedRevenue - f.companyTotalCost;
  f.taxDeclarationAmount = f.taxableSalary;
}

watch(
  () => inputFields.map((key) => form[key]),
  () => recalc(),
  { deep: true },
);

onMounted(async () => {
  try {
    const res = await getFilterOptions();
    const data = res.data || res || {};
    deptTree.value = data.deptTree || [];
    areaTree.value = data.areaTree || [];
  } catch (error) {
    console.error(error);
  }
});

function normalizeDetail(row = {}) {
  const data = { ...row };
  for (const key of [
    ...inputFields,
    ...computedFields.map((item) => item.prop),
    "orgId",
    "cityId",
  ]) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      const parsed = Number(data[key]);
      if (!Number.isNaN(parsed)) {
        data[key] = parsed;
      }
    }
  }
  // 日期选择器绑定的是字符串日期，用后端格式化的 xxxStr 字段回填
  data.entryDate = data.entryDateStr || "";
  return data;
}

function reset() {
  Object.assign(form, defaultForm());
  formRef.value?.clearValidate();
}

function open() {
  reset();
  isEdit.value = false;
  isView.value = false;
  title.value = "新增";
  visible.value = true;
  recalc();
}

function openEdit(row) {
  reset();
  isEdit.value = true;
  isView.value = false;
  title.value = "编辑";
  Object.assign(form, normalizeDetail(row));
  visible.value = true;
  recalc();
}

function openView(row) {
  reset();
  isEdit.value = false;
  isView.value = true;
  title.value = "查看";
  Object.assign(form, normalizeDetail(row));
  visible.value = true;
  recalc();
}

async function handleSubmit() {
  await formRef.value.validate();
  submitting.value = true;
  try {
    const payload = { ...form };
    delete payload.entryDateStr;
    delete payload.entryRecordDateStr;
    delete payload.seq;
    if (!isEdit.value) {
      delete payload.id;
    }
    if (isEdit.value) {
      await edit(payload);
      proxy.$modal.msgSuccess("修改成功");
    } else {
      await add(payload);
      proxy.$modal.msgSuccess("新增成功");
    }
    visible.value = false;
    emit("success");
  } finally {
    submitting.value = false;
  }
}

defineExpose({ open, openEdit, openView });
</script>
