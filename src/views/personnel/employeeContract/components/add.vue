<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="800px"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="合同类别" prop="cate">
        <el-select
          v-model="form.cate"
          :disabled="true"
          style="width:100%"
          placeholder="自动获取"
        >
          <el-option label="劳动合同" :value="1" />
          <el-option label="劳务合同" :value="2" />
          <el-option label="实习协议" :value="3" />
          <el-option label="保密协议" :value="4" />
        </el-select>
      </el-form-item>

      <el-form-item label="合同类型" prop="types" required>
        <el-select
          v-model="form.types"
          :disabled="isView"
          style="width:100%"
          placeholder="请选择合同类型"
        >
          <el-option label="新签合同" :value="1" />
          <el-option label="续签合同" :value="2" />
          <el-option label="合同变更" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="员工姓名" prop="uid" required>
        <el-select
          v-model="form.uid"
          :disabled="isView"
          placeholder="请选择员工"
          clearable
          style="width:100%"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="签约主体公司" prop="enterpriseId" required>
        <el-select
          v-model="form.enterpriseId"
          :disabled="isView"
          placeholder="请选择签约主体公司"
          clearable
          style="width:100%"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="合同名称" prop="title" required>
        <el-input
          v-model="form.title"
          :disabled="isView"
          style="width:100%"
          placeholder="请输入合同名称"
        />
      </el-form-item>

      <el-form-item label="合同编号" prop="code" required>
        <el-input
          v-model="form.code"
          :disabled="isView"
          style="width:100%"
          placeholder="请输入合同编号"
        />
      </el-form-item>

      <el-form-item label="签订日期" prop="signTime" required>
        <el-date-picker
          v-model="form.signTime"
          type="date"
          value-format="YYYY-MM-DD"
          :disabled="isView"
          style="width:100%"
          placeholder="请选择签订日期"
        />
      </el-form-item>

      <el-form-item label="生效时间" prop="startTime" required>
        <el-date-picker
          v-model="form.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          :disabled="isView"
          style="width:100%"
          placeholder="请选择生效时间"
        />
      </el-form-item>

      <el-form-item label="失效时间" prop="endTime" required>
        <el-date-picker
          v-model="form.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          :disabled="isView"
          style="width:100%"
          placeholder="请选择失效时间"
        />
      </el-form-item>

      <!-- 劳动合同专属字段 -->
      <template v-if="form.cate === 1">
        <el-form-item label="试用月数" prop="trialMonths">
          <el-input-number
            v-model="form.trialMonths"
            :min="1"
            :disabled="isView"
            style="width:100%"
            placeholder="请输入试用月数"
          />
        </el-form-item>

        <el-form-item label="试用期结束时间" prop="trialEndTime">
          <el-date-picker
            v-model="form.trialEndTime"
            type="date"
            value-format="YYYY-MM-DD"
            :disabled="isView"
            style="width:100%"
            placeholder="请选择试用期结束日期"
          />
        </el-form-item>

        <el-form-item label="试用工资" prop="trialSalary" required>
          <el-input
            v-model="form.trialSalary"
            :disabled="isView"
            style="width:100%"
            placeholder="请输入试用工资"
          />
        </el-form-item>

        <el-form-item label="转正工资" prop="workerSalary" required>
          <el-input
            v-model="form.workerSalary"
            :disabled="isView"
            style="width:100%"
            placeholder="请输入转正工资"
          />
        </el-form-item>
      </template>

      <!-- 劳务/实习专属 -->
      <template v-if="form.cate === 2 || form.cate === 3">
        <el-form-item label="工资费用" prop="workerSalary" required>
          <el-input
            v-model="form.workerSalary"
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
import { getPageList } from '@/api/base/common/businessEntity/index.js';
import { addDeptChange, updateDeptChange } from "@/api/personnel/employeeContract/index.js";

const emit = defineEmits(["success"]);

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);
const userOptions = ref([]);
const companyList = ref([]);

// 合同类别映射
const categoryMap = {
  '劳动合同': 1,
  '劳务合同': 2,
  '实习协议': 3,
  '保密协议': 4
};

const form = reactive({
  cate: null,
  types: 1,
  uid: "",
  enterpriseId: "",
  title: "",
  code: "",
  signTime: "",
  startTime: "",
  endTime: "",
  trialMonths: 1,
  trialEndTime: "",
  trialSalary: "",
  workerSalary: "",
  remark: ""
});

const dialogTitle = computed(() => {
  return isView.value ? "查看合同" : isEdit.value ? "编辑合同" : "新增合同";
});

