<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="car-dialog"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="isView ? {} : rules" label-width="140px">

      <el-form-item label="车辆名称" prop="title" required>
        <el-input v-model="form.title" placeholder="请输入车辆名称" :disabled="isView" />
      </el-form-item>

      <el-form-item label="车牌号码" prop="name" required>
        <el-input v-model="form.name" placeholder="请输入车牌号码" :disabled="isView" />
      </el-form-item>

      <el-form-item label="购买日期" prop="buyTime" required>
        <el-date-picker
          v-model="form.buyTime"
          type="date"
          placeholder="请选择购买日期"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="购买价格" prop="price" required>
        <el-input-number
          v-model="form.price"
          :min="0"
          :precision="2"
          placeholder="请输入购买价格"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="车身颜色" prop="color" required>
        <el-input v-model="form.color" placeholder="请输入车身颜色" :disabled="isView" />
      </el-form-item>

      <el-form-item label="座位数" prop="seats" required>
        <el-input-number
          v-model="form.seats"
          :min="1"
          placeholder="请输入座位数"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="发动机号" prop="engine" required>
        <el-input v-model="form.engine" placeholder="请输入发动机号" :disabled="isView" />
      </el-form-item>

      <el-form-item label="车架号(VIN)" prop="vin" required>
        <el-input v-model="form.vin" placeholder="请输入车架号" :disabled="isView" />
      </el-form-item>

      <el-form-item label="保险到期时间" prop="insureTime" required>
        <el-date-picker
          v-model="form.insureTime"
          type="date"
          placeholder="请选择保险到期时间"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="年检到期时间" prop="reviewTime" required>
        <el-date-picker
          v-model="form.reviewTime"
          type="date"
          placeholder="请选择年检到期时间"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="燃油类型" prop="oil" required>
        <el-input v-model="form.oil" placeholder="请输入燃油类型" :disabled="isView" />
      </el-form-item>

      <el-form-item label="行驶里程" prop="mileage" required>
        <el-input v-model="form.mileage" placeholder="请输入行驶里程" :disabled="isView" />
      </el-form-item>

      <el-form-item label="驾驶员">
        <el-select
          v-model="form.driver"
          :disabled="isView"
          :teleported="false"
          placeholder="请选择驾驶员"
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

      <el-form-item label="车辆状态" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择车辆状态"
          :disabled="isView"
          style="width: 100%"
        >
          <el-option label="在用" :value="1" />
          <el-option label="停用" :value="0" />
          <el-option label="报废" :value="2" />
          <el-option label="待维修" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="车辆缩略图">
        <el-upload
          :action="uploadUrl"
          :file-list="fileList"
          :limit="1"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
          :disabled="isView"
          list-type="picture-card"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
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
          <el-button type="primary" :icon="Upload">上传附件</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="备注信息">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入备注信息"
          :disabled="isView"
        />
      </el-form-item>

    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddData">
import { ref, reactive, computed, onMounted, getCurrentInstance } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/administration/car/data/index.js";
import { ElMessage } from "element-plus";
import { Plus, Upload } from "@element-plus/icons-vue";
import { listUser } from "@/api/system/user.js";

const { proxy } = getCurrentInstance();
const uploadUrl = import.meta.env.VITE_APP_BASE_API + "/file/upload";

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const userOptions = ref([]);
onMounted(() => {
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = res.rows || [];
  });
});

const form = reactive({
  id: undefined,
  title: "",
  name: "",
  oil: "",
  mileage: "",
  seats: 0,
  color: "",
  vin: "",
  engine: "",
  buyTime: null,
  price: 0,
  thumb: 0,
  types: 0,
  driver: null,
  insureTime: null,
  reviewTime: null,
  fileIds: "",
  remark: "",
  status: 1,
});

const fileList = ref([]);
const attachFileList = ref([]);

const dialogTitle = computed(() => {
  if (isView.value) return "查看车辆信息";
  return isEdit.value ? "编辑车辆信息" : "新增车辆信息";
});

