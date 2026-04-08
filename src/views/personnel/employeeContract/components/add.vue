<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="800px"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="合同类别" prop="contractCategory">
        <el-input
          v-model="form.contractCategory"
          :disabled="isView"
          style="width:100%"
          placeholder="自动获取"
        />
      </el-form-item>

      <el-form-item label="合同类型" prop="contractType" required>
        <el-select
          v-model="form.contractType"
          :disabled="isView"
          style="width:100%"
          placeholder="请选择合同类型"
        >
          <el-option label="新签合同" value="新签合同" />
          <el-option label="续签合同" value="续签合同" />
        </el-select>
      </el-form-item>

      <el-form-item label="员工姓名" prop="empName" required>
        <el-select
          v-model="form.empName"
          :disabled="isView"
          placeholder="请选择员工"
          clearable
          style="width:100%"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.userName"
            :value="item.userName"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="签约主体公司" prop="company" required>
        <el-input
          v-model="form.company"
          :disabled="isView"
          style="width:100%"
          placeholder="请输入签约主体公司"
        />
      </el-form-item>

      <el-form-item label="合同名称" prop="contractName" required>
        <el-input
          v-model="form.contractName"
          :disabled="isView"
          style="width:100%"
          placeholder="请输入合同名称"
        />
      </el-form-item>

      <el-form-item label="签订日期" prop="signDate" required>
        <el-date-picker
          v-model="form.signDate"
          type="date"
          value-format="YYYY-MM-DD"
          :disabled="isView"
          style="width:100%"
          placeholder="请选择签订日期"
        />
      </el-form-item>

      <el-form-item label="生效时间" prop="effectiveDate" required>
        <el-date-picker
          v-model="form.effectiveDate"
          type="date"
          value-format="YYYY-MM-DD"
          :disabled="isView"
          style="width:100%"
          placeholder="请选择生效时间"
        />
      </el-form-item>

      <el-form-item label="失效时间" prop="expireDate" required>
        <el-date-picker
          v-model="form.expireDate"
          type="date"
          value-format="YYYY-MM-DD"
          :disabled="isView"
          style="width:100%"
          placeholder="请选择失效时间"
        />
      </el-form-item>

      <!-- 劳动合同专属 -->
      <template v-if="form.contractCategory === '劳动合同'">
        <el-form-item label="试用月数" prop="probationMonths">
          <el-input-number
            v-model="form.probationMonths"
            :min="0"
            :disabled="isView"
            style="width:100%"
            placeholder="请输入试用月数"
          />
        </el-form-item>
        <el-form-item label="试用工资" prop="probationSalary">
          <el-input
            v-model="form.probationSalary"
            :disabled="isView"
            style="width:100%"
            placeholder="请输入试用工资"
          />
        </el-form-item>
        <el-form-item label="转正工资" prop="regularSalary">
          <el-input
            v-model="form.regularSalary"
            :disabled="isView"
            style="width:100%"
            placeholder="请输入转正工资"
          />
        </el-form-item>
      </template>

      <!-- 劳务/实习专属 -->
      <template v-if="['劳务合同','实习协议'].includes(form.contractCategory)">
        <el-form-item label="工资费用" prop="salaryCost">
          <el-input
            v-model="form.salaryCost"
            :disabled="isView"
            style="width:100%"
            placeholder="请输入工资费用"
          />
        </el-form-item>
      </template>

      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="4"
          :disabled="isView"
          style="width:100%"
          placeholder="请输入备注信息"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer" style="text-align:right">
        <!-- 查看模式隐藏提交按钮 -->
        <el-button
          type="primary"
          @click="handleSubmit"
          v-if="!isView"
        >
          提交
        </el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddContractDialog">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { listUser } from "@/api/system/user.js";

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false); // 查看模式：true=全部置灰
const userOptions = ref([]);

const form = reactive({
  contractCategory: "",
  contractType: "新签合同",
  empName: "",
  company: "",
  contractName: "",
  signDate: "",
  effectiveDate: "",
  expireDate: "",
  probationMonths: 0,
  probationSalary: "",
  regularSalary: "",
  salaryCost: "",
  remark: ""
});

const dialogTitle = computed(() => {
  return isView.value ? "查看合同" : isEdit.value ? "编辑合同" : "新增合同";
});

const rules = {
  contractCategory: [{ required: true, message: "请选择合同类别" }],
  contractType: [{ required: true, message: "请选择合同类型" }],
  empName: [{ required: true, message: "请选择员工" }],
  contractName: [{ required: true, message: "请输入合同名称" }],
  signDate: [{ required: true, message: "请选择签订日期" }],
  effectiveDate: [{ required: true, message: "请选择生效时间" }],
  expireDate: [{ required: true, message: "请选择失效时间" }],
};

onMounted(() => {
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = res.rows || [];
  });
});

function reset() {
  Object.assign(form, {
    contractCategory: "", contractType: "新签合同", empName: "", company: "", contractName: "",
    signDate: "", effectiveDate: "", expireDate: "", probationMonths:0, probationSalary:"",
    regularSalary:"", salaryCost:"", remark:""
  });
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
}

function handleClose() {
  dialogVisible.value = false;
  reset();
}

function open(category) {
  reset();
  form.contractCategory = category;
  dialogVisible.value = true;
}

function openEdit(data) {
  reset();
  Object.assign(form, data);
  isEdit.value = true;
  dialogVisible.value = true;
}

function openView(data) {
  reset();
  Object.assign(form, data);
  isView.value = true; // 开启查看模式（全部置灰）
  dialogVisible.value = true;
}

async function handleSubmit() {
  const valid = await formRef.value?.validate();
  if (!valid) return;
  ElMessage.success(isEdit.value ? "编辑成功" : "新增成功");
  dialogVisible.value = false;
  emit("success");
}

const emit = defineEmits(["success"]);
defineExpose({ open, openEdit, openView });
</script>