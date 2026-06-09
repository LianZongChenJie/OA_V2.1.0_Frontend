<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="700px"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" :disabled="isView" placeholder="请输入姓名" style="width: 100%" />
      </el-form-item>

      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio :label="'0'">男</el-radio>
          <el-radio :label="'1'">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="所在城市" prop="city">
        <el-cascader
          ref="cascaderRef"
          v-model="cityCascaderValue"
          :props="cascaderProps"
          :disabled="isView"
          placeholder="请选择所在城市"
          clearable
          style="width: 100%"
          @change="handleCityChange"
        />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input 
          v-model="form.phone" 
          :disabled="isView" 
          placeholder="请输入11位手机号" 
          maxlength="11"
          style="width: 100%" 
        />
      </el-form-item>

      <el-form-item label="身份证号" prop="idcard">
        <el-input 
          v-model="form.idcard" 
          :disabled="isView" 
          placeholder="请输入18位身份证号" 
          maxlength="18"
          style="width: 100%" 
        />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" :disabled="isView" placeholder="请输入邮箱" style="width: 100%" />
      </el-form-item>

      <el-form-item label="归属部门" prop="deptId">
        <el-cascader
          v-model="form.deptId"
          :disabled="isView"
          placeholder="请选择归属部门"
          clearable
          style="width: 100%"
          :props="deptProps"
        />
      </el-form-item>

      <el-form-item label="简历附件" prop="attachments">
        <UploadAttachmentList
          v-model="form.attachments"
          :disabled="isView"
          :limit="5"
          action="employee/care/upload"
          @downloadApi="downFiles"
        />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          :disabled="isView"
          type="textarea"
          :rows="4"
          placeholder="请输入备注"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer" style="text-align:right">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">立即提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddResumeDialog">
import { ref, reactive, computed, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { getThreeList } from "@/api/base/common/division";
import { addDeptChange, updateDeptChange } from "@/api/personnel/resume/index.js";
import UploadAttachmentList from "@/components/UploadAttachmentList/index.vue";
import { downloadFile } from "@/utils/download";
import { getCurrentInstance } from "vue";
import { listDept } from "@/api/system/dept.js";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["success"]);

const dialogVisible = ref(false);
const formRef = ref(null);
const cascaderRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 城市级联选择器的值（数组格式）
const cityCascaderValue = ref([]);

// 部门选项
const deptOptions = ref([]);

const form = reactive({
  id: undefined,
  name: "",
  sex: "0",
  phone: "",
  idcard: "",
  email: "",
  city: "",  // 存储城市名称字符串，如 "北京市,北京市,西城区"
  deptId: "", // 归属部门ID
  remark: "",
  attachments: [],
});

const dialogTitle = computed(() => {
  return isView.value ? "查看简历" : isEdit.value ? "编辑简历" : "新增简历";
});

// 部门级联配置
const deptProps = {
  value: "id",
  label: "label",
  children: "children",
  checkStrictly: true,
  emitPath: false  // 只返回最后一级的ID
};

// 加载部门树
async function loadDeptTree() {
  try {
    const res = await listDept();
    if (res.code === 200) {
      deptOptions.value = res.data || [];
    }
  } catch (error) {
    console.error("加载部门失败:", error);
  }
}

// 手机号校验规则
const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入手机号"));
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};

// 身份证号校验规则
const validateIdCard = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入身份证号"));
  } else if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
    callback(new Error("请输入正确的18位身份证号码"));
  } else {
    callback();
  }
};

const rules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  phone: [
    { required: true, validator: validatePhone, trigger: "blur" }
  ],
  idcard: [
    { required: true, validator: validateIdCard, trigger: "blur" }
  ],
  city: [{ required: true, message: "请选择所在城市", trigger: "change" }],
  deptId: [{ required: true, message: "请选择归属部门", trigger: "change" }],
  email: [
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ]
};

