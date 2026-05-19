<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="transfer-add-edit-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="员工" prop="uid">
        <el-select
          v-model="form.uid"
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
        <DeptCascader
          v-model="form.toDid"
          :emit-path="false"
          placeholder="请选择调入部门"
        />
      </el-form-item>
      <el-form-item label="调动时间" prop="moveTime">
        <el-date-picker
          v-model="form.moveTime"
          type="datetime"
          placeholder="请选择调动时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="调动原因" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入调动原因"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <!-- 审批记录 -->
    <RecordSteps v-if="isEdit && currentData?.records?.length" :records="currentData.records" />

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="TransferAddEdit">
import { ref, reactive, computed, getCurrentInstance, onMounted, nextTick } from "vue";
import {
  addDeptChange,
  updateDeptChange,
} from "@/api/personnel/transfer/index.js";
import { listUser, deptTreeSelect } from "@/api/system/user.js";
import RecordSteps from "@/components/RecordSteps/index.vue";
import DeptCascader from "@/components/DeptCascader/index.vue";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const currentData = ref(null);

// 员工下拉选项
const userOptions = ref([]);

// 用户选择时的部门映射
const userDeptMap = ref({});

const form = reactive({
  id: undefined,
  uid: undefined,
  fromDid: undefined,
  fromDidName: "",
  toDid: undefined,
  remark: "",
  moveTime: "",
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑调动" : "新增调动";
});

const rules = {
  uid: [{ required: true, message: "请选择员工", trigger: "change" }],
  fromDid: [
    { required: true, message: "请选择员工以确定调出部门", trigger: "change" },
  ],
  toDid: [{ required: true, message: "请选择调入部门", trigger: "change" }],
  moveTime: [{ required: true, message: "请选择调动时间", trigger: "change" }],
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

onMounted(() => {
  getUserList();
});

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.uid = undefined;
  form.fromDid = undefined;
  form.fromDidName = "";
  form.toDid = undefined;
  form.moveTime = "";
  form.remark = "";

  isEdit.value = false;
  formRef.value?.clearValidate();
}

/** 关闭弹窗 */
function handleClose() {
  reset();
  currentData.value = null;
}

/** 显示弹窗 - 新增模式 */
function open() {
  isEdit.value = false;
  dialogVisible.value = true;
  nextTick(() => {
    reset();
  });
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  isEdit.value = true;
  currentData.value = data;
  dialogVisible.value = true;
  nextTick(() => {
    form.id = data.id;
    form.uid = data.uid;
    form.fromDid = data.fromDid;
    // 如果后端没有返回 fromDidName，则从用户部门映射中获取
    form.fromDidName = data.fromDidName || userDeptMap.value[data.uid]?.deptName || "";
    form.toDid = data.toDid;
    form.moveTime = data.moveTime;
    form.remark = data.remark;
  });
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = { ...form };

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
});
</script>

<style scoped>
.transfer-add-edit-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.transfer-add-edit-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.transfer-add-edit-dialog .el-dialog__footer {
  border-top: 1px solid #f7f7f7;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
}
</style>
