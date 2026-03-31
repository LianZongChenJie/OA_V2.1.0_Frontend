  <template>
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="30%"
      append-to-body
      class="approval-module-dialog"
      @close="handleClose"
    >
      <el-form ref="formRef" :model="form" :rules="isView ? {} : rules" label-width="120px">
        <el-form-item label="关怀项目" prop="title">
          <el-input v-model="form.title" placeholder="请输入关怀项目" :disabled="isView" />
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

  <script setup name="AddCareprogram">
  import { ref, reactive, computed, getCurrentInstance } from "vue";
  import { addenterPrise, updateenterPrise } from "@/api/base/hr/careprogram/index.js";

  const { proxy } = getCurrentInstance();

  const dialogVisible = ref(false);
  const formRef = ref(null);
  const isEdit = ref(false); // 是否为编辑模式
  const isView = ref(false); // 是否为查看模式

  const form = reactive({
    id: undefined,
    title: "",
  });

  // 根据模式动态显示标题
  const dialogTitle = computed(() => {
    if (isView.value) return "查看项目";
    return isEdit.value ? "编辑项目" : "新增项目";
  });

  const rules = {
    title: [{ required: true, message: "请输入关怀项目", trigger: "blur" }],
  };

  /** 表单重置 */
  function reset() {
    form.id = undefined;
    form.title = "";

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
    
    isEdit.value = true;
    dialogVisible.value = true;
  }

  /** 显示弹窗 - 查看模式 */
  function openView(data) {
    reset();
    // 填充表单数据
    form.id = data.id;
    form.title = data.title;

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
