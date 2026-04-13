<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="100px"
    >
      <!-- 第一行：公文名称 + 公文编号 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="公文名称" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入公文名称"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公文编号" prop="code">
            <el-input
              v-model="form.code"
              placeholder="请输入公文编号"
              :disabled="isView"
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
              :disabled="isView"
              placeholder="请选择拟稿人"
              clearable
              style="width: 100%"
              @change="handleDraftUserChange"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拟稿部门" prop="draftDname">
            <el-select
              v-model="form.draftDname"
              :disabled="isView"
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
              :disabled="isView"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主送人员" prop="sendUids">
            <el-select
              v-model="form.sendUids"
              :disabled="isView"
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
                :label="item.userName"
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
              :disabled="isView"
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
                :label="item.userName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="共享可查阅人" prop="shareUids">
            <el-select
              v-model="form.shareUids"
              :disabled="isView"
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
                :label="item.userName"
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
            <el-radio-group v-model="form.secrets" :disabled="isView">
              <el-radio
                v-for="dict in secrets_level"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="紧急程度" prop="urgency">
            <el-radio-group v-model="form.urgency" :disabled="isView">
              <el-radio
                v-for="dict in urgency_level"
                :key="dict.value"
                :label="dict.value"
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
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">
          确 定
        </el-button>
        <el-button @click="dialogVisible = false">
          {{ isView ? "关 闭" : "取 消" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddDocuments">
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import { add, edit } from "@/api/administration/doc/documents/index.js";
import { listUser } from "@/api/system/user.js";
import { listDept } from "@/api/system/dept.js";

const { proxy } = getCurrentInstance();
const { secrets_level, urgency_level } = proxy.useDict(
  "secrets_level",
  "urgency_level"
);

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const isView = ref(false); // 是否为查看模式

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

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看公文";
  return isEdit.value ? "编辑公文" : "新增公文";
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

/** 表单重置 */
function reset() {
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

  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
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
      form.draftName = selectedUser.userName;
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

/** 关闭弹窗 */
function handleClose() {
  reset();
}

/** 显示弹窗 - 新增模式 */
function open() {
  reset();
  dialogVisible.value = true;
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  reset();
  // 填充表单数据
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
      ? data.sendUids
      : data.sendUids.split(",")
    : [];
  form.copyUids = data.copyUids
    ? Array.isArray(data.copyUids)
      ? data.copyUids
      : data.copyUids.split(",")
    : [];
  form.shareUids = data.shareUids
    ? Array.isArray(data.shareUids)
      ? data.shareUids
      : data.shareUids.split(",")
    : [];
  form.secrets = data.secrets || "";
  form.urgency = data.urgency || "";
  form.content = data.content || "";

  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  // 填充表单数据
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
      ? data.sendUids
      : data.sendUids.split(",")
    : [];
  form.copyUids = data.copyUids
    ? Array.isArray(data.copyUids)
      ? data.copyUids
      : data.copyUids.split(",")
    : [];
  form.shareUids = data.shareUids
    ? Array.isArray(data.shareUids)
      ? data.shareUids
      : data.shareUids.split(",")
    : [];
  form.secrets = data.secrets || "";
  form.urgency = data.urgency || "";
  form.content = data.content || "";

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      // 将数组转换为逗号分隔的字符串，secrets 和 urgency 转为数字
      const submitData = {
        ...form,
        sendUids: Array.isArray(form.sendUids)
          ? form.sendUids.join(",")
          : form.sendUids,
        copyUids: Array.isArray(form.copyUids)
          ? form.copyUids.join(",")
          : form.copyUids,
        shareUids: Array.isArray(form.shareUids)
          ? form.shareUids.join(",")
          : form.shareUids,
        secrets: form.secrets ? parseInt(form.secrets) : null,
        urgency: form.urgency ? parseInt(form.urgency) : null,
      };

      const apiMethod = isEdit.value ? edit : add;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      apiMethod(submitData).then(() => {
        proxy.$modal.msgSuccess(successMsg);
        dialogVisible.value = false;
        emit("success");
      });
    }
  });
}

const emit = defineEmits(["success"]);

defineExpose({
  open,
  openEdit,
  openView,
});

/** 初始化数据 */
onMounted(() => {
  getUserList();
  getDeptList();
});
</script>

<style scoped>
</style>

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
.documents-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.documents-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>
