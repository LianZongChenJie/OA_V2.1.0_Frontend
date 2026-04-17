<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="600px"
    append-to-body
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="100px"
      :validate-on-rule-change="false"
    >
      <!-- 姓名 -->
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入姓名"
          :disabled="isView"
        />
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="form.mobile"
          placeholder="请输入手机号"
          :disabled="isView"
        />
      </el-form-item>

      <!-- 电子邮箱 -->
      <el-form-item label="电子邮箱" prop="email">
        <el-input
          v-model="form.email"
          placeholder="请输入电子邮箱"
          :disabled="isView"
        />
      </el-form-item>

      <!-- QQ号码 -->
      <el-form-item label="QQ号码" prop="qq">
        <el-input
          v-model="form.qq"
          placeholder="请输入QQ号码"
          :disabled="isView"
        />
      </el-form-item>

      <!-- 微信号 -->
      <el-form-item label="微信号" prop="wechat">
        <el-input
          v-model="form.wechat"
          placeholder="请输入微信号"
          :disabled="isView"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">
          确 定
        </el-button>
        <el-button @click="dialogVisible = false">
          {{ isView ? "关 闭" : "取 消" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="EditContact">
import { ref, reactive, computed, getCurrentInstance, nextTick } from "vue";
import { edit } from "@/api/customer/contact";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const form = reactive({
  id: undefined,
  name: "",
  mobile: "",
  email: "",
  qq: "",
  wechat: "",
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看联系人";
  return isEdit.value ? "编辑联系人" : "新增联系人";
});

// 手机号校验
const validateMobile = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入手机号"));
  } else {
    const reg = /^1[3-9]\d{9}$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的手机号格式"));
    } else {
      callback();
    }
  }
};

// 邮箱校验
const validateEmail = (rule, value, callback) => {
  if (value) {
    const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的邮箱格式"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const rules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  mobile: [{ required: true, validator: validateMobile, trigger: "blur" }],
  email: [{ validator: validateEmail, trigger: "blur" }],
};

/** 表单重置 */
function reset() {
  // 先清除验证
  formRef.value?.clearValidate();

  form.id = undefined;
  form.name = "";
  form.mobile = "";
  form.email = "";
  form.qq = "";
  form.wechat = "";

  isEdit.value = false;
  isView.value = false;
}

/** 关闭弹窗 */
function handleClose() {
  reset();
}

/** 显示弹窗 - 新增模式 */
function open() {
  reset();
  dialogVisible.value = true;
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  reset();
  isEdit.value = true;

  // 使用 nextTick 确保表单状态更新后再设置数据
  nextTick(() => {
    form.id = data.id;
    form.name = data.name || "";
    form.mobile = data.mobile || "";
    form.email = data.email || "";
    form.qq = data.qq || "";
    form.wechat = data.wechat || "";
  });

  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  isView.value = true;

  // 使用 nextTick 确保表单状态更新后再设置数据
  nextTick(() => {
    form.id = data.id;
    form.name = data.name || "";
    form.mobile = data.mobile || "";
    form.email = data.email || "";
    form.qq = data.qq || "";
    form.wechat = data.wechat || "";
  });

  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = { ...form };

      edit(submitData).then(() => {
        proxy.$modal.msgSuccess("编辑成功");
        dialogVisible.value = false;
        emit("success");
      });
    }
  });
}

const emit = defineEmits(["success"]);

defineExpose({
  open,
  openEdit,
  openView,
});
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
