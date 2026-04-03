<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="product-dialog"
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
          <el-form-item label="产品名称" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入产品名称"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品分类" prop="cateId">
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
              placeholder="请选择产品分类"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="产品编码" prop="code">
            <el-input
              v-model="form.code"
              placeholder="请输入产品编码"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品条码" prop="barcode">
            <el-input
              v-model="form.barcode"
              placeholder="请输入商品条码"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="计量单位" prop="unit">
            <el-input
              v-model="form.unit"
              placeholder="请输入计量单位"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌" prop="brand">
            <el-input
              v-model="form.brand"
              placeholder="请输入品牌"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="生产商" prop="producer">
            <el-input
              v-model="form.producer"
              placeholder="请输入生产商"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存数量" prop="stock">
            <el-input-number
              v-model="form.stock"
              :min="0"
              :precision="0"
              :disabled="isView"
              placeholder="请输入库存数量"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="基础价格" prop="basePrice">
            <el-input-number
              v-model="form.basePrice"
              :min="0"
              :precision="2"
              :disabled="isView"
              placeholder="请输入基础价格"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="采购价格" prop="purchasePrice">
            <el-input-number
              v-model="form.purchasePrice"
              :min="0"
              :precision="2"
              :disabled="isView"
              placeholder="请输入采购价格"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售价格" prop="salePrice">
            <el-input-number
              v-model="form.salePrice"
              :min="0"
              :precision="2"
              :disabled="isView"
              placeholder="请输入销售价格"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="产品描述" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="4"
              placeholder="请输入产品描述"
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

<script setup name="AddProduct">
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import { addProduct, updateProduct } from "@/api/base/contract/product/index.js";
import { getTree } from "@/api/base/contract/productClassify";

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
  barcode: "",
  unit: "",
  brand: "",
  producer: "",
  basePrice: 0,
  purchasePrice: 0,
  salePrice: 0,
  content: "",
  stock: 0,
  status: 1,
});

// 产品分类选项
const categoryOptions = ref([]);

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看产品";
  return isEdit.value ? "编辑产品" : "新增产品";
});

const rules = {
  title: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
  cateId: [{ required: true, message: "请选择产品分类", trigger: "change" }],
  code: [{ required: true, message: "请输入产品编码", trigger: "blur" }],
  unit: [{ required: true, message: "请输入计量单位", trigger: "blur" }],
  basePrice: [{ required: true, message: "请输入基础价格", trigger: "blur" }],
  purchasePrice: [
    { required: true, message: "请输入采购价格", trigger: "blur" },
  ],
  salePrice: [{ required: true, message: "请输入销售价格", trigger: "blur" }],
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
  form.barcode = "";
  form.unit = "";
  form.brand = "";
  form.producer = "";
  form.basePrice = 0;
  form.purchasePrice = 0;
  form.salePrice = 0;
  form.content = "";
  form.stock = 0;
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
    barcode: data.barcode || "",
    unit: data.unit || "",
    brand: data.brand || "",
    producer: data.producer || "",
    basePrice: data.basePrice || 0,
    purchasePrice: data.purchasePrice || 0,
    salePrice: data.salePrice || 0,
    content: data.content || "",
    stock: data.stock || 0,
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
    barcode: data.barcode || "",
    unit: data.unit || "",
    brand: data.brand || "",
    producer: data.producer || "",
    basePrice: data.basePrice || 0,
    purchasePrice: data.purchasePrice || 0,
    salePrice: data.salePrice || 0,
    content: data.content || "",
    stock: data.stock || 0,
    status: data.status ?? 1,
  });

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? updateProduct : addProduct;
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
.product-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.product-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}

/* 级联选择器下拉框 z-index */
.product-dialog .el-cascader-panel {
  z-index: 9999 !important;
}
</style>
