<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="car-dialog"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="isView ? undefined : rules" label-width="140px">

      <!-- 所有表单项 垂直单列 -->
      
      <el-form-item label="车辆名称" prop="carId" required>
        <el-select
          v-model="form.carId"
          :disabled="isView"
          :teleported="false"
          placeholder="请选择车辆"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in carOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="费用类型" prop="types" required>
        <el-select
          v-model="form.types"
          :disabled="isView"
          placeholder="请选择费用类型"
          style="width: 100%"
        >
          <el-option label="停车费" :value="1" />
          <el-option label="洗车费" :value="2" />
          <el-option label="保养费" :value="3" />
          <el-option label="维修费" :value="4" />
          <el-option label="过路费" :value="5" />
          <el-option label="过桥费" :value="6" />
          <el-option label="养路费" :value="7" />
          <el-option label="保险费" :value="8" />
          <el-option label="年检费" :value="9" />
          <el-option label="违章费" :value="10" />
          <el-option label="其他费" :value="11" />
        </el-select>
      </el-form-item>

      <el-form-item label="费用主题" prop="title" required>
        <el-input v-model="form.title" placeholder="请输入费用主题" :disabled="isView" />
      </el-form-item>

      <el-form-item label="收费日期" prop="feeTime" required>
        <el-date-picker
          v-model="form.feeTime"
          type="date"
          placeholder="请选择收费日期"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="费用金额" prop="amount" required>
        <el-input-number
          v-model="form.amount"
          :min="0"
          :precision="2"
          placeholder="请输入费用金额"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="经手人" prop="handled" required>
        <el-select
          v-model="form.handled"
          :disabled="isView"
          :teleported="false"
          placeholder="请选择经手人"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="相关附件">
        <el-upload
          :action="uploadUrl"
          :file-list="attachFileList"
          :on-success="handleAttachUploadSuccess"
          :before-upload="beforeUpload"
          :disabled="isView"
          multiple
        >
          <el-button type="primary" :icon="Plus">上传附件</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="收费内容" prop="content" required>
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          placeholder="请输入收费内容"  
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">立即提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddRepairData">
import { ref, reactive, computed, onMounted, getCurrentInstance } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/administration/car/fee/index.js";
import { getPageList  } from "@/api/administration/car/data/index.js";
import { ElMessage } from "element-plus";
import { Plus, Upload } from "@element-plus/icons-vue";
import { listUser } from "@/api/system/user.js";

const { proxy } = getCurrentInstance();
const uploadUrl = import.meta.env.VITE_APP_BASE_API + "/file/upload";

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 车辆下拉
const carOptions = ref([]);
// 用户下拉
const userOptions = ref([]);

onMounted(() => {
  // 获取车辆列表
  getPageList({ pageSize: 1000 }).then(res => {
    carOptions.value = res.rows || [];
  });

  // 获取用户列表
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = res.rows || [];
  });
});


const form = reactive({
  id: undefined,
  carId: null,
  title: "",
  feeTime: null,
  amount: 0,
  handled: null,
  types: undefined,
  content: "",
  fileIds: "",
});

const attachFileList = ref([]);

const dialogTitle = computed(() => {
  if (isView.value) return "查看费用记录";
  return isEdit.value ? "编辑费用记录" : "新增费用记录";
});

const rules = {
  carId: [{ required: true, message: "请选择车辆", trigger: "change" }],
  title: [{ required: true, message: "请输入费用主题", trigger: "blur" }],
  feeTime: [{ required: true, message: "请选择收费日期", trigger: "change" }],
  amount: [{ required: true, message: "请输入费用金额", trigger: "blur" }],
  handled: [{ required: true, message: "请选择经手人", trigger: "change" }],
  content: [{ required: true, message: "请输入收费内容", trigger: "blur" }],
  types: [{ required: true, message: "请选择费用类型", trigger: "change" }]
};

// 提交
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = {
        ...form,
        feeTime: form.feeTime ? Math.floor(form.feeTime / 1000) : 0,
        handled: form.handled || 0,
      };

      const apiMethod = isEdit.value ? updateenterPrise : addenterPrise;
      apiMethod(submitData).then(() => {
        proxy.$modal.msgSuccess(isEdit.value ? "编辑成功" : "新增成功");
        dialogVisible.value = false;
        emit("success");
      });
    }
  });
}

// 上传限制
function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("文件不能超过2MB");
    return false;
  }
  return true;
}

// 附件上传成功
function handleAttachUploadSuccess(res) {
  const ids = attachFileList.value.map(i => i.response?.data).filter(Boolean);
  form.fileIds = ids.join(",");
  ElMessage.success("上传成功");
}

// 重置
function reset() {
  Object.assign(form, {
    id: undefined,
    carId: null,
    title: "",
    feeTime: null,
    amount: 0,
    handled: null,
    types: undefined,
    content: "",
    fileIds: "",
  });
  attachFileList.value = [];
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate?.();
}

// 关闭
function handleClose() {
  dialogVisible.value = false;
  reset();
}

// 打开新增
function open() {
  reset();
  dialogVisible.value = true;
}

// 编辑
function openEdit(data) {
  reset();
  Object.assign(form, {
    ...data,
    feeTime: data.feeTime ? data.feeTime * 1000 : null,
    handled: data.handled === 0 ? null : data.handled,
  });
  isEdit.value = true;
  dialogVisible.value = true;
}

// 查看
function openView(data) {
  reset();
  Object.assign(form, {
    ...data,
    feeTime: data.feeTime ? data.feeTime * 1000 : null,
    handled: data.handled === 0 ? null : data.handled,
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