const rules = {
  title: [{ required: true, message: "请输入车辆名称", trigger: "blur" }],
  name: [{ required: true, message: "请输入车牌号码", trigger: "blur" }],
  buyTime: [{ required: true, message: "请选择购买日期", trigger: "change" }],
  price: [{ required: true, message: "请输入购买价格", trigger: "blur" }],
  color: [{ required: true, message: "请输入车身颜色", trigger: "blur" }],
  seats: [{ required: true, message: "请输入座位数", trigger: "blur" }],
  engine: [{ required: true, message: "请输入发动机号", trigger: "blur" }],
  vin: [{ required: true, message: "请输入车架号", trigger: "blur" }],
  insureTime: [{ required: true, message: "请选择保险到期时间", trigger: "change" }],
  reviewTime: [{ required: true, message: "请选择年检到期时间", trigger: "change" }],
  oil: [{ required: true, message: "请输入燃油类型", trigger: "blur" }],
  mileage: [{ required: true, message: "请输入行驶里程", trigger: "blur" }],
};

// 提交
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = {
        ...form,
        buyTime: form.buyTime ? Math.floor(new Date(form.buyTime).getTime() / 1000) : 0,
        insureTime: form.insureTime ? Math.floor(new Date(form.insureTime).getTime() / 1000) : 0,
        reviewTime: form.reviewTime ? Math.floor(new Date(form.reviewTime).getTime() / 1000) : 0,
        driver: Number(form.driver) || null,
        price: Number(form.price),
        seats: Number(form.seats),
        status: Number(form.status),
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

// 上传前校验
function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("文件不能超过2MB");
    return false;
  }
  return true;
}

// 图片上传成功
function handleUploadSuccess(res) {
  form.thumb = res.data;
  ElMessage.success("上传成功");
}

// 附件上传成功
function handleAttachUploadSuccess(res) {
  const ids = attachFileList.value.map(i => i.response?.data).filter(Boolean);
  form.fileIds = ids.join(",");
  ElMessage.success("附件上传成功");
}

// 重置表单
function reset() {
  Object.assign(form, {
    id: undefined, title: "", name: "", oil: "", mileage: "", seats: 0, color: "",
    vin: "", engine: "", buyTime: null, price: 0, thumb: 0, driver: null,
    insureTime: null, reviewTime: null, fileIds: "", remark: "", status: 1
  });
  fileList.value = [];
  attachFileList.value = [];
  isEdit.value = false;
  isView.value = false;
}

// 关闭弹窗（修复版）
function handleClose() {
  if (formRef.value) {
    formRef.value.clearValidate();
  }
  reset();
  dialogVisible.value = false;
}

// 打开新增
function open() {
  reset();
  dialogVisible.value = true;
}

// 编辑（已修复：数字类型 + 时间类型）
function openEdit(data) {
  reset();
  Object.assign(form, {
    id: data.id,
    title: data.title,
    name: data.name,
    price: Number(data.price),
    color: data.color,
    seats: Number(data.seats),
    engine: data.engine,
    vin: data.vin,
    buyTime: data.buyTime ? new Date(data.buyTime * 1000) : null,
    insureTime: data.insureTime ? new Date(data.insureTime * 1000) : null,
    reviewTime: data.reviewTime ? new Date(data.reviewTime * 1000) : null,
    oil: data.oil,
    mileage: String(data.mileage),
    driver: data.driver === 0 ? null : Number(data.driver),
    status: Number(data.status),
    thumb: data.thumb,
    fileIds: data.fileIds,
    remark: data.remark,
  });
  isEdit.value = true;
  dialogVisible.value = true;
}

// 查看（已修复）
function openView(data) {
  reset();
  Object.assign(form, {
    id: data.id,
    title: data.title,
    name: data.name,
    price: Number(data.price),
    color: data.color,
    seats: Number(data.seats),
    engine: data.engine,
    vin: data.vin,
    buyTime: data.buyTime ? new Date(data.buyTime * 1000) : null,
    insureTime: data.insureTime ? new Date(data.insureTime * 1000) : null,
    reviewTime: data.reviewTime ? new Date(data.reviewTime * 1000) : null,
    oil: data.oil,
    mileage: String(data.mileage),
    driver: data.driver === 0 ? null : Number(data.driver),
    status: Number(data.status),
    thumb: data.thumb,
    fileIds: data.fileIds,
    remark: data.remark,
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