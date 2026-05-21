<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="approval-flow-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="120px"
    >
      <el-form-item label="流程名称" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入流程名称"
          :disabled="isView"
        />
      </el-form-item>
      <el-form-item label="审批类型" prop="cateId">
        <el-select
          v-model="form.cateId"
          :disabled="isView"
          placeholder="请选择审批类型"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in approvalTypeOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="应用部门" prop="departmentIds">
        <DeptCascader
          v-model="form.departmentIds"
          :multiple="true"
          placeholder="请选择部门"
        />
      </el-form-item>
      <el-form-item label="审批流程类型" prop="checkType">
        <el-radio-group
          v-model="form.checkType"
          :disabled="isView"
          @change="handleCheckTypeChange"
        >
          <el-radio
            v-for="item in approval_flow_type"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 审批流程配置（固定审批流程时显示） -->
      <template v-if="showFlowConfig">
        <el-form-item label="审批流程配置">
          <div class="flow-config">
            <div
              v-for="(flow, index) in form.flowList"
              :key="index"
              class="flow-item"
            >
              <div class="flow-item-header">
                <span class="flow-level">第 {{ index + 1 }} 级审批</span>
                <el-button
                  v-if="!isView && form.flowList.length > 1"
                  type="danger"
                  link
                  @click="removeFlow(index)"
                >
                  删除
                </el-button>
              </div>
              <el-form-item
                :label="`审批人类型${index + 1}`"
                :prop="`flowList.${index}.check_role`"
                :rules="{
                  required: true,
                  message: '请选择审批人类型',
                  trigger: 'change',
                }"
              >
                <el-select
                  v-model="flow.check_role"
                  :disabled="isView || isRollbackFlow"
                  placeholder="请选择审批人类型"
                  clearable
                  @change="handleApproverTypeChange(index)"
                  style="width: 100%"
                >
                  <el-option
                    v-for="dict in filteredFlowListItemType"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>

              <!-- 指定成员时显示成员选择 -->
              <el-form-item
                v-if="flow.check_role === '4'"
                :label="`选择成员${index + 1}`"
                :prop="`flowList.${index}.check_uids`"
                :rules="{
                  required: true,
                  message: '请选择成员',
                  trigger: 'change',
                }"
              >
                <el-select
                  v-model="flow.check_uids"
                  :disabled="isView"
                  placeholder="请选择成员"
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

              <!-- 指定岗位职称人时显示岗位选择 -->
              <el-form-item
                v-if="flow.check_role === '3'"
                :label="`选择岗位${index + 1}`"
                :prop="`flowList.${index}.check_position_id`"
                :rules="{
                  required: true,
                  message: '请选择岗位',
                  trigger: 'change',
                }"
              >
                <el-select
                  v-model="flow.check_position_id"
                  :disabled="isView"
                  placeholder="请选择岗位"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="post in postOptions"
                    :key="post.postId"
                    :label="post.postName"
                    :value="post.postId"
                  />
                </el-select>
              </el-form-item>

              <!-- 审批方式选择 -->
              <el-form-item
                :label="`审批方式${index + 1}`"
                :prop="`flowList.${index}.check_types`"
                :rules="{
                  required: true,
                  message: '请选择审批方式',
                  trigger: 'change',
                }"
              >
                <el-radio-group v-model="flow.check_types" :disabled="isView">
                  <el-radio
                    v-for="dict in approval_mode"
                    :key="dict.value"
                    :label="dict.value"
                  >
                    {{ dict.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </div>

            <el-button
              v-if="!isView"
              type="primary"
              link
              @click="addFlowNode"
              style="margin-top: 10px"
            >
              + 添加审批节点
            </el-button>
          </div>
        </el-form-item>
      </template>

      <el-form-item label="抄送人" prop="copyUids">
        <el-select
          v-model="form.copyUids"
          :disabled="isView"
          :teleported="false"
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
      <el-form-item label="流程说明" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入流程说明"
          :disabled="isView"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false">{{
          isView ? "关 闭" : "取 消"
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddApprovalModule">
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import { addFlow, updateFlow } from "@/api/base/common/approvalFlow/index.js";
import { getPageList as getApprovalTypeList } from "@/api/base/common/approvalType/index.js";
import { listUser } from "@/api/system/user.js";
import { listPost } from "@/api/system/post.js";
import useUserStore from "@/store/modules/user";
import DeptCascader from "@/components/DeptCascader/index.vue";

const { proxy } = getCurrentInstance();
const { approval_flow_type, flow_list_item_type, approval_mode } =
  proxy.useDict("approval_flow_type", "flow_list_item_type", "approval_mode");

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const isView = ref(false); // 是否为查看模式

const form = reactive({
  id: undefined,
  title: "",
  departmentIds: [],
  cateId: "",
  remark: "",
  checkType: "",
  copyUids: [],
  flowList: [], // 审批流程配置列表
});

// 下拉选项数据
const approvalTypeOptions = ref([]);
const userOptions = ref([]);
const postOptions = ref([]); // 岗位选项

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看审批流程";
  return isEdit.value ? "编辑审批流程" : "新增审批流程";
});

