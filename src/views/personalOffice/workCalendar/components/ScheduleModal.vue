<template>
  <el-dialog
    :title="isDetailMode ? '日程详情' : '添加日程安排'"
    v-model="dialogVisible"
    width="600px"
    append-to-body
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isDetailMode ? {} : rules"
      label-width="100px"
    >
      <!-- 日程时间 -->
      <el-form-item label="日程时间" prop="timeRange" :required="!isDetailMode">
        <el-date-picker
          v-model="form.timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
          :disabled-date="disabledDate"
          :disabled="isDetailMode"
        />
      </el-form-item>

      <!-- 安排主题 -->
      <el-form-item label="安排主题" prop="title" :required="!isDetailMode">
        <el-input
          v-model="form.title"
          placeholder="请输入安排主题"
          maxlength="100"
          show-word-limit
          :disabled="isDetailMode"
        />
      </el-form-item>

      <!-- 提醒类型 -->
      <el-form-item label="提醒类型" prop="remindType" :required="!isDetailMode">
        <el-select v-model="form.remindType" placeholder="请选择提醒类型" style="width: 100%" :disabled="isDetailMode">
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

      <!-- 优先级 -->
      <el-form-item label="优先级" prop="type" :required="!isDetailMode">
        <el-select v-model="form.type" placeholder="请选择优先级" style="width: 100%" :disabled="isDetailMode">
          <el-option label="低优先级" value="1" />
          <el-option label="中优先级" value="2" />
          <el-option label="高优先级" value="3" />
          <el-option label="紧急" value="4" />
        </el-select>
      </el-form-item>

      <!-- 具体描述 -->
      <el-form-item label="具体描述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入具体描述"
          maxlength="500"
          show-word-limit
          :disabled="isDetailMode"
        />
      </el-form-item>

      <!-- 隐藏字段：创建人 -->
      <el-form-item v-show="false" label="创建人" prop="adminId">
        <el-input v-model="form.adminId" />
      </el-form-item>

      <!-- 隐藏字段：创建部门 -->
      <el-form-item v-show="false" label="创建部门" prop="did">
        <el-input v-model="form.did" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isDetailMode" type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">{{ isDetailMode ? '关 闭' : '取 消' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch, nextTick } from "vue";
import { addDate, detail } from "@/api/personalOffice/workCalendar/index.js";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const userStore = useUserStore();

const dialogVisible = ref(false);
const formRef = ref(null);
const isDetailMode = ref(false);

// 表单数据
const form = reactive({
  startTime: "",
  endTime: "",
  timeRange: [],
  title: "",
  remindType: 0,
  type: "",
  remark: "",
  adminId: "",
  did: "",
});

// 表单校验规则
const rules = {
  timeRange: [{ required: true, message: "请选择日程时间", trigger: "change" }],
  title: [
    { required: true, message: "请输入安排主题", trigger: "blur" },
    { min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }
  ],
  remindType: [{ required: true, message: "请选择提醒类型", trigger: "change" }],
  type: [{ required: true, message: "请选择优先级", trigger: "change" }],
};

// 禁用今天之前的日期
const disabledDate = (time) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time.getTime() < today.getTime();
};

// 监听时间范围变化，同步到 startTime 和 endTime
watch(() => form.timeRange, (newVal) => {
  if (newVal && newVal.length === 2) {
    form.startTime = newVal[0];
    form.endTime = newVal[1];
  } else {
    form.startTime = "";
    form.endTime = "";
  }
}, { deep: true });

// 重置表单
function reset() {
  form.startTime = "";
  form.endTime = "";
  form.timeRange = [];
  form.title = "";
  form.remindType = 0;
  form.type = "";
  form.remark = "";
  // 从用户信息中获取创建人和创建部门（使用数字类型的id）
  form.adminId = userStore.id || "";
  form.did = userStore.deptId || "";
  isDetailMode.value = false;

  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

// 关闭弹窗
function handleClose() {
  reset();
}

// 打开弹窗
function open(date) {
  reset();
  dialogVisible.value = true;

  // 如果传入了日期，设置默认时间范围为该日期当天
  if (date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const startTime = `${year}-${month}-${day} 09:00:00`;
    const endTime = `${year}-${month}-${day} 18:00:00`;
    form.timeRange = [startTime, endTime];
    form.startTime = startTime;
    form.endTime = endTime;
  }

  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

// 打开详情弹窗
function openDetail(id) {
  reset();
  isDetailMode.value = true;
  detail(id).then((res) => {
    if (res.data) {
      const data = res.data;
      form.startTime = data.startTime;
      form.endTime = data.endTime;
      form.timeRange = [data.startTime, data.endTime];
      form.title = data.title;
      form.remindType = data.remindType;
      form.type = String(data.type);
      form.remark = data.remark || "";
      dialogVisible.value = true;
      nextTick(() => {
        formRef.value?.clearValidate();
      });
    }
  }).catch((error) => {
    console.error("获取日程详情失败", error);
    proxy.$modal.msgError("获取日程详情失败");
  });
}

// 提交表单
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = {
        startTime: form.startTime,
        endTime: form.endTime,
        title: form.title,
        remindType: form.remindType,
        type: form.type,
        remark: form.remark,
        adminId: String(form.adminId || ""),
        did: String(form.did || ""),
      };

      addDate(submitData).then(() => {
        proxy.$modal.msgSuccess("添加日程成功");
        dialogVisible.value = false;
        emit("success");
      }).catch((error) => {
        console.error("添加日程失败", error);
        proxy.$modal.msgError("添加日程失败");
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
  openDetail,
});
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
</style>
