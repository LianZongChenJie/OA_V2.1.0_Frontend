<template>
  <el-dialog
    title="查看公文"
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

      <!-- 审批中/审批完结状态：显示审批节点时间轴 -->
      <div v-if="!isApprovalFlowEditable">
        <ApprovalNodes :nodes="flowNodes" :currentStepSort="currentCheckStepSort" />
      </div>

      <!-- 其他状态：显示审批流程选择组件 -->
      <ApprovalFlow
        v-else
        ref="approvalFlowRef"
        :flowId="currentData?.checkFlowId"
        :actionId="currentData?.id"
        :disabled="!isApprovalFlowEditable"
        flow-title="公文"
      />

      <!-- 审批记录 -->
      <RecordSteps
        v-if="currentData?.records?.length"
        :records="currentData.records"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <ApprovalButtons
          :current-data="currentData"
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

<script setup name="DocumentsDetail">
import { ref, computed, nextTick } from "vue";
import ApprovalFlow from "@/components/ApprovalFlow/index.vue";
import ApprovalButtons from "@/components/ApprovalFlow/ApprovalButtons.vue";
import ApprovalNodes from "@/components/ApprovalFlow/ApprovalNodes.vue";
import RecordSteps from "@/components/RecordSteps/index.vue";
import FormData from "./formData.vue";
import { getFlowNodes } from "@/api/common/approval";

const dialogVisible = ref(false);
const formDataRef = ref(null);
const approvalFlowRef = ref(null);
const flowNodes = ref([]);
const currentCheckStepSort = ref(null);
const currentData = ref(null);

const isApprovalFlowEditable = computed(() => {
  return [0, 3, 4].includes(Number(currentData.value?.checkStatus));
});

/** 关闭弹窗 */
function handleClose() {
  formDataRef.value?.resetForm();
  // 清空审批节点数据
  flowNodes.value = [];
  currentCheckStepSort.value = null;
  // 清空数据
  currentData.value = null;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  // 保存原始数据用于权限判断
  currentData.value = data;

  dialogVisible.value = true;

  // 等待 DOM 更新后设置数据
  nextTick(() => {
    formDataRef.value?.resetForm();
    formDataRef.value?.setFormData(data);

    // 设置审批流程数据
    if (data.checkFlowId) {
      approvalFlowRef.value?.setFlowId(data.checkFlowId);
    }

    if (data.checkCopyUids) {
      const copyUids = Array.isArray(data.checkCopyUids)
        ? data.checkCopyUids
        : data.checkCopyUids.split(",");
      approvalFlowRef.value?.setCopyUids(copyUids);
    }

    // 如果是审批中或审批完结状态，获取审批节点信息
    if (!isApprovalFlowEditable.value && data.checkFlowId && data.id) {
      getFlowNodes({
        flowId: data.checkFlowId,
        actionId: data.id
      }).then((result) => {
        const stepSort = result.data?.checkStepSort ?? result.data?.step?.sort ?? 0;
        const nodesData = result.data?.nodes.map(item => ({
          ...item,
          isFinished: 0,
          stepName: '步骤 ' + (Number(item.sort) + 1)
        })) || [];

        if (nodesData.length > 0) {
          flowNodes.value = data.checkStatus === 1
            ? nodesData
            : [...nodesData, { stepName: '完结', sort: nodesData.length, isFinished: 1 }];
          currentCheckStepSort.value = stepSort;
        }
      }).catch((error) => {
        console.error("获取审批节点失败:", error);
      });
    }
  });
}

const emit = defineEmits(["success"]);

/** 审批操作成功回调 - 刷新列表 */
function handleSuccess() {
  emit("success");
}

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