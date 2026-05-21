<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    @close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="100px"
      style="margin-top: 15px"
    >
      <!-- 第一行：时间范围 + 工作类别（按截图布局） -->
      <el-row :gutter="0">
        <el-col :span="14">
          <el-form-item label="时间范围" prop="dateRange" required class="nowrap-label">
            <el-date-picker
              v-model="form.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              :disabled="isView"
              style="width: 100%"
              :shortcuts="dateShortcuts"
              @change="handleDateRangeChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="工作类别" prop="cid" required>
            <el-select
              v-model="form.cid"
              :disabled="isView"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in workCateList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：工作类型（保持截图里的单选样式） -->
      <el-form-item label="工作类型" prop="laborType" required>
        <el-radio-group v-model="form.laborType" :disabled="isView">
          <el-radio :label="1">案头工作</el-radio>
          <el-radio :label="2">外勤工作</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 第三行：工作内容 -->
      <el-form-item label="工作内容" prop="title" required>
        <el-input
          v-model="form.title"
          placeholder="请输入工作内容"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

      <!-- 第四行：补充描述 -->
      <el-form-item label="补充描述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="8"
          placeholder="请输入补充描述"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div style="text-align: center;">
        <el-button
          v-if="!isView"
          type="primary"
          @click="handleSubmit"
          style="width: 80px;"
        >
          确定提交
        </el-button>
        <el-button @click="dialogVisible = false">
          {{ isView ? "关 闭" : "取 消" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch, nextTick, onMounted, computed } from "vue";
import { add as addSchedule, edit as editSchedule , getWorkCateList} from "@/api/personalOffice/worklog/index.js"; 

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);
const workCateList = ref([]);


