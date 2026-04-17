<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="120px"
      :validate-on-rule-change="false"
    >
      <!-- 基础信息 -->
      <div class="form-section-title">基础信息</div>

      <!-- 第一行：客户名称 + 客户来源 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客户名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入客户名称"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户来源" prop="sourceId">
            <el-select
              v-model="form.sourceId"
              :disabled="isView"
              placeholder="请选择客户来源"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in channelOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：联系地址 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="联系地址" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入联系地址"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：所属行业 + 客户等级 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属行业" prop="industryId">
            <el-select
              v-model="form.industryId"
              :disabled="isView"
              placeholder="请选择所属行业"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in industryOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户等级" prop="gradeId">
            <el-select
              v-model="form.gradeId"
              :disabled="isView"
              placeholder="请选择客户等级"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in levelOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行：归属员工 + 归属部门 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="归属员工" prop="belongUid">
            <el-select
              v-model="form.belongUid"
              :disabled="isView"
              placeholder="请选择归属员工"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属部门" prop="belongDid">
            <el-select
              v-model="form.belongDid"
              :disabled="isView"
              placeholder="请选择归属部门"
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

      <!-- 第五行：共享员工 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="共享员工" prop="shareIds">
            <el-select
              v-model="form.shareIds"
              :disabled="isView"
              placeholder="请选择共享员工"
              clearable
              multiple
              style="width: 100%"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第六行：客户介绍 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="客户介绍" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="3"
              placeholder="请输入客户介绍"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第七行：备注 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 首要联系人 -->
      <div class="form-section-title">首要联系人</div>

      <!-- 第八行：名称 + 联系电话 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="名称" prop="contactInfo.name">
            <el-input
              v-model="form.contactInfo.name"
              placeholder="请输入名称"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="contactInfo.mobile">
            <el-input
              v-model="form.contactInfo.mobile"
              placeholder="请输入联系电话"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第九行：性别 + 邮箱 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="contactInfo.sex">
            <el-radio-group v-model="form.contactInfo.sex" :disabled="isView">
              <el-radio :label="0">未知</el-radio>
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="contactInfo.email">
            <el-input
              v-model="form.contactInfo.email"
              placeholder="请输入邮箱"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第十行：微信 + QQ -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="微信" prop="contactInfo.wechat">
            <el-input
              v-model="form.contactInfo.wechat"
              placeholder="请输入微信"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="QQ" prop="contactInfo.qq">
            <el-input
              v-model="form.contactInfo.qq"
              placeholder="请输入QQ"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第十一行：网名 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="网名" prop="contactInfo.nickname">
            <el-input
              v-model="form.contactInfo.nickname"
              placeholder="请输入网名"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在部门" prop="contactInfo.department">
            <el-input
              v-model="form.contactInfo.department"
              placeholder="请输入所在部门"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第十二行：所属职位 + 生日 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属职位" prop="contactInfo.position">
            <el-input
              v-model="form.contactInfo.position"
              placeholder="请输入所属职位"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生日" prop="contactInfo.birthday">
            <el-date-picker
              v-model="form.contactInfo.birthday"
              type="date"
              placeholder="请选择生日"
              :disabled="isView"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第十三行：所属区域 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="所属区域" prop="contactInfo.address">
            <el-input
              v-model="form.contactInfo.address"
              placeholder="请输入所属区域"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">
          确 定
        </el-button>
        <el-button @click="dialogVisible = false">
          {{ isView ? "关 闭" : "取 消" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddCustomer">
import { ref, reactive, computed, getCurrentInstance, onMounted, nextTick } from "vue";
import { add, edit } from "@/api/customer/list";
import { listDept } from "@/api/system/dept.js";
import { listUser } from "@/api/system/user.js";
import { getPageList as getCustomerLevelList } from "@/api/base/customer/level";
import { getPageList as getChannelPageList } from "@/api/base/customer/channel";
import { getPageList as getIndustryTypePageList } from "@/api/base/customer/industryType";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 下拉选项数据
const deptOptions = ref([]);
const userOptions = ref([]);
const levelOptions = ref([]);
const channelOptions = ref([]);
const industryOptions = ref([]);

const form = reactive({
  id: undefined,
  name: "",
  sourceId: "",
  address: "",
  industryId: "",
  gradeId: "",
  belongUid: "",
  belongDid: "",
  shareIds: [],
  content: "",
  remark: "",
  customerStatus: 1,
  intentStatus: "D",
  contactInfo: {
    name: "",
    mobile: "",
    sex: 0,
    email: "",
    wechat: "",
    qq: "",
    nickname: "",
    department: "",
    position: "",
    birthday: "",
    address: "",
  },
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看客户";
  return isEdit.value ? "编辑客户" : "新增客户";
});

// 手机号校验
const validateMobile = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入联系电话"));
  } else {
    const reg = /^1[3-9]\d{9}$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的手机号格式"));
    } else {
      callback();
    }
  }
};

