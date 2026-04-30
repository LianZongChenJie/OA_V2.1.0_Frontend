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
      <el-form-item label="服务分类" prop="title">
        <el-input 
          v-model="form.title" 
          placeholder="请输入服务分类" 
          :disabled="isView" 
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="费用（元）" prop="price">
        <el-input-number
          v-model="form.price"
          :precision="2"
          :min="0"
          :max="99999999.99"
          :controls="true"
          placeholder="请输入费用"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>
      
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="form.sort"
          placeholder="请输入排序"
          :disabled="isView"
          :min="0"
          :max="9999"
          style="width: 100%"
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

<script setup name="Addservice">
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/base/contract/service/index.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const form = reactive({
  id: undefined,
  title: "",
  price: null,  
  sort: 0,
  status: 1,
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看服务分类";
  return isEdit.value ? "编辑服务分类" : "新增服务分类";
});

// 表单验证规则
const rules = {
  title: [{ required: true, message: "请输入服务分类", trigger: "blur" }],
  price: [
    { required: true, message: "请输入费用", trigger: "blur" },
    { 
      type: "number", 
      message: "费用必须是数字", 
      trigger: "blur" 
    },
    {
      validator: (rule, value, callback) => {
        if (value === null || value === undefined || value === "") {
          callback(new Error("请输入费用"));
        } else if (value < 0) {
          callback(new Error("费用不能小于0"));
        } else if (value > 99999999.99) {
          callback(new Error("费用不能超过99999999.99"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  sort: [
    {
      validator: (rule, value, callback) => {
        if (value === null || value === undefined) {
          callback();
        } else if (value < 0) {
          callback(new Error("排序不能小于0"));
        } else if (value > 9999) {
          callback(new Error("排序不能超过9999"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
};

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.title = "";
  form.price = null; 
  form.sort = 0;
  form.status = 1;

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
  form.id = data.id;
  form.title = data.title || "";
  form.price = data.price !== undefined && data.price !== null ? Number(data.price) : null;
  form.sort = data.sort !== undefined && data.sort !== null ? Number(data.sort) : 0;
  form.status = data.status || 1;
  
  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  // 填充表单数据
  form.id = data.id;
  form.title = data.title || "";
  form.price = data.price !== undefined && data.price !== null ? Number(data.price) : null;
  form.sort = data.sort !== undefined && data.sort !== null ? Number(data.sort) : 0;
  form.status = data.status || 1;

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? updateenterPrise : addenterPrise;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      // 准备提交数据，确保数字类型格式正确
      const submitData = {
        ...form,
        price: form.price !== null && form.price !== undefined ? Number(form.price) : 0,
        sort: form.sort !== null && form.sort !== undefined ? Number(form.sort) : 0
      };

      apiMethod(submitData).then(() => {
        proxy.$modal.msgSuccess(successMsg);
        dialogVisible.value = false;
        emit("success");
      }).catch(error => {
        console.error("提交失败:", error);
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