<template>
  <!-- 弹窗主体 -->
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="800px"
    append-to-body
    @close="handleClose"
  >
    <!-- 第一步：选择汇报类型 -->
    <template v-if="step === 1">
      <div class="type-select">
        <el-button
          v-for="item in typeOptions"
          :key="item.value"
          :type="form.types === item.value ? 'primary' : 'default'"
          @click="selectType(item.value)"
          class="type-btn"
        >
          {{ item.label }}
        </el-button>
      </div>
    </template>

    <!-- 第二步：填写汇报表单 -->
    <template v-if="step === 2">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <!-- 汇报类型（只读显示） -->
        <el-form-item label="汇报类型">
          <el-select
            v-model="form.types"
            disabled
            style="width:100%"
          >
            <el-option label="日报" :value="1" />
            <el-option label="周报" :value="2" />
            <el-option label="月报" :value="3" />
          </el-select>
        </el-form-item>

        <!-- 接收人 -->
        <el-form-item label="接收人" prop="toUids" required>
          <el-select
            v-model="form.toUids"
            :disabled="isView"
            multiple
            clearable
            style="width:100%"
            placeholder="请选择接收人"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="String(item.userId)"
            />
          </el-select>
        </el-form-item>

        <!-- 汇报周期（时间范围） -->
        <el-form-item label="汇报周期" prop="dateRange" required>
          <!-- 日报 -->
          <el-date-picker
            v-if="form.types === 1"
            key="date"
            v-model="dateRange"
            type="date"
            placeholder="请选择日期"
            value-format="YYYY-MM-DD"
            :disabled="isView"
            style="width:100%"
            @change="handleDateChange"
          />

          <!-- 周报 -->
          <el-date-picker
            v-else-if="form.types === 2"
            key="week"
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledWeekDate"
            :disabled="isView"
            style="width:100%"
            @calendar-change="handleWeekCalendarChange"
            @change="handleDateChange"
          />

          <!-- 月报 -->
          <el-date-picker
            v-else-if="form.types === 3"
            key="month"
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledMonthDate"
            :disabled="isView"
            style="width:100%"
            @calendar-change="handleMonthCalendarChange"
            @change="handleDateChange"
          />
        </el-form-item>

        <!-- 已完成工作内容 -->
        <el-form-item 
          :label="form.types === 1 ? '今日工作' : form.types === 2 ? '本周工作' : '本月工作'" 
          prop="works" 
          required
        >
          <el-input
            v-model="form.works"
            type="textarea"
            :rows="6"
            :disabled="isView"
            style="width:100%"
            :placeholder="`请输入${form.types === 1 ? '今日' : form.types === 2 ? '本周' : '本月'}工作内容`"
          />
        </el-form-item>

        <!-- 计划工作内容 -->
        <el-form-item 
          :label="form.types === 1 ? '明日计划' : form.types === 2 ? '下周计划' : '下月计划'" 
          prop="plans"
        >
          <el-input
            v-model="form.plans"
            type="textarea"
            :rows="6"
            :disabled="isView"
            style="width:100%"
            :placeholder="`请输入${form.types === 1 ? '明日' : form.types === 2 ? '下周' : '下月'}计划`"
          />
        </el-form-item>

        <!-- 其他事项/备注 -->
        <el-form-item label="其它事项" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="4"
            :disabled="isView"
            style="width:100%"
            placeholder="请输入其它事项"
          />
        </el-form-item>

        <!-- 附件上传 -->
        <!-- <el-form-item label="附件">
          <el-upload
            v-model:file-list="fileList"
            action="#"
            :auto-upload="false"
            :disabled="isView"
            multiple
            list-type="text"
            style="width:100%"
          >
            <el-button type="primary" :disabled="isView">+ 添加附件</el-button>
          </el-upload>
        </el-form-item> -->
      </el-form>
    </template>

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <div class="dialog-footer" style="text-align:right">
        <!-- 第一步：取消按钮 -->
        <el-button v-if="step === 1" @click="handleClose">取消</el-button>

        <!-- 第二步：根据不同状态显示不同按钮 -->
        <template v-if="step === 2">
          <!-- 查看模式：只显示关闭 -->
          <el-button v-if="isView" @click="handleClose">关闭</el-button>
          
          <!-- 编辑模式 -->
          <template v-else>
            <!-- 已发送状态：只显示仅保存（仅保存）和取消 -->
            <template v-if="isSent">
              <el-button type="primary" @click="handleResend">仅保存</el-button>
              <el-button @click="handleClose">取消</el-button>
            </template>
            
            <!-- 未发送状态：显示完整按钮 -->
            <template v-else>
              <el-button @click="step = 1">上一步</el-button>
              <el-button @click="handleOnlySave">仅保存</el-button>
              <el-button type="primary" @click="handleSubmit">保存并发送</el-button>
              <el-button @click="handleClose">取消</el-button>
            </template>
          </template>
        </template>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddWorkReportDialog">
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { listUser } from "@/api/system/user.js";
import { addenterPrise, updateenterPrise } from "@/api/personalOffice/workReport/index.js";

