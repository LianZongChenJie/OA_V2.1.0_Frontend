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

<script setup name="ApprovalButtons">
import { computed, getCurrentInstance } from "vue";
import { submitToFlow, approval as approvalFlow } from "@/api/common/approval.js";
import useUserStore from "@/store/modules/user";

const props = defineProps({
  // 当前申请数据
  currentData: {
    type: Object,
    default: null,
  },
  // 审批流程组件引用
  approvalFlowRef: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["success", "closeDialog"]);

const { proxy } = getCurrentInstance();
const userStore = useUserStore();

// 审批状态判断
const canSubmitApproval = computed(() => {
  const info = props.currentData || {};
  return Number(info?.checkStatus) === 0 || info?.checkStatus === undefined;
});

const canApproveReject = computed(() => {
  const info = props.currentData || {};
  if (info?.checkStatus !== 1) {
    return false;
  }
  const checkUids = info?.checkUids?.split(",") || [];
  return checkUids.includes(String(userStore.id));
});

const canRevoke = computed(() => {
  const info = props.currentData || {};
  const adminId = info?.adminId;
  return (
    Number(info?.checkStatus) === 1 &&
    Number(adminId) === Number(userStore.id)
  );
});

/** 提交审批 */
function handleSubmitApproval() {
  const info = props.currentData || {};
  const selectedFlow = props.approvalFlowRef?.getSelectedFlow();

  if (!selectedFlow?.id) {
    proxy.$modal.msgWarning("请先选择审批流程");
    return;
  }

  const checkCopyUids = props.approvalFlowRef?.getCopyUids() || [];

  proxy.$modal
    .confirm("确认提交审批吗？")
    .then(() => {
      const submitData = {
        content: "提交审批",
        actionId: info.id,
        flowId: selectedFlow.id,
        checkName: selectedFlow.checkTable,
        checkFiles: "",
        checkCopyUids: checkCopyUids.join(","),
      };

      submitToFlow(submitData).then(() => {
        proxy.$modal.msgSuccess("提交审批成功");
        emit("closeDialog");
        emit("success");
      });
    })
    .catch(() => {});
}

/** 同意审批 */
function handleApprove() {
  const info = props.currentData || {};

  proxy.$modal
    .prompt("请输入审批意见", "同意审批", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /\S+/,
      inputErrorMessage: "审批意见不能为空",
    })
    .then(({ value }) => {
      approvalFlow({
        actionId: info.id,
        flowId: info.checkFlowId,
        checkStatus: 2,
        remark: value,
      }).then(() => {
        proxy.$modal.msgSuccess("审批通过");
        emit("closeDialog");
        emit("success");
      });
    })
    .catch(() => {});
}

/** 拒绝审批 */
function handleReject() {
  const info = props.currentData || {};

  proxy.$modal
    .prompt("请输入拒绝原因", "拒绝审批", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /\S+/,
      inputErrorMessage: "拒绝原因不能为空",
    })
    .then(({ value }) => {
      approvalFlow({
        id: info.id,
        status: 3,
        remark: value,
      }).then(() => {
        proxy.$modal.msgSuccess("已拒绝");
        emit("closeDialog");
        emit("success");
      });
    })
    .catch(() => {});
}

/** 撤销审批 */
function handleRevoke() {
  const info = props.currentData || {};

  proxy.$modal
    .confirm("确认撤销该审批吗？")
    .then(() => {
      approvalFlow({
        id: info.id,
        status: 0,
      }).then(() => {
        proxy.$modal.msgSuccess("撤销成功");
        emit("closeDialog");
        emit("success");
      });
    })
    .catch(() => {});
}
</script>

<style scoped>
.approval-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
