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
          <el-form-item label="签约主体" prop="subjectId">
            <el-select
              v-model="form.subjectId"
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

      <!-- 审批流程信息 - 仅在查看模式下显示 -->
      <div v-if="isView" class="form-section-title">审批流程信息</div>

      <ApprovalFlow
        v-if="isView"
        ref="approvalFlowRef"
        v-model="approvalFlowData"
        :disabled="!isApprovalFlowEditable"
        flow-title="销售合同"
        @flow-change="handleFlowChange"
      />
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <!-- 新增/编辑模式 -->
        <template v-if="!isView">
          <el-button type="primary" @click="handleSubmit">
            确 定
          </el-button>
          <el-button @click="dialogVisible = false">
            取 消
          </el-button>
        </template>
        <!-- 查看模式 - 审批操作按钮 -->
        <template v-else>
          <el-button
            v-if="canSubmitApproval"
            type="primary"
            @click="handleSubmitApproval"
          >
            提交审批
          </el-button>
          <el-button
            v-if="canApprove"
            type="success"
            @click="handleApprove"
          >
            同意
          </el-button>
          <el-button
            v-if="canReject"
            type="danger"
            @click="handleReject"
          >
            拒绝
          </el-button>
          <el-button
            v-if="canRevoke"
            type="warning"
            @click="handleRevoke"
          >
            撤销
          </el-button>
          <el-button @click="dialogVisible = false">
            关 闭
          </el-button>
        </template>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddSalesContract">
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import { add, edit } from "@/api/contract/salesContract";
import {
  submitToFlow,
  approval as approvalFlow,
  getFlowNodes,
} from "@/api/common/approval.js";
import { listUser } from "@/api/system/user.js";
import { listDept } from "@/api/system/dept.js";
import { getPageList as getEnterprisePageList } from "@/api/base/common/businessEntity/index.js";
import { getPageList as getClassifyPageList } from "@/api/base/contract/classify/index.js";
import request from "@/utils/request";
import ApprovalFlow from "@/components/ApprovalFlow/index.vue";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const userStore = useUserStore();
const { contract_types } = proxy.useDict("contract_types");

const dialogVisible = ref(false);
const formRef = ref(null);
const approvalFlowRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const isView = ref(false); // 是否为查看模式

// 审批流程数据（双向绑定）
const approvalFlowData = ref({
  checkFlowId: "",
  checkCopyUids: userStore.id ? [userStore.id] : [],
});

// 选中的审批流程详情
const selectedFlow = ref(null);

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
  subjectId: "",
  cateId: "",
  contractTime: [],
  customerId: "",
  customer: "",
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
  // 审批状态
  checkStatus: undefined,
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看合同";
  return isEdit.value ? "编辑合同" : "新增合同";
});

// 审批状态判断
const canSubmitApproval = computed(() => {
  // 未提交审批状态（通常是 0）可以提交
  return form.checkStatus === 0 || form.checkStatus === undefined;
});

const canApprove = computed(() => {
  // 待审批状态（通常是 1）可以同意
  return form.checkStatus === 1;
});

const canReject = computed(() => {
  // 待审批状态（通常是 1）可以拒绝
  return form.checkStatus === 1;
});

const canRevoke = computed(() => {
  // 审批中或已通过状态可以撤销（需要根据实际业务调整）
  return form.checkStatus === 1 || form.checkStatus === 2;
});

// 审批流是否可编辑（审核中=1，审核通过=2时不可编辑）
const isApprovalFlowEditable = computed(() => {
  return form.checkStatus !== 1 && form.checkStatus !== 2;
});

const rules = {
  types: [{ required: true, message: "请选择合同性质", trigger: "change" }],
  name: [{ required: true, message: "请输入合同名称", trigger: "blur" }],
  subjectId: [{ required: true, message: "请选择签约主体", trigger: "change" }],
  cateId: [{ required: true, message: "请选择合同类别", trigger: "change" }],
  contractTime: [
    { required: true, message: "请选择合同时间", trigger: "change" },
  ],
  customerId: [
    { required: true, message: "请选择客户名称", trigger: "change" },
  ],
  contactName: [{ required: true, message: "请输入客户代表", trigger: "blur" }],
  contactMobile: [
    { required: true, message: "请输入客户联系方式", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
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
  form.subjectId = "";
  form.cateId = "";
  form.contractTime = [];
  form.customerId = "";
  form.customer = "";
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
  // 审批状态
  form.checkStatus = undefined;

  // 重置审批流程数据
  approvalFlowData.value = {
    checkFlowId: "",
    checkCopyUids: userStore.id ? [userStore.id] : [],
  };
  selectedFlow.value = null;

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
    url: "/system/customer/list",
    method: "get",
    params: { pageNum: 1, pageSize: 100, ...query },
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
      (item) => item.id === customerId,
    );
    if (selectedCustomer) {
      form.customer = selectedCustomer.name;
    }
  } else {
    form.customerId = "";
    form.customer = "";
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
      (item) => item.deptId === deptId,
    );
    if (selectedDept) {
      form.deptName = selectedDept.deptName;
    }
  } else {
    form.did = "";
    form.deptName = "";
  }
}

/** 审批流程变更 */
function handleFlowChange(flow) {
  selectedFlow.value = flow;
}

