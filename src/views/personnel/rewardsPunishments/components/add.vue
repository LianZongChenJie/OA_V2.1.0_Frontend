<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="600px"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      
      <el-form-item label="奖惩项目" prop="rewardsCate" required>
        <el-select
          v-model="form.rewardsCate"
          :disabled="isView"
          placeholder="请选择"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in rewardsCateList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="奖惩类型" prop="types" required>
        <el-radio-group v-model="form.types" :disabled="isView">
          <el-radio :label="1">奖励</el-radio>
          <el-radio :label="0">惩罚</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="当前状态" prop="status" required>
        <el-radio-group v-model="form.status" :disabled="isView">
          <el-radio :label="1">待执行</el-radio>
          <el-radio :label="0">已执行</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="员工姓名" prop="uid" required>
        <el-select
          v-model="form.uid"
          :disabled="isView"
          placeholder="请选择员工"
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

      <el-form-item label="奖惩金额(元)" prop="cost" required>
        <el-input v-model="form.cost" placeholder="请输入金额" style="width: 100%" :disabled="isView" />
      </el-form-item>

      <el-form-item label="奖惩日期" prop="rewardsTime" required>
        <el-date-picker
          v-model="form.rewardsTime"
          type="date"
          placeholder="请选择"
          style="width: 100%"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :disabled="isView"
        />
      </el-form-item>

      <el-form-item label="奖惩物品" prop="thing">
        <el-input v-model="form.thing" placeholder="请输入奖惩物品" style="width: 100%" :disabled="isView" />
      </el-form-item>

      <el-form-item label="奖惩描述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入奖惩描述"
          style="width: 100%"
          :disabled="isView"
        />
      </el-form-item>

    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit" v-if="!isView">立即提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddReward">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { listUser } from "@/api/system/user.js";
import { getPageList } from "@/api/base/hr/rewards/index.js";
import { addDeptChange, updateDeptChange } from "@/api/personnel/rewardsPunishments/index.js";

const emit = defineEmits(["success"]);

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);
const userOptions = ref([]);
const rewardsCateList = ref([]);

const form = reactive({
  id: undefined,
  rewardsCate: null,  // 改为存 ID，int 类型
  types: 1,
  status: 1,
  uid: null,
  copyUids: [],
  cost: "",
  rewardsTime: "",
  thing: "",
  remark: ""
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看奖惩信息";
  if (isEdit.value) return "编辑奖惩信息";
  return "新增奖惩信息";
});

const rules = {
  rewardsCate: [{ required: true, message: "请选择奖惩项目", trigger: "change" }],
  types: [{ required: true, message: "请选择奖惩类型", trigger: "change" }],
  status: [{ required: true, message: "请选择当前状态", trigger: "change" }],
  uid: [{ required: true, message: "请选择员工姓名", trigger: "change" }],
  cost: [
    { required: true, message: "请输入奖惩金额", trigger: "blur" },
    { 
      validator: (rule, value, callback) => {
        if (value === '' || value === null || value === undefined) {
          callback();
          return;
        }
        const num = Number(value);
        if (isNaN(num)) {
          callback(new Error('请输入数字'));
        } else if (num <= 0) {
          callback(new Error('金额必须大于0'));
        } else if (!Number.isInteger(num) && !/^\d+(\.\d{1,2})?$/.test(value)) {
          callback(new Error('最多保留两位小数'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  rewardsTime: [{ required: true, message: "请选择奖惩日期", trigger: "change" }],
};

onMounted(() => {
  loadUserList();
  loadRewardsCateList();
});

// 加载员工列表
function loadUserList() {
  listUser({ pageNum: 1, pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(user => user.status === '0' || user.status === 0);
  });
}

// 加载奖惩项目列表
function loadRewardsCateList() {
  getPageList({ pageNum: 1, pageSize: 1000 }).then(res => {
    rewardsCateList.value = res.rows || [];
  });
}

function reset() {
  form.id = undefined;
  form.rewardsCate = null;
  form.types = 1;
  form.status = 1;
  form.uid = null;
  form.copyUids = [];
  form.cost = "";
  form.rewardsTime = "";
  form.thing = "";
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
  Object.assign(form, {
    ...data,
    rewardsCate: data.rewardsCate,  // 直接使用 ID
    uid: data.uid,
    types: data.types,
    status: data.status
  });
  isEdit.value = true;
  dialogVisible.value = true;
}

function openView(data) {
  reset();
  Object.assign(form, {
    ...data,
    rewardsCate: data.rewardsCate,
    uid: data.uid,
    types: data.types,
    status: data.status
  });
  isView.value = true;
  dialogVisible.value = true;
}

async function handleSubmit() {
  const valid = await formRef.value?.validate?.();
  if (!valid) return;

  // 验证金额格式
  const costNum = Number(form.cost);
  if (isNaN(costNum) || costNum <= 0) {
    ElMessage.error("请输入有效的金额");
    return;
  }

  const submitData = {
    id: form.id,
    rewardsCate: Number(form.rewardsCate),  // 转为 int 类型
    types: Number(form.types),
    status: Number(form.status),
    uid: Number(form.uid),
    cost: costNum,
    rewardsTime: Math.floor(new Date(form.rewardsTime).getTime() / 1000),
    thing: form.thing || "",
    remark: form.remark || ""
  };

  try {
    if (isEdit.value) {
      await updateDeptChange(submitData);
    } else {
      await addDeptChange(submitData);
    }
    ElMessage.success("操作成功");
    dialogVisible.value = false;
    emit("success");
  } catch (err) {
    console.error("操作失败:", err);
    ElMessage.error(err.msg || "操作失败");
  }
}

defineExpose({ open, openEdit, openView });
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>