// 邮箱校验
const validateEmail = (rule, value, callback) => {
  if (value) {
    const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的邮箱格式"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const rules = {
  name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
  sourceId: [{ required: true, message: "请选择客户来源", trigger: "change" }],
  address: [{ required: true, message: "请输入联系地址", trigger: "blur" }],
  industryId: [{ required: true, message: "请选择所属行业", trigger: "change" }],
  gradeId: [{ required: true, message: "请选择客户等级", trigger: "change" }],
  content: [{ required: true, message: "请输入客户介绍", trigger: "blur" }],
  "contactInfo.name": [{ required: true, message: "请输入名称", trigger: "blur" }],
  "contactInfo.mobile": [
    { required: true, validator: validateMobile, trigger: "blur" },
  ],
  "contactInfo.email": [{ validator: validateEmail, trigger: "blur" }],
};

/** 表单重置 */
function reset() {
  // 先清除验证
  formRef.value?.clearValidate();

  form.id = undefined;
  form.name = "";
  form.sourceId = "";
  form.address = "";
  form.industryId = "";
  form.gradeId = "";
  form.belongUid = "";
  form.belongDid = "";
  form.shareIds = [];
  form.content = "";
  form.remark = "";
  form.customerStatus = 1;
  form.intentStatus = "D";
  form.contactInfo = {
    name: "",
    mobile: "",
    sex: 0,
    email: "",
    wechat: "",
    qq: "",
    nickname: "",
    department: "",
    position: "",
    birthday: "",
    address: "",
  };

  isEdit.value = false;
  isView.value = false;
}

/** 获取部门列表 */
function getDeptList() {
  listDept({ pageNum: 1, pageSize: 1000 }).then((response) => {
    deptOptions.value = response.data || [];
  });
}

/** 获取员工列表 */
function getUserList() {
  listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
    userOptions.value = response.rows || [];
  });
}

/** 获取客户等级列表 */
function getLevelList() {
  getCustomerLevelList({ pageNum: 1, pageSize: 1000 }).then((response) => {
    levelOptions.value = response.rows || [];
  });
}

/** 获取客户来源列表 */
function getChannelList() {
  getChannelPageList({ pageNum: 1, pageSize: 1000 }).then((response) => {
    channelOptions.value = response.rows || [];
  });
}