/** 提交审批 */
function handleSubmitApproval() {
  if (!approvalFlowData.value.checkFlowId) {
    proxy.$modal.msgWarning("请先选择审批流程");
    return;
  }

  proxy.$modal.confirm('确认提交审批吗？').then(() => {
    // 构建符合接口要求的入参格式
    const submitData = {
      actionId: form.id,                    // 当前申请的ID（合同ID）
      flowId: approvalFlowData.value.checkFlowId,  // 审批流程ID
      checkName: "contract",                // 固定值：contract
      checkUids: "",                        // 审批人ID，从选中的流程中获取
      checkCopyUids: Array.isArray(approvalFlowData.value.checkCopyUids)
        ? approvalFlowData.value.checkCopyUids.join(",")
        : approvalFlowData.value.checkCopyUids || "",
    };

    // 从选中的审批流程中提取审批人ID
    if (selectedFlow.value && selectedFlow.value.flowList && selectedFlow.value.flowList.length > 0) {
      // 获取第一步审批的审批人ID
      const firstStep = selectedFlow.value.flowList[0];
      if (firstStep.check_uids) {
        submitData.checkUids = Array.isArray(firstStep.check_uids)
          ? firstStep.check_uids.join(",")
          : firstStep.check_uids;
      }
    }

    submitToFlow(submitData).then(() => {
      proxy.$modal.msgSuccess("提交审批成功");
      dialogVisible.value = false;
      emit("success");
    });
  }).catch(() => {});
}

/** 同意审批 */
function handleApprove() {
  proxy.$modal
    .prompt("请输入审批意见", "同意审批", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /\S+/,
      inputErrorMessage: "审批意见不能为空",
    })
    .then(({ value }) => {
      approvalFlow({
        id: form.id,
        status: 2, // 同意
        remark: value,
      }).then(() => {
        proxy.$modal.msgSuccess("审批通过");
        dialogVisible.value = false;
        emit("success");
      });
    })
    .catch(() => {});
}

/** 拒绝审批 */
function handleReject() {
  proxy.$modal
    .prompt("请输入拒绝原因", "拒绝审批", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /\S+/,
      inputErrorMessage: "拒绝原因不能为空",
    })
    .then(({ value }) => {
      approvalFlow({
        id: form.id,
        status: 3, // 拒绝
        remark: value,
      }).then(() => {
        proxy.$modal.msgSuccess("已拒绝");
        dialogVisible.value = false;
        emit("success");
      });
    })
    .catch(() => {});
}

/** 撤销审批 */
function handleRevoke() {
  proxy.$modal
    .confirm("确认撤销该审批吗？")
    .then(() => {
      // 调用撤销审批的API（需要根据实际情况调整）
      approvalFlow({
        id: form.id,
        status: 0, // 撤销回初始状态
      }).then(() => {
        proxy.$modal.msgSuccess("撤销成功");
        dialogVisible.value = false;
        emit("success");
      });
    })
    .catch(() => {});
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
  form.types =
    data.types !== undefined && data.types !== null ? String(data.types) : "";
  form.name = data.name || "";
  form.subjectId = data.subjectId ? Number(data.subjectId) : "";
  form.cateId = data.cateId
    ? Number(data.cateId)
    : data.cataId
      ? Number(data.cataId)
      : "";
  // 将开始时间和结束时间组合为数组
  if (data.startTime || data.endTime) {
    form.contractTime = [data.startTime || "", data.endTime || ""];
  }
  form.customerId = data.customerId || "";
  form.customer = data.customer || "";
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
  // 审批状态
  form.checkStatus = data.checkStatus;

  // 设置审批流程数据
  approvalFlowData.value = {
    checkFlowId: data.checkFlowId || "",
    checkCopyUids: data.checkCopyUids
      ? Array.isArray(data.checkCopyUids)
        ? data.checkCopyUids
        : data.checkCopyUids.split(",")
      : [],
  };

  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  // 填充表单数据
  form.id = data.id;
  // 合同基本信息
  form.types =
    data.types !== undefined && data.types !== null ? String(data.types) : "";
  form.name = data.name || "";
  form.subjectId = data.subjectId ? Number(data.subjectId) : "";
  form.cateId = data.cateId
    ? Number(data.cateId)
    : data.cataId
      ? Number(data.cataId)
      : "";
  // 将开始时间和结束时间组合为数组
  if (data.startTime || data.endTime) {
    form.contractTime = [data.startTime || "", data.endTime || ""];
  }
  form.customerId = data.customerId || "";
  form.customer = data.customer || "";
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
  // 审批状态
  form.checkStatus = data.checkStatus;

  // 设置审批流程数据
  approvalFlowData.value = {
    checkFlowId: data.checkFlowId || "",
    checkCopyUids: data.checkCopyUids
      ? Array.isArray(data.checkCopyUids)
        ? data.checkCopyUids
        : data.checkCopyUids.split(",")
      : [],
  };

  isView.value = true;
  dialogVisible.value = true;

  // 如果有 action_id 和 flow_id，获取审批节点信息
  if (data.id && data.checkFlowId) {
    getFlowNodes({
      check_name: "contract",
      action_id: data.id,
      flow_id: data.checkFlowId,
    }).then((flowData) => {
      // 将获取到的审批节点数据存储，用于展示
      if (flowData.data) {
        approvalFlowData.value.flowNodes = flowData.data;
      }
    }).catch((error) => {
      console.error("获取审批节点失败:", error);
    });
  }
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      // 将数组转换为后端需要的格式
      const submitData = {
        ...form,
        subjectId: String(form.subjectId),
        shareIds: Array.isArray(form.shareIds)
          ? form.shareIds.join(",")
          : form.shareIds,
        // 将合同时间数组拆分为开始时间和结束时间
        startTime:
          form.contractTime && form.contractTime.length >= 1
            ? form.contractTime[0]
            : "",
        endTime:
          form.contractTime && form.contractTime.length >= 2
            ? form.contractTime[1]
            : "",
        // 审批流程数据
        checkFlowId: approvalFlowData.value.checkFlowId,
        checkCopyUids: Array.isArray(approvalFlowData.value.checkCopyUids)
          ? approvalFlowData.value.checkCopyUids.join(",")
          : approvalFlowData.value.checkCopyUids,
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
