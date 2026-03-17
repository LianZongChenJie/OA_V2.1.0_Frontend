<template>
  <el-dialog
    title="新增消息模版"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="模板名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入模板名称" />
      </el-form-item>
      <el-form-item label="模版标识" prop="name">
        <el-input v-model="form.name" placeholder="请输入模版标识" />
      </el-form-item>
      <el-form-item label="消息类型" prop="types">
        <el-radio-group v-model="form.types">
          <el-radio :value="1">普通消息</el-radio>
          <el-radio :value="2">审批消息</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="消息链接" prop="msgLink">
        <el-input v-model="form.msgLink" placeholder="请输入消息链接" />
      </el-form-item>
      <el-form-item label="模版标题" prop="msgTitle0">
        <el-input v-model="form.msgTitle0" placeholder="请输入模版标题" />
      </el-form-item>
      <el-form-item label="模版内容" prop="msgContent0">
        <el-input
          v-model="form.msgContent0"
          type="textarea"
          :rows="4"
          placeholder="请输入模版内容"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="2"
          placeholder="请输入备注"
        />
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

<script setup name="AddMessageModule">
import { ref, reactive, getCurrentInstance } from "vue";
import { addMessageModule } from "@/api/base/common/messageModule/index.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);

const form = reactive({
  title: "",
  name: "",
  types: 1,
  remark: "",
  msgLink: "",
  msgTitle0: "",
  msgContent0: "",
});

const rules = {
  title: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
  name: [{ required: true, message: "请输入模版标识", trigger: "blur" }],
  types: [{ required: true, message: "请选择消息类型", trigger: "change" }],
  msgTitle0: [{ required: true, message: "请输入模版标题", trigger: "blur" }],
  msgContent0: [{ required: true, message: "请输入模版内容", trigger: "blur" }],
};

/** 表单重置 */
function reset() {
  form.title = "";
  form.name = "";
  form.types = 1;
  form.remark = "";
  form.msgLink = "";
  form.msgTitle0 = "";
  form.msgContent0 = "";
  proxy.resetForm("formRef");
}

/** 关闭弹窗 */
function handleClose() {
  reset();
}

/** 显示弹窗 */
function open() {
  reset();
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      addMessageModule(form).then(() => {
        proxy.$modal.msgSuccess("新增成功");
        dialogVisible.value = false;
        emit("success");
      });
    }
  });
}

const emit = defineEmits(["success"]);

defineExpose({
  open,
});
</script>

<style scoped>
</style>
