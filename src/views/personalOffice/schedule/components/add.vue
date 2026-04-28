<template>
  <el-dialog
    title="日程安排"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="schedule-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="100px"
    >
      <!-- 第一行：日程时间范围 + 提醒 -->
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="日程时间范围" prop="dateRange" required class="nowrap-label">
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
          <el-form-item label="提醒" prop="remindType" required>
            <el-select
              v-model="form.remindType"
              placeholder="请选择"
              :disabled="isView"
            >
              <el-option label="不提醒" :value="0" />
              <el-option label="准时提醒" :value="1" />
              <el-option label="提前5分钟" :value="2" />
              <el-option label="提前10分钟" :value="3" />
              <el-option label="提前15分钟" :value="4" />
              <el-option label="提前30分钟" :value="5" />
              <el-option label="提前1小时" :value="6" />
              <el-option label="提前1天" :value="7" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：日程内容 + 优先级 -->
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="日程内容" prop="title" required>
            <el-input
              v-model="form.title"
              placeholder="请完成日程内容"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="优先级" prop="type" required>
            <el-select
              v-model="form.type"
              placeholder="请选择"
              :disabled="isView"
            >
              <el-option label="低优先级" value="1" />
              <el-option label="中优先级" value="2" />
              <el-option label="高优先级" value="3" />
              <el-option label="紧急" value="4" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：日程详细描述 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="日程详细描述" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="10"
              placeholder="请输入日程详细描述"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer" style="text-align: center;">
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

<script setup name="AddSchedule">
import { ref, reactive, getCurrentInstance, watch, nextTick } from "vue";
import { add as addSchedule, edit as editSchedule } from "@/api/personalOffice/schedule/index.js"; 

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 日期快捷选项
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
    text: '最近一周',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
];

const form = reactive({
  id: undefined,
  title: "",
  type: "", 
  remindType: 0,
  remark: "",
  dateRange: [],
  startTime: "",
  endTime: "",
});

const rules = {
  title: [
    { required: true, message: "请输入日程内容", trigger: "blur" },
    { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }
  ],
  type: [{ required: true, message: "请选择优先级", trigger: "change" }],
  remindType: [{ required: true, message: "请选择提醒类型", trigger: "change" }],
  dateRange: [{ required: true, message: "请选择日程时间范围", trigger: "change" }],
};

// 监听日期范围变化，同步到 form 的 startTime 和 endTime
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

// 日期范围变化处理
const handleDateRangeChange = (value) => {
  if (value && value.length === 2) {
    form.startTime = value[0];
    form.endTime = value[1];
  } else {
    form.startTime = "";
    form.endTime = "";
  }
};

function reset() {
  form.id = undefined;
  form.title = "";
  form.type = ""; 
  form.remindType = 0;
  form.remark = "";
  form.dateRange = [];
  form.startTime = "";
  form.endTime = "";
  isEdit.value = false;
  isView.value = false;
  
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

function handleClose() {
  reset();
}

function open() {
  reset();
  dialogVisible.value = true;
  
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

function openEdit(data) {
  reset();
  dialogVisible.value = true;
  
  form.id = data.id;
  form.title = data.title || "";
  form.type = data.type + "" || ""; 
  form.remindType = data.remindType ?? 0;
  form.remark = data.remark || "";
  form.startTime = data.startTime || "";
  form.endTime = data.endTime || "";

  if (form.startTime && form.endTime) {
    form.dateRange = [form.startTime, form.endTime];
  }

  isEdit.value = true;
  
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

function openView(data) {
  reset();
  dialogVisible.value = true;
  
  form.id = data.id;
  form.title = data.title || "";
  form.type = data.type + "" || ""; 
  form.remindType = data.remindType ?? 0;
  form.remark = data.remark || "";
  form.startTime = data.startTime || "";
  form.endTime = data.endTime || "";

  if (form.startTime && form.endTime) {
    form.dateRange = [form.startTime, form.endTime];
  }

  isView.value = true;
  
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? editSchedule : addSchedule;
      const successMsg = isEdit.value ? "编辑日程成功" : "新增日程成功";
      
      const submitData = { 
        ...form,
        dateRange: undefined
      };
      
      apiMethod(submitData).then(() => {
        proxy.$modal.msgSuccess(successMsg);
        dialogVisible.value = false;
        emit("success");
      }).catch((error) => {
        console.error('提交失败', error);
        proxy.$modal.msgError(isEdit.value ? "编辑日程失败" : "新增日程失败");
      });
    } else {
      proxy.$modal.msgWarning("请完整填写表单信息");
      return false;
    }
  });
}

const emit = defineEmits(["success"]);

defineExpose({
  open,
  openEdit,
  openView,
});
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