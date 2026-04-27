<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="readonly ? {} : rules"
    label-width="120px"
  >
    <!-- 回款信息 -->
    <div class="form-section-title">回款信息</div>

    <!-- 第一行：回款日期 + 回款金额 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="回款日期" prop="enterTime">
          <el-date-picker
            v-model="form.enterTime"
            type="date"
            placeholder="请选择回款日期"
            :disabled="readonly"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="回款金额(元)" prop="amount">
          <el-input-number
            v-model="form.amount"
            :min="0"
            :precision="2"
            placeholder="请输入回款金额"
            :disabled="readonly"
            style="width: 100%; padding-right: 30px"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第二行：备注 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="form.remarks"
            type="textarea"
            :rows="4"
            placeholder="请输入备注"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup name="InvoiceFormData">
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
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
  // 发票ID
  invoiceId: {
    type: [String, Number],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const formRef = ref(null);

// 当前登录用户信息
const currentUserInfo = ref({
  userId: "",
  deptId: ""
});

// 表单数据
const form = reactive({
  id: undefined,
  invoiceId: undefined,
  enterTime: "",
  amount: undefined,
  remarks: "",
  adminId: "",
  did: "",
});

// 验证规则
const rules = {
  enterTime: [{ required: true, message: "请选择回款日期", trigger: "change" }],
  amount: [{ required: true, message: "请输入回款金额", trigger: "blur" }],
};

/** 重置表单 */
function resetForm() {
  form.id = undefined;
  form.invoiceId = props.invoiceId || undefined;
  form.enterTime = "";
  form.amount = undefined;
  form.remarks = "";
  form.adminId = currentUserInfo.value.userId;
  form.did = currentUserInfo.value.deptId;
  formRef.value?.clearValidate();
}

/** 填充表单数据 */
function setFormData(data) {
  form.id = data.id;
  form.enterTime = data.enterTime || "";
  form.amount = data.amount || undefined;
  form.remarks = data.remarks || "";
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
  form.did = currentUserInfo.value.deptId;
}

/** 初始化数据 */
onMounted(() => {
  setCurrentUserInfo();
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
