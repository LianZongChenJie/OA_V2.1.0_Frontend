<template>
  <div class="approval-flow">
    <!-- 审批流程 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="审批流程"  label-width="120px">
          <el-select
            v-model="flowId"
            :disabled="disabled"
            placeholder="请选择审批流程"
            clearable
            style="width: 100%"
            @change="handleFlowChange"
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

    <!-- 抄送人 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="抄送人"  label-width="120px">
          <el-select
            v-model="copyUids"
            :disabled="disabled"
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

    <!-- 审批流程详情 -->
    <el-row
      :gutter="20"
      v-if="selectedFlow && selectedFlow.flowList && selectedFlow.flowList.length > 0"
    >
      <el-col :span="24">
        <el-form-item label="审批流程详情"  label-width="120px">
          <div class="flow-detail-container">
            <div
              v-for="(flow, index) in selectedFlow.flowList"
              :key="index"
              class="flow-item"
            >
              <div class="flow-header">
                <span class="flow-index">第 {{ index + 1 }} 步</span>
                <el-tag v-if="flow.check_types" size="small" class="flow-mode">{{
                  getApprovalModeLabel(flow.check_types)
                }}</el-tag>
              </div>
              <div class="flow-content">
                <div class="flow-info-row">
                  <span class="info-label">审批类型：</span>
                  <span class="info-value">{{ getFlowRoleLabel(flow.check_role) }}</span>
                </div>
                <div v-if="flow.check_position_id" class="flow-info-row">
                  <span class="info-label">岗位名称：</span>
                  <span class="info-value">{{ getPostName(flow.check_position_id) }}</span>
                </div>
                <div v-if="flow.check_uids && flow.check_uids.length > 0" class="flow-info-row">
                  <span class="info-label">审批人：</span>
                  <span class="info-value">{{ getUserNames(flow.check_uids) }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, getCurrentInstance } from "vue";
import { listUser } from "@/api/system/user.js";
import { listPost } from "@/api/system/post.js";
import { getPageList as getApprovalFlowList } from "@/api/base/common/approvalFlow/index.js";
import { getFlowNodes } from "@/api/common/approval.js";
import useUserStore from "@/store/modules/user";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ checkFlowId: "", checkCopyUids: [] }),
  },
  disabled: { type: Boolean, default: false },
  flowTitle: { type: String, default: "" },
  flowId: { type: [String, Number], default: "" },
  actionId: { type: [String, Number], default: "" },
});

const emit = defineEmits(["update:modelValue", "flowChange"]);

const userStore = useUserStore();
const { proxy } = getCurrentInstance();
const { approval_mode, flow_list_item_type } = proxy.useDict("approval_mode", "flow_list_item_type");

// 下拉选项
const userOptions = ref([]);
const postOptions = ref([]);
const approvalFlowOptions = ref([]);
const selectedFlow = ref(null);

// 双向绑定值
const flowId = ref("");
const copyUids = ref([]);
let isUpdatingFromProps = false;

// 监听 props.modelValue
watch(
  () => props.modelValue,
  (val) => {
    if (!val) return;
    isUpdatingFromProps = true;
    flowId.value = val.checkFlowId || "";
    copyUids.value = normalizeCopyUids(val.checkCopyUids);
    if (val.flowNodes) {
      handleFlowNodesChange(val.flowNodes);
    }
    nextTick(() => { isUpdatingFromProps = false; });
  },
  { immediate: true, deep: true }
);

// 监听 flowId 和 actionId 变化
watch(
  [() => props.flowId, () => props.actionId],
  ([newFlowId, newActionId]) => {
    if (newFlowId && newActionId) {
      fetchFlowNodes(newFlowId, newActionId);
    }
  },
  { immediate: true }
);

// 监听内部值变化
watch(flowId, () => !isUpdatingFromProps && emitUpdate());
watch(copyUids, () => !isUpdatingFromProps && emitUpdate());

