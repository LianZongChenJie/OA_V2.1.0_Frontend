<template>
  <div class="approval-flow">
    <!-- 审批流程 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="审批流程" prop="checkFlowId">
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
        <el-form-item label="抄送人" prop="checkCopyUids">
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
        <el-form-item label="审批流程详情">
          <div class="flow-detail-container">
            <div
              v-for="(flow, index) in selectedFlow.flowList"
              :key="index"
              class="flow-item"
            >
              <div class="flow-header">
                <span class="flow-index">第 {{ index + 1 }} 步</span>
                <el-tag size="small" class="flow-mode">{{
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

<script setup name="ApprovalFlow">
import { ref, reactive, watch, computed, getCurrentInstance, onMounted } from "vue";
import { listUser } from "@/api/system/user.js";
import { listPost } from "@/api/system/post.js";
import { getPageList as getApprovalFlowList } from "@/api/base/common/approvalFlow/index.js";
import useUserStore from "@/store/modules/user";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      checkFlowId: "",
      checkCopyUids: [],
    }),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  flowTitle: {
    type: String,
    default: "", // 用于筛选审批流程的标题关键字
  },
});

const emit = defineEmits(["update:modelValue", "flowChange"]);

const { proxy } = getCurrentInstance();
const userStore = useUserStore();

const { approval_mode, flow_list_item_type } = proxy.useDict("approval_mode", "flow_list_item_type");

// 下拉选项数据
const userOptions = ref([]);
const postOptions = ref([]);
const approvalFlowOptions = ref([]);
const selectedFlow = ref(null);

// 双向绑定值
const flowId = ref("");
const copyUids = ref([]);

// 监听 props.modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      flowId.value = val.checkFlowId || "";
      copyUids.value = val.checkCopyUids
        ? (Array.isArray(val.checkCopyUids)
            ? val.checkCopyUids
            : val.checkCopyUids.split(",")
          ).map(id => Number(typeof id === 'string' ? id.trim() : id))  // 确保转换为数字数组
        : [];
      // 监听审批节点数据变化
      if (val.flowNodes) {
        handleFlowNodesChange(val.flowNodes);
      }
    }
  },
  { immediate: true, deep: true },
);

// 监听内部值变化，emit 到父组件
watch(flowId, (val) => {
  emitUpdate();
});

watch(copyUids, (val) => {
  emitUpdate();
});

function emitUpdate() {
  emit("update:modelValue", {
    checkFlowId: flowId.value,
    checkCopyUids: copyUids.value,
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

/** 获取审批流程列表 */
function getApprovalFlowOptions() {
  const params = { pageNum: 1, pageSize: 100 };
  if (props.flowTitle) {
    params.title = props.flowTitle;
  }
  getApprovalFlowList(params).then((response) => {
    approvalFlowOptions.value = response.rows || [];
    // 如果有默认值，自动选中并显示详情
    if (flowId.value) {
      handleFlowChange(flowId.value);
    }
  });
}

/** 审批流程变更 */
function handleFlowChange(flowIdVal) {
  if (!flowIdVal) {
    selectedFlow.value = null;
    emit("flowChange", null);
    return;
  }
  const flow = approvalFlowOptions.value.find((item) => item.id === flowIdVal);
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
    emit("flowChange", selectedFlow.value);
  } else {
    selectedFlow.value = null;
    emit("flowChange", null);
  }
}

/** 处理从详情页获取的审批节点数据 */
function handleFlowNodesChange(flowNodes) {
  // 将获取到的审批节点数据格式化为 flowList 格式
  if (flowNodes && flowNodes.length > 0) {
    const formattedFlowList = flowNodes.map((node) => ({
      check_types: node.checkType || node.check_types || 1,
      check_role: node.checkRole || node.check_role || 1,
      check_position_id: node.checkPositionId || node.check_position_id || "",
      check_uids: node.checkUids || node.check_uids || [],
      status: node.status || node.node_status || 0,
      remark: node.remark || "",
    }));
    selectedFlow.value = {
      id: flowId.value,
      flowList: formattedFlowList,
    };
    emit("flowChange", selectedFlow.value);
  }
}

/** 获取审批方式标签 */
function getApprovalModeLabel(checkTypes) {
  const mode = approval_mode.value.find((item) => item.value === String(checkTypes));
  return mode ? mode.label : checkTypes;
}

/** 获取审批类型标签 */
function getFlowRoleLabel(checkRole) {
  const role = flow_list_item_type.value.find((item) => item.value === String(checkRole));
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

// 暴露方法给父组件
function setDefaultCopyUser() {
  if (userStore.id) {
    copyUids.value = [userStore.id];
    emitUpdate();
  }
}

defineExpose({
  setDefaultCopyUser,
});

/** 初始化数据 */
onMounted(() => {
  getUserList();
  getPostList();
  getApprovalFlowOptions();
  // 默认设置当前登录人为抄送人
  setDefaultCopyUser();
});
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