// 是否显示审批流程配置（固定审批流程或可回退审批流时显示）
const showFlowConfig = computed(() => {
  // 假设 value="2" 是固定审批流程，value="3" 是可回退审批流
  return form.checkType == "2" || form.checkType == "3";
});

// 是否是可回退审批流
const isRollbackFlow = computed(() => {
  return form.checkType == "3";
});

// 审批人类型选项（可回退审批流时只能选择指定成员）
const filteredFlowListItemType = computed(() => {
  if (isRollbackFlow.value) {
    return flow_list_item_type.value.filter((item) => item.value === "4");
  }
  return flow_list_item_type.value;
});

const rules = {
  title: [{ required: true, message: "请输入流程名称", trigger: "blur" }],
  cateId: [{ required: true, message: "请选择审批类型", trigger: "change" }],
  checkType: [
    { required: true, message: "请选择审批流程类型", trigger: "change" },
  ],
};

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.title = "";
  form.departmentIds = [];
  form.cateId = "";
  form.remark = "";
  form.checkType = "";
  form.copyUids = [];
  form.flowList = [];
  isEdit.value = false;
  isView.value = false;
  // 清除表单验证状态
  if (formRef.value) {
    formRef.value.clearValidate();
  }
}

/** 获取审批类型列表 */
function getApprovalTypes() {
  getApprovalTypeList({ pageNum: 1, pageSize: 1000 }).then((response) => {
    approvalTypeOptions.value = response.rows || [];
  });
}

/** 获取用户列表 */
function getUserList() {
  listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
    userOptions.value = response.rows || [];
  });
}

/** 获取岗位列表 */
function getPostList() {
  listPost({ pageNum: 1, pageSize: 1000 }).then((response) => {
    postOptions.value = response.rows || [];
  });
}

/** 审批流程类型变更处理 */
function handleCheckTypeChange(value) {
  // 切换审批流程类型时，重置审批流程配置
  form.flowList = [];

  if (value == "2" || value == "3") {
    // 固定审批流程或可回退审批流，初始化一个默认审批节点
    addFlowNode();
  }
}

/** 添加审批节点 */
function addFlowNode() {
  // 可回退审批流时，审批人类型默认为指定成员
  const defaultCheckRole = form.checkType == "3" ? "4" : "";
  // 确保 form.flowList 是数组
  if (!Array.isArray(form.flowList)) {
    form.flowList = [];
  }
  form.flowList.push({
    check_role: defaultCheckRole, // 审批人类型：1-当前部门负责人，2-上一级部门负责人，3-指定岗位职称人，4-指定成员
    check_uids: [], // 指定成员ID列表
    check_position_id: "", // 岗位ID
    check_types: "1", // 审批方式：1-或签，2-会签（字符串类型以匹配数据字典）
  });
}

/** 删除审批节点 */
function removeFlow(index) {
  form.flowList.splice(index, 1);
}

/** 审批人类型变更处理 */
function handleApproverTypeChange(index) {
  const flow = form.flowList[index];
  if (["3", "4"].includes(flow.check_role)) {
    flow.check_uids = [];
    flow.check_position_id = "";
  }
}

/** 初始化数据 */
onMounted(() => {
  getApprovalTypes();
  getUserList();
  getPostList();
});

/** 关闭弹窗 */
function handleClose() {
  reset();
}

