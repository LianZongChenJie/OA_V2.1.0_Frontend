<template>
  <el-dialog
    title="设置状态"
    v-model="dialogVisible"
    width="400px"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" label-width="80px">
      <el-form-item label="资产状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio
            v-for="item in assets_status"
            :key="item.value"
            :label="parseInt(item.value)"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="statusDialog">
import { ref, reactive, getCurrentInstance } from "vue";
import { updateStatus } from "@/api/administration/fixedAssets/info/index.js";

const { proxy } = getCurrentInstance();
const { assets_status } = proxy.useDict("assets_status");

const dialogVisible = ref(false);
const formRef = ref(null);

const form = reactive({
  id: undefined,
  status: undefined,
});

/** 打开弹窗 */
function open(row) {
  form.id = row.id;
  form.status = row.status;
  dialogVisible.value = true;
}

/** 关闭弹窗 */
function handleClose() {
  form.id = undefined;
  form.status = undefined;
  formRef.value?.clearValidate();
}

/** 提交 */
async function handleSubmit() {
  if (form.status === undefined) {
    proxy.$modal.msgWarning("请选择状态");
    return;
  }

  const res = await updateStatus({ id: form.id, status: form.status });
  if (res) {
    proxy.$modal.msgSuccess("设置成功");
    dialogVisible.value = false;
    emit("success");
  }
}

const emit = defineEmits(["success"]);

defineExpose({
  open,
});
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