const emit = defineEmits(["success"]);

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);
const step = ref(1); 
const userOptions = ref([]);
const dateRange = ref(null); 
const fileList = ref([]); 

// 临时存储选择的开始日期
const tempStartDate = ref(null);

// 汇报类型选项
const typeOptions = [
  { label: "日报", value: 1 },
  { label: "周报", value: 2 },
  { label: "月报", value: 3 }
];

// 表单数据（完全对齐接口字段）
const form = reactive({
  types: null, // 1-日报 2-周报 3-月报
  startDate: "", // 开始日期（字符串格式 YYYY-MM-DD）
  endDate: "", // 结束日期（字符串格式 YYYY-MM-DD）
  toUids: [], // 接收人ID数组（提交时转逗号分隔字符串）
  works: "", // 已完成工作内容
  plans: "", // 计划工作内容
  remark: "", // 其他事项/备注
  fileIds: null, // 附件ID列表（提交时转逗号分隔字符串）
  sendTime: null, // 发送时间（仅保存时为null，发送时赋值）
  adminId: 0, // 创建人/汇报人ID（可在提交时从用户信息中获取）
  id: null // 编辑时的ID
});

// 判断是否为已发送状态（有发送时间表示已发送）
const isSent = computed(() => {
  return !!form.sendTime;
});

// 弹窗标题动态计算
const dialogTitle = computed(() => {
  if (isView.value) return "查看工作汇报";
  if (isEdit.value) {
    return isSent.value ? "编辑工作汇报（已发送）" : "编辑工作汇报";
  }
  return step.value === 1 ? "新建工作汇报" : typeOptions.find(t => t.value === form.types)?.label + "汇报";
});

// 自定义校验函数：校验时间范围是否已选择
const validateDateRange = (rule, value, callback) => {
  if (!dateRange.value || (Array.isArray(dateRange.value) && dateRange.value.length === 0) || dateRange.value === '') {
    callback(new Error("请选择汇报周期"));
  } else if (form.types === 1 && dateRange.value) {
    callback();
  } else if ((form.types === 2 || form.types === 3) && Array.isArray(dateRange.value) && dateRange.value.length === 2) {
    callback();
  } else {
    callback(new Error("请选择汇报周期"));
  }
};

// 表单校验规则
const rules = {
  toUids: [{ required: true, message: "请选择接收人", trigger: "change" }],
  works: [{ required: true, message: "请输入工作内容", trigger: "blur" }],
  dateRange: [{ required: true, validator: validateDateRange, trigger: "change" }]
};

// 周报：禁用超出开始日期+6天的日期
const disabledWeekDate = (time) => {
  if (!tempStartDate.value) return false;
  const startDate = new Date(tempStartDate.value);
  const maxDate = new Date(startDate);
  maxDate.setDate(startDate.getDate() + 6);
  maxDate.setHours(23, 59, 59, 999);
  return time.getTime() > maxDate.getTime();
};

// 月报：禁用超出开始日期+30天的日期
const disabledMonthDate = (time) => {
  if (!tempStartDate.value) return false;
  const startDate = new Date(tempStartDate.value);
  const maxDate = new Date(startDate);
  maxDate.setDate(startDate.getDate() + 30);
  maxDate.setHours(23, 59, 59, 999);
  return time.getTime() > maxDate.getTime();
};

// 周报：日历变化时（选择了第一个日期）
const handleWeekCalendarChange = (val) => {
  if (val && val.length === 1) {
    tempStartDate.value = val[0];
  }
};

// 月报：日历变化时（选择了第一个日期）
const handleMonthCalendarChange = (val) => {
  if (val && val.length === 1) {
    tempStartDate.value = val[0];
  }
};

// 处理日期变化（日报、周报、月报）- 转换为字符串格式
function handleDateChange(val) {
  if (!val) {
    form.startDate = "";
    form.endDate = "";
    tempStartDate.value = null;
    formRef.value?.validateField('dateRange');
    return;
  }

  if (form.types === 1) {
    // 日报：单选日期
    form.startDate = val;
    form.endDate = val;
  } else if (form.types === 2) {
    // 周报：日期范围，最多7天
    if (val && val.length === 2) {
      const start = new Date(val[0]);
      const end = new Date(val[1]);
      
      // 检查日期范围是否超过7天
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (diffDays > 7) {
        ElMessage.warning("周报周期不能超过7天");
        dateRange.value = null;
        form.startDate = "";
        form.endDate = "";
        tempStartDate.value = null;
        formRef.value?.validateField('dateRange');
        return;
      }
      
      form.startDate = val[0];
      form.endDate = val[1];
      tempStartDate.value = null;
    } else {
      form.startDate = "";
      form.endDate = "";
    }
  } else if (form.types === 3) {
    // 月报：日期范围，最多31天
    if (val && val.length === 2) {
      const start = new Date(val[0]);
      const end = new Date(val[1]);
      
      // 检查日期范围是否超过31天
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (diffDays > 31) {
        ElMessage.warning("月报周期不能超过31天");
        dateRange.value = null;
        form.startDate = "";
        form.endDate = "";
        tempStartDate.value = null;
        formRef.value?.validateField('dateRange');
        return;
      }
      
      form.startDate = val[0];
      form.endDate = val[1];
      tempStartDate.value = null;
    } else {
      form.startDate = "";
      form.endDate = "";
    }
  }
  
  formRef.value?.validateField('dateRange');
}

