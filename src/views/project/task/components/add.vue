<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="70%"
    append-to-body
    class="car-dialog"
    @close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="isView ? {} : rules" 
      label-width="110px"
      style="margin-top: 15px"
      :key="dialogVisible"
    >
      <!-- 第一行：任务主题 + 预计结束日期 -->
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="任务主题" prop="title" required label-suffix="：">
            <el-input 
              v-model="form.title" 
              placeholder="请输入任务主题" 
              :disabled="isView" 
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预计结束日期" prop="endTime" required label-suffix="：">
            <el-date-picker
              v-model="form.endTime"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="请选择时间"
              :disabled="isView"
              style="width:100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：工作类型 + 预估工时 + 任务优先级 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="工作类型" prop="workId" required label-suffix="：">
            <el-select
              v-model="form.workId"
              :disabled="isView"
              placeholder="请选择"
              filterable
              clearable
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
        <el-col :span="8">
          <el-form-item label="预估工时" prop="planHours" required label-suffix="：">
            <el-input 
              v-model="form.planHours" 
              placeholder="请填写预估工时" 
              :disabled="isView" 
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务优先级" prop="priority" required label-suffix="：">
            <el-select
              v-model="form.priority"
              :disabled="isView"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option label="低" :value="1" />
              <el-option label="中" :value="2" />
              <el-option label="高" :value="3" />
              <el-option label="紧急" :value="4" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：负责人 + 协作人 + 关联项目 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="负责人" prop="directorUid" required label-suffix="：">
            <el-select
              v-model="form.directorUid"
              :disabled="isView"
              placeholder="请选择"
              filterable
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="协作人" prop="assistAdminIds" required label-suffix="：">
            <el-select
              v-model="form.assistAdminIds"
              multiple
              :disabled="isView"
              placeholder="请选择"
              filterable
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关联项目" prop="projectId" required label-suffix="：">
            <el-select
              v-model="form.projectId"
              :disabled="isView"
              placeholder="请选择项目"
              filterable
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行：详细描述 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="详细描述" prop="content" required label-suffix="：">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="4"
              placeholder="请输入详细描述"
              :disabled="isView"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 工作记录 -->
    <div v-if="isView" style="margin-top: 20px; border-top: 1px solid #ebeef5; padding-top: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div style="font-weight: bold;">工作日志</div>
        <el-button type="success" size="small" @click="openAddWorkLog">+ 添加工作日志</el-button>
      </div>

      <el-table :data="workLogList" border size="small" style="width: 100%;">
        <el-table-column label="ID号" prop="id" align="center" width="70" />
        <el-table-column label="工作内容" prop="workContent" align="center" />
        <el-table-column label="所属人员" prop="executorName" align="center" />
        <el-table-column label="工作时间范围" prop="workTimeRange" align="center" />
        <el-table-column label="工作类型" prop="workType" align="center" />
        <el-table-column label="工时" prop="workHour" align="center" width="70" />
        <el-table-column label="创建时间" prop="createTime" align="center" />
        <el-table-column label="操作" align="center" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small">详细</el-button>
            <el-button type="success" size="small" style="margin-left: 5px;">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        small
        background
        layout="prev, pager, next"
        :total="workLogTotal"
        style="margin-top: 10px; text-align: right;"
      />
    </div>

    <!-- 添加工作日志 弹窗 -->
    <el-dialog
      title="添加工作日志"
      v-model="addLogVisible"
      width="550px"
      append-to-body
    >
      <el-form ref="logFormRef" :model="logForm" :rules="logRules" label-width="80px">
        <el-form-item label="时间范围" prop="startTime">
          <el-space wrap>
            <el-date-picker
              v-model="logForm.startDate"
              type="date"
              placeholder="开始日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
            <el-time-picker
              v-model="logForm.startTime"
              placeholder="开始时间"
              format="HH:mm"
              value-format="HH:mm"
            />
            <span>至</span>
            <el-date-picker
              v-model="logForm.endDate"
              type="date"
              placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
            <el-time-picker
              v-model="logForm.endTime"
              placeholder="结束时间"
              format="HH:mm"
              value-format="HH:mm"
            />
          </el-space>
        </el-form-item>

        <el-form-item label="工作类别" prop="workType">
          <el-select v-model="logForm.workType" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in workCateList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="工时" prop="workHour">
          <el-input v-model.number="logForm.workHour" placeholder="请输入工时" />
        </el-form-item>

        <el-form-item label="工作内容" prop="workContent">
          <el-input v-model="logForm.workContent" type="textarea" rows="3" placeholder="请输入工作内容" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addLogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitWorkLog">确认提交</el-button>
      </template>
    </el-dialog>

    <template #footer>
      <div style="text-align: center">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">立即提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, nextTick } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import { addenterPrise, updateenterPrise, getWorkCateList} from "@/api/project/task/index.js";
