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
        <el-input v-model="form.phone" placeholder="请输入供应商电话" :disabled="isView" @input="form.phone = form.phone.replace(/[^0-9-]/g, '')" />
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

      <el-form-item label="联系人" prop="contactList.0.name">
        <el-input v-model="form.contactList[0].name" placeholder="请输入联系人姓名" :disabled="isView" />
      </el-form-item>

      <el-form-item label="联系电话" prop="contactList.0.mobile">
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
import { ElMessage } from "element-plus";
import {
  addMessageModule,
  updateMessageModule,
} from "@/api/base/contract/supplier/index.js";

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 初始化默认联系人，永远不会为空
const defaultContact = {
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
};

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
  contactList: [{ ...defaultContact }], // 强制有值
  fileList: [],
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看供应商";
  return isEdit.value ? "编辑供应商" : "新增供应商";
});

const rules = {
  title: [{ required: true, message: "请输入供应商名称", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入供应商电话", trigger: "blur" },
    { pattern: /^[0-9-]*$/, message: "电话只能包含数字和中划线", trigger: "blur" }
  ],
  address: [{ required: true, message: "请输入供应商地址", trigger: "blur" }],
  email: [
    { required: true, message: "请输入供应商邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  "contactList.0.name": [{ required: true, message: "请输入联系人姓名", trigger: "blur" }],
  "contactList.0.mobile": [
    { required: true, message: "请输入联系人电话", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号格式", trigger: "blur" }
  ],
};

// 完全安全的重置
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
  
  // 强制覆盖，保证 contactList[0] 一定存在
  form.contactList[0] = { ...defaultContact };
  form.fileList = [];

  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate?.();
}

function handleClose() {
  dialogVisible.value = false;
}

function open() {
  reset();
  dialogVisible.value = true;
}

// 100% 安全编辑
function openEdit(data) {
  if (!data) return;
  reset();
  
  // 基础赋值
  form.id = data.id || undefined;
  form.title = data.title || "";
  form.phone = data.phone || "";
  form.address = data.address || "";
  form.email = data.email || "";
  form.content = data.content || "";

  // 安全赋值联系人
  const contact = data?.contactList?.[0] || {};
  form.contactList[0].name = contact.name || "";
  form.contactList[0].mobile = contact.mobile || "";
  form.contactList[0].sex = contact.sex ?? 1;
  form.contactList[0].id = contact.id || undefined;
  form.contactList[0].sid = form.id;

  isEdit.value = true;
  dialogVisible.value = true;
}

// 100% 安全查看
function openView(data) {
  if (!data) return;
  reset();
  
  form.id = data.id || undefined;
  form.title = data.title || "";
  form.phone = data.phone || "";
  form.address = data.address || "";
  form.email = data.email || "";
  form.content = data.content || "";

  const contact = data?.contactList?.[0] || {};
  form.contactList[0].name = contact.name || "";
  form.contactList[0].mobile = contact.mobile || "";
  form.contactList[0].sex = contact.sex ?? 1;

  isView.value = true;
  dialogVisible.value = true;
}

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