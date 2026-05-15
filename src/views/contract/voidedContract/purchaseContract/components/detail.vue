<template>
  <el-dialog
    title="采购合同作废详情"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="detail-dialog"
    @close="handleClose"
  >
    <div class="detail-content">
      <div class="form-section-title">合同基本信息</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="合同编号">{{
          formData.code || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="合同名称">{{
          formData.name || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="合同类型">{{
          formData.cateName || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="合同性质">
          <dict-tag
            :options="procurement_contract_types"
            :value="Number(formData.types)"
          />
        </el-descriptions-item>
        <el-descriptions-item label="合同开始时间">{{
          formData.startTimeStr || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="合同结束时间">{{
          formData.endTimeStr || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="合同金额">{{
          formData.cost || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{
          formData.customerName || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="客户代表">{{
          formData.contactName || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="客户联系方式">{{
          formData.contactMobile || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="客户地址" :span="2">{{
          formData.contactAddress || "-"
        }}</el-descriptions-item>
      </el-descriptions>

      <div class="form-section-title">合同签订信息</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="签订人">{{
          formData.signName || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="签订日期">{{
          formData.signTimeStr || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="制定人">{{
          formData.preparedName || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="保管人">{{
          formData.keeperName || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{
          formData.deptName || "-"
        }}</el-descriptions-item>
      </el-descriptions>

      <div class="form-section-title">作废信息</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="作废时间">{{
          formData.voidTimeStr || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="作废人">{{
          formData.voidUidName || "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="作废原因">{{
          formData.voidRemark || "-"
        }}</el-descriptions-item>
      </el-descriptions>
      <div v-if="formData.remark" class="form-section-title">其他信息</div>
      <el-descriptions v-if="formData.remark" :column="1" border>
        <el-descriptions-item label="备注">{{
          formData.remark || "-"
        }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup name="PurchaseContractArchiveDetail">
import { ref, reactive, getCurrentInstance } from "vue";
import DictTag from "@/components/DictTag";

const { proxy } = getCurrentInstance();
const { procurement_contract_types } = proxy.useDict(
  "procurement_contract_types",
);

const dialogVisible = ref(false);
const formData = reactive({});

/** 关闭弹窗 */
function handleClose() {
  Object.keys(formData).forEach((key) => delete formData[key]);
}

/** 显示弹窗 */
function open(row) {
  Object.assign(formData, row);
  dialogVisible.value = true;
}

defineExpose({
  open,
});
</script>

<style scoped>
.detail-content {
  max-height: 60vh;
  overflow-y: auto;
}

.form-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0 15px 0;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}

.form-section-title:first-child {
  margin-top: 0;
}
</style>

<style>
.detail-dialog .el-dialog {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.detail-dialog .el-dialog__body {
  max-height: calc(80vh - 120px);
  overflow-y: auto;
}
</style>