import { listUser } from "@/api/system/user.js";
import { getPageList } from "@/api/project/itemList/index.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const userOptions = ref([]);
const projectList = ref([]);
const workCateList = ref([]); // 工作类型接口数据

// 工作记录列表
const workLogList = ref([]);
const workLogTotal = ref(0);

// 添加日志弹窗
const addLogVisible = ref(false);
const logFormRef = ref(null);
const logForm = reactive({
  taskId: null,
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  workType: "",
  workHour: "",
  workContent: ""
});

// 表单数据
const form = reactive({
  id: undefined,
  title: "",
  priority: "", 
  workId: "",
  planHours: "",
  endTime: "",
  directorUid: null,
  assistAdminIds: [],
  projectId: "",
  content: ""
});

// 日志校验
const logRules = {
  startTime: [{ required: true, message: "请选择时间范围", trigger: "change" }],
  workType: [{ required: true, message: "请选择工作类别", trigger: "change" }],
  workHour: [{ required: true, message: "请输入工时", trigger: "blur" }],
  workContent: [{ required: true, message: "请输入工作内容", trigger: "blur" }]
};

// 加载工作类型接口
async function loadWorkCateList() {
  try {
    const res = await getWorkCateList({ pageSize: 1000 , pageNum: 1});
    workCateList.value = res.rows || [];
  } catch (err) {
    console.error("加载工作类型失败:", err);
  }
}

// 加载项目列表
async function loadProjectList() {
  try {
    const res = await getPageList({ pageSize: 1000 });
    projectList.value = res.rows || [];
  } catch (err) {
    console.error("加载项目列表失败:", err);
  }
}

// 加载用户列表
async function loadUserList() {
  try {
    const res = await listUser({ pageSize: 1000 });
    userOptions.value = (res.rows || []).filter(u => u.status === "0");
  } catch (err) {
    console.error("加载用户列表失败:", err);
  }
}

const dialogTitle = computed(() => {
  if (isView.value) return "查看任务";
  return isEdit.value ? "编辑任务" : "新建任务";
});

