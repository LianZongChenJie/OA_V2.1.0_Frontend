<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="readonly ? {} : rules"
    label-width="100px"
  >
    <!-- 第一行：公文名称 + 公文编号 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="公文名称" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入公文名称"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="公文编号" prop="code">
          <el-input
            v-model="form.code"
            placeholder="请输入公文编号"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第二行：拟稿人 + 拟稿部门 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="拟稿人" prop="draftName">
          <el-select
            v-model="form.draftName"
            :disabled="readonly"
            placeholder="请选择拟稿人"
            clearable
            style="width: 100%"
            @change="handleDraftUserChange"
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
        <el-form-item label="拟稿部门" prop="draftDname">
          <el-select
            v-model="form.draftDname"
            :disabled="readonly"
            placeholder="请选择拟稿部门"
            clearable
            style="width: 100%"
            @change="handleDeptChange"
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

    <!-- 第三行：拟稿日期 + 主送人员 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="拟稿日期" prop="draftTime">
          <el-date-picker
            v-model="form.draftTime"
            type="date"
            placeholder="请选择拟稿日期"
            :disabled="readonly"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主送人员" prop="sendUids">
          <el-select
            v-model="form.sendUids"
            :disabled="readonly"
            placeholder="请选择主送人员"
            multiple
            filterable
            clearable
            collapse-tags
            collapse-tags-tooltip
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

    <!-- 第四行：抄送人员 + 共享可查阅人 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="抄送人员" prop="copyUids">
          <el-select
            v-model="form.copyUids"
            :disabled="readonly"
            placeholder="请选择抄送人员"
            multiple
            filterable
            clearable
            collapse-tags
            collapse-tags-tooltip
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
        <el-form-item label="共享可查阅人" prop="shareUids">
          <el-select
            v-model="form.shareUids"
            :disabled="readonly"
            placeholder="请选择共享可查阅人"
            multiple
            filterable
            clearable
            collapse-tags
            collapse-tags-tooltip
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

    <!-- 第五行：密级程度 + 紧急程度 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="密级程度" prop="secrets">
          <el-radio-group v-model="form.secrets" :disabled="readonly">
            <el-radio
              v-for="dict in secrets_level"
              :key="dict.value"
              :label="Number(dict.value)"
            >
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="紧急程度" prop="urgency">
          <el-radio-group v-model="form.urgency" :disabled="readonly">
            <el-radio
              v-for="dict in urgency_level"
              :key="dict.value"
              :label="Number(dict.value)"
            >
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 第六行：公文内容（独占一行） -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="公文内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请输入公文内容"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup name="DocumentsFormData">
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { listUser } from "@/api/system/user.js";
import { listDept } from "@/api/system/dept.js";

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false
  }
});

const { proxy } = getCurrentInstance();
const { secrets_level, urgency_level } = proxy.useDict("secrets_level", "urgency_level");

const formRef = ref(null);

// 下拉选项数据
const userOptions = ref([]);
const deptOptions = ref([]);

const form = reactive({
  id: undefined,
  title: "",
  code: "",
  draftName: "",
  draftUid: "",
  draftDname: "",
  did: "",
  draftTime: "",
  sendUids: [],
  copyUids: [],
  shareUids: [],
  secrets: "",
  urgency: "",
  content: "",
});

const rules = {
  title: [{ required: true, message: "请输入公文名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入公文编号", trigger: "blur" }],
  draftName: [{ required: true, message: "请选择拟稿人", trigger: "change" }],
  draftDname: [{ required: true, message: "请选择拟稿部门", trigger: "change" }],
  draftTime: [{ required: true, message: "请选择拟稿日期", trigger: "change" }],
  sendUids: [{ required: true, message: "请选择主送人员", trigger: "change" }],
  secrets: [{ required: true, message: "请选择密级程度", trigger: "change" }],
  urgency: [{ required: true, message: "请选择紧急程度", trigger: "change" }],
  content: [{ required: true, message: "请输入公文内容", trigger: "blur" }],
};

/** 重置表单 */
function resetForm() {
  form.id = undefined;
  form.title = "";
  form.code = "";
  form.draftName = "";
  form.draftUid = "";
  form.draftDname = "";
  form.did = "";
  form.draftTime = "";
  form.sendUids = [];
  form.copyUids = [];
  form.shareUids = [];
  form.secrets = "1";
  form.urgency = "1";
  form.content = "";
  formRef.value?.clearValidate();
}

/** 设置表单数据 */
function setFormData(data) {
  form.id = data.id;
  form.title = data.title || "";
  form.code = data.code || "";
  form.draftName = data.draftName || "";
  form.draftUid = data.draftUid || "";
  form.draftDname = data.draftDname || "";
  form.did = data.did || "";
  form.draftTime = data.draftTime || "";
  form.sendUids = data.sendUids
    ? Array.isArray(data.sendUids)
      ? data.sendUids.map(id => Number(id))
      : data.sendUids.split(",").map(id => Number(id))
    : [];
  form.copyUids = data.copyUids
    ? Array.isArray(data.copyUids)
      ? data.copyUids.map(id => Number(id))
      : data.copyUids.split(",").map(id => Number(id))
    : [];
  form.shareUids = data.shareUids
    ? Array.isArray(data.shareUids)
      ? data.shareUids.map(id => Number(id))
      : data.shareUids.split(",").map(id => Number(id))
    : [];
  form.secrets = data.secrets !== undefined ? Number(data.secrets) : "";
  form.urgency = data.urgency !== undefined ? Number(data.urgency) : "";
  form.content = data.content || "";
}

/** 获取提交表单数据 */
function getSubmitData() {
  return {
    ...form,
    sendUids: Array.isArray(form.sendUids) ? form.sendUids.join(",") : form.sendUids,
    copyUids: Array.isArray(form.copyUids) ? form.copyUids.join(",") : form.copyUids,
    shareUids: Array.isArray(form.shareUids) ? form.shareUids.join(",") : form.shareUids,
    secrets: form.secrets ? parseInt(form.secrets) : null,
    urgency: form.urgency ? parseInt(form.urgency) : null,
  };
}

/** 获取用户列表 */
function getUserList() {
  listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
    userOptions.value = response.rows || [];
  });
}

/** 获取部门列表 */
function getDeptList() {
  listDept({ pageNum: 1, pageSize: 1000 }).then((response) => {
    deptOptions.value = response.data || [];
  });
}

/** 拟稿人选择变更 */
function handleDraftUserChange(userId) {
  if (userId) {
    form.draftUid = userId;
    const selectedUser = userOptions.value.find(
      (item) => item.userId === userId
    );
    if (selectedUser) {
      form.draftName = selectedUser.nickName;
    }
  } else {
    form.draftUid = "";
    form.draftName = "";
  }
}

/** 拟稿部门选择变更 */
function handleDeptChange(deptId) {
  if (deptId) {
    form.did = deptId;
    const selectedDept = deptOptions.value.find(
      (item) => item.deptId === deptId
    );
    if (selectedDept) {
      form.draftDname = selectedDept.deptName;
    }
  } else {
    form.did = "";
    form.draftDname = "";
  }
}

/** 验证表单 */
function validate() {
  return formRef.value?.validate();
}

defineExpose({
  formRef,
  resetForm,
  setFormData,
  getSubmitData,
  form,
});

/** 初始化数据 */
onMounted(() => {
  getUserList();
  getDeptList();
});
</script>

<style scoped>
</style>