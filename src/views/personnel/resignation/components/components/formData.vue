<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="readonly ? {} : rules"
    label-width="120px"
  >
    <!-- 离职申请信息 -->
    <div class="form-section-title">离职申请信息</div>

    <!-- 第一行：离职员工 + 所在部门 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="离职员工" prop="uid">
          <el-select
            v-model="form.uid"
            :disabled="readonly"
            placeholder="请选择离职员工"
            clearable
            filterable
            style="width: 100%"
            @change="handleUserChange"
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
        <el-form-item label="所在部门" prop="did">
          <el-select
            v-model="form.did"
            :disabled="readonly"
            placeholder="请选择所在部门"
            clearable
            filterable
            style="width: 100%"
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

    <!-- 第二行：离职日期 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="离职日期" prop="quitTime">
          <el-date-picker
            v-model="form.quitTime"
            type="date"
            placeholder="请选择离职日期"
            :disabled="readonly"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第三行：上级领导 + 交接人 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="上级领导" prop="leadAdminId">
          <el-select
            v-model="form.leadAdminId"
            :disabled="readonly"
            placeholder="请选择上级领导"
            clearable
            filterable
            style="width: 100%"
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
        <el-form-item label="交接人" prop="connectId">
          <el-select
            v-model="form.connectId"
            :disabled="readonly"
            placeholder="请选择交接人"
            clearable
            filterable
            style="width: 100%"
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
    </el-row>

    <!-- 第四行：参与交接人 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="参与交接人" prop="connectUids">
          <el-select
            v-model="form.connectUids"
            :disabled="readonly"
            placeholder="请选择参与交接人"
            clearable
            multiple
            filterable
            style="width: 100%"
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
    </el-row>

    <!-- 离职原因 -->
    <div class="form-section-title">离职原因</div>

    <!-- 离职原因 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="离职原因" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入离职原因"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup name="ResignationFormData">
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import { listUser } from "@/api/system/user.js";
import { listDept } from "@/api/system/dept.js";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const userStore = useUserStore();

defineProps({
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

const formRef = ref(null);

// 下拉选项数据
const userOptions = ref([]);
const deptOptions = ref([]);

// 表单数据
const form = reactive({
  id: undefined,
  uid: userStore.id,
  uidName: userStore.nickName,
  did: userStore.deptId,
  deptName: userStore.deptName || "",
  quitTime: "",
  leadAdminId: null,
  leadAdminIdName: "",
  connectId: null,
  connectIdName: "",
  connectUids: [],
  remark: "",
});

// 验证规则
const rules = {
  uid: [{ required: true, message: "请选择离职员工", trigger: "change" }],
  did: [{ required: true, message: "请选择所在部门", trigger: "change" }],
  quitTime: [{ required: true, message: "请选择离职日期", trigger: "change" }],
  leadAdminId: [{ required: true, message: "请选择上级领导", trigger: "change" }],
  connectId: [{ required: true, message: "请选择交接人", trigger: "change" }],
  remark: [{ required: true, message: "请输入离职原因", trigger: "blur" }],
};

/** 获取用户列表 */
function getUserList() {
  listUser({ pageNum: 1, pageSize: 100 }).then((response) => {
    userOptions.value = response.rows || [];
  });
}

/** 获取部门列表 */
function getDeptList() {
  listDept().then((response) => {
    deptOptions.value = response.data || [];
  });
}

/** 用户选择变化处理 */
function handleUserChange(userId) {
  const selectedUser = userOptions.value.find(item => item.userId === userId);
  if (selectedUser) {
    form.uidName = selectedUser.nickName;
    if (selectedUser.deptId) {
      form.did = selectedUser.deptId;
      form.deptName = selectedUser.deptName || "";
    }
  }
}

/** 重置表单 */
function resetForm() {
  form.id = undefined;
  form.uid = userStore.id;
  form.uidName = userStore.nickName;
  form.did = userStore.deptId;
  form.deptName = userStore.deptName || "";
  form.quitTime = "";
  form.leadAdminId = null;
  form.leadAdminIdName = "";
  form.connectId = null;
  form.connectIdName = "";
  form.connectUids = [];
  form.remark = "";
  formRef.value?.clearValidate();
}

/** 填充表单数据 */
function setFormData(data) {
  form.id = data.id;
  form.uid = data.uid || userStore.id;
  form.uidName = data.uidName || "";
  form.did = data.did || userStore.deptId;
  form.deptName = data.deptName || "";
  form.quitTime = data.quitTime || "";
  form.leadAdminId = data.leadAdminId || null;
  form.leadAdminIdName = data.leadAdminIdName || "";
  form.connectId = data.connectId || null;
  form.connectIdName = data.connectIdName || "";
  form.connectUids = data.connectUids ? (typeof data.connectUids === "string" ? data.connectUids.split(",") : data.connectUids) : [];
  form.remark = data.remark || "";
}

/** 获取表单数据 */
function getFormData() {
  return {
    ...form,
    connectUids: form.connectUids ? form.connectUids.join(",") : "",
  };
}

/** 初始化数据 */
onMounted(() => {
  getUserList();
  getDeptList();
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
