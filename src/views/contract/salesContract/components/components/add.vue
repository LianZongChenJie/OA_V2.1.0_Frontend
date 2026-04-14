<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="documents-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="120px"
    >
      <!-- 合同基本信息 -->
      <div class="form-section-title">合同基本信息</div>

      <!-- 第一行：合同性质 + 合同名称 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="合同性质" prop="types">
            <el-select
              v-model="form.types"
              :disabled="isView"
              placeholder="请选择合同性质"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="dict in contract_types"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入合同名称"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：签约主体 + 合同类别 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="签约主体" prop="enterpriseId">
            <el-select
              v-model="form.enterpriseId"
              :disabled="isView"
              placeholder="请选择签约主体"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="item in enterpriseOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同类别" prop="cateId">
            <el-select
              v-model="form.cateId"
              :disabled="isView"
              placeholder="请选择合同类别"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in classifyOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：合同时间 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="合同时间" prop="contractTime">
            <el-date-picker
              v-model="form.contractTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled="isView"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行：客户名称 + 客户代表 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerId">
            <el-select
              v-model="form.customerId"
              :disabled="isView"
              placeholder="请选择客户名称"
              clearable
              filterable
              style="width: 100%"
              @change="handleCustomerChange"
            >
              <el-option
                v-for="item in customerOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户代表" prop="contactName">
            <el-input
              v-model="form.contactName"
              placeholder="请输入客户代表"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行：客户地址 + 客户联系方式 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客户地址" prop="contactAddress">
            <el-input
              v-model="form.contactAddress"
              placeholder="请输入客户地址"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户联系方式" prop="contactMobile">
            <el-input
              v-model="form.contactMobile"
              placeholder="请输入客户手机号"
              :disabled="isView"
              maxlength="11"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第六行：合同金额 + 合同编号 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="合同金额" prop="cost">
            <el-input-number
              v-model="form.cost"
              :min="0"
              :precision="2"
              placeholder="请输入合同金额"
              :disabled="isView"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同编号" prop="code">
            <el-input
              v-model="form.code"
              placeholder="请输入合同编号"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 合同签订信息 -->
      <div class="form-section-title">合同签订信息</div>

      <!-- 第七行：签订人 + 所属部门 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="签订人" prop="signUid">
            <el-select
              v-model="form.signUid"
              :disabled="isView"
              placeholder="请选择签订人"
              clearable
              filterable
              style="width: 100%"
              @change="handleSignUserChange"
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
          <el-form-item label="所属部门" prop="did">
            <el-select
              v-model="form.did"
              :disabled="isView"
              placeholder="请选择所属部门"
              clearable
              style="width: 100%"
              @change="handleDeptChange"
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

      <!-- 第八行：签订日期 + 制定人 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="签订日期" prop="signTime">
            <el-date-picker
              v-model="form.signTime"
              type="date"
              placeholder="请选择签订日期"
              :disabled="isView"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制定人" prop="preparedUid">
            <el-select
              v-model="form.preparedUid"
              :disabled="isView"
              placeholder="请选择制定人"
              clearable
              filterable
              style="width: 100%"
              @change="handlePreparedUserChange"
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

      <!-- 第九行：保管人 + 共享人 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="保管人" prop="keeperUid">
            <el-select
              v-model="form.keeperUid"
              :disabled="isView"
              placeholder="请选择保管人"
              clearable
              filterable
              style="width: 100%"
              @change="handleKeeperUserChange"
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
          <el-form-item label="共享人" prop="shareIds">
            <el-select
              v-model="form.shareIds"
              :disabled="isView"
              placeholder="请选择共享人"
              multiple
              filterable
              clearable
              collapse-tags
              collapse-tags-tooltip
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

      <!-- 其他信息 -->
      <div class="form-section-title">其他信息</div>

      <!-- 第十行：备注信息 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注信息" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="4"
              placeholder="请输入备注信息"
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

<script setup name="AddSalesContract">
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import { add, edit } from "@/api/contract/salesContract";
import { listUser } from "@/api/system/user.js";
import { listDept } from "@/api/system/dept.js";
import { getPageList as getEnterprisePageList } from "@/api/base/common/businessEntity/index.js";
import { getPageList as getClassifyPageList } from "@/api/base/contract/classify/index.js";
import request from "@/utils/request";

