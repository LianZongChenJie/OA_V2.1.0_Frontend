<template>
  <el-dialog
    :title="isDetailMode ? '日程详情' : '添加日程安排'"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    @close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isDetailMode ? {} : rules"
      label-width="100px"
      style="margin-top: 15px"
    >
      <!-- 第一行：日程时间 + 工作类别 -->
      <el-row :gutter="0">
        <el-col :span="14">
          <el-form-item label="日程时间" prop="dateRange" required class="nowrap-label">
            <el-date-picker
              v-model="form.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
              :disabled="isDetailMode"
              :shortcuts="dateShortcuts"
              @change="handleDateRangeChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="工作类别" prop="cid" required>
            <el-select
              v-model="form.cid"
              placeholder="请选择"
              style="width: 100%"
              :disabled="isDetailMode"
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

      <!-- 第二行：工作类型（单选样式） -->
      <el-form-item label="工作类型" prop="laborType" required>
        <el-radio-group v-model="form.laborType" :disabled="isDetailMode">
          <el-radio :label="1">案头工作</el-radio>
          <el-radio :label="2">外勤工作</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 第三行：工作内容 -->
      <el-form-item label="工作内容" prop="title" required>
        <el-input
          v-model="form.title"
          placeholder="请输入工作内容"
          :disabled="isDetailMode"
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
          :disabled="isDetailMode"
          style="width: 100%"
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
        <el-button
          v-if="!isDetailMode"
          type="primary"
          @click="handleSubmit"
          style="width: 80px;"
        >
          确定提交
        </el-button>
        <el-button @click="dialogVisible = false">
          {{ isDetailMode ? '关 闭' : '取 消' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch, nextTick, onMounted } from "vue";
import { addDate, detail } from "@/api/personalOffice/workCalendar/index.js";
import { getWorkCateList } from "@/api/personalOffice/worklog/index.js";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const userStore = useUserStore();

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

const dialogVisible = ref(false);
const formRef = ref(null);
const isDetailMode = ref(false);

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

// 表单校验规则
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
function reset() {
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
    form.dateRange = [startTime, endTime];
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
      form.id = data.id;
      form.tid = data.tid;
      form.startTime = data.startTime;
      form.endTime = data.endTime;
      form.dateRange = [data.startTime, data.endTime];
      form.title = data.title;
      form.cid = data.cid;
      form.laborType = data.laborType || 1;
      form.remark = data.remark || "";
      form.cmid = data.cmid || 0;
      form.ptid = data.ptid || 0;
      form.did = data.did || null;
      form.adminId = data.adminId || 0;
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
    await addDate(params);
    proxy.$modal.msgSuccess("添加成功");
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

defineExpose({
  open,
  openDetail,
});
</script>

<style scoped>
.schedule-dialog :deep(.el-dialog) {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}
.schedule-dialog :deep(.el-dialog__body) {
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
