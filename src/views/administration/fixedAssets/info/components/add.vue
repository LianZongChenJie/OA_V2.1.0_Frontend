<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="80%"
    append-to-body
    class="fixed-asset-dialog"
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
          <el-form-item label="资产名称" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入资产名称"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资产编码" prop="code">
            <el-input
              v-model="form.code"
              placeholder="请输入资产编码"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="资产型号" prop="model">
            <el-input
              v-model="form.model"
              placeholder="请输入资产型号"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资产分类" prop="cateId">
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
              placeholder="请选择资产分类"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="资产品牌" prop="brandId">
            <el-select
              v-model="form.brandId"
              filterable
              :disabled="isView"
              placeholder="请选择资产品牌"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in brandOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计量单位" prop="unitId">
            <el-select
              v-model="form.unitId"
              :disabled="isView"
              placeholder="请选择计量单位"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in unitOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="质保到期日" prop="qualityTime">
            <el-date-picker
              v-model="form.qualityTime"
              type="date"
              :disabled="isView"
              placeholder="请选择质保到期日"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="购买价格" prop="price">
            <el-input-number
              v-model="form.price"
              :min="0"
              :precision="2"
              :disabled="isView"
              placeholder="请输入购买价格"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="购买日期" prop="buyTime">
            <el-date-picker
              v-model="form.buyTime"
              type="date"
              :disabled="isView"
              placeholder="请选择购买日期"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年折旧率%" prop="rate">
            <el-input-number
              v-model="form.rate"
              :min="0"
              :max="100"
              :precision="2"
              :disabled="isView"
              placeholder="请输入年折旧率"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="使用人员" prop="userIds">
            <el-select
              v-model="form.userIds"
              multiple
              :disabled="isView"
              placeholder="请选择使用人员"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName || item.userName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用部门" prop="userDids">
            <el-select
              v-model="form.userDids"
              multiple
              :disabled="isView"
              placeholder="请选择使用部门"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in deptOptions"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="资产状态" prop="status">
            <el-select
              v-model="form.status"
              :disabled="isView"
              placeholder="请选择资产状态"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="parseInt(item.dictValue)"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资产来源" prop="source">
            <el-select
              v-model="form.source"
              :disabled="isView"
              placeholder="请选择资产来源"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in sourceOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="parseInt(item.dictValue)"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="放置地址" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入放置地址"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="资产描述" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="4"
              placeholder="请输入资产描述"
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

<script setup name="addFixedAsset">
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import { add, edit } from "@/api/administration/fixedAssets/info/index.js";
import { getTree } from "@/api/base/administration/assetClassfiy/index.js";
import { getPageList as getBrandList } from "@/api/base/administration/assetBrand/index.js";
import { getPageList as getUnitList } from "@/api/base/administration/assetUnit/index.js";
import { listUser } from "@/api/system/user";
import { listDept } from "@/api/system/dept";
import { getDicts } from "@/api/system/dict/data.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const isView = ref(false); // 是否为查看模式

const form = reactive({
  id: undefined,
  title: "",
  code: "",
  model: "",
  cateId: null,
  brandId: null,
  qualityTime: "",
  unitId: null,
  userIds: [],
  userDids: [],
  price: null,
  buyTime: "",
  rate: null,
  status: 1,
  source: null,
  content: "",
  address: "",
});

// 产品分类选项
const categoryOptions = ref([]);

// 资产品牌选项
const brandOptions = ref([]);

// 计量单位选项
const unitOptions = ref([]);

// 使用人员选项
const userOptions = ref([]);

// 使用部门选项
const deptOptions = ref([]);

// 资产状态选项
const statusOptions = ref([]);

// 资产来源选项
const sourceOptions = ref([]);

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看资产";
  return isEdit.value ? "编辑资产" : "新增资产";
});

const rules = {
  title: [{ required: true, message: "请输入资产名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入资产编码", trigger: "blur" }],
  model: [{ required: true, message: "请输入资产型号", trigger: "blur" }],
  cateId: [{ required: true, message: "请选择资产分类", trigger: "change" }],
  brandId: [{ required: true, message: "请选择资产品牌", trigger: "change" }],
  qualityTime: [{ required: true, message: "请选择质保到期日", trigger: "change" }],
  unitId: [{ required: true, message: "请选择计量单位", trigger: "change" }],
  price: [{ required: true, message: "请输入购买价格", trigger: "blur" }],
  buyTime: [{ required: true, message: "请选择购买日期", trigger: "change" }],
  rate: [{ required: true, message: "请输入年折旧率", trigger: "blur" }],
  status: [{ required: true, message: "请选择资产状态", trigger: "change" }],
  source: [{ required: true, message: "请选择资产来源", trigger: "change" }],
};