/** 显示弹窗 - 新增模式 */
function open() {
  reset();
  // 默认选中固定审批流程（值为"2"）
  form.checkType = "2";
  // 初始化一个默认审批节点
  addFlowNode();
  dialogVisible.value = true;
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  reset();
  // 填充表单数据
  form.id = data.id;
  form.title = data.title;
  // 将 departmentIds 字符串转换为数组（转换为数字）
  form.departmentIds = data.departmentIds
    ? Array.isArray(data.departmentIds)
      ? data.departmentIds.map((id) => Number(id))
      : data.departmentIds.split(",").map((id) => Number(id.trim()))
    : [];
  form.cateId = data.cateId || "";
  form.remark = data.remark || "";
  // 确保 checkType 是字符串类型
  form.checkType = data.checkType ? String(data.checkType) : "";
  // 将 copyUids 字符串转换为数组（转换为数字）
  form.copyUids = data.copyUids
    ? Array.isArray(data.copyUids)
      ? data.copyUids.map((id) => Number(id))
      : data.copyUids.split(",").map((id) => Number(id.trim()))
    : [];
  // 解析 flowList
  const flowList = data.flowList
    ? typeof data.flowList === "string"
      ? JSON.parse(data.flowList)
      : data.flowList
    : [];
  // 直接使用后端字段格式
  form.flowList = flowList.map((flow) => {
    // 处理 check_uids：可能是字符串或数组
    let check_uids = [];
    if (flow.check_uids) {
      if (Array.isArray(flow.check_uids)) {
        check_uids = flow.check_uids;
      } else if (typeof flow.check_uids === "string") {
        check_uids = flow.check_uids.split(",").map((id) => Number(id.trim()));
      }
    }
    return {
      check_role: flow.check_role || "",
      check_uids: check_uids,
      check_position_id: flow.check_position_id || "",
      check_types: String(flow.check_types || 1),
    };
  });

  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  // 填充表单数据
  form.id = data.id;
  form.title = data.title;
  // 将 departmentIds 字符串转换为数组（转换为数字）
  form.departmentIds = data.departmentIds
    ? Array.isArray(data.departmentIds)
      ? data.departmentIds.map((id) => Number(id))
      : data.departmentIds.split(",").map((id) => Number(id.trim()))
    : [];
  form.cateId = data.cateId || "";
  form.remark = data.remark || "";
  // 确保 checkType 是字符串类型
  form.checkType = data.checkType ? String(data.checkType) : "";
  // 将 copyUids 字符串转换为数字数组
  form.copyUids = data.copyUids
    ? Array.isArray(data.copyUids)
      ? data.copyUids.map((id) => Number(id))
      : data.copyUids
          .split(",")
          .map((id) => Number(id.trim()))
          .filter((id) => !isNaN(id))
    : [];
  // 解析 flowList
  const flowList = data.flowList
    ? typeof data.flowList === "string"
      ? JSON.parse(data.flowList)
      : data.flowList
    : [];
  // 直接使用后端字段格式
  form.flowList = flowList.map((flow) => {
    // 处理 check_uids：可能是字符串或数组
    let check_uids = [];
    if (flow.check_uids) {
      if (Array.isArray(flow.check_uids)) {
        check_uids = flow.check_uids;
      } else if (typeof flow.check_uids === "string") {
        check_uids = flow.check_uids.split(",").map((id) => Number(id.trim()));
      }
    }
    return {
      check_role: flow.check_role || "",
      check_uids: check_uids,
      check_position_id: flow.check_position_id || "",
      check_types: String(flow.check_types || 1),
    };
  });

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const userStore = useUserStore();
      // 转换 flowList 中的 check_uids 为逗号分隔字符串
      const submitFlowList = form.flowList.map((flow) => ({
        check_role: flow.check_role,
        check_uids: Array.isArray(flow.check_uids)
          ? flow.check_uids.join(",")
          : flow.check_uids,
        check_position_id: flow.check_position_id,
        check_types: flow.check_types,
      }));
      // 将 copyUids 数组转换为以逗号分隔的字符串
      const submitData = {
        ...form,
        admin: userStore.name,
        adminId: userStore.id, // 当前登录人ID
        copyUids: Array.isArray(form.copyUids)
          ? form.copyUids.join(",")
          : form.copyUids,
        // 将 departmentIds 数组转换为以逗号分隔的字符串
        departmentIds: Array.isArray(form.departmentIds)
          ? form.departmentIds.join(",")
          : form.departmentIds + "",
        // 将 flowList 转换为 JSON 字符串
        flowList: JSON.stringify(submitFlowList),
      };

      const apiMethod = isEdit.value ? updateFlow : addFlow;
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
</script>

<style scoped>
/* 级联选择器标签样式 */
:deep(.el-cascader__tags) {
  flex-wrap: wrap;
}

:deep(.el-cascader__collapse-tags) {
  flex-wrap: wrap;
}

/* 审批流程配置样式 */
.flow-config {
  width: 100%;
}

.flow-item {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.flow-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.flow-level {
  font-weight: bold;
  color: #409eff;
  font-size: 14px;
}

.flow-item :deep(.el-form-item) {
  margin-bottom: 12px;
}
</style>

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
.approval-flow-dialog.el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.approval-flow-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}

/* 级联选择器下拉框 z-index */
.approval-flow-dialog .el-cascader-panel {
  z-index: 9999 !important;
}
</style>
