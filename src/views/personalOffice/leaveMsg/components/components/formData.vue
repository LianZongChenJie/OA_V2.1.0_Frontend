<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="readonly ? {} : rules"
    label-width="120px"
  >
    <!-- 请假基本信息 -->
    <div class="form-section-title">请假基本信息</div>

    <!-- 第二行：开始时间 + 结束时间 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            type="datetime"
            placeholder="请选择开始时间"
            :disabled="readonly"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            v-model="form.endDate"
            type="datetime"
            placeholder="请选择结束时间"
            :disabled="readonly"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第三行：请假天数 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="请假天数" prop="duration">
          <el-input-number
            v-model="form.duration"
            :min="0"
            :precision="1"
            placeholder="请输入请假天数"
            :disabled="readonly"
            style="width: 100%; padding-right: 30px"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="请假类型" prop="types">
          <el-select
            v-model="form.types"
            :disabled="readonly"
            placeholder="请选择请假类型"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="dict in leavel_types"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第四行：申请人 + 所属部门 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请人" prop="adminId">
          <el-input v-model="form.adminName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所属部门" prop="did">
          <el-input v-model="form.deptName" disabled />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 请假原因 -->
    <div class="form-section-title">请假原因</div>

    <!-- 第五行：请假原因 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="请假原因" prop="reason">
          <el-input
            v-model="form.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入请假原因"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup name="LeaveFormData">
import { ref, reactive, getCurrentInstance } from "vue";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const { leavel_types } = proxy.useDict("leavel_types");
const userStore = useUserStore();

defineProps({
  // 是否只读
  readonly: {
    type: Boolean,
    default: false,
  },
});

const formRef = ref(null);

// 表单数据
const form = reactive({
  id: undefined,
  types: "",
  startDate: "",
  endDate: "",
  duration: undefined,
  adminId: userStore.id,
  adminName: userStore.nickName,
  did: userStore.deptId,
  deptName: userStore.deptName || "",
  reason: "",
});

// 验证规则
const rules = {
  types: [{ required: true, message: "请选择请假类型", trigger: "change" }],
  startDate: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  endDate: [{ required: true, message: "请选择结束时间", trigger: "change" }],
  duration: [{ required: true, message: "请输入请假天数", trigger: "blur" }],
  adminId: [{ required: true, message: "请选择申请人", trigger: "change" }],
  did: [{ required: true, message: "请选择所属部门", trigger: "change" }],
  reason: [{ required: true, message: "请输入请假原因", trigger: "blur" }],
};

/** 重置表单 */
function resetForm() {
  form.id = undefined;
  form.types = "";
  form.startDate = "";
  form.endDate = "";
  form.duration = undefined;
  form.adminId = userStore.id;
  form.adminName = userStore.nickName;
  form.did = userStore.deptId;
  form.deptName = userStore.deptName || "";
  form.reason = "";
  formRef.value?.clearValidate();
}

/** 填充表单数据 */
function setFormData(data) {
  form.id = data.id;
  form.types =
    data.types !== undefined && data.types !== null ? String(data.types) : "";
  // 兼容后端返回的字段名可能是 startDate/startTime 或 endDate/endTime
  form.startDate = data.startDate || data.startTime || "";
  form.endDate = data.endDate || data.endTime || "";
  form.duration = data.duration || undefined;
  form.adminId = data.adminId || userStore.id;
  form.adminName = data.adminName || userStore.nickName;
  form.did = data.did || userStore.deptId;
  form.deptName = data.deptName || userStore.deptName || "";
  form.reason = data.reason || "";
}

/** 获取表单数据 */
function getFormData() {
  return { ...form };
}

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
