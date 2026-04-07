<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="600px"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      
      <el-form-item label="奖惩项目" prop="rewardItem" required>
        <el-select v-model="form.rewardItem" placeholder="请选择" style="width: 100%">
          <el-option label="请选择" value="" />
          <el-option label="生日福利" value="生日福利" />
          <el-option label="节日福利" value="节日福利" />
          <el-option label="迟到扣款" value="迟到扣款" />
          <el-option label="全勤奖励" value="全勤奖励" />
          <el-option label="表现优秀" value="表现优秀" />
          <el-option label="违规操作" value="违规操作" />
        </el-select>
      </el-form-item>

      <el-form-item label="奖惩类型" prop="rewardType" required>
        <el-radio-group v-model="form.rewardType">
          <el-radio label="1">奖励</el-radio>
          <el-radio label="0">惩罚</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="当前状态" prop="status" required>
        <el-radio-group v-model="form.status">
          <el-radio label="1">待执行</el-radio>
          <el-radio label="0">已执行</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 员工姓名（下拉选择人员） -->
      <el-form-item label="员工姓名" prop="empName" required>
        <el-select
          v-model="form.empName"
          :disabled="isView"
          placeholder="请选择员工"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.userName"
            :value="item.userName"
          />
        </el-select>
      </el-form-item>


      <el-form-item label="奖惩金额(元)" prop="amount" required>
        <el-input v-model="form.amount" placeholder="请输入金额" style="width: 100%" />
      </el-form-item>

      <el-form-item label="奖惩日期" prop="rewardDate" required>
        <el-date-picker
          v-model="form.rewardDate"
          type="date"
          placeholder="请选择"
          style="width: 100%"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="奖惩物品" prop="gift">
        <el-input v-model="form.gift" placeholder="请输入奖惩物品" style="width: 100%" />
      </el-form-item>

      <el-form-item label="奖惩描述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入奖惩描述"
          style="width: 100%"
        />
      </el-form-item>

    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">立即提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddReward">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { listUser } from "@/api/system/user.js"; // 引入用户接口

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);
const userOptions = ref([]); // 用户列表

const form = reactive({
  rewardItem: "",
  rewardType: "1",
  status: "1",
  empName: "",
  copyUids: [], // 抄送人
  amount: "",
  rewardDate: "",
  gift: "",
  remark: ""
});

const dialogTitle = computed(() => {
  return isView.value ? "查看奖惩信息" : isEdit.value ? "编辑奖惩信息" : "新增奖惩信息";
});

const rules = {
  rewardItem: [{ required: true, message: "请选择奖惩项目", trigger: "change" }],
  rewardType: [{ required: true, message: "请选择奖惩类型", trigger: "change" }],
  status: [{ required: true, message: "请选择当前状态", trigger: "change" }],
  empName: [{ required: true, message: "请选择员工姓名", trigger: "change" }],
  amount: [{ required: true, message: "请输入奖惩金额", trigger: "blur" }],
  rewardDate: [{ required: true, message: "请选择奖惩日期", trigger: "change" }],
};

// 获取用户列表（和上面审批弹窗一样）
function getUserList() {
  listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
    userOptions.value = response.rows || [];
  });
}

onMounted(() => {
  getUserList(); // 打开页面就加载用户
});

function reset() {
  form.rewardItem = "";
  form.rewardType = "1";
  form.status = "1";
  form.empName = "";
  form.copyUids = [];
  form.amount = "";
  form.rewardDate = "";
  form.gift = "";
  form.remark = "";
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate?.();
}

function handleClose() {
  dialogVisible.value = false;
  reset();
}

function open() {
  reset();
  dialogVisible.value = true;
}

function openEdit(data) {
  reset();
  Object.assign(form, data);
  isEdit.value = true;
  dialogVisible.value = true;
}

function openView(data) {
  reset();
  Object.assign(form, data);
  isView.value = true;
  dialogVisible.value = true;
}

async function handleSubmit() {
  const valid = await formRef.value?.validate?.();
  if (!valid) return;

  try {
    ElMessage.success(isEdit.value ? "编辑成功" : "新增成功");
    dialogVisible.value = false;
    emit("success");
  } catch (err) {
    ElMessage.error("操作失败");
  }
}

const emit = defineEmits(["success"]);
defineExpose({ open, openEdit, openView, getUserList });
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>