<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="supplier-module-dialog"
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

      <el-form-item label="相关附件" prop="fileIds">
        <el-upload
          v-model:file-list="form.fileList"
          :disabled="isView"
          :auto-upload="false"
          multiple
          :limit="10"
        >
          <el-button type="success" icon="Plus">添加附件</el-button>
        </el-upload>
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
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { addMessageModule, updateMessageModule } from "@/api/base/contract/supplier/index.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

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

const dialogTitle = computed(() => {
  if (isView.value) return "查看供应商";
  return isEdit.value ? "编辑供应商" : "新增供应商";
});

const rules = {
  title: [{ required: true, message: "请输入供应商名称", trigger: "blur" }],
};

// 重置表单
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
  form.contactList = [
    { id: undefined, sid: undefined, isDefault: 1, name: "", sex: 1, mobile: "", qq: "", wechat: "", email: "", nickname: "", department: "", position: "", status: 1 },
  ];
  form.fileList = [];
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
}

function handleClose() { dialogVisible.value = false; }
function open() { reset(); dialogVisible.value = true; }

// ==============================================
// ✅ 编辑：直接赋值，不调用任何接口
// ==============================================
function openEdit(data) {
  reset();
  form.id = data.id;
  form.title = data.title || "";
  form.phone = data.phone || "";
  form.email = data.email || "";
  form.address = data.address || "";
  form.content = data.content || "";
  form.status = data.status ?? 1;

  // 联系人直接赋值
  const contact = data.contactList?.[0] || {};
  form.contactList[0] = {
    id: contact.id || undefined,
    sid: data.id,
    isDefault: 1,
    name: contact.name || "",
    sex: contact.sex ?? 1,
    mobile: contact.mobile || "",
    status: contact.status ?? 1,
  };

  isEdit.value = true;
  dialogVisible.value = true;
}

// ==============================================
// ✅ 查看：直接赋值，不调用任何接口
// ==============================================
function openView(data) {
  reset();
  form.id = data.id;
  form.title = data.title || "";
  form.phone = data.phone || "";
  form.email = data.email || "";
  form.address = data.address || "";
  form.content = data.content || "";
  form.status = data.status ?? 1;

  const contact = data.contactList?.[0] || {};
  form.contactList[0] = {
    id: contact.id || undefined,
    sid: data.id,
    isDefault: 1,
    name: contact.name || "",
    sex: contact.sex ?? 1,
    mobile: contact.mobile || "",
    status: contact.status ?? 1,
  };

  isView.value = true;
  dialogVisible.value = true;
}

// 提交（正常 POST / PUT）
async function handleSubmit() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const apiMethod = isEdit.value ? updateMessageModule : addMessageModule;
      const msg = isEdit.value ? "编辑成功" : "新增成功";

      const submitData = {
        ...form,
        contactList: form.contactList.map(c => ({ ...c, sid: form.id }))
      };

      await apiMethod(submitData);
      proxy.$modal.msgSuccess(msg);
      dialogVisible.value = false;
      emit("success");
    } catch (e) {
      console.error(e);
      proxy.$modal.msgError("提交失败");
    }
  });
}

const emit = defineEmits(["success"]);
defineExpose({ open, openEdit, openView });
</script>

<style scoped>
.dialog-footer { text-align: right; }
</style>

<style>
.supplier-module-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}
.supplier-module-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
  padding-bottom: 20px;
}
</style>