<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="approval-module-dialog"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="isView ? {} : rules" label-width="120px">
      <el-form-item label="企业名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入企业名称" :disabled="isView" />
      </el-form-item>
       <el-form-item label="所在城市" prop="city">
        <el-input v-model="form.city" placeholder="请输入所在城市" :disabled="isView" />
      </el-form-item>
      <el-form-item label="开户银行" prop="bank">
        <el-input v-model="form.bank" placeholder="请输入开户银行" :disabled="isView" />
      </el-form-item>
      <el-form-item label="银行账号" prop="bankSn">
        <el-input v-model="form.bankSn" placeholder="银行账号" :disabled="isView" />
      </el-form-item>
      <el-form-item label="纳税人识别号" prop="taxNum">
        <el-input v-model="form.taxNum" placeholder="纳税人识别号" :disabled="isView" />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="form.address" placeholder="详细地址" :disabled="isView" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="2"
          placeholder="请输入备注"
          :disabled="isView"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">{{ isView ? '关 闭' : '取 消' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddEnterPrise">
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/base/common/businessEntity/index.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const isView = ref(false); // 是否为查看模式

const form = reactive({
  id: undefined,
  title: "",
  city: "",
  bank: "",
  bankSn: "",
  taxNum: "",
  address: "",
  remark: "",
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看企业";
  return isEdit.value ? "编辑企业" : "新增企业";
});

const rules = {
  title: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
  city: [{ required: true, message: "请输入所在城市", trigger: "blur" }],
  taxNum: [{ required: true, message: "请输入纳税人识别号", trigger: "blur" }],
  address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
 };

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.title = "";
  form.city = "";
  form.bank = "";
  form.bankSn = "";
  form.taxNum = "";
  form.address = "";
  form.remark = "";
  isEdit.value = false;
  isView.value = false;
  proxy.resetForm("formRef");
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
  // 填充表单数据
  form.id = data.id;
  form.title = data.title;
  form.city = data.city;
  form.bank = data.bank;
  form.bankSn = data.bankSn;
  form.taxNum = data.taxNum;
  form.address = data.address;
  form.remark = data.remark;

  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  // 填充表单数据
  form.id = data.id;
  form.title = data.title;
  form.city = data.city;
  form.bank = data.bank;
  form.bankSn = data.bankSn;
  form.taxNum = data.taxNum;
  form.address = data.address;
  form.remark = data.remark;

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? updateenterPrise : addenterPrise;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      apiMethod(form).then(() => {
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
</style>  

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
.approval-module-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.approval-module-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>