/** 获取产品分类树 */
function getCategoryTree() {
  getTree().then((res) => {
    categoryOptions.value = res.data || [];
  });
}

/** 获取资产品牌列表 */
function getBrandListData() {
  getBrandList({ pageNum: 1, pageSize: 1000 }).then((res) => {
    brandOptions.value = res.rows || [];
  });
}

/** 获取计量单位列表 */
function getUnitListData() {
  getUnitList({ pageNum: 1, pageSize: 1000 }).then((res) => {
    unitOptions.value = res.rows || [];
  });
}

/** 获取使用人员列表 */
function getUserListData() {
  listUser({ pageNum: 1, pageSize: 1000 }).then((res) => {
    userOptions.value = res.rows || [];
  });
}

/** 获取使用部门列表 */
function getDeptListData() {
  listDept({ pageNum: 1, pageSize: 1000 }).then((res) => {
    // 部门数据可能是树形结构，需要转换为扁平数组
    const deptData = res.data || [];
    deptOptions.value = flattenTree(deptData);
  });
}

/** 将树形数据转换为扁平数组 */
function flattenTree(tree, result = []) {
  if (!Array.isArray(tree)) return result;
  tree.forEach(node => {
    result.push(node);
    if (node.children && node.children.length > 0) {
      flattenTree(node.children, result);
    }
  });
  return result;
}

/** 获取数据字典 - 资产状态 */
function getDictStatus() {
  getDicts("assets_status").then((response) => {
    statusOptions.value = response.data || [];
  });
}

/** 获取数据字典 - 资产来源 */
function getDictSource() {
  getDicts("assets_source").then((response) => {
    sourceOptions.value = response.data || [];
  });
}

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.title = "";
  form.code = "";
  form.model = "";
  form.cateId = null;
  form.brandId = null;
  form.qualityTime = "";
  form.unitId = null;
  form.userIds = [];
  form.userDids = [];
  form.price = null;
  form.buyTime = "";
  form.rate = null;
  form.status = 1;
  form.source = null;
  form.content = "";
  form.address = "";

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
    code: data.code || "",
    model: data.model || "",
    cateId: data.cateId || null,
    brandId: data.brandId || null,
    qualityTime: data.qualityTime || "",
    unitId: data.unitId || null,
    userIds: data.userIds ? (Array.isArray(data.userIds) ? data.userIds : data.userIds.split(',')) : [],
    userDids: data.userDids ? (Array.isArray(data.userDids) ? data.userDids : data.userDids.split(',')) : [],
    price: data.price || null,
    buyTime: data.buyTime || "",
    rate: data.rate || null,
    status: data.status ?? 1,
    source: data.source || null,
    content: data.content || "",
    address: data.address || "",
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
    code: data.code || "",
    model: data.model || "",
    cateId: data.cateId || null,
    brandId: data.brandId || null,
    qualityTime: data.qualityTime || "",
    unitId: data.unitId || null,
    userIds: data.userIds ? (Array.isArray(data.userIds) ? data.userIds : data.userIds.split(',')) : [],
    userDids: data.userDids ? (Array.isArray(data.userDids) ? data.userDids : data.userDids.split(',')) : [],
    price: data.price || null,
    buyTime: data.buyTime || "",
    rate: data.rate || null,
    status: data.status ?? 1,
    source: data.source || null,
    content: data.content || "",
    address: data.address || "",
  });

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? edit : add;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      // 格式化日期函数
      const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // 将数组转换为逗号分隔的字符串，并格式化日期
      const submitData = {
        ...form,
        userIds: Array.isArray(form.userIds) ? form.userIds.join(',') : form.userIds,
        userDids: Array.isArray(form.userDids) ? form.userDids.join(',') : form.userDids,
        buyTime: formatDate(form.buyTime),
        qualityTime: formatDate(form.qualityTime)
      };

      apiMethod(submitData).then(() => {
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
  getBrandListData();
  getUnitListData();
  getUserListData();
  getDeptListData();
  getDictStatus();
  getDictSource();
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
.fixed-asset-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.fixed-asset-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}

/* 级联选择器下拉框 z-index */
.fixed-asset-dialog .el-cascader-panel {
  z-index: 9999 !important;
}
</style>
