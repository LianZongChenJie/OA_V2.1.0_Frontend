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
    <!-- 标题右侧 + 状态按钮 -->
  <template #header>
    <div style="display: flex; align-items: center; gap:10px;">
      <span>{{ dialogTitle }}</span>
        <!-- 新增：状态切换按钮 -->
        <el-button
          type="primary"
          size="small" 
          v-if="isView"
          @click="handleChangeStatus"
          :disabled="form.status === 3"
        >
          {{ statusButtonText }}
        </el-button>
      </div>
    </template>

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
          <el-form-item label="工作类别" prop="workId" required label-suffix="：">
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
        <el-table-column label="ID" prop="id" align="center" width="70" />
        <el-table-column label="工作内容" prop="title" align="center" />
        <el-table-column label="工作时间范围" prop="workTimeRange" align="center" />
        <el-table-column label="工作类别" prop="workTitle" align="center" />
        <el-table-column label="工作类型" prop="laborTypeName" align="center" />
        <el-table-column label="工时" prop="workHour" align="center" width="70" />
        <el-table-column label="补充描述" prop="remark" align="center" />
        <el-table-column label="创建时间" prop="createTimeStr" align="center" />
        <el-table-column label="操作" align="center" width="120">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="openEditWorkLog(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        small
        background
        layout="prev, pager, next"
        :total="workLogTotal"
        :current-page="workLogPageNum"
        @current-change="handleWorkLogPageChange"
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
      <el-form ref="logFormRef" :model="logForm" :rules="logRules" label-width="100px" label-suffix="：">
        <el-form-item label="时间范围" prop="timeRange" required>
          <el-date-picker
            v-model="logForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disabledDate"
            style="width:100%"
          />
        </el-form-item>

        <el-form-item label="工作类别" prop="cid" required>
          <el-select v-model="logForm.cid" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in workCateList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="工作类型" prop="laborType" required>
          <el-radio-group v-model="logForm.laborType">
            <el-radio :label="1">案头工作</el-radio>
            <el-radio :label="2">外勤工作</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="工作内容" prop="title" required>
          <el-input v-model="logForm.title" type="textarea" rows="3" placeholder="请输入工作内容" />
        </el-form-item>

        <el-form-item label="补充描述" prop="remark">
          <el-input 
            v-model="logForm.remark" 
            type="textarea" 
            rows="4" 
            placeholder="请输入补充描述" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addLogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitWorkLog">提交</el-button>
      </template>
    </el-dialog>

    <!-- 底部按钮 -->
    <template #footer>
      <div style="text-align:center">
        <el-button type="primary" @click="handleSubmit" v-if="!isView">提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, nextTick } from "vue";
import { ElMessage } from "element-plus";
// 新增：引入状态切换接口
import { addenterPrise, updateenterPrise, getWorkCateList, updateStatus } from "@/api/project/task/index.js";
import { listUser } from "@/api/system/user.js";
import { getPageList } from "@/api/project/itemList/index.js";
import { getPageList as getTaskHourList, addenterPrise as addWorkHour, updateenterPrise as updateWorkHour } from "@/api/project/workingHour/index.js";

const { proxy } = getCurrentInstance(); 

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const userOptions = ref([]);
const projectList = ref([]);
const workCateList = ref([]);

// 工作记录列表
const workLogList = ref([]);
const workLogTotal = ref(0);
const workLogPageNum = ref(1);

// 添加日志弹窗
const addLogVisible = ref(false);
const logFormRef = ref(null);
const logForm = reactive({
  id: null,
  tid: null,
  title: "",
  timeRange: null,
  startTime: null,
  endTime: null,
  cid: null,
  laborType: 1,
  remark: "",
  cmid: 0,
  ptid: 0,
  did: null,
  adminId: 0,
  taskEndTime: null  // 任务的预计结束时间
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
  content: "",
  did: null,
  status: 1 // 新增：状态字段 1-待办 2-进行中 3-已完成
});

// 日志校验规则
const logRules = {
  timeRange: [{ required: true, message: "请选择时间范围", trigger: "change" }],
  cid: [{ required: true, message: "请选择工作类别", trigger: "change" }],
  laborType: [{ required: true, message: "请选择工作类型", trigger: "change" }],
  title: [{ required: true, message: "请输入工作内容", trigger: "blur" }]
};

// 禁用超过任务预计结束时间的日期
const disabledDate = (time) => {
  if (!logForm.taskEndTime) return false;
  const taskEndDate = new Date(logForm.taskEndTime);
  // 禁用大于任务预计结束日期的日期
  return time.getTime() > taskEndDate.getTime();
};

