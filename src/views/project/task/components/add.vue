<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
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
              <el-option label="其他" :value="1" />
              <el-option label="方案策划" :value="2" />
              <el-option label="撰写文档" :value="3" />
              <el-option label="需求调研" :value="4" />
              <el-option label="需求沟通" :value="5" />
              <el-option label="参加会议" :value="6" />
              <el-option label="拜访客户" :value="7" />
              <el-option label="接待客户" :value="8" />
              <el-option label="系统设计" :value="9" />
              <el-option label="系统开发" :value="10" />
              <el-option label="系统实施" :value="11" />
              <el-option label="测试验证" :value="12" />
              <el-option label="部署上线" :value="13" />
              <el-option label="系统维护" :value="14" />
              <el-option label="系统验收" :value="15" />
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
import { addenterPrise, updateenterPrise } from "@/api/project/task/index.js";
import { listUser, deptTreeSelect } from "@/api/system/user.js";
import { getPageList } from "@/api/project/itemList/index.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const userOptions = ref([]);
const projectList = ref([]);

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

// 加载项目列表
async function loadProjectList() {
  try {
    const res = await getPageList({ pageSize: 1000 });
    projectList.value = res.rows || [];
  } catch (err) {
    console.error("加载项目列表失败:", err);
    proxy.$modal.msgError("加载项目失败");
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
  planHours: [{ required: true, message: "请填写预估工时", trigger: "blur" }],
  endTime: [{ required: true, message: "请选择预计结束日期", trigger: "change" }],
  directorUid: [{ required: true, message: "请选择负责人", trigger: "change" }],
  assistAdminIds: [{ required: true, message: "请选择协作人", trigger: "change" }],
  projectId: [{ required: true, message: "请选择关联项目", trigger: "change" }],
  content: [{ required: true, message: "请输入详细描述", trigger: "blur" }],
};

// 初始化加载
onMounted(() => {
  loadUserList();
  loadProjectList();
});

function formatDateTime(dateStr) {
  if (!dateStr) return "";
  return dateStr + " 00:00:00";
}

// 提交
function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return;

    const endTime = form.endTime ? new Date(form.endTime).getTime() : 0;

    const data = {
      id: form.id || undefined,
      title: form.title || '',
      priority: Number(form.priority) || 0,
      workId: Number(form.workId) || 0,
      planHours: form.planHours || '',
      endTime: formatDateTime(form.endTime),
      directorUid: Number(form.directorUid) || 0,
      assistAdminIds: (form.assistAdminIds || []).join(','),
      projectId: form.projectId || '',
      content: form.content || ''
    };

    const api = isEdit.value ? updateenterPrise : addenterPrise;
    api(data).then(() => {
      proxy.$modal.msgSuccess("操作成功");
      handleClose();
    }).catch(err => {
      console.error("提交失败", err);
      proxy.$modal.msgError("提交失败：参数格式不正确");
    });
  });
}

// 重置表单（彻底清除校验状态）
function resetForm() {
  // 重置表单数据
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
  // 清除校验状态
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
/* 强制标签不换行 */
.car-dialog .el-form-item__label {
  white-space: nowrap !important;
  overflow: visible !important;
}
</style>