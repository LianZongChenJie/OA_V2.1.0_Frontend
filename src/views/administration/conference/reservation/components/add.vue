<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="car-dialog"
    @close="handleClose"
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="isView ? {} : rules" 
      label-width="140px"
      style="margin-top: 15px"
    >
      <el-form-item label="会议主题" prop="title" required>
        <el-input 
          v-model="form.title" 
          placeholder="请输入会议主题" 
          :disabled="isView" 
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="会议室" prop="roomId" required>
        <el-select
          v-model="form.roomId"
          :disabled="isView"
          placeholder="请选择会议室"
          filterable
          clearable
          style="width:100%"
        >
          <el-option
            v-for="item in roomOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间" prop="startDate" required>
        <el-date-picker
          v-model="form.startDate"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择开始时间"
          :disabled="isView"
          style="width:100%"
        />
      </el-form-item>

      <el-form-item label="结束时间" prop="endDate" required>
        <el-date-picker
          v-model="form.endDate"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择结束时间"
          :disabled="isView"
          style="width:100%"
        />
      </el-form-item>    

      <el-form-item label="会议人数" prop="num" required>
        <el-input 
          v-model="form.num" 
          placeholder="请输入会议人数" 
          :disabled="isView" 
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="会议需求">
        <el-checkbox-group v-model="form.requirementList" :disabled="isView">
          <el-checkbox label="电子屏" />
          <el-checkbox label="投影背景" />
          <el-checkbox label="电脑" />
          <el-checkbox label="视频" />
          <el-checkbox label="购买水果" />
          <el-checkbox label="订餐" />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="其他要求">
        <el-input
          v-model="form.requirements"
          type="textarea"
          rows="3"
          placeholder="请输入其他要求"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

      <!-- 审批流程 -->
      <el-form-item label="审批流程" prop="flowId">
        <el-select
          v-model="form.flowId"
          :disabled="isView"
          placeholder="请选择审批流程"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in flowOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="审批人" prop="adminId">
        <el-select
          v-model="form.adminId"
          :disabled="isView"
          placeholder="请选择审批人"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="抄送人">
        <el-select
          v-model="form.ccUids"
          multiple
          :disabled="isView"
          placeholder="请选择抄送人"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>

    </el-form>

    <template #footer>
      <div style="text-align: center">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, nextTick } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/administration/conference/reservation/index.js";
import { listUser } from "@/api/system/user.js";
import { getPageList } from "@/api/administration/conference/room/index.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const userOptions = ref([]);
const roomOptions = ref([]);
const flowOptions = ref([]);

const form = reactive({
  id: undefined,
  title: "",
  roomId: null,
  startDate: "",
  endDate: "",
  flowId: null,
  adminId: null,
  num: "",
  requirements: "",
  requirementList: [],
  ccUids: []
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看会议预订";
  return isEdit.value ? "编辑会议预订" : "新增会议预订";
});

const rules = {
  title: [{ required: true, message: "请输入会议主题", trigger: "blur" }],
  roomId: [{ required: true, message: "请选择会议室", trigger: "change" }],
  startDate: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  endDate: [{ required: true, message: "请选择结束时间", trigger: "change" }],
  num: [
    { required: true, message: "请输入会议人数", trigger: "blur" },
    { pattern: /^[1-9]\d*$/, message: "必须是正整数", trigger: "blur" }
  ]
};

onMounted(() => {
  // 加载用户列表
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(u => u.status === "0");
  });
  
  // 加载会议室列表
  getPageList({ pageSize: 1000 }).then(res => {
    let list = [];
    if (res.rows && Array.isArray(res.rows)) {
      list = res.rows.map(row => {
        return Array.isArray(row) ? row[0] : row;
      }).filter(item => item && item.id); 
    }
    roomOptions.value = list;
  });
});

function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return;

    // 处理需求字段
    let requirementsText = form.requirementList.join('、');
    if (form.requirements && form.requirements.trim()) {
      requirementsText += (requirementsText ? '；' : '') + form.requirements;
    }

    // 只构建需要提交的字段，不包含后端自动生成的字段
    const data = {};
    
    // 基础必填字段
    data.title = form.title;
    data.roomId = Number(form.roomId);
    data.startDate = form.startDate;
    data.endDate = form.endDate;
    data.num = Number(form.num);
    data.requirements = requirementsText;
    
    // 处理抄送人（如果有值）
    if (form.ccUids && form.ccUids.length > 0) {
      data.ccUids = form.ccUids.join(',');
    }
    
    // 编辑时传id
    if (isEdit.value && form.id) {
      data.id = form.id;
    }
    
    // 可选字段，只在有值时传递
    if (form.flowId) {
      data.flowId = Number(form.flowId);
    }
    
    if (form.adminId) {
      data.adminId = Number(form.adminId);
    }

    console.log('提交数据（不包含后端自动字段）:', data);

    const api = isEdit.value ? updateenterPrise : addenterPrise;
    api(data).then(() => {
      proxy.$modal.msgSuccess("操作成功");
      dialogVisible.value = false;
      emit("success");
    }).catch(err => {
      console.error("提交失败详情：", err);
    });
  });
}