function emitUpdate() {
  emit("update:modelValue", { checkFlowId: flowId.value, checkCopyUids: copyUids.value });
}

function normalizeCopyUids(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(id => Number(String(id).trim()));
  return String(value).split(",").map(id => Number(id.trim()));
}

function getUserList() {
  listUser({ pageNum: 1, pageSize: 1000 }).then(res => { userOptions.value = res.rows || []; });
}

function getPostList() {
  listPost({ pageNum: 1, pageSize: 1000 }).then(res => { postOptions.value = res.rows || []; });
}

function getApprovalFlowOptions() {
  const params = { pageNum: 1, pageSize: 100 };
  if (props.flowTitle) params.title = props.flowTitle;
  params.byDept = 1;
  getApprovalFlowList(params).then(res => {
    approvalFlowOptions.value = res.rows || [];
    if (flowId.value) handleFlowChange(flowId.value);
  });
}

function fetchFlowNodes(flowIdVal, actionIdVal) {
  getFlowNodes({ flowId: flowIdVal, actionId: actionIdVal }).then(res => {
    if (res.data?.length > 0) handleFlowNodesChange(res.data);
  }).catch(console.error);
}

function handleFlowChange(flowIdVal) {
  if (!flowIdVal) {
    selectedFlow.value = null;
    emit("flowChange", null);
    return;
  }
  const flow = approvalFlowOptions.value.find(item => item.id === flowIdVal);
  if (flow) {
    let flowListData = flow.flowList;
    if (typeof flowListData === "string") {
      try { flowListData = JSON.parse(flowListData); } 
      catch (e) { console.error("解析 flowList 失败:", e); flowListData = []; }
    }
    selectedFlow.value = { ...flow, flowList: flowListData };
    emit("flowChange", selectedFlow.value);
  } else {
    selectedFlow.value = null;
    emit("flowChange", null);
  }
}

function handleFlowNodesChange(flowNodes) {
  if (!flowNodes?.length) return;
  const formattedFlowList = flowNodes.map(node => ({
    check_types: node.checkType || node.check_types || 1,
    check_role: node.checkRole || node.check_role || 1,
    check_position_id: node.checkPositionId || node.check_position_id || "",
    check_uids: node.checkUids || node.check_uids || [],
    status: node.status || node.node_status || 0,
    remark: node.remark || "",
  }));
  selectedFlow.value = { id: flowId.value, flowList: formattedFlowList };
  emit("flowChange", selectedFlow.value);
}

function getApprovalModeLabel(checkTypes) {
  return approval_mode.value.find(item => item.value === String(checkTypes))?.label || checkTypes;
}

function getFlowRoleLabel(checkRole) {
  return flow_list_item_type.value.find(item => item.value === String(checkRole))?.label || checkRole;
}

function getPostName(postId) {
  return postOptions.value.find(item => String(item.postId) === String(postId))?.postName || postId;
}

function getUserNames(userIds) {
  if (!userIds) return "";
  const ids = Array.isArray(userIds) ? userIds : String(userIds).split(",").map(id => id.trim());
  const users = userOptions.value.filter(user => ids.includes(String(user.userId)));
  return users.map(user => user.nickName || user.userName).join("、");
}

// 暴露方法
function setDefaultCopyUser() {
  if (userStore.id) { copyUids.value = [userStore.id]; emitUpdate(); }
}

function setFlowId(id) { flowId.value = id; handleFlowChange(id); }
function setCopyUids(uids) { copyUids.value = normalizeCopyUids(uids); }

defineExpose({ setDefaultCopyUser, getSelectedFlow: () => selectedFlow.value, getFlowId: () => flowId.value, getCopyUids: () => copyUids.value, setFlowId, setCopyUids });

onMounted(() => { getUserList(); getPostList(); getApprovalFlowOptions(); setDefaultCopyUser(); });
</script>

<style scoped>
.approval-flow {
  width: 100%;
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
  background-color: #ecf5ff;
  border-color: #d9ecff;
  color: #409eff;
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