/** 获取所属行业列表 */
function getIndustryList() {
  getIndustryTypePageList({ pageNum: 1, pageSize: 1000 }).then((response) => {
    industryOptions.value = response.rows || [];
  });
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
function openEdit(formData) {
  // 兼容两种数据格式：{ info: data, record } 或直接 data
  const data = formData?.info || formData;
  reset();
  isEdit.value = true; // 先设置为编辑模式

  // 使用 nextTick 确保表单状态更新后再设置数据
  nextTick(() => {
    form.id = data.id;
    form.name = data.name || "";
    form.sourceId = data.sourceId || "";
    form.address = data.address || "";
    form.industryId = data.industryId || "";
    form.gradeId = data.gradeId || "";
    form.belongUid = data.belongUid || "";
    form.belongDid = data.belongDid || "";
    form.shareIds = data.shareIds
      ? (Array.isArray(data.shareIds)
          ? data.shareIds
          : data.shareIds.split(",")
        ).map(id => Number(typeof id === 'string' ? id.trim() : id))
      : [];
    form.content = data.content || "";
    form.remark = data.remark || "";
    if (data.contactInfo) {
      form.contactInfo = {
        name: data.contactInfo.name || "",
        mobile: data.contactInfo.mobile || "",
        sex: data.contactInfo.sex ?? 0,
        email: data.contactInfo.email || "",
        wechat: data.contactInfo.wechat || "",
        qq: data.contactInfo.qq || "",
        nickname: data.contactInfo.nickname || "",
        department: data.contactInfo.department || "",
        position: data.contactInfo.position || "",
        birthday: data.contactInfo.birthday || "",
        address: data.contactInfo.address || "",
      };
    }
  });

  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(formData) {
  // 兼容两种数据格式：{ info: data, record } 或直接 data
  const data = formData?.info || formData;
  reset();
  isView.value = true; // 先设置为查看模式

  // 使用 nextTick 确保表单状态更新后再设置数据
  nextTick(() => {
    form.id = data.id;
    form.name = data.name || "";
    form.sourceId = data.sourceId || "";
    form.address = data.address || "";
    form.industryId = data.industryId || "";
    form.gradeId = data.gradeId || "";
    form.belongUid = data.belongUid || "";
    form.belongDid = data.belongDid || "";
    form.shareIds = data.shareIds
      ? (Array.isArray(data.shareIds)
          ? data.shareIds
          : data.shareIds.split(",")
        ).map(id => Number(typeof id === 'string' ? id.trim() : id))
      : [];
    form.content = data.content || "";
    form.remark = data.remark || "";
    if (data.contactInfo) {
      form.contactInfo = {
        name: data.contactInfo.name || "",
        mobile: data.contactInfo.mobile || "",
        sex: data.contactInfo.sex ?? 0,
        email: data.contactInfo.email || "",
        wechat: data.contactInfo.wechat || "",
        qq: data.contactInfo.qq || "",
        nickname: data.contactInfo.nickname || "",
        department: data.contactInfo.department || "",
        position: data.contactInfo.position || "",
        birthday: data.contactInfo.birthday || "",
        address: data.contactInfo.address || "",
      };
    }
  });

  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = {
        ...form,
        shareIds: Array.isArray(form.shareIds) ? form.shareIds.join(",") : form.shareIds,
      };

      const apiMethod = isEdit.value ? edit : add;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      apiMethod(submitData).then(() => {
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

/** 初始化数据 */
onMounted(() => {
  getDeptList();
  getUserList();
  getLevelList();
  getChannelList();
  getIndustryList();
});
</script>

<style scoped>
.form-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}

.flow-detail-container {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 12px;
  background-color: #f5f7fa;
  max-height: 300px;
  overflow-y: auto;
}

.flow-item {
  padding: 12px;
  background-color: #ffffff;
  border-radius: 4px;
  margin-bottom: 12px;
  border: 1px solid #e4e7ed;
}

.flow-item:last-child {
  margin-bottom: 0;
}

.flow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e4e7ed;
}

.flow-index {
  font-weight: bold;
  color: #409eff;
  font-size: 14px;
}

.flow-mode {
  font-size: 12px;
}

.flow-content {
  padding-left: 8px;
}

.flow-info-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 13px;
}

.flow-info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #909399;
  min-width: 70px;
  font-weight: 500;
}

.info-value {
  color: #303133;
  font-weight: 400;
}
</style>

<style>
.documents-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.documents-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>
