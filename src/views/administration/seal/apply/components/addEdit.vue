<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
  >
    <FormData
      ref="formDataRef"
      :readonly="false"
    />

    <!-- 审批流程信息 -->
    <div class="form-section-title">审批流程信息</div>
    <ApprovalFlow
      ref="approvalFlowRef"
      :flowId="currentApplyData?.checkFlowId"
      :actionId="currentApplyData?.id"
      flow-title="用章"
    />

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

<script setup name="AddEditSealApply">
import { ref, computed, getCurrentInstance, nextTick } from "vue";
import { add, edit } from "@/api/administration/seal/apply";
import FormData from "./formData.vue";
import ApprovalFlow from "@/components/ApprovalFlow/index.vue";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formDataRef = ref(null);
const approvalFlowRef = ref(null);
const isEdit = ref(false);

// 当前申请数据（用于传递审批流信息）
const currentApplyData = ref(null);

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑用章申请" : "新增用章申请";
});

/** 关闭弹窗 */
async function handleClose() {
  await formDataRef.value?.resetForm();
  isEdit.value = false;
  currentApplyData.value = null;
}

/** 显示弹窗 - 新增模式 */
async function open() {
  isEdit.value = false;
  currentApplyData.value = null;
  dialogVisible.value = true;

  // 等待 DOM 更新后重置表单
  await nextTick();
  await formDataRef.value?.resetForm();
}

/** 显示弹窗 - 编辑模式 */
async function openEdit(data) {
  isEdit.value = true;
  currentApplyData.value = data;
  dialogVisible.value = true;

  // 等待 DOM 更新后设置数据
  await nextTick();
  await formDataRef.value?.resetForm();
  formDataRef.value?.setFormData(data);

  // 设置审批流程ID（需要等待 ApprovalFlow 组件初始化完成）
  if (data.checkFlowId) {
    approvalFlowRef.value?.setFlowId(data.checkFlowId);
  }

  // 设置抄送人 - 转换为数字数组
  if (data.checkCopyUids) {
    const copyUids = Array.isArray(data.checkCopyUids)
      ? data.checkCopyUids.map(id => Number(id))
      : data.checkCopyUids.split(",").map(id => Number(id.trim()));
    // 延迟设置抄送人，确保用户列表已加载
    setTimeout(() => {
      approvalFlowRef.value?.setCopyUids(copyUids);
    }, 100);
  }
}

/** 提交表单 */
function handleSubmit() {
  formDataRef.value?.formRef.validate((valid) => {
    if (valid) {
      const formData = formDataRef.value?.getFormData();

      // 获取审批流程信息
      const flowData = approvalFlowRef.value?.getSelectedFlow() || {};
      const flowId = flowData.id || approvalFlowRef.value?.getFlowId();
      const copyUids = approvalFlowRef.value?.getCopyUids();

      // 将数组转换为后端需要的格式
      const submitData = {
        ...formData,
        checkFlowId: flowId,
        checkCopyUids: Array.isArray(copyUids) ? copyUids.join(",") : copyUids,
      };
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
</style>
