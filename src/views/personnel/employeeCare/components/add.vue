<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="600px"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="员工姓名" prop="empName" required>
        <el-select
          v-model="form.empName"
          :disabled="isView"
          placeholder="请选择员工"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.userName"
            :value="item.userName"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="关怀项目" prop="careItem" required>
        <el-select v-model="form.careItem" :disabled="isView" placeholder="请选择" style="width: 100%">
          <el-option label="请选择" value="" />
          <el-option label="礼品" value="礼品" />
          <el-option label="生日" value="生日" />
          <el-option label="节日" value="节日" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>

      <el-form-item label="当前状态" prop="status" required>
        <el-radio-group v-model="form.status" :disabled="isView">
          <el-radio label="1">待执行</el-radio>
          <el-radio label="0">已执行</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="关怀金额(元)" prop="amount" required>
        <el-input v-model="form.amount" :disabled="isView" placeholder="请输入金额" style="width: 100%" />
      </el-form-item>

      <el-form-item label="关怀日期" prop="careDate" required>
        <el-date-picker
          v-model="form.careDate"
          :disabled="isView"
          type="date"
          placeholder="请选择"
          style="width: 100%"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="关怀物品" prop="gift">
        <el-input v-model="form.gift" :disabled="isView" placeholder="请输入关怀物品" style="width: 100%" />
      </el-form-item>

      <el-form-item label="关怀描述" prop="remark">
        <el-input
          v-model="form.remark"
          :disabled="isView"
          type="textarea"
          :rows="4"
          placeholder="请输入关怀描述"
          style="width: 100%"
        />
      </el-form-item>

    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <!-- 查看模式隐藏提交按钮 -->
        <el-button v-if="!isView" type="primary" @click="handleSubmit">立即提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddCareDialog">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { listUser } from "@/api/system/user.js";

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);
const userOptions = ref([]);

// 修复：字段名和columns、业务完全一致
const form = reactive({
  careItem: "",
  status: "1",
  empName: "",
  copyUids: [],
  amount: "",
  careDate: "",
  gift: "",
  remark: ""
});

const dialogTitle = computed(() => {
  return isView.value ? "查看关怀信息" : isEdit.value ? "编辑关怀信息" : "新增关怀信息";
});

const rules = {
  careItem: [{ required: true, message: "请选择关怀项目", trigger: "change" }],
  status: [{ required: true, message: "请选择当前状态", trigger: "change" }],
  empName: [{ required: true, message: "请选择员工姓名", trigger: "change" }],
  amount: [{ required: true, message: "请输入关怀金额", trigger: "blur" }],
  careDate: [{ required: true, message: "请选择关怀日期", trigger: "change" }],
};

// 获取用户列表
function getUserList() {
  listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
    userOptions.value = response.rows || [];
  });
}

onMounted(() => {
  getUserList();
});

function reset() {
  form.careItem = "";
  form.status = "1";
  form.empName = "";
  form.copyUids = [];
  form.amount = "";
  form.careDate = "";
  form.gift = "";
  form.remark = "";
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate?.();
}

function handleClose() {
  dialogVisible.value = false;
  reset();
}

function open() {
  reset();
  dialogVisible.value = true;
}

function openEdit(data) {
  reset();
  Object.assign(form, data);
  isEdit.value = true;
  dialogVisible.value = true;
}

function openView(data) {
  reset();
  Object.assign(form, data);
  isView.value = true;
  dialogVisible.value = true;
}

async function handleSubmit() {
  const valid = await formRef.value?.validate?.();
  if (!valid) return;

  try {
    ElMessage.success(isEdit.value ? "编辑成功" : "新增成功");
    dialogVisible.value = false;
    emit("success");
  } catch (err) {
    ElMessage.error("操作失败");
  }
}

const emit = defineEmits(["success"]);
defineExpose({ open, openEdit, openView, getUserList });
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>