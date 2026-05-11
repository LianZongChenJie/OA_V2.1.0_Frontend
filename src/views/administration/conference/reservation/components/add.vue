<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="isView ? {} : rules" 
      label-width="140px"
      style="margin-top: 15px"
    >
      <!-- 基础信息（新增/编辑/查看都显示） -->
      <div class="form-section-title">基础申请信息</div>

      <el-form-item label="会议主题" prop="title" required>
        <el-input 
          v-model="form.title" 
          placeholder="请输入会议主题" 
          :disabled="isView" 
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="会议室" prop="roomId" required>
        <el-select
          v-model="form.roomId"
          :disabled="isView"
          placeholder="请选择会议室"
          filterable
          clearable
          style="width:100%"
        >
          <el-option
            v-for="item in roomOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间" prop="startDate" required>
        <el-date-picker
          v-model="form.startDate"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择开始时间"
          :disabled="isView"
          style="width:100%"
        />
      </el-form-item>

      <el-form-item label="结束时间" prop="endDate" required>
        <el-date-picker
          v-model="form.endDate"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择结束时间"
          :disabled="isView"
          style="width:100%"
        />
      </el-form-item>    

      <el-form-item label="会议人数" prop="num" required>
        <el-input-number
          v-model="form.num"
          :min="1"
          :max="1000"
          placeholder="请输入会议人数"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="会议需求">
        <el-checkbox-group v-model="form.requirementList" :disabled="isView">
          <el-checkbox label="电子屏" />
          <el-checkbox label="投影背景" />
          <el-checkbox label="电脑" />
          <el-checkbox label="视频" />
          <el-checkbox label="购买水果" />
          <el-checkbox label="订餐" />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="其他要求">
        <el-input
          v-model="form.requirements"
          type="textarea"
          rows="3"
          placeholder="请输入其他要求"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

      <!-- 审批流程信息（仅在查看模式显示） -->
      <template v-if="isView">
        <div class="form-section-title">审批流程信息</div>

        <!-- 审批中/审批完结状态：显示审批节点时间轴 -->
        <div v-if="!isApprovalFlowEditable">
          <ApprovalNodes :nodes="flowNodes" :currentStepSort="currentCheckStepSort" />
        </div>

        <!-- 可编辑审批状态：显示审批流程选择组件 -->
        <ApprovalFlow
          v-else
          ref="approvalFlowRef"
          :flowId="currentData?.checkFlowId"
          :actionId="currentData?.id"
          :disabled="!isApprovalFlowEditable"
          flow-title="会议预订"
        />
      </template>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <!-- 新增/编辑模式显示提交按钮 -->
        <el-button v-if="!isView" type="primary" @click="handleSubmit">
          确 定
        </el-button>
        
        <!-- 查看模式且审批可编辑时显示审批按钮 -->
        <ApprovalButtons
          v-if="isView && isApprovalFlowEditable"
          :current-data="currentData"
          :approval-flow-ref="approvalFlowRef"
          @success="handleApprovalSuccess"
          @close-dialog="dialogVisible = false"
        />
        
        <el-button @click="dialogVisible = false">
          {{ isView ? "关 闭" : "取 消" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, nextTick } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/administration/conference/reservation/index.js";
import { listUser } from "@/api/system/user.js";
import { getPageList } from "@/api/administration/conference/room/index.js";
import ApprovalFlow from "@/components/ApprovalFlow/index.vue";
import ApprovalButtons from "@/components/ApprovalFlow/ApprovalButtons.vue";
import ApprovalNodes from "@/components/ApprovalFlow/ApprovalNodes.vue";
import { getFlowNodes } from "@/api/common/approval";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["success"]);

// 弹窗状态
const dialogVisible = ref(false);
const formRef = ref(null);
const approvalFlowRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);
const currentData = ref(null);

// 审批相关
const flowNodes = ref([]);
const currentCheckStepSort = ref(null);

// 下拉选项数据
const userOptions = ref([]);
const roomOptions = ref([]);

// 是否可编辑审批
const isApprovalFlowEditable = computed(() => {
  return [0, 3, 4].includes(Number(currentData.value?.checkStatus));
});

// 表单数据
const form = reactive({
  id: undefined,
  title: "",
  roomId: null,
  startDate: "",
  endDate: "",
  num: 1,
  requirementList: [],
  requirements: "",
});

// 弹窗标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看会议预订";
  return isEdit.value ? "编辑会议预订" : "新增会议预订";
});

// 校验规则
const rules = {
  title: [{ required: true, message: "请输入会议主题", trigger: "blur" }],
  roomId: [{ required: true, message: "请选择会议室", trigger: "change" }],
  startDate: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  endDate: [{ required: true, message: "请选择结束时间", trigger: "change" }],
  num: [
    { required: true, message: "请输入会议人数", trigger: "blur" },
    { type: 'number', min: 1, message: "会议人数必须大于0", trigger: "blur" }
  ]
};