function reset() {
  Object.assign(form, {
    id: undefined, 
    title: "", 
    roomId: null, 
    startDate: "", 
    endDate: "",
    flowId: null, 
    adminId: null, 
    num: "", 
    requirements: "", 
    requirementList: [], 
    ccUids: []
  });
  isEdit.value = false;
  isView.value = false;
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

function handleClose() {
  reset();
  dialogVisible.value = false;
}

function open() {
  reset();
  dialogVisible.value = true;
}

function openEdit(data) {
  reset();
  
  console.log('编辑数据:', data);
  
  // 解析需求字段
  let requirementList = [];
  let requirements = "";
  
  if (data.requirements) {
    // 按中文分号分隔
    const parts = data.requirements.split('；');
    if (parts.length > 0) {
      // 第一部分可能包含checkbox选中的值（用顿号分隔）
      const firstPart = parts[0];
      const checkboxCandidates = firstPart.split('、').filter(Boolean);
      
      // 预定义的checkbox选项
      const checkboxOptions = ['电子屏', '投影背景', '电脑', '视频', '购买水果', '订餐'];
      
      // 分离checkbox选中的值和其他文本
      requirementList = checkboxCandidates.filter(item => checkboxOptions.includes(item));
      
      // 其他文本作为其他要求
      const otherTexts = checkboxCandidates.filter(item => !checkboxOptions.includes(item));
      if (otherTexts.length > 0) {
        requirements = otherTexts.join('、');
      }
      
      // 如果有更多部分，追加到其他要求
      if (parts.length > 1) {
        requirements += (requirements ? '；' : '') + parts.slice(1).join('；');
      }
    }
  }
  
  // 只赋值需要的字段，不包含后端自动生成的字段
  form.id = data.id;
  form.title = data.title || "";
  form.startDate = data.startDate || "";
  form.endDate = data.endDate || "";
  form.roomId = data.roomId ? Number(data.roomId) : null;
  form.flowId = data.flowId ? Number(data.flowId) : null;
  form.adminId = data.adminId ? Number(data.adminId) : null;
  form.num = data.num ? String(data.num) : "";
  form.ccUids = data.ccUids ? data.ccUids.split(',').filter(Boolean).map(Number) : [];
  form.requirementList = requirementList;
  form.requirements = requirements;

  isEdit.value = true;
  dialogVisible.value = true;
  
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

function openView(data) {
  reset();
  
  // 解析需求字段
  let requirementList = [];
  let requirements = "";
  
  if (data.requirements) {
    const parts = data.requirements.split('；');
    if (parts.length > 0) {
      const firstPart = parts[0];
      const checkboxCandidates = firstPart.split('、').filter(Boolean);
      
      const checkboxOptions = ['电子屏', '投影背景', '电脑', '视频', '购买水果', '订餐'];
      
      requirementList = checkboxCandidates.filter(item => checkboxOptions.includes(item));
      
      const otherTexts = checkboxCandidates.filter(item => !checkboxOptions.includes(item));
      if (otherTexts.length > 0) {
        requirements = otherTexts.join('、');
      }
      
      if (parts.length > 1) {
        requirements += (requirements ? '；' : '') + parts.slice(1).join('；');
      }
    }
  }
  
  // 只赋值需要的字段
  form.id = data.id;
  form.title = data.title || "";
  form.startDate = data.startDate || "";
  form.endDate = data.endDate || "";
  form.roomId = data.roomId ? Number(data.roomId) : null;
  form.flowId = data.flowId ? Number(data.flowId) : null;
  form.adminId = data.adminId ? Number(data.adminId) : null;
  form.num = data.num ? String(data.num) : "";
  form.ccUids = data.ccUids ? data.ccUids.split(',').filter(Boolean).map(Number) : [];
  form.requirementList = requirementList;
  form.requirements = requirements;

  isView.value = true;
  dialogVisible.value = true;
  
  nextTick(() => {
    formRef.value?.clearValidate();
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
</style>