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

      <el-form-item label="审批人" prop="adminId" >
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
import { ref, reactive, computed, onMounted, getCurrentInstance } from "vue";
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

const form = reactive({
  id: undefined,
  title: "",
  roomId: null,
  startDate: "",
  endDate: "",
  adminId: null,
  flowId: null, // 👈 审批流程ID
  num: "",
  requirements: "",
  requirementList: [],
  ccUids: []
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看";
  return isEdit.value ? "编辑" : "新增";
});

const rules = {
  title: [{ required: true, message: "请输入会议主题", trigger: "blur" }],
  roomId: [{ required: true, message: "请选择会议室", trigger: "change" }],
  startDate: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  endDate: [{ required: true, message: "请选择结束时间", trigger: "change" }],
  num: [
    { required: true, message: "请输入会议人数", trigger: "blur" },
    { pattern: /^[1-9]\d*$/, message: "必须是正整数", trigger: "blur" }
  ],
};

onMounted(() => {
  // 用户列表
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(u => u.status === "0");
  });

  // 会议室列表
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

    const data = {
      ...form,
      roomId: +form.roomId,
      adminId: form.adminId || null,
      num: +form.num,
      requirements: form.requirementList.join('、') + (form.requirements ? '；' + form.requirements : ''),
      ccUids: form.ccUids.join(',')
    };

    const api = isEdit.value ? updateenterPrise : addenterPrise;
    api(data).then(() => {
      proxy.$modal.msgSuccess("操作成功");
      dialogVisible.value = false;
      emit("success");
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
    adminId: null,
    num: "",
    requirements: "",
    requirementList: [],
    ccUids: []
  });
  isEdit.value = false;
  isView.value = false;
  // 手动清除校验
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
  console.log("编辑回显数据：", data); // 看控制台！
  
  Object.assign(form, {
    ...data,
    startDate: data.startDate || "",
    endDate: data.endDate || "",
    roomId: data.roomId || null,
    adminId: data.adminId || null,
    num: (data.num || "").toString(),
    ccUids: data.ccUids ? data.ccUids.split(',').map(Number) : [],
    requirementList: data.requirements ? data.requirements.split('、').filter(Boolean) : []
  });
  
  isEdit.value = true;
  dialogVisible.value = true;
}

function openView(data) {
  reset();
  Object.assign(form, {
    ...data,
    startDate: data.startDate || "",
    endDate: data.endDate || "",
    roomId: data.roomId || null,
    adminId: data.adminId || null,
    num: (data.num || "").toString(),
    ccUids: data.ccUids ? data.ccUids.split(',').map(Number) : [],
    requirementList: data.requirements ? data.requirements.split('、').filter(Boolean) : []
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
</style>