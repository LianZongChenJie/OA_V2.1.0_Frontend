<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="message-module-dialog"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
      <el-divider  class="divider" content-position="left">基础信息</el-divider>
      <el-form-item label="模板名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入模板名称" />
      </el-form-item>
      <el-form-item label="模版标识" prop="name">
        <el-input v-model="form.name" placeholder="请输入模版标识" />
      </el-form-item>
      <el-form-item label="消息类型" prop="types">
        <el-radio-group v-model="form.types">
          <el-radio
            v-for="item in message_module_types"
            :key="item.value"
            :value="parseInt(item.value)"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="消息链接" prop="msgLink">
        <el-input v-model="form.msgLink" placeholder="请输入消息链接" />
      </el-form-item>
      <div v-if="form.types === 1">
        <el-form-item label="模板标题" prop="msgTitle0">
          <el-input
            v-model="form.msgTitle0"
            placeholder="请输入审批中的消息模板标题"
          />
        </el-form-item>
        <el-form-item label="模板内容" prop="msgContent0">
          <el-input
            v-model="form.msgContent0"
            type="textarea"
            :rows="4"
            placeholder="请输入审批中的消息模板内容"
          />
        </el-form-item>
      </div>
      <div v-if="form.types === 2">
        <el-divider class="divider" content-position="left"
          >审批中的消息模板</el-divider
        >
        <el-form-item label="模板标题" prop="msgTitle0">
          <el-input
            v-model="form.msgTitle0"
            placeholder="请输入审批中的消息模板标题"
          />
        </el-form-item>
        <el-form-item label="模板内容" prop="msgContent0">
          <el-input
            v-model="form.msgContent0"
            type="textarea"
            :rows="4"
            placeholder="请输入审批中的消息模板内容"
          />
        </el-form-item>

        <el-divider class="divider" content-position="left"
          >审批通过的消息模板</el-divider
        >
        <el-form-item label="模板标题" prop="msgTitle1">
          <el-input
            v-model="form.msgTitle1"
            placeholder="请输入审批通过的消息模板标题"
          />
        </el-form-item>
        <el-form-item label="模板内容" prop="msgContent1">
          <el-input
            v-model="form.msgContent1"
            type="textarea"
            :rows="4"
            placeholder="请输入审批通过的消息模板内容"
          />
        </el-form-item>
        <el-divider class="divider" content-position="left"
          >审批拒绝的消息模板</el-divider
        >
        <el-form-item label="模板标题" prop="msgTitle2">
          <el-input
            v-model="form.msgTitle2"
            placeholder="请输入审批拒绝的消息模板标题"
          />
        </el-form-item>
        <el-form-item label="模板内容" prop="msgContent2">
          <el-input
            v-model="form.msgContent2"
            type="textarea"
            :rows="4"
            placeholder="请输入审批拒绝的消息模板内容"
          />
        </el-form-item>
        <el-divider class="divider" content-position="left"
          >通过抄送人的消息模板</el-divider
        >
        <el-form-item label="模板标题" prop="msgTitle3">
          <el-input
            v-model="form.msgTitle3"
            placeholder="请输入通过抄送人的消息模板标题"
          />
        </el-form-item>
        <el-form-item label="模板内容" prop="msgContent3">
          <el-input
            v-model="form.msgContent3"
            type="textarea"
            :rows="4"
            placeholder="请输入通过抄送人的消息模板内容"
          />
        </el-form-item>
      </div>
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
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { addMessageModule, updateMessageModule } from "@/api/base/common/messageModule/index.js";

const { proxy } = getCurrentInstance();
const { message_module_types } = proxy.useDict("message_module_types");

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式

const form = reactive({
  id: undefined,
  title: "",
  name: "",
  types: 1,
  remark: "",
  msgLink: "",
  msgTitle0: "",
  msgContent0: "",
  msgTitle1: "",
  msgContent1: "",
  msgTitle2: "",
  msgContent2: "",
  msgTitle3: "",
  msgContent3: "",
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑消息模版" : "新增消息模版";
});

const rules = {
  title: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
  name: [{ required: true, message: "请输入模版标识", trigger: "blur" }],
  types: [{ required: true, message: "请选择消息类型", trigger: "change" }],
  msgTitle0: [
    { required: true, message: "请输入审批中的消息模板标题", trigger: "blur" },
  ],
  msgContent0: [
    { required: true, message: "请输入审批中的消息模板内容", trigger: "blur" },
  ],
  msgTitle1: [
    {
      required: true,
      message: "请输入审批通过的消息模板标题",
      trigger: "blur",
    },
  ],
  msgContent1: [
    {
      required: true,
      message: "请输入审批通过的消息模板内容",
      trigger: "blur",
    },
  ],
  msgTitle2: [
    {
      required: true,
      message: "请输入审批拒绝的消息模板标题",
      trigger: "blur",
    },
  ],
  msgContent2: [
    {
      required: true,
      message: "请输入审批拒绝的消息模板内容",
      trigger: "blur",
    },
  ],
  msgTitle3: [
    {
      required: true,
      message: "请输入通过抄送人的消息模板标题",
      trigger: "blur",
    },
  ],
  msgContent3: [
    {
      required: true,
      message: "请输入通过抄送人的消息模板内容",
      trigger: "blur",
    },
  ],
};

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.title = "";
  form.name = "";
  form.types = 1;
  form.remark = "";
  form.msgLink = "";
  form.msgTitle0 = "";
  form.msgContent0 = "";
  form.msgTitle1 = "";
  form.msgContent1 = "";
  form.msgTitle2 = "";
  form.msgContent2 = "";
  form.msgTitle3 = "";
  form.msgContent3 = "";
  isEdit.value = false;
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
  form.name = data.name;
  form.types = data.types;
  form.remark = data.remark || "";
  form.msgLink = data.msgLink || "";
  form.msgTitle0 = data.msgTitle0 || "";
  form.msgContent0 = data.msgContent0 || "";
  form.msgTitle1 = data.msgTitle1 || "";
  form.msgContent1 = data.msgContent1 || "";
  form.msgTitle2 = data.msgTitle2 || "";
  form.msgContent2 = data.msgContent2 || "";
  form.msgTitle3 = data.msgTitle3 || "";
  form.msgContent3 = data.msgContent3 || "";

  isEdit.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? updateMessageModule : addMessageModule;
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
});
</script>

<style scoped>
.divider {
  margin: 40px 0;
  font-weight: bold;
}
</style>

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
.message-module-dialog.el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.message-module-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>
