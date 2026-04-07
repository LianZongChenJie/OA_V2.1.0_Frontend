<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="procurement-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="采购品名称" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入采购品名称"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购品分类" prop="cateId">
            <el-cascader
              v-model="form.cateId"
              :options="categoryOptions"
              :props="{
                value: 'id',
                label: 'title',
                children: 'children',
                checkStrictly: true,
                emitPath: false,
              }"
              :disabled="isView"
              placeholder="请选择采购品分类"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="采购品编码" prop="code">
            <el-input
              v-model="form.code"
              placeholder="请输入采购品编码"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计量单位" prop="unit">
            <el-input
              v-model="form.unit"
              placeholder="请输入计量单位"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="规格" prop="specs">
            <el-input
              v-model="form.specs"
              placeholder="请输入规格"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购价(元)" prop="purchasePrice">
            <el-input-number
              v-model="form.purchasePrice"
              :min="0"
              :precision="2"
              :disabled="isView"
              placeholder="请输入采购价"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否实物" prop="isObject">
            <el-select
              v-model="form.isObject"
              :disabled="isView"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="采购品描述" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="4"
              placeholder="请输入采购品描述"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false">{{
          isView ? "关 闭" : "取 消"
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="addProcurement">
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import { addProcurement, updateProcurement } from "@/api/base/contract/procurement/index.js";
import { getTree } from "@/api/base/contract/procurementClassify";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const isView = ref(false); // 是否为查看模式

const form = reactive({
  id: undefined,
  title: "",
  cateId: null,
  code: "",
  unit: "",
  specs: "",
  purchasePrice: 0,
  content: "",
  isObject: 1,
  status: 1,
});

// 产品分类选项
const categoryOptions = ref([]);

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看采购品";
  return isEdit.value ? "编辑采购品" : "新增采购品";
});

const rules = {
  title: [{ required: true, message: "请输入采购品名称", trigger: "blur" }],
  cateId: [{ required: true, message: "请选择采购品分类", trigger: "change" }],
  code: [{ required: true, message: "请输入采购品编码", trigger: "blur" }],
  unit: [{ required: true, message: "请输入计量单位", trigger: "blur" }],
  purchasePrice: [
    { required: true, message: "请输入采购价", trigger: "blur" },
  ],
};

/** 获取产品分类树 */
function getCategoryTree() {
  getTree().then((res) => {
    categoryOptions.value = res.data || [];
  });
}

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.title = "";
  form.cateId = null;
  form.code = "";
  form.unit = "";
  form.specs = "";
  form.purchasePrice = 0;
  form.content = "";
  form.isObject = 1;
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
  // 填充表单数据
  Object.assign(form, {
    id: data.id,
    title: data.title || "",
    cateId: data.cateId || null,
    code: data.code || "",
    unit: data.unit || "",
    specs: data.specs || "",
    purchasePrice: data.purchasePrice || 0,
    content: data.content || "",
    isObject: data.isObject ?? 1,
    status: data.status ?? 1,
  });

  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  // 填充表单数据
  Object.assign(form, {
    id: data.id,
    title: data.title || "",
    cateId: data.cateId || null,
    code: data.code || "",
    unit: data.unit || "",
    specs: data.specs || "",
    purchasePrice: data.purchasePrice || 0,
    content: data.content || "",
    isObject: data.isObject ?? 1,
    status: data.status ?? 1,
  });

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? updateProcurement : addProcurement;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      apiMethod(form).then(() => {
        proxy.$modal.msgSuccess(successMsg);
        dialogVisible.value = false;
        emit("success");
      });
    }
  });
}

/** 初始化数据 */
onMounted(() => {
  getCategoryTree();
});

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
.procurement-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.procurement-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}

/* 级联选择器下拉框 z-index */
.procurement-dialog .el-cascader-panel {
  z-index: 9999 !important;
}
</style>