// 获取会议室列表
function getRoomList() {
  getPageList({ pageSize: 1000 }).then(res => {
    let list = [];
    if (res.rows && Array.isArray(res.rows)) {
      list = res.rows.map(row => {
        return Array.isArray(row) ? row[0] : row;
      }).filter(item => item && item.id);
    }
    roomOptions.value = list;
  });
}

// 获取用户列表
function getUserList() {
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(u => u.status === "0");
  });
}

// 重置表单
function resetForm() {
  Object.assign(form, {
    id: undefined,
    title: "",
    roomId: null,
    startDate: "",
    endDate: "",
    num: 1,
    requirementList: [],
    requirements: "",
  });
  flowNodes.value = [];
  currentCheckStepSort.value = null;
  currentData.value = null;
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

// 关闭弹窗
function handleClose() {
  resetForm();
  dialogVisible.value = false;
  isEdit.value = false;
  isView.value = false;
}

// 解析需求字段
function parseRequirements(requirementsText) {
  let requirementList = [];
  let requirements = "";
  
  if (requirementsText) {
    const parts = requirementsText.split('；');
    if (parts.length > 0) {
      const firstPart = parts[0];
      const checkboxCandidates = firstPart.split('、').filter(Boolean);
      const checkboxOptions = ['电子屏', '投影背景', '电脑', '视频', '购买水果', '订餐'];
      requirementList = checkboxCandidates.filter(item => checkboxOptions.includes(item));
      const otherTexts = checkboxCandidates.filter(item => !checkboxOptions.includes(item));
      if (otherTexts.length > 0) {
        requirements = otherTexts.join('、');
      }
      if (parts.length > 1) {
        requirements += (requirements ? '；' : '') + parts.slice(1).join('；');
      }
    }
  }
  
  return { requirementList, requirements };
}

// 填充表单数据
function fillFormData(data) {
  const { requirementList, requirements } = parseRequirements(data.requirements);
  
  form.id = data.id;
  form.title = data.title || "";
  form.startDate = data.startDate || "";
  form.endDate = data.endDate || "";
  form.roomId = data.roomId ? Number(data.roomId) : null;
  form.num = data.num || 1;
  form.requirementList = requirementList;
  form.requirements = requirements;
}

// 加载审批节点
async function loadApprovalNodes(data) {
  if (!isApprovalFlowEditable.value && data.checkFlowId && data.id) {
    try {
      const result = await getFlowNodes({
        flowId: data.checkFlowId,
        actionId: data.id
      });

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
    } catch (error) {
      console.error("获取审批步骤信息失败:", error);
    }
  }
}

// 提交（新增/编辑）
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (!valid) return;

    let requirementsText = form.requirementList.join('、');
    if (form.requirements && form.requirements.trim()) {
      requirementsText += (requirementsText ? '；' : '') + form.requirements;
    }

    const submitData = {
      title: form.title,
      roomId: Number(form.roomId),
      startDate: form.startDate,
      endDate: form.endDate,
      num: Number(form.num),
      requirements: requirementsText,
    };

    if (isEdit.value && form.id) {
      submitData.id = form.id;
    }

    const apiMethod = isEdit.value ? updateenterPrise : addenterPrise;
    apiMethod(submitData).then(() => {
      proxy.$modal.msgSuccess(isEdit.value ? "编辑成功" : "新增成功");
      dialogVisible.value = false;
      emit("success");
    });
  });
}

// 审批成功回调
function handleApprovalSuccess() {
  dialogVisible.value = false;
  emit("success");
}

// 打开新增
function open() {
  resetForm();
  isEdit.value = false;
  isView.value = false;
  dialogVisible.value = true;
}

// 打开编辑
function openEdit(data) {
  resetForm();
  fillFormData(data);
  isEdit.value = true;
  isView.value = false;
  dialogVisible.value = true;
}

// 打开查看
async function openView(data) {
  resetForm();
  fillFormData(data);
  currentData.value = data;
  isEdit.value = false;
  isView.value = true;
  dialogVisible.value = true;

  await nextTick();

  if (data.checkFlowId) {
    approvalFlowRef.value?.setFlowId(data.checkFlowId);
  }

  if (data.checkCopyUids) {
    const copyUids = Array.isArray(data.checkCopyUids)
      ? data.checkCopyUids
      : data.checkCopyUids.split(",");
    approvalFlowRef.value?.setCopyUids(copyUids);
  }

  await loadApprovalNodes(data);
}

// 初始化
onMounted(() => {
  getRoomList();
  getUserList();
});

defineExpose({ open, openEdit, openView });
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
  gap: 12px;
}

.el-dialog__footer {
  border-top: 1px solid #f7f7f7;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
}
</style>