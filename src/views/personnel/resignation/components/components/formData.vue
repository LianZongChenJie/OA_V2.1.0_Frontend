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
          <DeptCascader
            v-model="form.did"
            :readonly="readonly"
            placeholder="请选择所在部门"
            @change="handleDeptChange"
          />
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
            v-if="!readonly"
            v-model="form.connectUids"
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
          <el-input
            v-else
            v-model="form.connectUidsName"
            disabled
            style="width: 100%"
          />
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
import { ref, reactive, onMounted, watch } from "vue";
import { listUser } from "@/api/system/user.js";
import DeptCascader from "@/components/DeptCascader/index.vue";
import useUserStore from "@/store/modules/user";

const userStore = useUserStore();

defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
});

const formRef = ref(null);

// 下拉选项数据
const userOptions = ref([]);

// 存储待处理的 connectUids，用于 userOptions 加载完成后计算中文名称
const pendingConnectUids = ref([]);

// 保存原始数据，用于 userOptions 加载完成后回显
const savedData = ref(null);

// 获取初始表单数据
const getInitialForm = () => ({
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
  connectUidsName: "",
  remark: "",
});

// 表单数据
const form = reactive(getInitialForm());

// 验证规则
const rules = {
  uid: [{ required: true, message: "请选择离职员工", trigger: "change" }],
  did: [{ required: true, message: "请选择所在部门", trigger: "change" }],
  quitTime: [{ required: true, message: "请选择离职日期", trigger: "change" }],
  leadAdminId: [{ required: true, message: "请选择上级领导", trigger: "change" }],
  connectId: [{ required: true, message: "请选择交接人", trigger: "change" }],
  remark: [{ required: true, message: "请输入离职原因", trigger: "blur" }],
};

// 工具函数：解析 connectUids
const parseConnectUids = (data) => {
  if (!data.connectUids) return [];
  return typeof data.connectUids === "string"
    ? data.connectUids.split(",").map(id => Number(id))
    : data.connectUids.map(id => Number(id));
};

// 工具函数：计算用户名称
const getUserNames = (userIds) => {
  if (!userIds?.length || !userOptions.value.length) return "";
  const selectedUsers = userOptions.value.filter(item => userIds.includes(item.userId));
  return selectedUsers.map(item => item.nickName).join(",");
};

/** 获取用户列表 */
function getUserList() {
  listUser({ pageNum: 1, pageSize: 100 }).then((response) => {
    userOptions.value = response.rows || [];
    // 如果有待处理的 connectUids，计算中文名称
    if (pendingConnectUids.value.length > 0) {
      form.connectUidsName = getUserNames(pendingConnectUids.value);
      pendingConnectUids.value = [];
    }
  });
}

/** 监听 userOptions 加载完成，确保多选用户能回显 */
watch(userOptions, (newVal) => {
  if (newVal?.length && savedData.value) {
    form.connectUids = parseConnectUids(savedData.value);
    form.connectUidsName = getUserNames(form.connectUids);
  }
});

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

/** 部门选择变化处理 */
function handleDeptChange(value) {
  if (value) {
    form.did = value[value.length - 1];
  } else {
    form.did = "";
  }
}

/** 重置表单 */
function resetForm() {
  Object.assign(form, getInitialForm());
  savedData.value = null;
  pendingConnectUids.value = [];
  formRef.value?.clearValidate();
}

/** 填充表单数据 */
function setFormData(data) {
  savedData.value = data;

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
  form.connectUids = parseConnectUids(data);
  form.connectUidsName = data.connectUidsName || getUserNames(form.connectUids);

  // userOptions 还未加载，保存待处理的 connectUids
  if (form.connectUids.length > 0 && !userOptions.value.length) {
    pendingConnectUids.value = form.connectUids;
    form.connectUidsName = "";
  }

  form.remark = data.remark || "";
}

/** 获取表单数据 */
function getFormData() {
  return {
    ...form,
    connectUids: form.connectUids?.join(",") || "",
    connectUidsName: getUserNames(form.connectUids),
  };
}

/** 初始化数据 */
onMounted(() => {
  getUserList();
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
