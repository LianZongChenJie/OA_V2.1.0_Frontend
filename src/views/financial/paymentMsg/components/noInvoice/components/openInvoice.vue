<template>
  <el-dialog
    title="开票"
    v-model="dialogVisible"
    width="500px"
    append-to-body
    class="open-invoice-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="发票号码" prop="code">
        <el-input
          v-model="form.code"
          placeholder="请输入发票号码"
          clearable
        />
      </el-form-item>
      <el-form-item label="开票日期" prop="openTime">
        <el-date-picker
          v-model="form.openTime"
          type="date"
          placeholder="请选择开票日期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="物流单号" prop="delivery">
        <el-input
          v-model="form.delivery"
          placeholder="请输入物流单号(选填)"
          clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">
          确 定
        </el-button>
        <el-button @click="dialogVisible = false">
          取 消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="OpenInvoiceDialog">
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { updateStatus } from "@/api/financial/invoiceMsg";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const currentRow = ref(null);

// 表单数据
const form = reactive({
  code: "",
  openTime: "",
  delivery: ""
});

// 验证规则
const rules = {
  code: [{ required: true, message: "请输入发票号码", trigger: "blur" }],
  openTime: [{ required: true, message: "请选择开票日期", trigger: "change" }]
};

/** 打开对话框 */
function open(row) {
  currentRow.value = row;
  dialogVisible.value = true;

  // 重置表单
  nextTick(() => {
    formRef.value?.resetFields();
  });
}

/** 关闭对话框 */
function handleClose() {
  formRef.value?.resetFields();
  currentRow.value = null;
}

/** 提交 */
function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      const submitData = {
        id: currentRow.value.id,
        openStatus: 1,
        code: form.code,
        openTime: form.openTime,
        delivery: form.delivery
      };

      updateStatus(submitData).then(() => {
        proxy.$modal.msgSuccess("开票成功");
        dialogVisible.value = false;
        emit("success");
      });
    }
  });
}

const emit = defineEmits(["success"]);

defineExpose({
  open
});
</script>

<style scoped>
.open-invoice-dialog .el-dialog {
  max-height: 80vh;
}
</style>