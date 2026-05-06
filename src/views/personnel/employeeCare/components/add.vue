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
          <el-radio :label="1">未执行</el-radio>
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

const emit = defineEmits(["success"]);

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
  // 处理日期格式：如果后端返回的是完整时间格式，只取年月日部分
  if (data.careTime) {
    data.careTime = formatDateOnly(data.careTime);
  }
  // 移除 createTime 和 updateTime 等不需要的字段
  const { createTime, updateTime, ...cleanData } = data;
  Object.assign(form, cleanData);
  isEdit.value = true;
  dialogVisible.value = true;
}

function openView(data) {
  reset();
  // 处理日期格式：如果后端返回的是完整时间格式，只取年月日部分
  if (data.careTime) {
    data.careTime = formatDateOnly(data.careTime);
  }
  // 移除 createTime 和 updateTime 等不需要的字段
  const { createTime, updateTime, ...cleanData } = data;
  Object.assign(form, cleanData);
  isView.value = true;
  dialogVisible.value = true;
}

// 格式化日期：只保留年月日
function formatDateOnly(dateTime) {
  if (!dateTime) return "";
  
  // 如果是字符串格式
  if (typeof dateTime === "string") {
    // 如果已经是 YYYY-MM-DD 格式，直接返回
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateTime)) {
      return dateTime;
    }
    // 如果是 YYYY-MM-DD HH:mm:ss 格式，只取前面部分
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateTime)) {
      return dateTime.split(' ')[0];
    }
  }
  
  // 如果是时间戳（秒或毫秒）
  if (typeof dateTime === "number") {
    const timestamp = dateTime.toString().length === 10 ? dateTime * 1000 : dateTime;
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  
  return dateTime;
}

// 将日期加上时分秒（默认 00:00:00）
function addTimeToDate(dateStr) {
  if (!dateStr) return "";
  // 如果已经是完整格式，直接返回
  if (typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  // 如果是 YYYY-MM-DD 格式，加上 00:00:00
  if (typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return `${dateStr} 00:00:00`;
  }
  return dateStr;
}

async function handleSubmit() {
  const valid = await formRef.value?.validate?.();
  if (!valid) return;

  // 构建提交数据，排除不需要的字段
  const submitData = {
    careCate: Number(form.careCate),
    status: Number(form.status),
    uid: Number(form.uid),
    cost: Number(form.cost),
    careTime: addTimeToDate(form.careTime),
    thing: form.thing || "",
    remark: form.remark || ""
  };

  // 如果是编辑，需要加上 id
  if (isEdit.value && form.id) {
    submitData.id = form.id;
  }

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
    console.error("提交失败:", err);
  }
}

defineExpose({ open, openEdit, openView });
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>