const { proxy } = getCurrentInstance();
const { contract_types } = proxy.useDict("contract_types");

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const isView = ref(false); // 是否为查看模式

// 下拉选项数据
const userOptions = ref([]);
const deptOptions = ref([]);
const enterpriseOptions = ref([]);
const customerOptions = ref([]);
const classifyOptions = ref([]);

const form = reactive({
  // 合同基本信息
  id: undefined,
  types: "",
  name: "",
  enterpriseId: "",
  cateId: "",
  contractTime: [],
  customerId: "",
  customerName: "",
  contactName: "",
  contactAddress: "",
  contactMobile: "",
  cost: undefined,
  code: "",
  // 合同签订信息
  signUid: "",
  did: "",
  signTime: "",
  preparedUid: "",
  keeperUid: "",
  shareIds: [],
  // 其他信息
  remark: "",
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看合同";
  return isEdit.value ? "编辑合同" : "新增合同";
});

const rules = {
  types: [{ required: true, message: "请选择合同性质", trigger: "change" }],
  name: [{ required: true, message: "请输入合同名称", trigger: "blur" }],
  enterpriseId: [{ required: true, message: "请选择签约主体", trigger: "change" }],
  cateId: [{ required: true, message: "请选择合同类别", trigger: "change" }],
  contractTime: [{ required: true, message: "请选择合同时间", trigger: "change" }],
  customerId: [{ required: true, message: "请选择客户名称", trigger: "change" }],
  contactName: [{ required: true, message: "请输入客户代表", trigger: "blur" }],
  contactMobile: [
    { required: true, message: "请输入客户联系方式", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ],
  cost: [{ required: true, message: "请输入合同金额", trigger: "blur" }],
  code: [{ required: true, message: "请输入合同编号", trigger: "blur" }],
  signUid: [{ required: true, message: "请选择签订人", trigger: "change" }],
  did: [{ required: true, message: "请选择所属部门", trigger: "change" }],
  signTime: [{ required: true, message: "请选择签订日期", trigger: "change" }],
  preparedUid: [{ required: true, message: "请选择制定人", trigger: "change" }],
  keeperUid: [{ required: true, message: "请选择保管人", trigger: "change" }],
};

/** 表单重置 */
function reset() {
  form.id = undefined;
  // 合同基本信息
  form.types = "";
  form.name = "";
  form.enterpriseId = "";
  form.cateId = "";
  form.contractTime = [];
  form.customerId = "";
  form.customerName = "";
  form.contactName = "";
  form.contactAddress = "";
  form.contactMobile = "";
  form.cost = undefined;
  form.code = "";
  // 合同签订信息
  form.signUid = "";
  form.did = "";
  form.signTime = "";
  form.preparedUid = "";
  form.keeperUid = "";
  form.shareIds = [];
  // 其他信息
  form.remark = "";

  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
}

/** 获取用户列表 */
function getUserList() {
  listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
    userOptions.value = response.rows || [];
  });
}

/** 获取部门列表 */
function getDeptList() {
  listDept({ pageNum: 1, pageSize: 1000 }).then((response) => {
    deptOptions.value = response.data || [];
  });
}

/** 获取企业主体列表 */
function getEnterpriseList() {
  getEnterprisePageList({ pageNum: 1, pageSize: 20 }).then((response) => {
    enterpriseOptions.value = response.rows || [];
  });
}

/** 获取客户列表 */
function getCustomerList(query = {}) {
  return request({
    url: '/system/customer/list',
    method: 'get',
    params: { pageNum: 1, pageSize: 100, ...query }
  }).then((response) => {
    customerOptions.value = response.rows || [];
  });
}

/** 获取合同分类列表 */
function getClassifyList() {
  getClassifyPageList({ pageNum: 1, pageSize: 100 }).then((response) => {
    classifyOptions.value = response.rows || [];
  });
}

