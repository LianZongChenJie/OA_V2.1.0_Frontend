<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="form.name"
              :disabled="isView"
              placeholder="请输入姓名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input
              v-model="form.age"
              :disabled="isView"
              placeholder="请输入年龄"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别">
            <el-radio-group v-model="form.sex">
              <el-radio :label="'0'">男</el-radio>
              <el-radio :label="'1'">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="form.phone"
              :disabled="isView"
              placeholder="请输入11位手机号"
              maxlength="11"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idcard">
            <el-input
              v-model="form.idcard"
              :disabled="isView"
              placeholder="请输入18位身份证号"
              maxlength="18"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="form.email"
              :disabled="isView"
              placeholder="请输入邮箱"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所在城市" prop="city">
            <CityCascader
              ref="cascaderRef"
              v-model="cityCascaderValue"
              :disabled="isView"
              @city-change="handleCityChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最高学历" prop="education">
            <el-select
              v-model="form.education"
              :disabled="isView"
              placeholder="请选择最高学历"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="dict in highest_degree"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="毕业院校" prop="graduateSchool">
            <el-input
              v-model="form.graduateSchool"
              :disabled="isView"
              placeholder="请输入毕业院校"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="毕业年份" prop="graduateYear">
            <el-date-picker
              v-model="form.graduateYear"
              :disabled="isView"
              type="year"
              placeholder="选择毕业年份"
              value-format="YYYY"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
      <el-form-item label="简历附件" prop="attachments">
        <UploadAttachmentList
          v-model="form.attachments"
          :disabled="isView"
          :limit="5"
          accept=".pdf,.doc,.docx"
          action="resume/parse"
          @downloadApi="downFiles"
          @uploadSuccess="handleUploadSuccess"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer" style="text-align: right">
        <el-button v-if="!isView" type="primary" @click="handleSubmit"
          >立即提交</el-button
        >
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddResumeDialog">
import { ref, reactive, computed, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { add, update } from "@/api/personnel/resume/index.js";
import UploadAttachmentList from "@/components/UploadAttachmentList/index.vue";
import { downloadFile } from "@/utils/download";
import { getCurrentInstance } from "vue";
import CityCascader from "@/components/CityCascader/index.vue";

const { proxy } = getCurrentInstance();
const { highest_degree } = proxy.useDict("highest_degree");
const emit = defineEmits(["success"]);

const dialogVisible = ref(false);
const formRef = ref(null);
const cascaderRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 城市级联选择器的值（数组格式）
const cityCascaderValue = ref([]);

const form = reactive({
  id: undefined,
  name: "",
  sex: "0",
  phone: "",
  idcard: "",
  email: "",
  city: "", // 存储城市名称字符串，如 "北京市,北京市,西城区"
  cityId: "",
  age: "",
  entryProjectName: "",
  education: "",
  graduateSchool: "",
  graduateYear: "",
  remark: "",
  attachments: [],
});

const dialogTitle = computed(() => {
  return isView.value ? "查看简历" : isEdit.value ? "编辑简历" : "新增简历";
});

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
  } else if (
    !/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
      value,
    )
  ) {
    callback(new Error("请输入正确的18位身份证号码"));
  } else {
    callback();
  }
};

const rules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
  idcard: [{ required: true, validator: validateIdCard, trigger: "blur" }],
  city: [{ required: true, message: "请选择所在城市", trigger: "change" }],
  age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
  education: [{ required: true, message: "请选择最高学历", trigger: "change" }],
  graduateSchool: [
    { required: true, message: "请输入毕业院校", trigger: "blur" },
  ],
  graduateYear: [
    { required: true, message: "请选择毕业年份", trigger: "change" },
  ],
  email: [{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }],
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
    getThreeList(params).then((res) => {
      const nodes = (res.data || []).map((item) => ({
        ...item,
        leaf: item.hasChildren === false || item.level >= 3,
      }));
      resolve(nodes);
    });
  },
};

// 城市选择变化
function handleCityChange(cityName) {
  // cityName 来自 CityCascader 组件的 @city-change 事件，格式为 "省,市,区"
  form.city = cityName;
  // cityId 保存省市区所有 ID，逗号隔开
  const val = cityCascaderValue.value;
  form.cityId = val && val.length > 0 ? val.join(",") : "";
}

// 简历附件上传成功回调，解析返回的简历信息回填表单
function handleUploadSuccess(data) {
  if (data.age) form.age = form.age?form.age:data.age;
  if (data.email) form.email = form.email?form.email:data.email;
  if (data.graduateSchool) form.graduateSchool =form.graduateSchool?form.graduateSchool:data.graduateSchool;
  if (data.phone) form.phone = form.phone?form.phone:data.phone;
  if (data.sex !== undefined && data.sex !== null) form.sex = form.sex?form.sex:String(data.sex);
  if (data.userName) form.name = form.name?form.name:data.userName;
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
  form.cityId = "";
  form.age = "";
  form.entryProjectName = "";
  form.education = "";
  form.graduateSchool = "";
  form.graduateYear = "";
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
    cityId: data.cityId || "",
    age: data.age || "",
    entryProjectName: data.entryProjectName || "",
    education: data.education || "",
    graduateSchool: data.graduateSchool || "",
    graduateYear: data.graduateYear ? String(data.graduateYear) : "",
    remark: data.remark || "",
    attachments: data.attachments || [],
  });

  isEdit.value = true;
  dialogVisible.value = true;

  await nextTick();
  // 回显城市级联
  setCityCascaderValue();
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
    cityId: data.cityId || "",
    age: data.age || "",
    entryProjectName: data.entryProjectName || "",
    education: data.education || "",
    graduateSchool: data.graduateSchool || "",
    graduateYear: data.graduateYear ? String(data.graduateYear) : "",
    remark: data.remark || "",
    attachments: data.attachments || [],
  });

  isView.value = true;
  dialogVisible.value = true;

  await nextTick();
  // 回显城市级联
  setCityCascaderValue();
}

/** 设置城市级联选择器的回显值 */
function setCityCascaderValue() {
  if (form.cityId) {
    const idArray = String(form.cityId).split(",").map(Number);
    cascaderRef.value?.setPendingCityId(idArray);
    cascaderRef.value?.handleOpened();
  }
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
    cityId: form.cityId,
    age: form.age || "",
    entryProjectName: form.entryProjectName || "",
    education: form.education || "",
    graduateSchool: form.graduateSchool || "",
    graduateYear: form.graduateYear || "",
    remark: form.remark || "",
    attachments: form.attachments || [],
  };

  // 编辑时加上 id
  if (isEdit.value && form.id) {
    submitData.id = form.id;
  }

  console.log("提交数据:", submitData);

  try {
    if (isEdit.value) {
      await update(submitData);
    } else {
      await add(submitData);
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
  const url = baseUrl + `/resume/attachment/download/${file.id}`;
  downloadFile(url, file.fileName || file.name || "下载文件").catch(() => {
    proxy.$modal.msgError("下载失败");
  });
};

defineExpose({ open, openEdit, openView });
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