// 城市级联配置
const cascaderProps = {
  value: "id",
  label: "name",
  children: "children",
  checkStrictly: true,
  emitPath: true,
  lazy: true,
  lazyLoad(node, resolve) {
    const params = node.level === 0 ? { pid: 0 } : { pid: node.data.id };
    getThreeList(params).then(res => {
      const nodes = (res.data || []).map(item => ({
        ...item,
        leaf: item.hasChildren === false || item.level >= 3,
      }));
      resolve(nodes);
    });
  },
};

// 城市选择变化
function handleCityChange(values) {
  const nodes = cascaderRef.value?.getCheckedNodes();
  if (nodes && nodes.length > 0) {
    const node = nodes[0];
    // 存储完整路径名称，用逗号分隔
    form.city = node.pathLabels ? node.pathLabels.join(",") : node.label || "";
  } else {
    form.city = "";
  }
}

// 重置表单
function reset() {
  form.id = undefined;
  form.name = "";
  form.sex = "0";
  form.phone = "";
  form.idcard = "";
  form.email = "";
  form.city = "";
  form.deptId = "";
  form.remark = "";
  form.attachments = [];
  cityCascaderValue.value = [];
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate?.();
}

// 关闭
function handleClose() {
  dialogVisible.value = false;
  reset();
}

// 打开新增
function open() {
  reset();
  dialogVisible.value = true;
}

// 字符串转数组（用于城市回显）
function parseCityToArray(cityStr) {
  if (!cityStr) return [];
  if (typeof cityStr === "string" && cityStr.includes(",")) {
    return cityStr.split(",");
  }
  return cityStr ? [cityStr] : [];
}

// 编辑
async function openEdit(data) {
  reset();
  
  // 复制数据
  Object.assign(form, {
    id: data.id,
    name: data.name || "",
    sex: data.sex || "0",
    phone: data.phone || "",
    idcard: data.idcard || "",
    email: data.email || "",
    city: data.city || "",
    deptId: data.deptId || "",
    remark: data.remark || "",
    attachments: data.attachments || []
  });
  
  // 设置城市级联选择器的值（需要数组格式）
  cityCascaderValue.value = parseCityToArray(data.city);
  
  isEdit.value = true;
  dialogVisible.value = true;
  
  // 等待弹窗渲染完成后刷新级联组件
  await nextTick();
}

// 查看
async function openView(data) {
  reset();
  
  Object.assign(form, {
    id: data.id,
    name: data.name || "",
    sex: data.sex || "0",
    phone: data.phone || "",
    idcard: data.idcard || "",
    email: data.email || "",
    city: data.city || "",
    deptId: data.deptId || "",
    remark: data.remark || "",
    attachments: data.attachments || []
  });
  
  cityCascaderValue.value = parseCityToArray(data.city);
  
  isView.value = true;
  dialogVisible.value = true;
  
  await nextTick();
}

// 提交
async function handleSubmit() {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  // 构建提交数据
  const submitData = {
    name: form.name,
    sex: form.sex,
    phone: form.phone,
    idcard: form.idcard,
    email: form.email || "",
    city: form.city,
    deptId: form.deptId,
    remark: form.remark || "",
    attachments: form.attachments || []
  };

  // 编辑时加上 id
  if (isEdit.value && form.id) {
    submitData.id = form.id;
  }

  console.log("提交数据:", submitData);

  try {
    if (isEdit.value) {
      await updateDeptChange(submitData);
    } else {
      await addDeptChange(submitData);
    }
    ElMessage.success(isEdit.value ? "编辑成功" : "新增成功");
    dialogVisible.value = false;
    emit("success");
  } catch (err) {
    console.error("提交失败", err);
    ElMessage.error(err.message || "操作失败");
  }
}

// 文件下载
const downFiles = (file) => {
  if (!file.id) {
    proxy.$modal.msgWarning("文件ID不存在");
    return;
  }
  const baseUrl = import.meta.env.VITE_APP_BASE_API || "";
  const url = baseUrl + `/employee/care/download/${file.id}`;
  downloadFile(url, file.fileName || file.name || "简历文件").catch(() => {
    proxy.$modal.msgError("下载失败");
  });
};

// 加载部门树
loadDeptTree();

defineExpose({ open, openEdit, openView });
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>