/** 客户选择变更 */
function handleCustomerChange(customerId) {
  if (customerId) {
    const selectedCustomer = customerOptions.value.find(
      (item) => item.id === customerId
    );
    if (selectedCustomer) {
      form.customerName = selectedCustomer.name;
    }
  } else {
    form.customerId = "";
    form.customerName = "";
  }
}

/** 签订人选择变更 */
function handleSignUserChange(userId) {
  if (userId) {
    form.signUid = userId;
  } else {
    form.signUid = "";
  }
}

/** 制定人选择变更 */
function handlePreparedUserChange(userId) {
  if (userId) {
    form.preparedUid = userId;
  } else {
    form.preparedUid = "";
  }
}

/** 保管人选择变更 */
function handleKeeperUserChange(userId) {
  if (userId) {
    form.keeperUid = userId;
  } else {
    form.keeperUid = "";
  }
}

/** 部门选择变更 */
function handleDeptChange(deptId) {
  if (deptId) {
    form.did = deptId;
    const selectedDept = deptOptions.value.find(
      (item) => item.deptId === deptId
    );
    if (selectedDept) {
      form.deptName = selectedDept.deptName;
    }
  } else {
    form.did = "";
    form.deptName = "";
  }
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
  // 合同基本信息
  form.types = data.types || "";
  form.name = data.name || "";
  form.enterpriseId = data.enterpriseId || "";
  form.cateId = data.cateId || data.cataId || "";
  // 将开始时间和结束时间组合为数组
  if (data.startTime || data.endTime) {
    form.contractTime = [data.startTime || "", data.endTime || ""];
  }
  form.customerId = data.customerId || "";
  form.customerName = data.customerName || "";
  form.contactName = data.contactName || "";
  form.contactAddress = data.contactAddress || "";
  form.contactMobile = data.contactMobile || "";
  form.cost = data.cost || undefined;
  form.code = data.code || "";
  // 合同签订信息
  form.signUid = data.signUid || "";
  form.did = data.did || "";
  form.signTime = data.signTime || "";
  form.preparedUid = data.preparedUid || "";
  form.keeperUid = data.keeperUid || "";
  form.shareIds = data.shareIds
    ? Array.isArray(data.shareIds)
      ? data.shareIds.map(id => Number(id))
      : data.shareIds.split(",").map(id => Number(id))
    : [];
  // 其他信息
  form.remark = data.remark || "";

  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  // 填充表单数据
  form.id = data.id;
  // 合同基本信息
  form.types = data.types || "";
  form.name = data.name || "";
  form.enterpriseId = data.enterpriseId || "";
  form.cateId = data.cateId || data.cataId || "";
  // 将开始时间和结束时间组合为数组
  if (data.startTime || data.endTime) {
    form.contractTime = [data.startTime || "", data.endTime || ""];
  }
  form.customerId = data.customerId || "";
  form.customerName = data.customerName || "";
  form.contactName = data.contactName || "";
  form.contactAddress = data.contactAddress || "";
  form.contactMobile = data.contactMobile || "";
  form.cost = data.cost || undefined;
  form.code = data.code || "";
  // 合同签订信息
  form.signUid = data.signUid || "";
  form.did = data.did || "";
  form.signTime = data.signTime || "";
  form.preparedUid = data.preparedUid || "";
  form.keeperUid = data.keeperUid || "";
  form.shareIds = data.shareIds
    ? Array.isArray(data.shareIds)
      ? data.shareIds.map((id) => Number(id))
      : data.shareIds.split(",").map((id) => Number(id))
    : [];
  // 其他信息
  form.remark = data.remark || "";

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      // 将数组转换为后端需要的格式
      const submitData = {
        ...form,
        shareIds: Array.isArray(form.shareIds)
          ? form.shareIds.join(",")
          : form.shareIds,
        // 将合同时间数组拆分为开始时间和结束时间
        startTime: form.contractTime && form.contractTime.length >= 1 ? form.contractTime[0] : "",
        endTime: form.contractTime && form.contractTime.length >= 2 ? form.contractTime[1] : "",
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
  getUserList();
  getDeptList();
  getEnterpriseList();
  getCustomerList();
  getClassifyList();
});
</script>

<style scoped>
.form-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0 15px 0;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}
</style>

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
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
