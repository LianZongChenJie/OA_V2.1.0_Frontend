<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="approval-module-dialog"
    @close="handleClose"
  >
    <div class="section-title">基础信息</div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="120px"
    >
      <el-form-item label="员工" prop="uid">
        <el-select
          v-model="form.uid"
          :disabled="isView"
          placeholder="请选择员工"
          filterable
          clearable
          style="width: 100%"
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
      <el-form-item label="调出部门" prop="fromDid">
        <el-input v-model="form.fromDidName" placeholder="" disabled />
      </el-form-item>
      <el-form-item label="调入部门" prop="toDid">
        <el-tree-select
          v-model="form.toDid"
          :data="deptOptions"
          :props="{ value: 'id', label: 'label', children: 'children' }"
          :render-after-expand="false"
          :disabled="isView"
          placeholder="请选择调入部门"
          clearable
          check-strictly
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="调动时间" prop="moveTime">
        <el-date-picker
          v-model="form.moveTime"
          type="datetime"
          placeholder="请选择调动时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <div class="section-title">审批信息</div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="120px"
    >
      <el-form-item label="审批流程" prop="checkFlowId">
        <el-select
          v-model="form.checkFlowId"
          :disabled="isView"
          placeholder="请选择审批流程"
          clearable
          style="width: 100%"
          @change="handleFlowChange"
        >
          <el-option
            v-for="item in flowOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="抄送人" prop="checkCopyUids">
        <el-select
          v-model="form.checkCopyUids"
          :disabled="isView"
          placeholder="请选择抄送人"
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

<script setup name="AddDeptChange">
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import {
  addDeptChange,
  updateDeptChange,
} from "@/api/personnel/transfer/index.js";
import { listUser, deptTreeSelect } from "@/api/system/user.js";
import { getPageList as getFlowList } from "@/api/base/common/approvalFlow/index.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const isView = ref(false); // 是否为查看模式

// 员工下拉选项
const userOptions = ref([]);
// 部门树选项
const deptOptions = ref([]);
// 审批流程选项
const flowOptions = ref([]);

// 用户选择时的部门映射
const userDeptMap = ref({});

const form = reactive({
  id: undefined,
  uid: undefined,
  fromDid: undefined,
  fromDidName: "",
  toDid: undefined,
  moveTime: "",
  checkFlowId: undefined,
  checkCopyUids: [],
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看调动";
  return isEdit.value ? "编辑调动" : "新增调动";
});

const rules = {
  uid: [{ required: true, message: "请选择员工", trigger: "change" }],
  fromDid: [
    { required: true, message: "请选择员工以确定调出部门", trigger: "change" },
  ],
  toDid: [{ required: true, message: "请选择调入部门", trigger: "change" }],
  moveTime: [{ required: true, message: "请选择调动时间", trigger: "change" }],
  checkFlowId: [
    { required: true, message: "请选择审批流程", trigger: "change" },
  ],
};

// 获取用户列表
function getUserList() {
  listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
    userOptions.value = response.rows || [];
    // 构建用户部门映射
    response.rows?.forEach((user) => {
      userDeptMap.value[user.userId] = {
        deptId: user.deptId,
        deptName: user.dept?.deptName || "",
      };
    });
  });
}

// 获取部门树
function getDeptTree() {
  deptTreeSelect().then((res) => {
    deptOptions.value = res.data || [];
  });
}

// 获取审批流程列表
function loadFlowList() {
  getFlowList({ pageNum: 1, pageSize: 1000, title: "调动" }).then(
    (response) => {
      flowOptions.value = response.rows || [];
    },
  );
}

// 员工选择变化
function handleUserChange(userId) {
  if (userId) {
    const userDept = userDeptMap.value[userId];
    if (userDept) {
      form.fromDid = userDept.deptId;
      form.fromDidName = userDept.deptName;
    }
  } else {
    form.fromDid = undefined;
    form.fromDidName = "";
  }
}

// 审批流程选择变化
function handleFlowChange(flowId) {
  // TODO: 根据实际需求获取审批流程中的默认抄送人
  if (flowId) {
    // 可以在这里获取审批流程的抄送人信息并填充
    // form.checkCopyUids = ...
  } else {
    form.checkCopyUids = [];
  }
}

onMounted(() => {
  getUserList();
  getDeptTree();
  loadFlowList();
});

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.uid = undefined;
  form.fromDid = undefined;
  form.fromDidName = "";
  form.toDid = undefined;
  form.moveTime = "";
  form.checkFlowId = undefined;
  form.checkCopyUids = [];

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
  form.id = data.id;
  form.uid = data.uid;
  form.fromDid = data.fromDid;
  form.fromDidName = data.fromDidName || "";
  form.toDid = data.toDid;
  form.moveTime = data.moveTime;
  form.checkFlowId = data.checkFlowId;
  form.checkCopyUids = data.checkCopyUids
    ? data.checkCopyUids.split(",").map(Number)
    : [];

  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  // 填充表单数据
  form.id = data.id;
  form.uid = data.uid;
  form.fromDid = data.fromDid;
  form.fromDidName = data.fromDidName || "";
  form.toDid = data.toDid;
  form.moveTime = data.moveTime;
  form.checkFlowId = data.checkFlowId;
  form.checkCopyUids = data.checkCopyUids
    ? data.checkCopyUids.split(",").map(Number)
    : [];

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = { ...form };
      // 处理抄送人数组
      if (submitData.checkCopyUids && submitData.checkCopyUids.length > 0) {
        submitData.checkCopyUids = submitData.checkCopyUids.join(",");
      } else {
        submitData.checkCopyUids = "";
      }

      const apiMethod = isEdit.value ? updateDeptChange : addDeptChange;
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
</script>

<style scoped>
.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 16px 0 12px 0;
  padding-left: 8px;
  border-left: 3px solid #409eff;
}
.approval-module-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.approval-module-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>