onMounted(() => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  form.adminId = userInfo.userId || userInfo.id || 0;
  
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(user => user.status === 0 || user.status === '0');
  });
});

// 重置表单
function reset() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  Object.assign(form, {
    types: null,
    startDate: "",
    endDate: "",
    toUids: [],
    works: "",
    plans: "",
    remark: "",
    fileIds: null,
    sendTime: null,
    adminId: userInfo.userId || userInfo.id || 0,
    id: null
  });
  dateRange.value = null;
  fileList.value = [];
  tempStartDate.value = null;
  step.value = 1;
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
}

// 关闭弹窗
function handleClose() {
  dialogVisible.value = false;
  reset();
}

// 第一步：选择汇报类型
function selectType(type) {
  form.types = type;
  step.value = 2;
}

// 打开新增弹窗
function open() {
  reset();
  dialogVisible.value = true;
}

// 打开编辑弹窗
function openEdit(data) {
  console.log('openEdit 调用', data);

  form.id = data.id;
  form.types = data.types;
  form.startDate = data.startDate || "";
  form.endDate = data.endDate || "";
  form.toUids = data.toUids ? data.toUids.split(',') : [];
  form.works = data.works || "";
  form.plans = data.plans || "";
  form.remark = data.remark || "";
  form.fileIds = data.fileIds;
  form.sendTime = data.sendTime;  // 关键：保存发送时间，用于判断状态
  form.adminId = data.adminId;
  
  fileList.value = [];
  isEdit.value = true;
  isView.value = false;
  step.value = 2;
  dialogVisible.value = true;

  nextTick(() => {
    if (form.types === 1) {
      dateRange.value = form.startDate;
    } else {
      dateRange.value = [form.startDate, form.endDate];
    }
    console.log('日期赋值成功：', dateRange.value);
  });
}

// 打开查看弹窗
function openView(data) {
  openEdit(data);
  isView.value = true;
}

function getNowTimeStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const buildSubmitData = (isSend = false) => {
  const toUidsStr = form.toUids.length > 0 ? form.toUids.join(',') : null;
  const fileIdsStr = fileList.value.length > 0 ? fileList.value.map(f => f.id).join(',') : null;

  return {
    types: parseInt(form.types) || 1,
    startDate: form.startDate || "",
    endDate: form.endDate || "",
    toUids: toUidsStr,
    works: form.works || "",
    plans: form.plans || "",
    remark: form.remark || null,
    fileIds: fileIdsStr,
    sendTime: isSend ? getNowTimeStr() : null,
    adminId: parseInt(form.adminId) || 0,
    isSend: isSend
  };
};

// 仅保存（isSend = false）- 用于未发送状态
async function handleOnlySave() {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  const submitData = buildSubmitData(false);
  if (isEdit.value && form.id) {
    submitData.id = form.id;
  }

  try {
    if (isEdit.value) {
      await updateenterPrise(submitData);
    } else {
      await addenterPrise(submitData);
    }
    ElMessage.success("保存成功");
    dialogVisible.value = false;
    emit("success");
  } catch (err) {
    console.error('保存失败:', err);
    ElMessage.error(err.msg || "保存失败");
  }
}

// 保存并发送（isSend = true）- 用于未发送状态
async function handleSubmit() {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  const submitData = buildSubmitData(true);
  if (isEdit.value && form.id) {
    submitData.id = form.id;
  }

  try {
    if (isEdit.value) {
      await updateenterPrise(submitData);
    } else {
      await addenterPrise(submitData);
    }
    ElMessage.success("提交成功");
    dialogVisible.value = false;
    emit("success");
  } catch (err) {
    console.error('提交失败:', err);
    ElMessage.error(err.msg || "提交失败");
  }
}

async function handleResend() {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  const submitData = buildSubmitData(true);
  if (isEdit.value && form.id) {
    submitData.id = form.id;
  }

  try {
    await updateenterPrise(submitData);
    ElMessage.success("保存成功");
    dialogVisible.value = false;
    emit("success");
  } catch (err) {
    console.error('保存失败:', err);
  }
}

defineExpose({ open, openEdit, openView });
</script>

<style scoped>
.type-select {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 40px 0;
}
.type-btn {
  width: 120px;
  height: 120px;
  font-size: 18px;
}
.dialog-footer {
  text-align: right !important;
}
</style>