<template>
  <div class="approval-buttons">
    <el-button
      v-if="canSubmitApproval"
      type="primary"
      @click="handleSubmitApproval"
    >
      提交审批
    </el-button>
    <el-button v-if="canApproveReject" type="success" @click="handleApprove">
      同意
    </el-button>
    <el-button v-if="canApproveReject" type="danger" @click="handleReject">
      拒绝
    </el-button>
    <el-button v-if="canRevoke" type="warning" @click="handleRevoke">
      撤销
    </el-button>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance } from "vue";
import { submitToFlow, approval } from "@/api/common/approval.js";
import useUserStore from "@/store/modules/user";

const props = defineProps({
  currentData: { type: Object, default: null },
  approvalFlowRef: { type: Object, default: null },
});

const emit = defineEmits(["success", "closeDialog"]);

const { proxy } = getCurrentInstance();
const userStore = useUserStore();

// 审批状态判断
const canSubmitApproval = computed(() => {
  const info = props.currentData || {};
  return [0, 3, 4].includes(Number(info?.checkStatus)) || info?.checkStatus === undefined;
});

const canApproveReject = computed(() => {
  const info = props.currentData || {};
  if (info?.checkStatus !== 1) return false;
  return (info?.checkUids?.split(",") || []).includes(String(userStore.id));
});

const canRevoke = computed(() => {
  const info = props.currentData || {};
  return Number(info?.checkStatus) === 1 && Number(info?.adminId) === Number(userStore.id);
});

function handleSubmitApproval() {
  const info = props.currentData || {};
  const selectedFlow = props.approvalFlowRef?.getSelectedFlow?.();

  if (!selectedFlow?.id) {
    proxy.$modal.msgWarning("请先选择审批流程");
    return;
  }

  const checkCopyUids = props.approvalFlowRef?.getCopyUids?.() || [];

  proxy.$modal.confirm("确认提交审批吗？").then(() => {
    submitToFlow({
      content: "提交审批",
      actionId: info.id,
      flowId: selectedFlow.id,
      checkName: selectedFlow.checkTable,
      checkFiles: "",
      checkCopyUids: checkCopyUids.join(","),
    }).then(() => {
      proxy.$modal.msgSuccess("提交审批成功");
      emit("closeDialog");
      emit("success");
    });
  }).catch(() => {});
}

function handleApprove() {
  const info = props.currentData || {};
  proxy.$modal.prompt("请输入审批意见", "同意审批", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /\S+/,
    inputErrorMessage: "审批意见不能为空",
  }).then(({ value }) => {
    approval({
      actionId: info.id,
      flowId: info.checkFlowId,
      checkNode: info.checkStepSort,
      checkStatus: 1,
      content: value,
    }).then(() => {
      proxy.$modal.msgSuccess("审批通过");
      emit("closeDialog");
      emit("success");
    });
  }).catch(() => {});
}

function handleReject() {
  const info = props.currentData || {};
  proxy.$modal.prompt("请输入拒绝原因", "拒绝审批", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /\S+/,
    inputErrorMessage: "拒绝原因不能为空",
  }).then(({ value }) => {
    approval({
      actionId: info.id,
      flowId: info.checkFlowId,
      checkNode: info.checkStepSort,
      checkStatus: 2,
      content: value,
    }).then(() => {
      proxy.$modal.msgSuccess("已拒绝");
      emit("closeDialog");
      emit("success");
    });
  }).catch(() => {});
}

function handleRevoke() {
  const info = props.currentData || {};
  proxy.$modal.prompt("请输入撤销原因", "撤销审批", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /\S+/,
    inputErrorMessage: "撤销原因不能为空",
  }).then(({ value }) => {
    approval({
      actionId: info.id,
      flowId: info.checkFlowId,
      checkNode: info.checkStepSort,
      checkStatus: 3,
      content: value,
    }).then(() => {
      proxy.$modal.msgSuccess("已撤销");
      emit("closeDialog");
      emit("success");
    });
  }).catch(() => {});
}
</script>

<style scoped>
.approval-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
