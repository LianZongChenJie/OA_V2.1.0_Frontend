<template>
  <el-dialog
    title="查看合同"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
  >
    <div>
      <FormData
        ref="formDataRef"
        :readonly="true"
      />

      <!-- 审批流程信息 -->
      <div class="form-section-title">审批流程信息</div>
      <ApprovalFlow
        ref="approvalFlowRef"
        v-model="approvalFlowData"
        :disabled="!isApprovalFlowEditable"
        flow-title="销售合同"
        @flow-change="handleFlowChange"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          v-if="canSubmitApproval"
          type="primary"
          @click="handleSubmitApproval"
        >
          提交审批
        </el-button>
        <el-button
          v-if="canApprove"
          type="success"
          @click="handleApprove"
        >
          同意
        </el-button>
        <el-button
          v-if="canReject"
          type="danger"
          @click="handleReject"
        >
          拒绝
        </el-button>
        <el-button
          v-if="canRevoke"
          type="warning"
          @click="handleRevoke"
        >
          撤销
        </el-button>
        <el-button @click="dialogVisible = false">
          关 闭
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="SalesContractDetail">
import { ref, computed, getCurrentInstance, nextTick } from "vue";
import {
  submitToFlow,
  approval as approvalFlow,
  getFlowNodes,
} from "@/api/common/approval.js";
import ApprovalFlow from "@/components/ApprovalFlow/index.vue";
import FormData from "./formData.vue";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const userStore = useUserStore();

const dialogVisible = ref(false);
const formDataRef = ref(null);
const approvalFlowRef = ref(null);

// 当前合同数据（用于权限判断）
const currentContractData = ref(null);

// 审批流程数据（双向绑定）
const approvalFlowData = ref({
  checkFlowId: "",
  checkCopyUids: userStore.id ? [userStore.id] : [],
});

// 选中的审批流程详情
const selectedFlow = ref(null);

// 审批状态判断
const canSubmitApproval = computed(() => {
  const form = formDataRef.value?.getFormData();
  // 未提交审批状态（通常是 0）可以提交
  return form?.checkStatus === 0 || form?.checkStatus === undefined;
});

const canApprove = computed(() => {
  const form = formDataRef.value?.getFormData();

  // 待审批状态（checkStatus === 1）
  if (form?.checkStatus !== 1) {
    return false;
  }

  // 从选中的审批流程中获取第一步审批的审批人ID
  let checkUids = [];
  if (selectedFlow.value && selectedFlow.value.flowList && selectedFlow.value.flowList.length > 0) {
    const firstStep = selectedFlow.value.flowList[0];
    if (firstStep.check_uids) {
      checkUids = Array.isArray(firstStep.check_uids)
        ? firstStep.check_uids.map(id => Number(id))
        : String(firstStep.check_uids).split(",").map(id => Number(id));
    }
  }

  // 如果无法从 selectedFlow 获取，尝试从 flowNodes 获取
  if (checkUids.length === 0 && Array.isArray(approvalFlowData.value.flowNodes)) {
    const currentNode = approvalFlowData.value.flowNodes.find(node => node.check_status === 1);
    if (currentNode && currentNode.check_uids) {
      checkUids = Array.isArray(currentNode.check_uids)
        ? currentNode.check_uids.map(id => Number(id))
        : String(currentNode.check_uids).split(",").map(id => Number(id));
    }
  }

  // 判断当前登录人是否在审批人列表中
  return checkUids.includes(Number(userStore.id));
});

const canReject = computed(() => {
  const form = formDataRef.value?.getFormData();

  // 待审批状态（checkStatus === 1）
  if (form?.checkStatus !== 1) {
    return false;
  }

  // 从选中的审批流程中获取第一步审批的审批人ID
  let checkUids = [];
  if (selectedFlow.value && selectedFlow.value.flowList && selectedFlow.value.flowList.length > 0) {
    const firstStep = selectedFlow.value.flowList[0];
    if (firstStep.check_uids) {
      checkUids = Array.isArray(firstStep.check_uids)
        ? firstStep.check_uids.map(id => Number(id))
        : String(firstStep.check_uids).split(",").map(id => Number(id));
    }
  }

  // 如果无法从 selectedFlow 获取，尝试从 flowNodes 获取
  if (checkUids.length === 0 && Array.isArray(approvalFlowData.value.flowNodes)) {
    const currentNode = approvalFlowData.value.flowNodes.find(node => node.check_status === 1);
    if (currentNode && currentNode.check_uids) {
      checkUids = Array.isArray(currentNode.check_uids)
        ? currentNode.check_uids.map(id => Number(id))
        : String(currentNode.check_uids).split(",").map(id => Number(id));
    }
  }

  // 判断当前登录人是否在审批人列表中
  return checkUids.includes(Number(userStore.id));
});

const canRevoke = computed(() => {
  const form = formDataRef.value?.getFormData();
  // 只有审批中的（checkStatus === 1）且创建人是当前登录人的才能撤销
  // 创建人可能在 createBy、create_by 或 userId 字段中
  const createBy = currentContractData.value?.createBy
    || currentContractData.value?.create_by
    || currentContractData.value?.userId;

  return form?.checkStatus === 1 && createBy === userStore.userId;
});

