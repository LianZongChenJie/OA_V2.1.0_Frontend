<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="70%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
  >
    <div>
      <FormData
        ref="formDataRef"
        :readonly="false"
      />

      <!-- 审批记录（当 checkStatus != 0 时显示） -->
      <RecordSteps
        v-if="currentData && Number(currentData.checkStatus) !== 0 && currentData.records && currentData.records.length > 0"
        :records="currentData.records"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">
          确 定
        </el-button>
        <el-button @click="dialogVisible = false">
          取 消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddEditSalesContract">
import { ref, computed, getCurrentInstance, nextTick } from "vue";
import { add, edit } from "@/api/financial/reimbursement";
import ApprovalFlow from "@/components/ApprovalFlow/index.vue";
import ApprovalNodes from "@/components/ApprovalFlow/ApprovalNodes.vue";
import RecordSteps from "@/components/RecordSteps/index.vue";
import FormData from "./formData.vue";
import { getFlowNodes } from "@/api/common/approval";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formDataRef = ref(null);
const approvalFlowRef = ref(null);
const flowNodes = ref([]);
const currentCheckStepSort = ref(null);
const currentData = ref(null);
const isEdit = ref(false); // 是否为编辑模式

const isApprovalFlowEditable = computed(() => {
  return [0, 3, 4].includes(Number(currentData.value?.checkStatus));
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑报销" : "新增报销";
});

/** 关闭弹窗 */
function handleClose() {
  formDataRef.value?.resetForm();
  isEdit.value = false;
  // 清空审批节点数据
  flowNodes.value = [];
  currentCheckStepSort.value = null;
  currentData.value = null;
}

/** 显示弹窗 - 新增模式 */
function open() {
  isEdit.value = false;
  dialogVisible.value = true;

  // 等待 DOM 更新后重置表单
  nextTick(() => {
    formDataRef.value?.resetForm();
  });
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  isEdit.value = true;
  dialogVisible.value = true;

  // 保存原始数据用于权限判断
  currentData.value = data;

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

/** 提交表单 */
function handleSubmit() {
  formDataRef.value?.formRef.validate((valid) => {
    if (valid) {
      const formData = formDataRef.value?.getFormData();

      // 计算报销总金额
      const totalCost = formData.interfix.reduce((sum, item) => {
        return sum + (Number(item.amount) || 0);
      }, 0);

      // 转换为后端需要的扁平化格式
      const submitData = {
        adminId: formData.info.adminId,
        did: formData.info.did,
        subjectId: formData.info.subjectId,
        code: formData.info.code,
        expenseTime: formData.info.expenseTime,
        incomeMonth: formData.info.incomeMonth,
        projectId: formData.info.projectId,
        loanId: formData.info.loanId,
        loanTitle: formData.info.loanTitle,
        loanCode: formData.info.loanCode,
        cost: totalCost,
        interfix: formData.interfix.map(item => ({
          amount: item.amount,
          cateId: item.cateId,
          remarks: item.remarks,
          adminId: item.adminId
        }))
      };

      // 编辑时添加 id
      if (isEdit.value && formData.id) {
        submitData.id = formData.id;
      }

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
});
</script>

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

.form-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0 15px 0;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}
</style>
