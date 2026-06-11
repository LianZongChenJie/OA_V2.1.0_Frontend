<template>
  <el-dialog
    v-model="visible"
    title="推荐简历"
    width="50%"
    append-to-body
    class="car-dialog"
    @close="handleClose"
    :close-on-click-modal="false"
    :show-close="true"
    v-loading="loadingCustomer"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      style="margin-top: 15px"
    >
      <!-- 选择客户 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="选择客户" prop="customerId" required>
            <el-select
              v-model="form.customerId"
              placeholder="请选择客户"
              style="width: 100%"
              filterable
              remote
              reserve-keyword
              :remote-method="handleCustomerSearch"
              :loading="customerLoading"
              clearable
              @clear="handleClear"
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

        <!-- 客户邮箱 -->
        <el-col :span="24">
          <el-form-item label="客户邮箱" prop="emailUrl" required>
            <el-input
              v-model="form.emailUrl"
              placeholder="请输入客户邮箱"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <!-- 选择附件简历 -->
        <el-col :span="24" v-if="attachmentOptions.length > 0">
          <el-form-item label="选择附件" prop="filePath" required>
            <el-select
              v-model="form.filePath"
              placeholder="请选择附件简历"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in attachmentOptions"
                :key="item.id"
                :label="item.fileName"
                :value="item.filePath"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 项目名称 -->
        <el-col :span="24">
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="form.projectName"
              placeholder="请输入项目名称"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <!-- 备注 -->
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div style="text-align: center">
        <el-button type="primary" @click="submit" :loading="loading"
          >确认提交</el-button
        >
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, defineEmits, defineExpose } from "vue";
import { ElMessage } from "element-plus";
import { getPageList as getCustomerList } from "@/api/customer/list/index.js";
import { recommendResume, getDetail } from "@/api/personnel/resume/index.js";

const emit = defineEmits(["success"]);
const visible = ref(false);
const formRef = ref(null);
const loading = ref(false);
const loadingCustomer = ref(false);

// 客户列表
const customerOptions = ref([]);
const customerLoading = ref(false);

// 附件列表
const attachmentOptions = ref([]);

// 表单初始值
const getInitialForm = () => ({
  resumeId: "",
  customerId: "",
  customerName: "",
  emailUrl: "",
  filePath: "",
  projectName: "",
  status: "1",
  remark: "",
});

// 表单
const form = reactive(getInitialForm());

// 校验规则
const rules = {
  customerId: [{ required: true, message: "请选择客户", trigger: "change" }],
  emailUrl: [{ required: true, message: "请输入客户邮箱", trigger: "blur" }],
  filePath: [{ required: true, message: "请选择附件简历", trigger: "change" }],
};

// 加载客户列表（支持搜索关键词）
const loadCustomerList = async (keyword = "") => {
  try {
    loadingCustomer.value = true;
    const res = await getCustomerList({
      pageNum: 1,
      pageSize: 20,
      name: keyword,
    });
    customerOptions.value = res.rows || res.data || [];
  } catch (error) {
    console.error("加载客户列表失败：", error);
    ElMessage.error("加载客户列表失败");
  } finally {
    loadingCustomer.value = false;
  }
};

// 远程搜索客户
const handleCustomerSearch = async (keyword) => {
  try {
    customerLoading.value = true;
    const res = await getCustomerList({
      pageNum: 1,
      pageSize: 20,
      name: keyword,
    });
    customerOptions.value = res.rows || res.data || [];
  } catch (error) {
    console.error("搜索客户失败：", error);
  } finally {
    customerLoading.value = false;
  }
};

// 清空搜索时重新加载
function handleClear() {
  handleCustomerSearch("");
}

// 客户选择变化
function handleCustomerChange(customerId) {
  if (!customerId) {
    form.customerName = "";
    return;
  }
  const customer = customerOptions.value.find((c) => c.id === customerId);
  if (customer) {
    form.customerName = customer.name || "";
  }
}

// 重置表单
const resetForm = () => {
  const initial = getInitialForm();
  Object.keys(initial).forEach((key) => {
    form[key] = initial[key];
  });
  formRef.value?.clearValidate();
};

// 打开弹窗
async function open(row) {
  resetForm();
  form.resumeId = row?.id || "";
  form.customerId = "";
  form.customerName = "";
  formRef.value?.clearValidate();
  // 先清空客户列表和附件列表，显示弹窗和loading
  customerOptions.value = [];
  attachmentOptions.value = [];
  loadingCustomer.value = true;
  visible.value = true;

  // 并行加载客户列表和简历详情（包含附件）
  const tasks = [loadCustomerList()];

  // 如果有简历ID，获取简历详情以加载附件列表
  if (row?.id) {
    tasks.push(
      getDetail(row.id)
        .then((res) => {
          const detail = res.data || {};
          // 从简历详情中获取附件列表
          const attachments = detail.attachments || [];
          attachmentOptions.value = attachments;
        })
        .catch((err) => {
          console.error("获取简历详情失败：", err);
        }),
    );
  }

  await Promise.all(tasks);
  loadingCustomer.value = false;
}

// 关闭弹窗
function handleClose() {
  visible.value = false;
  resetForm();
}

// 提交
async function submit() {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  try {
    loading.value = true;
    const params = {
      resumeId: form.resumeId,
      customerId: form.customerId,
      customerName: form.customerName,
      emailUrl: form.emailUrl || "",
      filePath: form.filePath || "",
      projectName: form.projectName || "",
      status: form.status,
      remark: form.remark || "",
    };

    console.log("提交推荐参数：", params);

    const res = await recommendResume(params);

    if (res.code === 200 || res.code === 0) {
      ElMessage.success("推荐成功");
      emit("success");
      handleClose();
    } else {
      ElMessage.error(res.msg || "操作失败");
    }
  } catch (e) {
    console.error("推荐失败：", e);
    ElMessage.error(e.message || "操作失败");
  } finally {
    loading.value = false;
  }
}

// 暴露方法给父组件
defineExpose({ open, close: handleClose });
</script>

<style scoped>
.dialog-title {
  font-weight: 500;
  font-size: 16px;
}
</style>

<style>
.car-dialog.el-dialog {
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}
.car-dialog .el-dialog__body {
  overflow-y: auto;
}
</style>
