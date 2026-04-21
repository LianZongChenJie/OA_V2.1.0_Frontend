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
        :approval-flow="{flowId: currentApplyData.value?.checkFlowId, actionId:currentApplyData.value?.id }"
        :disabled="!isApprovalFlowEditable"
        flow-title="用章"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <ApprovalButtons
          :current-data="currentApplyData"
          :approval-flow-ref="approvalFlowRef"
          @success="handleSuccess"
          @close-dialog="dialogVisible = false"
        />
        <el-button style="margin-left: 20px" @click="dialogVisible = false">
          关 闭
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="SealApplyDetail">
import { ref, computed, nextTick } from "vue";
import ApprovalFlow from "@/components/ApprovalFlow/index.vue";
import ApprovalButtons from "@/components/ApprovalFlow/ApprovalButtons.vue";
import FormData from "./formData.vue";
import { getFlowNodes } from "@/api/common/approval";

const dialogVisible = ref(false);
const formDataRef = ref(null);
const approvalFlowRef = ref(null);

// 当前申请数据（用于权限判断）
const currentApplyData = ref(null);

// 审批流是否可编辑（审核中=1，审核通过=2时不可编辑）
const isApprovalFlowEditable = computed(() => {
  const info = currentApplyData.value || {};
  return [0, 3, 4].includes(Number(info?.checkStatus));
});

/** 处理审批操作成功 */
function handleSuccess() {
  emit("success");
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

    // 当审批流不可编辑时，调用 getFlowNodes 接口获取审批步骤信息
    if (!isApprovalFlowEditable.value && data.checkFlowId && data.id) {
      try {
        const result = await getFlowNodes({
          flowId: data.checkFlowId,
          actionId: data.id
        });
        console.log("审批步骤信息:", result);
      } catch (error) {
        console.error("获取审批步骤信息失败:", error);
      }
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.el-dialog__footer {
  border-top: 1px solid #f7f7f7;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
}
</style>
