<template>
  <!-- 工时编辑弹窗 -->
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="work-hour-dialog"
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
      <el-row :gutter="20">
        <!-- 时间范围 -->
        <el-col :span="12">
          <el-form-item label="时间范围" prop="timeRange" required>
            <el-date-picker
              v-model="form.timeRange"
              type="datetimerange"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :disabled="isView"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>

        <!-- 工作类别 → 从接口获取 -->
        <el-col :span="12">
          <el-form-item label="工作类别" prop="workCategory" required>
            <el-select 
              v-model="form.workCategory" 
              :disabled="isView" 
              placeholder="请选择工作类别" 
              filterable 
              clearable
              style="width: 100%"
            >
              <el-option 
                v-for="item in workCateOptions" 
                :key="item.id" 
                :label="item.title" 
                :value="item.id" 
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 工作类型 -->
        <el-col :span="24">
          <el-form-item label="工作类型" prop="workType" required>
            <el-radio-group v-model="form.workType" :disabled="isView">
              <el-radio label="案头工作" />
              <el-radio label="外勤工作" />
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 工作内容 -->
        <el-col :span="24">
          <el-form-item label="工作内容" prop="workContent" required>
            <el-input 
              v-model="form.workContent" 
              placeholder="请输入工作内容" 
              :disabled="isView" 
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 补充描述 -->
        <el-col :span="24">
          <el-form-item label="补充描述" prop="remark">
            <el-input 
              v-model="form.remark" 
              type="textarea" 
              rows="4" 
              placeholder="请输入补充描述" 
              :disabled="isView" 
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div style="text-align:center">
        <el-button type="primary" @click="handleSubmit" v-if="!isView">确定提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { updateenterPrise } from "@/api/project/workingHour/index.js";
import { getWorkCateList } from "@/api/project/task/index.js";

const emit = defineEmits(["success"]);

// ========== 响应式数据 ==========
const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 工作类别下拉数据
const workCateOptions = ref([]);

const form = reactive({
  id: undefined,
  timeRange: [],
  workType: "案头工作",
  workCategory: null, // 存 ID
  workContent: "",
  remark: ""
});

// ========== 计算属性 ==========
const dialogTitle = computed(() => {
  if (isView.value) return "查看工时记录";
  return "编辑工时记录";
});

// ========== 表单校验 ==========
const rules = {
  timeRange: [{ required: true, message: "请选择时间范围", trigger: "change" }],
  workType: [{ required: true, message: "请选择工作类型", trigger: "change" }],
  workCategory: [{ required: true, message: "请选择工作类别", trigger: "change" }],
  workContent: [{ required: true, message: "请输入工作内容", trigger: "blur" }]
};

// ========== 加载工作类别 ==========
const loadWorkCate = async () => {
  try {
    const res = await getWorkCateList({ pageNum: 1, pageSize: 100 });
    workCateOptions.value = res.rows || [];
  } catch (err) {
    console.error("加载工作类别失败", err);
  }
};

// 页面挂载时加载
onMounted(() => {
  loadWorkCate();
});

// ========== 工具函数 ==========
const toSeconds = (dateStr) => {
  if (!dateStr) return null;
  if (typeof dateStr === "number") return dateStr > 1e10 ? Math.floor(dateStr / 1000) : dateStr;
  if (typeof dateStr === "string") {
    const d = new Date(dateStr.replace(/-/g, "/"));
    return isNaN(d.getTime()) ? null : Math.floor(d.getTime() / 1000);
  }
  return null;
};

const formatTime = (ts) => {
  if (!ts) return "";
  let date;
  if (typeof ts === "number") {
    const timeMs = ts.toString().length === 10 ? ts * 1000 : ts;
    date = new Date(timeMs);
  } else if (typeof ts === "string") {
    date = new Date(ts);
    if (isNaN(date.getTime())) date = new Date(ts.replace(/-/g, "/"));
  } else if (ts instanceof Date) {
    date = ts;
  } else {
    return "";
  }
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// ========== 提交 ==========
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;

    const [startTimeStr, endTimeStr] = form.timeRange || [];
    const startTime = toSeconds(startTimeStr);
    const endTime = toSeconds(endTimeStr);
    const workHour = startTime && endTime ? ((endTime - startTime) / 3600).toFixed(2) : 0;

    // 提交给后端的字段
    const data = {
      id: form.id,
      startTime,
      endTime,
      workHour,
      workType: form.workType,
      workCategory: form.workCategory, // 提交的是 ID
      workContent: form.workContent,
      remark: form.remark
    };

    updateWorkHour(data)
      .then(() => {
        ElMessage.success("操作成功");
        handleClose();
        emit("success");
      })
      .catch((e) => console.error("提交失败", e));
  });
};

// ========== 重置 / 关闭 ==========
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    timeRange: [],
    workType: "案头工作",
    workCategory: null,
    workContent: "",
    remark: ""
  });
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
};

const handleClose = () => {
  resetForm();
  dialogVisible.value = false;
};

// ========== 打开编辑 / 查看 ==========
const openEdit = (row) => {
  resetForm();
  loadWorkCate(); // 每次打开重新拉取最新类别

  Object.assign(form, {
    id: row.id,
    workType: row.workType || "案头工作",
    workCategory: row.workCategory, // 回填 ID
    workContent: row.workContent || "",
    remark: row.remark || ""
  });

  if (row.startTime && row.endTime) {
    form.timeRange = [formatTime(row.startTime), formatTime(row.endTime)];
  }

  isEdit.value = true;
  dialogVisible.value = true;
};

const openView = (row) => {
  openEdit(row);
  isView.value = true;
};

defineExpose({ openEdit, openView });
</script>

<style>
.work-hour-dialog.el-dialog {
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}
.work-hour-dialog .el-dialog__body {
  overflow-y: auto;
}
.work-hour-dialog .el-form-item__label {
  white-space: nowrap !important;
  overflow: visible !important;
}
</style>