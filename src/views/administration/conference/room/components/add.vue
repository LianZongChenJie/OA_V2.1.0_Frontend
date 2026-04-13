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

      <el-form-item label="会议室名称" prop="title" required>
        <el-input v-model="form.title" placeholder="请输入会议室名称" :disabled="isView" />
      </el-form-item>

      <el-form-item label="地址（楼层）" prop="address" required>
        <el-input v-model="form.address" placeholder="请输入地址（楼层）" :disabled="isView" />
      </el-form-item>

      <el-form-item label="管理员" prop="keepUid" required>
        <el-select
          v-model="form.keepUid"
          :disabled="isView"
          :teleported="false"
          placeholder="请选择管理员"
          filterable
          clearable
          style="width: 100%"
          @change="handleUserChange"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="容纳人数" prop="num" required>
        <el-input v-model="form.num" placeholder="请输入容纳人数" :disabled="isView" />
      </el-form-item>

      <el-form-item label="内置设备" prop="device" required>
        <el-input v-model="form.device" placeholder="请输入内置设备" :disabled="isView" />
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

<script setup name="AddRoom">
import { ref, reactive, computed, onMounted, getCurrentInstance } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/administration/conference/room/index.js";
import { ElMessage } from "element-plus";
import { listUser } from "@/api/system/user.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 用户下拉
const userOptions = ref([]);

// 表单
const form = reactive({
  id: undefined,
  title: "",
  num: "",
  device: "",
  address: "",
  keepUid: null,
  keepName: "", // 管理员姓名
  remark: "",
  status: 1,
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看会议室信息";
  return isEdit.value ? "编辑会议室信息" : "新增会议室信息";
});

const rules = {
  title: [{ required: true, message: "请输入会议室名称", trigger: "blur" }],
  num: [{ required: true, message: "请输入可容纳人数", trigger: "blur" },
     {
      pattern: /^[1-9]\d*$/,
      message: "请输入有效的正整数",
      trigger: "blur"
    }
  ],
  keepUid: [{ required: true, message: "请选择管理员", trigger: "change" }],
  device: [{ required: true, message: "请输入内置设备", trigger: "blur" }],
  address: [{ required: true, message: "请输入地址（楼层）", trigger: "blur" }],
};

// 获取用户列表（只获取正常状态的用户）
onMounted(() => {
  listUser({ pageSize: 1000 }).then(res => {
    // 过滤掉禁用的用户（status === "1" 表示禁用）
    userOptions.value = (res.rows || []).filter(user => user.status === "0");
  });
});

// 选择管理员时，自动赋值姓名（使用 nickName）
function handleUserChange(val) {
  const user = userOptions.value.find(item => item.userId === val);
  form.keepName = user ? user.nickName : "";
}

// 提交
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = {
        ...form,
        id: form.id ? parseInt(form.id) : undefined,
        num: parseInt(form.num) || 0,
        keepUid: parseInt(form.keepUid) || 0,
        status: parseInt(form.status) || 1,
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

// 重置
function reset() {
  Object.assign(form, {
    id: undefined,
    title: "",
    num: "",
    address: "",
    device: "",
    keepUid: null,
    keepName: "",
    remark: "",
    status: 1
  });
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
    keepUid: data.keepUid === 0 ? null : data.keepUid,
  });
  isEdit.value = true;
  dialogVisible.value = true;
}

// 查看
function openView(data) {
  reset();
  Object.assign(form, {
    ...data,
    keepUid: data.keepUid === 0 ? null : data.keepUid,
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