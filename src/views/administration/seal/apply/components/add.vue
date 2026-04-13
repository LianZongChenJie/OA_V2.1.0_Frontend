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
      <!-- 基础申请信息 -->
      <div class="form-section-title">基础申请信息</div>

      <!-- 第一行：申请主题 + 用章类型 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="申请主题" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入申请主题"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用章类型" prop="sealCateId">
            <el-select
              v-model="form.sealCateId"
              :disabled="isView"
              placeholder="请选择用章类型"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in seal_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：用印部门 + 盖章次数 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用印部门" prop="did">
            <el-select
              v-model="form.did"
              :disabled="isView"
              placeholder="请选择用印部门"
              clearable
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
        <el-col :span="12">
          <el-form-item label="盖章次数" prop="num">
            <el-input-number
              v-model="form.num"
              :min="1"
              :max="10"
              placeholder="请输入盖章次数"
              :disabled="isView"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：预期用印日期 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="预期用印日期" prop="useTime">
            <el-date-picker
              v-model="form.useTime"
              type="date"
              placeholder="请选择预期用印日期"
              :disabled="isView"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行：印章是否外借 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="印章是否外借" prop="isBorrow">
            <el-radio-group v-model="form.isBorrow" :disabled="isView" @change="handleIsBorrowChange">
              <el-radio :label="0">不外借</el-radio>
              <el-radio :label="1">外借</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行：借用开始日期 + 借用结束日期 -->
      <el-row :gutter="20" v-if="form.isBorrow === 1">
        <el-col :span="12">
          <el-form-item label="借用开始日期" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="date"
              placeholder="请选择借用开始日期"
              :disabled="isView"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="借用结束日期" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="date"
              placeholder="请选择借用结束日期"
              :disabled="isView"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第六行：盖章内容 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="盖章内容" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="4"
              placeholder="请输入盖章内容"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 审批流程信息 -->
      <div class="form-section-title">审批流程信息</div>

      <!-- 第七行：审批流程 + 抄送人 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="审批流程" prop="checkFlowId">
            <el-select
              v-model="form.checkFlowId"
              :disabled="isView"
              placeholder="请选择审批流程"
              clearable
              style="width: 100%"
            >
              <el-option
                label="用章"
                value="1"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抄送人" prop="checkCopyUids">
            <el-select
              v-model="form.checkCopyUids"
              :disabled="isView"
              placeholder="请选择抄送人"
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

<script setup name="AddSealApply">
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import { add, edit } from "@/api/administration/seal/apply";
import { listUser } from "@/api/system/user.js";
import { listDept } from "@/api/system/dept.js";

const { proxy } = getCurrentInstance();
const { seal_type } = proxy.useDict("seal_type");

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 下拉选项数据
const userOptions = ref([]);
const deptOptions = ref([]);

const form = reactive({
  id: undefined,
  title: "",
  did: "",
  num: 1,
  useTime: "",
  sealCateId: "",
  isBorrow: 0,
  startTime: "",
  endTime: "",
  content: "",
  checkFlowId: "1",
  checkCopyUids: [],
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看用章申请";
  return isEdit.value ? "编辑用章申请" : "新增用章申请";
});

const rules = {
  title: [{ required: true, message: "请输入申请主题", trigger: "blur" }],
  did: [{ required: true, message: "请选择用印部门", trigger: "change" }],
  num: [{ required: true, message: "请输入盖章次数", trigger: "blur" }],
  useTime: [{ required: true, message: "请选择预期用印日期", trigger: "change" }],
  sealCateId: [{ required: true, message: "请选择用章类型", trigger: "change" }],
  content: [{ required: true, message: "请输入盖章内容", trigger: "blur" }],
};

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.title = "";
  form.did = "";
  form.num = 1;
  form.useTime = "";
  form.sealCateId = "";
  form.isBorrow = 0;
  form.startTime = "";
  form.endTime = "";
  form.content = "";
  form.checkFlowId = "1";
  form.checkCopyUids = [];

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

/** 印章外借变更 */
function handleIsBorrowChange(value) {
  if (value === 0) {
    form.startTime = "";
    form.endTime = "";
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
  form.id = data.id;
  form.title = data.title || "";
  form.did = data.did || "";
  form.num = data.num || 1;
  form.useTime = data.useTime || "";
  form.sealCateId = data.sealCateId || "";
  form.isBorrow = data.isBorrow ?? 0;
  form.startTime = data.startTime || "";
  form.endTime = data.endTime || "";
  form.content = data.content || "";
  form.checkFlowId = data.checkFlowId || "1";
  form.checkCopyUids = data.checkCopyUids
    ? Array.isArray(data.checkCopyUids)
      ? data.checkCopyUids
      : data.checkCopyUids.split(",")
    : [];

  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  form.id = data.id;
  form.title = data.title || "";
  form.did = data.did || "";
  form.num = data.num || 1;
  form.useTime = data.useTime || "";
  form.sealCateId = data.sealCateId || "";
  form.isBorrow = data.isBorrow ?? 0;
  form.startTime = data.startTime || "";
  form.endTime = data.endTime || "";
  form.content = data.content || "";
  form.checkFlowId = data.checkFlowId || "1";
  form.checkCopyUids = data.checkCopyUids
    ? Array.isArray(data.checkCopyUids)
      ? data.checkCopyUids
      : data.checkCopyUids.split(",")
    : [];

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = {
        ...form,
        checkCopyUids: Array.isArray(form.checkCopyUids)
          ? form.checkCopyUids.join(",")
          : form.checkCopyUids,
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
.form-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}
</style>

<style>
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