const rules = {
  cate: [{ required: true, message: "合同类别不能为空" }],
  types: [{ required: true, message: "请选择合同类型" }],
  uid: [{ required: true, message: "请选择员工" }],
  enterpriseId: [{ required: true, message: "请选择签约主体公司" }],
  title: [{ required: true, message: "请输入合同名称" }],
  code: [{ required: true, message: "请输入合同编号" }],
  signTime: [{ required: true, message: "请选择签订日期" }],
  startTime: [{ required: true, message: "请选择生效时间" }],
  endTime: [{ required: true, message: "请选择失效时间" }],
  trialMonths: [{ pattern: /^[1-9]\d*$/, message: "试用月数必须是正整数" }],
  trialSalary: [{ required: true, message: "请输入工资费用" },
    { 
      validator: (rule, value, callback) => {
        if (value === '' || value === null || value === undefined) {
          callback();
          return;
        }
        const num = Number(value);
        if (isNaN(num)) {
          callback(new Error('请输入数字'));
        } else if (num <= 0) {
          callback(new Error('工资必须大于0'));
        } else if (!Number.isInteger(num) && !/^\d+(\.\d{1,2})?$/.test(value)) {
          callback(new Error('最多保留两位小数'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  workerSalary: [{ required: true, message: "请输入工资费用" },
    { 
      validator: (rule, value, callback) => {
        if (value === '' || value === null || value === undefined) {
          callback();
          return;
        }
        const num = Number(value);
        if (isNaN(num)) {
          callback(new Error('请输入数字'));
        } else if (num <= 0) {
          callback(new Error('工资必须大于0'));
        } else if (!Number.isInteger(num) && !/^\d+(\.\d{1,2})?$/.test(value)) {
          callback(new Error('最多保留两位小数'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
};

onMounted(() => {
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(user => user.status === 0 || user.status === '0');
  });
  getPageList({ pageSize: 1000, pageNum: 1 }).then(res => {
    companyList.value = res.rows || [];
  });
});

function reset() {
  Object.assign(form, {
    cate: null, 
    types: 1, 
    uid: "", 
    enterpriseId: "", 
    title: "", 
    code: "",
    signTime: "", 
    startTime: "", 
    endTime: "", 
    trialMonths: 1, 
    trialEndTime: "",
    trialSalary: "", 
    workerSalary: "", 
    remark: ""
  });
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
}

function handleClose() {
  dialogVisible.value = false;
  reset();
}

// 新增时 cate 传数字
function open(category) {
  reset();
  if (typeof category === 'string') {
    form.cate = categoryMap[category];
  } else {
    form.cate = category;
  }
  dialogVisible.value = true;
}

function openEdit(data) {
  reset();
  // 只复制需要的字段，排除多余字段
  form.id = data.id;
  form.cate = data.cate;
  form.types = data.types;
  form.uid = data.uid;
  form.enterpriseId = data.enterpriseId;
  form.title = data.title;
  form.code = data.code;
  form.signTime = data.signTime;
  form.startTime = data.startTime;
  form.endTime = data.endTime;
  form.trialMonths = data.trialMonths;
  form.trialEndTime = data.trialEndTime;
  form.trialSalary = data.trialSalary;
  form.workerSalary = data.workerSalary;
  form.remark = data.remark;
  
  isEdit.value = true;
  dialogVisible.value = true;
}

function openView(data) {
  reset();
  // 只复制需要的字段，排除多余字段
  form.id = data.id;
  form.cate = data.cate;
  form.types = data.types;
  form.uid = data.uid;
  form.enterpriseId = data.enterpriseId;
  form.title = data.title;
  form.code = data.code;
  form.signTime = data.signTime;
  form.startTime = data.startTime;
  form.endTime = data.endTime;
  form.trialMonths = data.trialMonths;
  form.trialEndTime = data.trialEndTime;
  form.trialSalary = data.trialSalary;
  form.workerSalary = data.workerSalary;
  form.remark = data.remark;
  
  isView.value = true;
  dialogVisible.value = true;
}

// 构建提交数据（新增和编辑使用相同的结构）
const buildSubmitData = () => {
  return {
    cate: parseInt(form.cate) || 1,
    types: parseInt(form.types) || 1,
    uid: parseInt(form.uid) || 0,
    enterpriseId: parseInt(form.enterpriseId) || 0,
    title: form.title || "",
    code: form.code || "",
    signTime: form.signTime || "",
    startTime: form.startTime || "",
    endTime: form.endTime || "",
    trialMonths: parseInt(form.trialMonths) || 1,
    trialEndTime: form.trialEndTime || "",
    trialSalary: form.trialSalary || "",
    workerSalary: form.workerSalary || "",
    remark: form.remark || ""
  };
};

async function handleSubmit() {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  const submitData = buildSubmitData();
  
  // 编辑时添加 id
  if (isEdit.value && form.id) {
    submitData.id = form.id;
  }
  
  try {
    if (isEdit.value) {
      await updateDeptChange(submitData);
    } else {
      await addDeptChange(submitData);
    }
    ElMessage.success("操作成功");
    dialogVisible.value = false;
    emit("success");
  } catch (err) {
    console.error('提交失败:', err);
    ElMessage.error(err.msg || "操作失败");
  }
}

defineExpose({ open, openEdit, openView });
</script>

<style scoped>
.dialog-footer {
  text-align: right !important;
}
</style>