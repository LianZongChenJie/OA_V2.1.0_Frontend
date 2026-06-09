<template>
  <el-dialog
    title="面试结果"
    v-model="visible"
    width="400px"
    @close="handleClose"
  >
    <el-radio-group v-model="interviewResultStatus">
      <el-radio
        v-for="dict in dictOptions"
        :key="dict.value"
        :value="dict.value"
      >
        {{ dict.label }}
      </el-radio>
    </el-radio-group>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from "vue";
import { updateInterviewResult } from "@/api/personnel/resume/index.js";

const { proxy } = getCurrentInstance();
const { resume_status } = proxy.useDict("resume_status");

const emit = defineEmits(["success"]);

const visible = ref(false);
const interviewResultStatus = ref(null);
const currentRow = ref(null);
const dictOptions = computed(() => 
  (resume_status.value || []).filter((item) => [2, 3].includes(Number(item.value)))
);

function open(row) {
  currentRow.value = row;
  interviewResultStatus.value = null;
  visible.value = true;
}

function handleClose() {
  visible.value = false;
  currentRow.value = null;
  interviewResultStatus.value = null;
}

async function handleSubmit() {
  if (interviewResultStatus.value === null) {
    proxy.$modal.msgWarning("请选择面试结果");
    return;
  }
  try {
    await updateInterviewResult({
      resumeId: currentRow.value.id,
      status: Number(interviewResultStatus.value)
    });
    proxy.$modal.msgSuccess("操作成功");
    handleClose();
    emit("success");
  } catch (err) {
    console.error("面试结果提交失败", err);
  }
}

defineExpose({ open });
</script>
