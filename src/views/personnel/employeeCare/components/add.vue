<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="600px"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
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

      <el-form-item label="关怀项目" prop="careCate" required>
        <el-select
          v-model="form.careCate"
          :disabled="isView"
          placeholder="请选择"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in careItemList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="当前状态" prop="status" required>
        <el-radio-group v-model="form.status" :disabled="isView">
          <el-radio :label="1">待执行</el-radio>
          <el-radio :label="2">已执行</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="关怀金额(元)" prop="cost" required>
        <el-input v-model="form.cost" :disabled="isView" placeholder="请输入金额" style="width: 100%" />
      </el-form-item>

      <el-form-item label="关怀日期" prop="careTime" required>
        <el-date-picker
          v-model="form.careTime"
          :disabled="isView"
          type="date"
          placeholder="请选择"
          style="width: 100%"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="关怀物品" prop="thing">
        <el-input v-model="form.thing" :disabled="isView" placeholder="请输入关怀物品" style="width: 100%" />
      </el-form-item>

      <el-form-item label="关怀描述" prop="remark">
        <el-input
          v-model="form.remark"
          :disabled="isView"
          type="textarea"
          :rows="4"
          placeholder="请输入关怀描述"
          style="width: 100%"
        />
      </el-form-item>

    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">立即提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddCareDialog">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { listUser } from "@/api/system/user.js";
import { getPageList } from '@/api/base/hr/careProgram/index.js';
import { addDeptChange, updateDeptChange } from "@/api/personnel/employeeCare/index.js";

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);
const userOptions = ref([]);
const careItemList = ref([]);

const form = reactive({
  careCate: "",
  status: 1,
  uid: "",
  copyUids: [],
  cost: "",
  careTime: "",
  thing: "",
  remark: ""
});

const dialogTitle = computed(() => {
  return isView.value ? "查看关怀信息" : isEdit.value ? "编辑关怀信息" : "新增关怀信息";
});

const rules = {
  careCate: [{ required: true, message: "请选择关怀项目", trigger: "change" }],
  status: [{ required: true, message: "请选择当前状态", trigger: "change" }],
  uid: [{ required: true, message: "请选择员工姓名", trigger: "change" }],
  cost: [
    { required: true, message: "请输入关怀金额", trigger: "blur" },
    { pattern: /^(?!0+(?:\.0+)?$)\d+(?:\.\d{1,2})?$/, message: "请输入大于0的正数，最多保留2位小数", trigger: "blur" }
  ],
  careTime: [{ required: true, message: "请选择关怀日期", trigger: "change" }],
};

onMounted(() => {
  listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
    userOptions.value = (response.rows || []).filter(user => user.status === '0' || user.status === 0);
  });
  getPageList({ pageNum: 1, pageSize: 1000 }).then((response) => {
    careItemList.value = response.rows || [];
  });
});

function reset() {
  form.careCate = "";
  form.status = 1;
  form.uid = "";
  form.copyUids = [];
  form.cost = "";
  form.careTime = "";
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

  // 所有数字类型强转，careTime 保持字符串
  const submitData = {
    ...form,
    uid: Number(form.uid),
    careCate: Number(form.careCate),
    status: Number(form.status),
    cost: Number(form.cost)
  };

  try {
    if (isEdit.value) {
      await updateDeptChange(submitData);
    } else {
      await addDeptChange(submitData);
    }
    ElMessage.success(isEdit.value ? "编辑成功" : "新增成功");
    dialogVisible.value = false;
    emit("success");
  } catch (err) {
    ElMessage.error("操作失败");
  }
}

const emit = defineEmits(["success"]);
defineExpose({ open, openEdit, openView });
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>