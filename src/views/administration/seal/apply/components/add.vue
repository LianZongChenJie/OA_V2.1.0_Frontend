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
      label-width="140px"
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
            <el-radio-group
              v-model="form.isBorrow"
              :disabled="isView"
              @change="handleIsBorrowChange"
            >
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

      <!-- 第七行：审批流程 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="审批流程" prop="checkFlowId">
            <el-select
              v-model="form.checkFlowId"
              :disabled="isView"
              placeholder="请选择审批流程"
              clearable
              style="width: 100%"
              @change="handleApprovalFlowChange"
            >
              <el-option
                v-for="item in approvalFlowOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第八行：抄送人 -->
      <el-row :gutter="20">
        <el-col :span="24">
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
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第九行：审批流程详情 -->
      <el-row
        :gutter="20"
        v-if="
          selectedFlow &&
          selectedFlow.flowList &&
          selectedFlow.flowList.length > 0
        "
      >
        <el-col :span="24">
          <el-form-item label="审批流程详情">
            <div class="flow-detail-container">
              <div
                v-for="(flow, index) in selectedFlow.flowList"
                :key="index"
                class="flow-item"
              >
                <div class="flow-header">
                  <span class="flow-index">第 {{ index + 1 }} 步</span>
                  <el-tag size="small" type="primary" class="flow-mode">{{
                    getApprovalModeLabel(flow.check_types)
                  }}</el-tag>
                </div>
                <div class="flow-content">
                  <div class="flow-info-row">
                    <span class="info-label">审批类型：</span>
                    <span class="info-value">{{
                      getFlowRoleLabel(flow.check_role)
                    }}</span>
                  </div>
                  <div v-if="flow.check_position_id" class="flow-info-row">
                    <span class="info-label">岗位名称：</span>
                    <span class="info-value">{{
                      getPostName(flow.check_position_id)
                    }}</span>
                  </div>
                  <div
                    v-if="flow.check_uids && flow.check_uids.length > 0"
                    class="flow-info-row"
                  >
                    <span class="info-label">审批人：</span>
                    <span class="info-value">{{
                      getUserNames(flow.check_uids)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
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
import { listPost } from "@/api/system/post.js";
import { getPageList as getApprovalFlowList } from "@/api/base/common/approvalFlow/index.js";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const userStore = useUserStore();
const { seal_type, approval_mode, flow_list_item_type } = proxy.useDict(
  "seal_type",
  "approval_mode",
  "flow_list_item_type",
);

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 下拉选项数据
const userOptions = ref([]);
const deptOptions = ref([]);
const postOptions = ref([]);
const approvalFlowOptions = ref([]);
const selectedFlow = ref(null);

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

// 自定义校验：印章外借时，开始日期和结束日期必填
const validateBorrowDates = (rule, value, callback) => {
  if (form.isBorrow === 1 && !value) {
    const fieldName = rule.field === "startTime" ? "借用开始日期" : "借用结束日期";
    callback(new Error(`请选择${fieldName}`));
  } else {
    callback();
  }
};

const rules = {
  title: [{ required: true, message: "请输入申请主题", trigger: "blur" }],
  did: [{ required: true, message: "请选择用印部门", trigger: "change" }],
  num: [{ required: true, message: "请输入盖章次数", trigger: "blur" }],
  useTime: [
    { required: true, message: "请选择预期用印日期", trigger: "change" },
  ],
  sealCateId: [
    { required: true, message: "请选择用章类型", trigger: "change" },
  ],
  content: [{ required: true, message: "请输入盖章内容", trigger: "blur" }],
  startTime: [
    { validator: validateBorrowDates, trigger: "change" },
  ],
  endTime: [
    { validator: validateBorrowDates, trigger: "change" },
  ],
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

/** 获取岗位列表 */
function getPostList() {
  listPost({ pageNum: 1, pageSize: 1000 }).then((response) => {
    postOptions.value = response.rows || [];
  });
}

/** 获取审批流程列表 */
function getApprovalFlowOptions() {
  getApprovalFlowList({ pageNum: 1, pageSize: 100, title: "用章" }).then(
    (response) => {
      approvalFlowOptions.value = response.rows || [];
    },
  );
}

/** 印章外借变更 */
function handleIsBorrowChange(value) {
  if (value === 0) {
    form.startTime = "";
    form.endTime = "";
  }
}

/** 审批流程变更 */
function handleApprovalFlowChange(flowId) {
  if (!flowId) {
    selectedFlow.value = null;
    return;
  }
  const flow = approvalFlowOptions.value.find((item) => item.id === flowId);
  if (flow) {
    // 解析 flowList，如果是字符串则转换为对象数组
    let flowListData = flow.flowList;
    if (typeof flowListData === "string") {
      try {
        flowListData = JSON.parse(flowListData);
      } catch (e) {
        console.error("解析 flowList 失败:", e);
        flowListData = [];
      }
    }
    selectedFlow.value = {
      ...flow,
      flowList: flowListData,
    };
    console.log("====选中的审批流程111：", selectedFlow.value);
    console.log("====选中的审批流程22：", selectedFlow.value.flowList);
  } else {
    selectedFlow.value = null;
  }
}

/** 获取审批方式标签 */
function getApprovalModeLabel(checkTypes) {
  const mode = approval_mode.value.find(
    (item) => item.value === String(checkTypes),
  );
  return mode ? mode.label : checkTypes;
}

/** 获取审批类型标签 */
function getFlowRoleLabel(checkRole) {
  const role = flow_list_item_type.value.find(
    (item) => item.value === String(checkRole),
  );
  return role ? role.label : checkRole;
}

/** 获取岗位名称 */
function getPostName(postId) {
  const post = postOptions.value.find((item) => String(item.postId) === String(postId));
  return post ? post.postName : postId;
}

/** 获取用户名称（支持数组或逗号分隔的字符串） */
function getUserNames(userIds) {
  if (!userIds) return "";
  let ids = [];
  if (Array.isArray(userIds)) {
    ids = userIds;
  } else if (typeof userIds === "string") {
    ids = userIds.split(",").map((id) => id.trim());
  }
  const users = userOptions.value.filter((user) => ids.includes(String(user.userId)));
  return users.map((user) => user.nickName || user.userName).join("、");
}

/** 关闭弹窗 */
function handleClose() {
  reset();
}

/** 显示弹窗 - 新增模式 */
function open() {
  reset();
  // 设置抄送人默认为当前登录人
  if (userStore.id) {
    form.checkCopyUids = [userStore.id];
  }
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
  getPostList();
  getApprovalFlowOptions();
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

.flow-detail-container {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 12px;
  background-color: #f5f7fa;
  max-height: 300px;
  overflow-y: auto;
}

.flow-item {
  padding: 12px;
  background-color: #ffffff;
  border-radius: 4px;
  margin-bottom: 12px;
  border: 1px solid #e4e7ed;
}

.flow-item:last-child {
  margin-bottom: 0;
}

.flow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e4e7ed;
}

.flow-index {
  font-weight: bold;
  color: #409eff;
  font-size: 14px;
}

.flow-mode {
  font-size: 12px;
}

.flow-content {
  padding-left: 8px;
}

.flow-info-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 13px;
}

.flow-info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #909399;
  min-width: 70px;
  font-weight: 500;
}

.info-value {
  color: #303133;
  font-weight: 400;
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