const dateShortcuts = [
  {
    text: '今天',
    value: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      return [start, end];
    },
  },
  {
    text: '明天',
    value: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const start = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0, 0);
      const end = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59);
      return [start, end];
    },
  },
  {
    text: '一周',
    value: () => {
      const end = new Date();
      const start = new Date();
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: '一个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
];

// 表单数据
const form = reactive({
  id: null,
  tid: null,
  title: "",
  cid: null,
  laborType: 1,
  remark: "",
  dateRange: [],
  startTime: "",
  endTime: "",
  cmid: 0,
  ptid: 0,
  did: null,
  adminId: 0,
  taskEndTime: null
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看工作记录";
  if (isEdit.value) return "编辑工作记录";
  return "新增工作记录";
});

// 校验规则
const rules = {
  dateRange: [{ required: true, message: "请选择时间范围", trigger: "change" }],
  cid: [{ required: true, message: "请选择工作类别", trigger: "change" }],
  laborType: [{ required: true, message: "请选择工作类型", trigger: "change" }],
  title: [{ required: true, message: "请输入工作内容", trigger: "blur" }]
};

// 监听日期范围变化
watch(() => form.dateRange, (newVal) => {
  if (newVal && newVal.length === 2 && newVal[0] && newVal[1]) {
    form.startTime = newVal[0];
    form.endTime = newVal[1];
    nextTick(() => {
      formRef.value?.validateField('dateRange');
    });
  } else {
    form.startTime = "";
    form.endTime = "";
  }
}, { deep: true });

const handleDateRangeChange = (value) => {
  if (value && value.length === 2) {
    form.startTime = value[0];
    form.endTime = value[1];
  } else {
    form.startTime = "";
    form.endTime = "";
  }
};

// 加载工作类别
async function loadWorkCateList() {
  try {
    const res = await getWorkCateList({ pageSize: 1000, pageNum: 1 });
    workCateList.value = (res.rows || []).filter(item => item.status === 1);
  } catch (err) {
    console.error("加载工作类别失败:", err);
  }
}

// 重置表单
function resetForm() {
  form.id = null;
  form.tid = null;
  form.title = "";
  form.cid = null;
  form.laborType = 1;
  form.remark = "";
  form.dateRange = [];
  form.startTime = "";
  form.endTime = "";
  form.cmid = 0;
  form.ptid = 0;
  form.did = null;
  form.adminId = 0;
  form.taskEndTime = null;

  nextTick(() => {
    formRef.value?.clearValidate();
  });
  isEdit.value = false;
  isView.value = false;
}

function handleClose() {
  resetForm();
  dialogVisible.value = false;
}

// 打开新增
function open(tid, taskEndTime) {
  resetForm();
  form.tid = tid;
  form.taskEndTime = taskEndTime;
  dialogVisible.value = true;
}

// 打开编辑
function openEdit(row, taskEndTime) {
  resetForm();
  isEdit.value = true;
  isView.value = false;
  fillFormData(row, taskEndTime);
  dialogVisible.value = true;
}

// 打开查看
function openView(row, taskEndTime) {
  resetForm();
  isEdit.value = false;
  isView.value = true;
  fillFormData(row, taskEndTime);
  dialogVisible.value = true;
}

// 填充表单数据的公共方法
function fillFormData(row, taskEndTime) {
  form.id = row.id;
  form.tid = row.tid;
  form.title = row.title || "";
  form.cid = row.cid || null;
  form.laborType = row.laborType || 1;
  form.remark = row.remark || "";
  form.cmid = row.cmid || 0;
  form.ptid = row.ptid || 0;
  form.did = row.did || null;
  form.adminId = row.adminId || 0;
  form.taskEndTime = taskEndTime || row.taskEndTime || null;

  // 时间回显
  if (row.startTime && row.endTime) {
    form.dateRange = [row.startTime, row.endTime];
    form.startTime = row.startTime;
    form.endTime = row.endTime;
  }
}

// 提交
async function handleSubmit() {
  const valid = await formRef.value.validate();
  if (!valid) return;

  const startTime = form.startTime;
  const endTime = form.endTime;

  // 验证时间
  if (new Date(endTime) <= new Date(startTime)) {
    proxy.$modal.msgError("结束时间必须大于开始时间");
    return;
  }

  // 验证时间不超过任务结束时间
  if (form.taskEndTime) {
    const taskEnd = new Date(form.taskEndTime).getTime();
    if (new Date(startTime).getTime() > taskEnd || new Date(endTime).getTime() > taskEnd) {
      proxy.$modal.msgError(`时间不能超过任务预计结束时间（${form.taskEndTime}）`);
      return;
    }
  }

  const params = {
    tid: form.tid,
    title: form.title,
    startTime: startTime,
    endTime: endTime,
    cid: form.cid,
    laborType: form.laborType,
    remark: form.remark || "",
    cmid: form.cmid || 0,
    ptid: form.ptid || 0,
    adminId: form.adminId || 0
  };

  if (form.id) {
    params.id = form.id;
  }
  if (form.did) {
    params.did = form.did;
  }

  try {
    if (form.id) {
      await editSchedule(params);
      proxy.$modal.msgSuccess("编辑成功");
    } else {
      await addSchedule(params);
      proxy.$modal.msgSuccess("添加成功");
    }
    dialogVisible.value = false;
    emit("success");
  } catch (err) {
    console.error(err);
    proxy.$modal.msgError(err.msg || "操作失败");
  }
}

onMounted(() => {
  loadWorkCateList();
});

const emit = defineEmits(["success"]);
// 关键修改：添加 openView 方法到暴露的接口中
defineExpose({ open, openEdit, openView });
</script>

<style scoped>
.schedule-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}
.schedule-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
.dialog-footer {
  text-align: center;
}
:deep(.el-date-editor .el-range-input) {
  width: 40%;
}
:deep(.el-form-item.is-error .el-date-editor) {
  border-color: #f56c6c;
}
:deep(.nowrap-label .el-form-item__label) {
  white-space: nowrap;
}
</style>