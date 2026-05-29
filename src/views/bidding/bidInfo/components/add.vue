<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="70%"
    append-to-body
    class="bid-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="140px"
    >
      <!-- 标书基础信息 -->
      <div class="section-title">标书基础信息</div>

      <!-- 第一行：负责人 + 所属月份 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="负责人" prop="tenderLeader">
            <el-select
              v-model="form.tenderLeaderId"
              placeholder="请选择负责人"
              :disabled="isView"
              filterable
              remote
              reserve-keyword
              :remote-method="(query) => handleUserSearch(query)"
              :loading="userLoading"
              style="width: 100%"
              clearable
              @focus="handleUserFocus"
              @change="handleUserChange"
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
          <el-form-item label="所属月份" prop="month">
            <el-date-picker
              v-model="form.month"
              type="month"
              placeholder="请选择所属月份"
              :disabled="isView"
              style="width: 100%"
              value-format="YYYY-MM"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：购买日期 + 客户名称 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="购买日期" prop="purchaseDate">
            <el-date-picker
              v-model="form.purchaseDate"
              type="date"
              placeholder="请选择购买日期"
              :disabled="isView"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerName">
            <el-input
              v-model="form.customerName"
              placeholder="请输入客户名称"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：招标机构 + 开标日期 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="招标机构" prop="tenderAgency">
            <el-input
              v-model="form.tenderAgency"
              placeholder="请输入招标机构"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开标日期" prop="bidOpeningDate">
            <el-date-picker
              v-model="form.bidOpeningDate"
              type="date"
              placeholder="请选择开标日期"
              :disabled="isView"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行：项目名称 + 项目周期 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="form.projectName"
              placeholder="请输入项目名称"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目周期" prop="projectCycle">
            <el-input-number
              v-model="form.projectCycleNum"
              :min="0"
              :precision="0"
              placeholder="请输入项目周期(月)"
              :disabled="isView"
              style="width: 70%"
            />
            <el-input
              v-model="form.projectCycle"
              style="width: 30%"
              disabled
              placeholder="项目周期"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行：预算金额 + 入围家数 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="预算金额(元)" prop="budgetAmount">
            <el-input-number
              v-model="form.budgetAmount"
              :min="0"
              :precision="2"
              placeholder="请输入预算金额"
              :disabled="isView"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入围家数" prop="shortlistedCountries">
            <el-input-number
              v-model="form.shortlistedCountries"
              :min="0"
              :precision="0"
              placeholder="请输入入围家数"
              :disabled="isView"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第六行：是否投标 + 排序 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否投标" prop="isTenderSubmitted">
            <el-radio-group v-model="form.isTenderSubmitted" :disabled="isView">
              <el-radio
                v-for="dict in sys_yes_no"
                :key="dict.label"
                :label="dict.label"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="form.sort"
              :min="0"
              :precision="0"
              placeholder="请输入排序"
              :disabled="isView"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 备注字段 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注信息"
              :disabled="isView"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 未投原因（单独一行，当是否投标为否时显示） -->
      <el-row :gutter="20" v-if="form.isTenderSubmitted === '否'">
        <el-col :span="12">
          <el-form-item label="未投原因" prop="nonTenderReason">
            <el-input
              v-model="form.nonTenderReason"
              placeholder="请输入未投原因"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 查看模式下显示创建时间和更新时间 -->
      <template v-if="isView">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input
                :model-value="formatDateTime(form.createTime)"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间">
              <el-input
                :model-value="formatDateTime(form.updateTime)"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!-- 投标信息 - 只在是否投标为是时显示 -->
      <template v-if="form.isTenderSubmitted === '是'">
        <!-- 标书款信息 -->
        <div class="section-title">投标信息 - 标书</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标书款(元)" prop="tenderDocumentFee">
              <el-input-number
                v-model="form.tenderDocumentFee"
                :min="0"
                :precision="2"
                placeholder="请输入标书款"
                :disabled="isView"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标书款发票" prop="hasTenderInvoice">
              <el-radio-group
                v-model="form.hasTenderInvoice"
                :disabled="isView"
              >
                <el-radio
                  v-for="dict in sys_yes_no"
                  :key="dict.label"
                  :label="dict.label"
                >
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 保证金信息 -->
        <div class="section-title">投标信息 - 保证金</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否缴纳" prop="isDepositPaid">
              <el-radio-group v-model="form.isDepositPaid" :disabled="isView">
                <el-radio
                  v-for="dict in sys_yes_no"
                  :key="dict.label"
                  :label="dict.label"
                >
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 保证金详细信息 - 只在是否缴纳为是时显示 -->
        <template v-if="form.isDepositPaid === '是'">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="金额(元)" prop="tenderDeposit">
                <el-input-number
                  v-model="form.tenderDeposit"
                  :min="0"
                  :precision="2"
                  placeholder="请输入保证金金额"
                  :disabled="isView"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收款账户名" prop="depositAccountName">
                <el-input
                  v-model="form.depositAccountName"
                  placeholder="请输入收款账户名"
                  :disabled="isView"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="收款账号" prop="depositAccountNo">
                <el-input
                  v-model="form.depositAccountNo"
                  placeholder="请输入收款账号"
                  :disabled="isView"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户银行" prop="depositBank">
                <el-input
                  v-model="form.depositBank"
                  placeholder="请输入开户银行"
                  :disabled="isView"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="缴纳截止日期" prop="depositPaidTime">
                <el-date-picker
                  v-model="form.depositPaidTime"
                  type="date"
                  placeholder="请选择缴纳截止日期"
                  :disabled="isView"
                  style="width: 100%"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否退回" prop="isDepositRefunded">
                <el-radio-group
                  v-model="form.isDepositRefunded"
                  :disabled="isView"
                >
                  <el-radio
                    v-for="dict in sys_yes_no"
                    :key="dict.label"
                    :label="dict.label"
                  >
                    {{ dict.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!-- 投标结果 -->
        <div class="section-title">投标信息 - 投标结果</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="中标结果" prop="bidResult">
              <el-select
                v-model="form.bidResult"
                placeholder="请选择中标结果"
                :disabled="isView"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="dict in bid_result"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中标服务费(元)" prop="bidServiceFee">
              <el-input-number
                v-model="form.bidServiceFee"
                :min="0"
                :precision="2"
                placeholder="请输入中标服务费"
                :disabled="isView"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 附件管理 -->
        <div class="section-title">投标信息 - 附件管理</div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="附件列表" prop="attachments">
              <UploadAttachmentList
                v-model="form.attachments"
                :disabled="isView"
                :limit="10"
                action="tender/attachment/upload"
                @downloadApi="downFiles"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
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

<script setup name="AddBidInfo">
import { ref, reactive, computed, getCurrentInstance, watch } from "vue";
import { add, edit } from "@/api/bidding/bidInfo";
import { getPageList as getEmployeeList } from "@/api/personnel/employee/index.js";
import UploadAttachmentList from "@/components/UploadAttachmentList/index.vue";
import { downloadFile } from "@/utils/download";

const { proxy } = getCurrentInstance();
const { sys_yes_no, bid_result } = proxy.useDict("sys_yes_no", "bid_result");

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 负责人选择相关
const userOptions = ref([]);
const userLoading = ref(false);

// 表单数据
const form = reactive({
  id: undefined,
  // 标书基础信息
  tenderLeaderId: undefined,
  tenderLeader: "",
  month: "",
  purchaseDate: "",
  customerName: "",
  projectName: "",
  tenderAgency: "",
  projectCycle: undefined,
  projectCycleNum: undefined,
  shortlistedCountries: undefined,
  budgetAmount: undefined,
  bidOpeningDate: "",
  isTenderSubmitted: "",
  nonTenderReason: "",
  sort: 0,
  remark: "", // 新增备注字段
  // 投标信息 - 标书
  tenderDocumentFee: undefined,
  hasTenderInvoice: "",
  // 投标信息 - 保证金
  isDepositPaid: "",
  tenderDeposit: undefined,
  depositAccountName: "",
  depositAccountNo: "",
  depositBank: "",
  depositPaidTime: "",
  isDepositRefunded: "",
  // 投标信息 - 投标结果
  bidResult: "待开标",
  bidServiceFee: 0,
  // 附件
  attachments: [],
  // 时间字段
  createTime: "",
  updateTime: "",
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看招投标信息";
  return isEdit.value ? "编辑招投标信息" : "新增招投标信息";
});

const rules = {
  tenderLeader: [
    { required: true, message: "请选择负责人", trigger: "change" },
  ],
  month: [{ required: true, message: "请选择所属月份", trigger: "change" }],
  purchaseDate: [
    { required: true, message: "请选择购买日期", trigger: "change" },
  ],
  customerName: [
    { required: true, message: "请输入客户名称", trigger: "blur" },
  ],
  projectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  tenderAgency: [
    { required: true, message: "请输入招标机构", trigger: "blur" },
  ],
  projectCycleNum: [
    { required: true, message: "请输入项目周期", trigger: "blur" },
  ],
  budgetAmount: [
    { required: true, message: "请输入预算金额", trigger: "blur" },
  ],
  bidOpeningDate: [
    { required: true, message: "请选择开标日期", trigger: "change" },
  ],
  isTenderSubmitted: [
    { required: true, message: "请选择是否投标", trigger: "change" },
  ],
  nonTenderReason: [
    { required: true, message: "请输入未投原因", trigger: "blur" },
  ],
  isDepositPaid: [
    { required: true, message: "请选择是否缴纳保证金", trigger: "change" },
  ],
  remark: [
    { max: 500, message: "备注不能超过500个字符", trigger: "blur" }
  ],
};

/** 格式化项目周期 */
function formatProjectCycle(months) {
  if (months === undefined || months === null || months === "") {
    return "";
  }
  const monthNum = Number(months);
  if (isNaN(monthNum) || monthNum < 0) {
    return "";
  }

  const years = Math.floor(monthNum / 12);
  const remainingMonths = monthNum % 12;

  if (years === 0) {
    return `${remainingMonths}个月`;
  } else if (remainingMonths === 0) {
    return `${years}年`;
  } else {
    return `${years}年零${remainingMonths}个月`;
  }
}

/** 监听项目周期月数变化 */
watch(
  () => form.projectCycleNum,
  (newVal) => {
    form.projectCycle = formatProjectCycle(newVal);
  }
);

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.tenderLeaderId = undefined;
  form.tenderLeader = "";
  form.month = "";
  form.purchaseDate = "";
  form.customerName = "";
  form.projectName = "";
  form.tenderAgency = "";
  form.projectCycle = undefined;
  form.projectCycleNum = undefined;
  form.shortlistedCountries = undefined;
  form.budgetAmount = undefined;
  form.bidOpeningDate = "";
  form.isTenderSubmitted = "是";
  form.nonTenderReason = "";
  form.sort = 0;
  form.remark = ""; // 清空备注
  form.tenderDocumentFee = undefined;
  form.hasTenderInvoice = "否";
  form.isDepositPaid = "是";
  form.tenderDeposit = undefined;
  form.depositAccountName = "";
  form.depositAccountNo = "";
  form.depositBank = "";
  form.depositPaidTime = "";
  form.isDepositRefunded = "否";
  form.bidResult = "待开标";
  form.bidServiceFee = 0;
  form.attachments = [];
  form.createTime = "";
  form.updateTime = "";

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
  fillForm(data);
  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  fillForm(data);
  isView.value = true;
  dialogVisible.value = true;
}

/** 填充表单数据 */
function fillForm(data) {
  form.id = data.id;
  form.tenderLeaderId = data.tenderLeaderId;
  form.tenderLeader = data.tenderLeader || "";
  form.month = data.month || "";
  form.purchaseDate = data.purchaseDate || "";
  form.customerName = data.customerName || "";
  form.projectName = data.projectName || "";
  form.tenderAgency = data.tenderAgency || "";
  form.projectCycleNum = data.projectCycleNum;
  form.projectCycle = data.projectCycle;
  form.shortlistedCountries = data.shortlistedCountries;
  form.budgetAmount = data.budgetAmount;
  form.bidOpeningDate = data.bidOpeningDate || "";
  form.isTenderSubmitted = data.isTenderSubmitted || "";
  form.nonTenderReason = data.nonTenderReason || "";
  form.sort = data.sort ?? 0;
  form.remark = data.remark || ""; // 新增备注赋值
  form.tenderDocumentFee = data.tenderDocumentFee;
  form.hasTenderInvoice = data.hasTenderInvoice || "";
  form.isDepositPaid = data.isDepositPaid || "";
  form.tenderDeposit = data.tenderDeposit;
  form.depositAccountName = data.depositAccountName || "";
  form.depositAccountNo = data.depositAccountNo || "";
  form.depositBank = data.depositBank || "";
  form.depositPaidTime = data.depositPaidTime || "";
  form.isDepositRefunded = data.isDepositRefunded || "";
  form.bidResult = data.bidResult || "";
  form.bidServiceFee = data.bidServiceFee;
  form.attachments = data.attachments || [];
  form.createTime = data.createTime || "";
  form.updateTime = data.updateTime || "";

  // 编辑时回显负责人选项
  if (data.tenderLeaderId) {
    // 直接添加当前负责人到选项列表，确保能正确回显
    if (
      !userOptions.value.find((item) => item.userId === data.tenderLeaderId)
    ) {
      userOptions.value.push({
        userId: data.tenderLeaderId,
        nickName: data.tenderLeader || "",
      });
    }
  }
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      // 处理附件数据
      const submitData = {
        ...form,
      };

      // 如果未投标，清空投标相关信息
      if (form.isTenderSubmitted === "否") {
        submitData.tenderDocumentFee = undefined;
        submitData.hasTenderInvoice = "";
        submitData.isDepositPaid = "";
        submitData.tenderDeposit = undefined;
        submitData.depositAccountName = "";
        submitData.depositAccountNo = "";
        submitData.depositBank = "";
        submitData.depositPaidTime = "";
        submitData.isDepositRefunded = "";
        submitData.bidResult = "待开标";
        submitData.bidServiceFee = undefined;
        submitData.attachments = [];
      }

      // 如果未缴纳保证金，清空保证金相关信息
      if (form.isDepositPaid === "否") {
        submitData.tenderDeposit = undefined;
        submitData.depositAccountName = "";
        submitData.depositAccountNo = "";
        submitData.depositBank = "";
        submitData.depositPaidTime = "";
        submitData.isDepositRefunded = "";
      }

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

/** 格式化日期时间 */
function formatDateTime(dateTime) {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return dateTime;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/** 员工搜索 */
async function handleUserSearch(query) {
  userLoading.value = true;
  try {
    const res = await getEmployeeList({
      pageNum: 1,
      pageSize: 20,
      nickName: query || "",
    });
    if (res.code === 200) {
      userOptions.value = res.rows || [];
    }
  } catch (e) {
    console.error("查询员工失败", e);
  } finally {
    userLoading.value = false;
  }
}

/** 获取焦点时加载默认数据 */
function handleUserFocus() {
  if (userOptions.value.length === 0) {
    handleUserSearch("");
  }
}

/** 员工选择变化 */
function handleUserChange(userId) {
  if (userId) {
    const selectedUser = userOptions.value.find(
      (item) => item.userId === userId,
    );
    form.tenderLeaderId = selectedUser ? selectedUser.userId : undefined;
    form.tenderLeader = selectedUser ? selectedUser.nickName : "";
  } else {
    form.tenderLeaderId = undefined;
    form.tenderLeader = "";
  }
}

const downFiles = (file) => {
  if (!file.id) {
    proxy.$modal.msgWarning("文件ID不存在");
    return;
  }
  const baseUrl = import.meta.env.VITE_APP_BASE_API || "";
  const url = baseUrl + `/tender/attachment/download/${file.id}`;
  downloadFile(url, file.fileName || file.name || "下载文件").catch(() => {
    proxy.$modal.msgError("下载失败");
  });
};

defineExpose({
  open,
  openEdit,
  openView,
});
</script>

<style scoped>
.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0 15px 0;
  padding-left: 10px;
  border-left: 4px solid #409eff;
}

.section-title:first-child {
  margin-top: 0;
}
</style>

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
.bid-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.bid-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>