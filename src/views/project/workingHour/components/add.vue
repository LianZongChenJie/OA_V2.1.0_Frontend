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
      <!-- 时间范围 -->
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

      <!-- 工作类别 → 从接口获取 -->
      <el-form-item label="工作类别" prop="cid" required>
        <el-select 
          v-model="form.cid" 
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

      <!-- 工作类型 -->
      <el-form-item label="工作类型" prop="laborType" required>
        <el-radio-group v-model="form.laborType" :disabled="isView">
          <el-radio :label="1">案头工作</el-radio>
          <el-radio :label="2">外勤工作</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 工作内容 -->
      <el-form-item label="工作内容" prop="title" required>
        <el-input 
          v-model="form.title" 
          type="textarea"
          :rows="3"
          placeholder="请输入工作内容" 
          :disabled="isView" 
        />
      </el-form-item>

      <!-- 补充描述 -->
      <el-form-item label="补充描述" prop="remark">
        <el-input 
          v-model="form.remark" 
          type="textarea" 
          rows="4" 
          placeholder="请输入补充描述" 
          :disabled="isView" 
        />
      </el-form-item>
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
import { updateenterPrise as updateWorkHour, addenterPrise as addWorkHour } from "@/api/project/workingHour/index.js";
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
  laborType: 1,   
  cid: null,         
  title: "",       
  remark: "",    
  tid: null,         
  ptid: 0,           
  cmid: 0,          
  did: null,          
  adminId: 0          
});

// ========== 计算属性 ==========
const dialogTitle = computed(() => {
  if (isView.value) return "查看工时记录";
  return isEdit.value ? "编辑工时记录" : "添加工时记录";
});

// ========== 表单校验 ==========
const rules = {
  timeRange: [{ required: true, message: "请选择时间范围", trigger: "change" }],
  laborType: [{ required: true, message: "请选择工作类型", trigger: "change" }],
  cid: [{ required: true, message: "请选择工作类别", trigger: "change" }],
  title: [{ required: true, message: "请输入工作内容", trigger: "blur" }]
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


const formatTimestampToDateTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// ========== 提交 ==========
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    const [startTimeStr, endTimeStr] = form.timeRange || [];
    const startTime = toSeconds(startTimeStr);
    const endTime = toSeconds(endTimeStr);
    
    if (!startTime || !endTime) {
      ElMessage.error("请正确选择时间范围");
      return;
    }
    
    if (endTime <= startTime) {
      ElMessage.error("结束时间必须大于开始时间");
      return;
    }
    
    const laborTime = ((endTime - startTime) / 3600).toFixed(2);

    // 提交给后端的字段（使用下划线命名）
    const data = {
      start_time: startTime,
      end_time: endTime,
      labor_time: laborTime,
      labor_type: form.laborType,
      cid: form.cid,
      title: form.title,
      remark: form.remark,
      tid: form.tid,
      ptid: form.ptid || 0,
      cmid: form.cmid || 0,
      admin_id: 0
    };
    
    if (form.id) {
      data.id = form.id;
    }
    
    if (!form.id && form.did) {
      data.did = form.did;
    }


    const api = form.id ? updateWorkHour : addWorkHour;
    await api(data);
    
    ElMessage.success(form.id ? "编辑成功" : "添加成功");
    handleClose();
    emit("success");
  } catch (err) {
    console.error("提交失败:", err);
    ElMessage.error(err.msg || err.message || "操作失败");
  }
};

// ========== 重置 / 关闭 ==========
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    timeRange: [],
    laborType: 1,
    cid: null,
    title: "",
    remark: "",
    tid: null,
    ptid: 0,
    cmid: 0,
    did: null,
    adminId: 0
  });
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
};

const handleClose = () => {
  resetForm();
  dialogVisible.value = false;
};

// ========== 打开新增 ==========
const open = (taskId, projectId, deptId) => {
  resetForm();
  loadWorkCate();
  form.tid = taskId;
  form.ptid = projectId || 0;
  form.did = deptId || null;
  dialogVisible.value = true;
};

// ========== 打开编辑 ==========
const openEdit = (row) => {
  console.log("编辑接收到的数据:", row);
  
  resetForm();
  loadWorkCate();

  const data = row;
  
  if (!data.id) {
    console.error("数据中没有 id 字段:", data);
    ElMessage.error("数据格式错误，无法编辑");
    return;
  }


  form.id = data.id;
  form.laborType = data.labor_type || 1;
  form.cid = data.cid;
  form.title = data.title || "";
  form.remark = data.remark || "";
  form.tid = data.tid;
  form.ptid = data.ptid || 0;
  form.cmid = data.cmid || 0;

  

  const startTime = data.start_time;
  const endTime = data.end_time;
  
  console.log("原始时间戳:", { startTime, endTime });
  
  if (startTime && endTime && startTime !== 0 && endTime !== 0) {
    const startStr = formatTimestampToDateTime(startTime);
    const endStr = formatTimestampToDateTime(endTime);
    form.timeRange = [startStr, endStr];
    console.log("时间范围设置:", form.timeRange);
  } else {
    console.warn("时间戳不存在或为0，无法设置时间范围");
    form.timeRange = [];
  }

  isEdit.value = true;
  dialogVisible.value = true;
};

// ========== 打开查看 ==========
const openView = (row) => {
  console.log("查看接收到的数据:", row);
  openEdit(row);
  isView.value = true;
};

defineExpose({ open, openEdit, openView });
</script>