// 审批流是否可编辑（审核中=1，审核通过=2时不可编辑）
const isApprovalFlowEditable = computed(() => {
  const form = formDataRef.value?.getFormData();
  return form?.checkStatus !== 1 && form?.checkStatus !== 2;
});

/** 审批流程变更 */
function handleFlowChange(flow) {
  selectedFlow.value = flow;
}

/** 提交审批 */
function handleSubmitApproval() {
  const form = formDataRef.value?.getFormData();

  if (!approvalFlowData.value.checkFlowId) {
    proxy.$modal.msgWarning("请先选择审批流程");
    return;
  }

  proxy.$modal.confirm('确认提交审批吗？').then(() => {
    // 构建符合接口要求的入参格式
    const submitData = {
      actionId: form.id,                    // 当前申请的ID（合同ID）
      flowId: approvalFlowData.value.checkFlowId,  // 审批流程ID
      checkName: "contract",                // 固定值：contract
      checkUids: "",                        // 审批人ID，从选中的流程中获取
      checkCopyUids: Array.isArray(approvalFlowData.value.checkCopyUids)
        ? approvalFlowData.value.checkCopyUids.join(",")
        : approvalFlowData.value.checkCopyUids || "",
    };

    // 从选中的审批流程中提取审批人ID
    if (selectedFlow.value && selectedFlow.value.flowList && selectedFlow.value.flowList.length > 0) {
      // 获取第一步审批的审批人ID
      const firstStep = selectedFlow.value.flowList[0];
      if (firstStep.check_uids) {
        submitData.checkUids = Array.isArray(firstStep.check_uids)
          ? firstStep.check_uids.join(",")
          : firstStep.check_uids;
      }
    }

    submitToFlow(submitData).then(() => {
      proxy.$modal.msgSuccess("提交审批成功");
      dialogVisible.value = false;
      emit("success");
    });
  }).catch(() => {});
}

/** 同意审批 */
function handleApprove() {
  const form = formDataRef.value?.getFormData();

  proxy.$modal
    .prompt("请输入审批意见", "同意审批", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /\S+/,
      inputErrorMessage: "审批意见不能为空",
    })
    .then(({ value }) => {
      approvalFlow({
        id: form.id,
        status: 2, // 同意
        remark: value,
      }).then(() => {
        proxy.$modal.msgSuccess("审批通过");
        dialogVisible.value = false;
        emit("success");
      });
    })
    .catch(() => {});
}

/** 拒绝审批 */
function handleReject() {
  const form = formDataRef.value?.getFormData();

  proxy.$modal
    .prompt("请输入拒绝原因", "拒绝审批", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /\S+/,
      inputErrorMessage: "拒绝原因不能为空",
    })
    .then(({ value }) => {
      approvalFlow({
        id: form.id,
        status: 3, // 拒绝
        remark: value,
      }).then(() => {
        proxy.$modal.msgSuccess("已拒绝");
        dialogVisible.value = false;
        emit("success");
      });
    })
    .catch(() => {});
}

/** 撤销审批 */
function handleRevoke() {
  const form = formDataRef.value?.getFormData();

  proxy.$modal
    .confirm("确认撤销该审批吗？")
    .then(() => {
      // 调用撤销审批的API（需要根据实际情况调整）
      approvalFlow({
        id: form.id,
        status: 0, // 撤销回初始状态
      }).then(() => {
        proxy.$modal.msgSuccess("撤销成功");
        dialogVisible.value = false;
        emit("success");
      });
    })
    .catch(() => {});
}

/** 关闭弹窗 */
function handleClose() {
  formDataRef.value?.resetForm();
  // 重置审批流程数据
  approvalFlowData.value = {
    checkFlowId: "",
    checkCopyUids: userStore.id ? [userStore.id] : [],
  };
  selectedFlow.value = null;
  // 清空合同数据
  currentContractData.value = null;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  // 保存原始数据用于权限判断
  currentContractData.value = data;

  dialogVisible.value = true;

  // 等待 DOM 更新后设置数据
  nextTick(() => {
    formDataRef.value?.resetForm();
    formDataRef.value?.setFormData(data);

    // 设置审批流程数据
    approvalFlowData.value = {
      checkFlowId: data.checkFlowId || "",
      checkCopyUids: data.checkCopyUids
        ? Array.isArray(data.checkCopyUids)
          ? data.checkCopyUids
          : data.checkCopyUids.split(",")
        : [],
    };

    // 如果有 action_id 和 flow_id，获取审批节点信息
    if (data.id && data.checkFlowId) {
      getFlowNodes({
        check_name: "contract",
        action_id: data.id,
        flow_id: data.checkFlowId,
      }).then((flowData) => {
        // 将获取到的审批节点数据存储，用于展示
        if (flowData.data) {
          approvalFlowData.value.flowNodes = flowData.data;
        }
      }).catch((error) => {
        console.error("获取审批节点失败:", error);
      });
    }
  });
}

const emit = defineEmits(["success"]);

defineExpose({
  openView,
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