// 加载工作类型接口
async function loadWorkCateList() {
  try {
    const res = await getWorkCateList({ pageSize: 1000 , pageNum: 1});
    workCateList.value = (res.rows || []).filter(item => item.status === 0);
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

// 新增：状态按钮文字
const statusButtonText = computed(() => {
  if (form.status === 1) return "开始";
  if (form.status === 2) return "已完成";
  if (form.status === 3) return "已完成";
  return "";
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

// 将时间戳转换为日期字符串（YYYY-MM-DD）
function formatTimestampToDate(timestamp) {
  if (!timestamp || timestamp === 0) return "";
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 格式化时间戳为日期时间字符串
function formatTimestamp(timestamp) {
  if (!timestamp || timestamp === 0) return null;
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 将日期时间字符串转换为时间戳（秒）
function dateTimeToTimestamp(dateTimeStr) {
  if (!dateTimeStr) return 0;
  const date = new Date(dateTimeStr.replace(/-/g, '/'));
  return Math.floor(date.getTime() / 1000);
}

// 计算工时（小时）
function calculateWorkHour(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  const diffSeconds = endTime - startTime;
  return Number((diffSeconds / 3600).toFixed(2));
}

// 打开添加工作日志
function openAddWorkLog() {
  if (!form.id) {
    ElMessage.warning("请先保存任务后再添加工作日志");
    return;
  }
  
  if (!form.endTime) {
    ElMessage.warning("请先设置任务的预计结束时间");
    return;
  }
  
  logForm.id = null;
  logForm.tid = form.id;
  logForm.title = "";
  logForm.timeRange = null;
  logForm.startTime = null;
  logForm.endTime = null;
  logForm.cid = null;
  logForm.laborType = 1;
  logForm.remark = "";
  logForm.cmid = 0;
  logForm.ptid = form.projectId || 0;
  logForm.did = form.did || null;
  logForm.adminId = 0;
  logForm.taskEndTime = form.endTime;
  
  nextTick(() => {
    logFormRef.value?.clearValidate();
  });
  addLogVisible.value = true;
}

// 编辑工作日志
async function openEditWorkLog(row) {
  try {
    logForm.id = row.id;
    logForm.tid = form.id;
    logForm.title = row.title || "";
    logForm.cid = row.cid || null;
    logForm.laborType = row.laborType || 1;
    logForm.remark = row.remark || "";
    logForm.cmid = row.cmid || 0;
    logForm.ptid = row.ptid || form.projectId || 0;
    logForm.did = row.did || null;
    logForm.adminId = row.adminId || 0;
    logForm.taskEndTime = form.endTime;
    
    const startTimeStr = row.startTime ? formatTimestamp(row.startTime) : null;
    const endTimeStr = row.endTime ? formatTimestamp(row.endTime) : null;
    if (startTimeStr && endTimeStr) {
      logForm.timeRange = [startTimeStr, endTimeStr];
    } else {
      logForm.timeRange = null;
    }
    
    nextTick(() => logFormRef.value?.clearValidate());
    addLogVisible.value = true;
  } catch (e) {
    console.error("加载数据失败:", e);
    ElMessage.error("加载数据失败");
  }
}

// 提交工作日志
async function submitWorkLog() {
  const valid = await logFormRef.value.validate();
  if (!valid) return;

  if (!logForm.tid) {
    ElMessage.error("任务ID不存在，请重新打开弹窗");
    return;
  }

  const timeRange = logForm.timeRange;
  if (!timeRange || !timeRange[0] || !timeRange[1]) {
    ElMessage.error("请选择时间范围");
    return;
  }

  const startTime = dateTimeToTimestamp(timeRange[0]);
  const endTime = dateTimeToTimestamp(timeRange[1]);
  
  if (endTime <= startTime) {
    ElMessage.error("结束时间必须大于开始时间");
    return;
  }
  
  // 验证工作日志的时间不能超过任务的预计结束时间
  if (logForm.taskEndTime) {
    const taskEndDate = new Date(logForm.taskEndTime.replace(/-/g, '/'));
    const taskEndTimestamp = Math.floor(taskEndDate.getTime() / 1000);
    
    if (startTime > taskEndTimestamp) {
      ElMessage.error(`工作开始时间不能超过任务预计结束时间（${logForm.taskEndTime}）`);
      return;
    }
    
    if (endTime > taskEndTimestamp) {
      ElMessage.error(`工作结束时间不能超过任务预计结束时间（${logForm.taskEndTime}）`);
      return;
    }
  }

  const params = {
    tid: logForm.tid,
    title: logForm.title,
    startTime: startTime,
    endTime: endTime,
    cid: logForm.cid,
    laborType: logForm.laborType,
    remark: logForm.remark || "",
    cmid: logForm.cmid || 0,
    ptid: logForm.ptid || 0,
    adminId: 0
  };


  if (logForm.id) {
    params.id = logForm.id;
  } 

  else if (logForm.did) {
    params.did = logForm.did;
  }

  try {
    if (logForm.id) {
      await updateWorkHour(params);
      ElMessage.success("编辑成功");
    } else {
      await addWorkHour(params);
      ElMessage.success("添加成功");
    }
    addLogVisible.value = false;
    loadWorkLogList();
  } catch (err) {
    console.error(err);
    ElMessage.error(err.msg || "操作失败");
  }
}

// 加载工作日志列表
async function loadWorkLogList(pageNum = 1) {
  if (!form.id) return;
  try {
    const res = await getTaskHourList({
      tid: form.id,  
      pageNum: pageNum,
      pageSize: 20
    });
    workLogList.value = (res.rows || []).map(item => {
      const workCate = workCateList.value.find(cate => cate.id === item.cid);
      return {
        ...item,
        workTimeRange: item.startTime && item.endTime ? 
          `${formatTimestamp(item.startTime)} 至 ${formatTimestamp(item.endTime)}` : '',
        createTimeStr: item.createTime ? formatTimestamp(item.createTime) : '',
        workHour: item.startTime && item.endTime ? 
          calculateWorkHour(item.startTime, item.endTime) : 0,
        laborTypeName: item.laborType === 1 ? '案头工作' : item.laborType === 2 ? '外勤工作' : '-',
        workTitle: workCate ? workCate.title : ''
      };
    });
    workLogTotal.value = res.total || 0;
    workLogPageNum.value = pageNum;
  } catch (err) {
    console.error("加载任务工时列表失败:", err);
  }
}

// 分页切换
function handleWorkLogPageChange(page) {
  loadWorkLogList(page);
}

async function handleChangeStatus() {
  // 已完成直接return，不执行
  if (form.status === 3) return;

  if (!form.id) {
    ElMessage.warning("任务ID不存在");
    return;
  }

  let nextStatus;
  if (form.status === 1) nextStatus = 2;
  else if (form.status === 2) nextStatus = 3;
  else return;

  try {
    await updateStatus(Number(form.id), { status: nextStatus });
    ElMessage.success("状态更新成功");
    form.status = nextStatus;
    emit("success");
  } catch (err) {
    console.error(err);
    ElMessage.error(err.msg || "状态更新失败");
  }
}

// 初始化加载
onMounted(() => {
  loadUserList();
  loadProjectList();
  loadWorkCateList();
});

// 提交任务
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
      ElMessage.error(err.msg || "提交失败");
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
    content: "",
    did: null,
    status: 1 // 重置状态
  });
  workLogList.value = [];
  workLogTotal.value = 0;
  workLogPageNum.value = 1;
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
  
  let formattedEndTime = data.endTime;
  if (data.endTime && typeof data.endTime === 'number') {
    formattedEndTime = formatTimestampToDate(data.endTime);
  }
  
  Object.assign(form, {
    ...data,
    priority: data.priority || "",
    workId: data.workId || "",
    planHours: data.planHours || "",
    endTime: formattedEndTime,
    directorUid: data.directorUid || null,
    assistAdminIds: data.assistAdminIds ? data.assistAdminIds.split(',').map(Number) : [],
    projectId: data.projectId || "",
    content: data.content || "",
    did: data.did || null,
    status: data.status || 1 // 赋值状态
  });
  isEdit.value = true;
  dialogVisible.value = true;
}

// 打开查看弹窗
function openView(data) {
  resetForm();
  loadProjectList();
  
  let formattedEndTime = data.endTime;
  if (data.endTime && typeof data.endTime === 'number') {
    formattedEndTime = formatTimestampToDate(data.endTime);
  }
  
  Object.assign(form, {
    ...data,
    priority: data.priority || "",
    workId: data.workId || "",
    planHours: data.planHours || "",
    endTime: formattedEndTime,
    directorUid: data.directorUid || null,
    assistAdminIds: data.assistAdminIds ? data.assistAdminIds.split(',').map(Number) : [],
    projectId: data.projectId || "",
    content: data.content || "",
    did: data.did || null,
    status: data.status || 1 // 赋值状态
  });
  isView.value = true;
  dialogVisible.value = true;
  nextTick(() => {
    loadWorkLogList();
  });
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