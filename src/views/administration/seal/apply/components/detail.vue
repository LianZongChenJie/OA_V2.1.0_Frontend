<template>
  <el-dialog
    title="查看用章申请"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
  >
    <div>
      <FormData ref="formDataRef" :readonly="true" />

      <!-- 审批流程信息 -->
      <div class="form-section-title">审批流程信息</div>
      <ApprovalFlow
        ref="approvalFlowRef"
        :disabled="!isApprovalFlowEditable"
        flow-title="用章"
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
          v-if="canApproveReject"
          type="success"
          @click="handleApprove"
        >
          同意
        </el-button>
        <el-button v-if="canApproveReject" type="danger" @click="handleReject">
          拒绝
        </el-button>
        <el-button v-if="canRevoke" type="warning" @click="handleRevoke">
          撤销
        </el-button>
        <el-button @click="dialogVisible = false"> 关 闭 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="SealApplyDetail">
import { ref, computed, getCurrentInstance, nextTick } from "vue";
import {
  submitToFlow,
  approval as approvalFlow,
} from "@/api/common/approval.js";
import ApprovalFlow from "@/components/ApprovalFlow/index.vue";
import FormData from "./formData.vue";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const userStore = useUserStore();

const dialogVisible = ref(false);
const formDataRef = ref(null);
const approvalFlowRef = ref(null);

// 当前申请数据（用于权限判断）
const currentApplyData = ref(null);

// 审批状态判断
const canSubmitApproval = computed(() => {
  const info = currentApplyData.value || {};

  // 未提交审批状态（通常是 0）可以提交
  return Number(info?.checkStatus) === 0 || info?.checkStatus === undefined;
});

const canApproveReject = computed(() => {
  const info = currentApplyData.value || {};
  // 待审批状态（checkStatus === 1）
  if (info?.checkStatus !== 1) {
    return false;
  }
  const checkUids = info?.checkUids?.split(",") || [];
  return checkUids.includes(String(userStore.id));
});

const canRevoke = computed(() => {
  const info = currentApplyData.value || {};
  const adminId = info?.adminId;
  return (
    Number(info?.checkStatus) === 1 &&
    Number(adminId) === Number(userStore.id)
  );
});

// 审批流是否可编辑（审核中=1，审核通过=2时不可编辑）
const isApprovalFlowEditable = computed(() => {
  const info = currentApplyData.value || {};
  return [0, 3, 4].includes(Number(info?.checkStatus));
});

/** 提交审批 */
function handleSubmitApproval() {
  const info = currentApplyData.value || {};
  const selectedFlow = approvalFlowRef.value?.getSelectedFlow();

  if (!selectedFlow?.id) {
    proxy.$modal.msgWarning("请先选择审批流程");
    return;
  }

  const checkCopyUids = approvalFlowRef.value?.getCopyUids() || [];

  proxy.$modal
    .confirm("确认提交审批吗？")
    .then(() => {
      // 构建符合接口要求的入参格式
      const submitData = {
        content: "提交审批", // 提交审批状态|默认审批中
        actionId: info.id, // 当前申请的ID
        flowId: selectedFlow.id, // 审批流程ID
        checkName: selectedFlow.checkTable,
        checkFiles: "", //用章申请附件
        checkCopyUids: checkCopyUids.join(","),
      };

      submitToFlow(submitData).then(() => {
        proxy.$modal.msgSuccess("提交审批成功");
        dialogVisible.value = false;
        emit("success");
      });
    })
    .catch(() => {});
}

/** 同意审批 */
function handleApprove() {
  const info = currentApplyData.value || {};

  proxy.$modal
    .prompt("请输入审批意见", "同意审批", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /\S+/,
      inputErrorMessage: "审批意见不能为空",
    })
    .then(({ value }) => {
      approvalFlow({
        id: info.id,
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
  const info = currentApplyData.value || {};

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
  const info = currentApplyData.value || {};

  proxy.$modal
    .confirm("确认撤销该审批吗？")
    .then(() => {
      // 调用撤销审批的API
      approvalFlow({
        id: info.id,
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
  // 清空申请数据
  currentApplyData.value = null;
}

/** 显示弹窗 - 查看模式 */
async function openView(data) {
  // 保存原始数据用于权限判断
  currentApplyData.value = data;

  dialogVisible.value = true;

  // 等待 DOM 更新后设置数据
  nextTick(async () => {
    await formDataRef.value?.resetForm();
    formDataRef.value?.setFormData(data);

    // 设置审批流程ID
    if (data.checkFlowId) {
      approvalFlowRef.value?.setFlowId(data.checkFlowId);
    }

    // 设置抄送人
    if (data.checkCopyUids) {
      const copyUids = Array.isArray(data.checkCopyUids)
        ? data.checkCopyUids
        : data.checkCopyUids.split(",");
      approvalFlowRef.value?.setCopyUids(copyUids);
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
