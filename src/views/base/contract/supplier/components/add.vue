<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="isView ? {} : rules" label-width="120px">
      <el-form-item label="供应商名称" prop="title" required>
        <el-input v-model="form.title" placeholder="请输入供应商名称" :disabled="isView" />
      </el-form-item>

      <el-form-item label="供应商电话" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入供应商电话" :disabled="isView" />
      </el-form-item>

      <el-form-item label="供应商地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入供应商地址" :disabled="isView" />
      </el-form-item>

      <el-form-item label="供应商邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入供应商邮箱" :disabled="isView" />
      </el-form-item>

      <el-form-item label="供应商简介" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          :disabled="isView"
        />
      </el-form-item>

      <el-divider content-position="left" style="margin:20px 0">首要联系人信息</el-divider>

      <el-form-item label="联系人" prop="name">
        <el-input v-model="form.contactList[0].name" placeholder="请输入联系人姓名" :disabled="isView" />
      </el-form-item>

      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="form.contactList[0].mobile" placeholder="请输入联系人电话" :disabled="isView" />
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.contactList[0].sex" :disabled="isView">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">{{ isView ? "关 闭" : "取 消" }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddSupplier">
import { ref, reactive, computed, nextTick } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import {
  addMessageModule,
  updateMessageModule,
} from "@/api/base/contract/supplier/index.js";

// 弹窗控制
const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 表单数据
const form = reactive({
  id: undefined,
  title: "",
  code: "",
  phone: "",
  email: "",
  address: "",
  fileIds: "",
  content: "",
  status: 1,
  sort: 0,
  contactList: [
    {
      id: undefined,
      sid: undefined,
      isDefault: 1,
      name: "",
      sex: 1,
      mobile: "",
      qq: "",
      wechat: "",
      email: "",
      nickname: "",
      department: "",
      position: "",
      status: 1,
    },
  ],
  fileList: [],
});

// 标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看供应商";
  return isEdit.value ? "编辑供应商" : "新增供应商";
});

// 校验
const rules = {
  title: [{ required: true, message: "请输入供应商名称", trigger: "blur" }],
};

// 重置
function reset() {
  form.id = undefined;
  form.title = "";
  form.code = "";
  form.phone = "";
  form.email = "";
  form.address = "";
  form.fileIds = "";
  form.content = "";
  form.status = 1;
  form.sort = 0;

  Object.assign(form.contactList[0], {
    id: undefined,
    sid: undefined,
    isDefault: 1,
    name: "",
    sex: 1,
    mobile: "",
    qq: "",
    wechat: "",
    email: "",
    nickname: "",
    department: "",
    position: "",
    status: 1,
  });
  form.fileList = [];

  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate?.();
}

// 关闭
function handleClose() {
  dialogVisible.value = false;
}

// 打开新增
function open() {
  reset();
  nextTick(() => {
    dialogVisible.value = true;
  });
}

function openEdit(data) {
  reset();
  Object.assign(form, data);

  if (data.contactList?.length > 0) {
    form.contactList[0].id = data.contactList[0].id;
    form.contactList[0].name = data.contactList[0].name || "";
    form.contactList[0].mobile = data.contactList[0].mobile || "";
    form.contactList[0].sex = data.contactList[0].sex ?? 1;
    form.contactList[0].sid = form.id;
  }

  isEdit.value = true;
  dialogVisible.value = true;
}



function openView(data) {
  reset();
  Object.assign(form, data);

  if (data.contactList?.length) {
    Object.assign(form.contactList[0], data.contactList[0]);
  }

  isView.value = true;
  nextTick(() => {
    dialogVisible.value = true;
  });
}

// 提交（不变）
async function handleSubmit() {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  try {
    const submitData = {
      id: form.id,
      title: form.title,
      code: form.code,
      phone: form.phone,
      email: form.email,
      address: form.address,
      fileIds: form.fileIds,
      content: form.content,
      status: form.status ?? 1, 
      sort: form.sort,
    
      contactList: [
        {
          id: form.contactList[0].id, 
          sid: form.id,
          isDefault: 1,
          name: form.contactList[0].name,
          sex: form.contactList[0].sex,
          mobile: form.contactList[0].mobile,
          status: 1
        }
      ]
    };

    await (isEdit.value ? updateMessageModule(submitData) : addMessageModule(submitData));
    ElMessage.success(isEdit.value ? "编辑成功" : "新增成功");
    dialogVisible.value = false;
    emit("success");
  } catch (err) {
    console.error(err);
    ElMessage.error("操作失败");
  }
}

const emit = defineEmits(["success"]);
defineExpose({ open, openEdit, openView });
</script>