const rules = {
  title: [{ required: true, message: "请输入任务主题", trigger: "blur" }],
  priority: [{ required: true, message: "请选择任务优先级", trigger: "change" }],
  workId: [{ required: true, message: "请选择工作类型", trigger: "change" }],
  planHours: [
    { required: true, message: "请填写预估工时", trigger: "blur" },
    { 
      validator: (rule, value, callback) => {
        if (value === '' || value === null || value === undefined) {
          callback();
          return;
        }
        const num = Number(value);
        if (isNaN(num)) {
          callback(new Error('请输入数字'));
        } else if (num <= 0) {
          callback(new Error('预估工时必须大于0'));
        } else if (!Number.isInteger(num) && !/^\d+(\.\d{1,2})?$/.test(value)) {
          callback(new Error('最多保留两位小数'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  endTime: [{ required: true, message: "请选择预计结束日期", trigger: "change" }],
  directorUid: [{ required: true, message: "请选择负责人", trigger: "change" }],
  assistAdminIds: [{ required: true, message: "请选择协作人", trigger: "change" }],
  projectId: [{ required: true, message: "请选择关联项目", trigger: "change" }],
  content: [{ required: true, message: "请输入详细描述", trigger: "blur" }],
};

// 打开添加工作日志
function openAddWorkLog() {
  logForm.taskId = form.id;
  addLogVisible.value = true;
}

// 提交工作日志
function submitWorkLog() {
  logFormRef.value.validate(valid => {
    if (!valid) return;
    ElMessage.success("添加成功");
    addLogVisible.value = false;
  });
}

// 初始化加载
onMounted(() => {
  loadUserList();
  loadProjectList();
  loadWorkCateList(); // 加载工作类型
});

// 提交
function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return;

    let endTime = null;
    if (form.endTime) {
      if (typeof form.endTime === 'string') {
        const date = new Date(form.endTime.replace(/-/g, '/'));
        endTime = Math.floor(date.getTime() / 1000);
      }
    }

    const data = {
      id: form.id || undefined,
      title: form.title || '',
      priority: Number(form.priority) || 0,
      workId: Number(form.workId) || 0,
      planHours: form.planHours || '',
      endTime: endTime,
      directorUid: Number(form.directorUid) || 0,
      assistAdminIds: (form.assistAdminIds || []).join(','),
      projectId: form.projectId || '',
      content: form.content || ''
    };

    const api = isEdit.value ? updateenterPrise : addenterPrise;
    api(data).then(() => {
      proxy.$modal.msgSuccess("操作成功");
      handleClose();
      emit("success");
    }).catch(err => {
      console.error("提交失败", err);
    });
  });
}

// 重置表单
function resetForm() {
  Object.assign(form, {
    id: undefined,
    title: "",
    priority: "",
    workId: "",
    planHours: "",
    endTime: "",
    directorUid: null,
    assistAdminIds: [],
    projectId: "",
    content: ""
  });
  workLogList.value = [];
  workLogTotal.value = 0;
  nextTick(() => {
    formRef.value?.clearValidate();
  });
  isEdit.value = false;
  isView.value = false;
}

// 关闭弹窗
function handleClose() {
  resetForm();
  dialogVisible.value = false;
}

// 打开新增弹窗
function open() {
  resetForm();
  loadProjectList();
  dialogVisible.value = true;
}

// 打开编辑弹窗
function openEdit(data) {
  resetForm();
  loadProjectList();
  Object.assign(form, {
    ...data,
    priority: data.priority || "",
    workId: data.workId || "",
    planHours: data.planHours || "",
    endTime: data.endTime || "",
    directorUid: data.directorUid || null,
    assistAdminIds: data.assistAdminIds ? data.assistAdminIds.split(',').map(Number) : [],
    projectId: data.projectId || "",
    content: data.content || ""
  });
  isEdit.value = true;
  dialogVisible.value = true;
}

// 打开查看弹窗
function openView(data) {
  resetForm();
  loadProjectList();
  Object.assign(form, {
    ...data,
    priority: data.priority || "",
    workId: data.workId || "",
    planHours: data.planHours || "",
    endTime: data.endTime || "",
    directorUid: data.directorUid || null,
    assistAdminIds: data.assistAdminIds ? data.assistAdminIds.split(',').map(Number) : [],
    projectId: data.projectId || "",
    content: data.content || ""
  });
  isView.value = true;
  dialogVisible.value = true;
}

const emit = defineEmits(["success"]);
defineExpose({ open, openEdit, openView });
</script>

<style>
.car-dialog.el-dialog {
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}
.car-dialog .el-dialog__body {
  overflow-y: auto;
}
.car-dialog .el-form-item__label {
  white-space: nowrap !important;
  overflow: visible !important;
}
</style>