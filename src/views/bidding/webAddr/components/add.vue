<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="500px"
    append-to-body
    class="web-addr-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="100px"
    >
      <el-form-item label="网站名称" prop="websiteName">
        <el-input
          v-model="form.websiteName"
          placeholder="请输入网站名称"
          :disabled="isView"
        />
      </el-form-item>

      <el-form-item label="网址" prop="websiteUrl">
        <el-input
          v-model="form.websiteUrl"
          placeholder="请输入网址"
          :disabled="isView"
        />
      </el-form-item>

      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          :disabled="isView"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          :disabled="isView"
          show-password
        />
      </el-form-item>

      <el-form-item label="是否有UK" prop="hasUk">
        <el-select
          v-model="form.hasUk"
          placeholder="请选择是否有UK"
          :disabled="isView"
          style="width: 100%"
          clearable
        >
          <el-option
            v-for="dict in have_uk"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="说明" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          :maxlength="500"
          show-word-limit
          placeholder="请输入说明（500字以内）"
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

<script setup name="AddWebAddr">
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { addWebsiteAccount, updateWebsiteAccount } from "@/api/bidding/webAddr";

const { proxy } = getCurrentInstance();
const { have_uk } = proxy.useDict("have_uk");

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const form = reactive({
  id: undefined,
  websiteName: "",
  websiteUrl: "",
  username: "",
  password: "",
  hasUk: "NS", // 未设置
  remark: "",
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看网址信息";
  return isEdit.value ? "编辑网址信息" : "新增网址信息";
});

const rules = {
  websiteName: [{ required: true, message: "请输入网站名称", trigger: "blur" }],
  websiteUrl: [{ required: true, message: "请输入网址", trigger: "blur" }],
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  hasUk: [{ required: true, message: "请选择是否有UK", trigger: "change" }],
};

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.websiteName = "";
  form.websiteUrl = "";
  form.username = "";
  form.password = "";
  form.hasUk = "NS"; // 未设置
  form.remark = "";

  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
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
  fillForm(data);
  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  fillForm(data);
  isView.value = true;
  dialogVisible.value = true;
}

/** 填充表单数据 */
function fillForm(data) {
  form.id = data.id;
  form.websiteName = data.websiteName || "";
  form.websiteUrl = data.websiteUrl || "";
  form.username = data.username || "";
  form.password = data.password || "";
  form.hasUk = data.hasUk || "NS";
  form.remark = data.remark || "";
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = { ...form };

      const apiMethod = isEdit.value ? updateWebsiteAccount : addWebsiteAccount;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      apiMethod(submitData).then(() => {
        proxy.$modal.msgSuccess(successMsg);
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
.web-addr-dialog .el-dialog {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.web-addr-dialog .el-dialog__body {
  max-height: calc(80vh - 120px);
  overflow-y: auto;
}
</style>
