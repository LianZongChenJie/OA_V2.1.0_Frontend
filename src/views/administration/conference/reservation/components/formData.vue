<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="readonly ? {} : rules"
    label-width="120px"
  >
    <el-form-item label="会议主题" prop="title" required>
      <el-input
        v-model="form.title"
        placeholder="请输入会议主题"
        :disabled="readonly"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="会议室" prop="roomId" required>
      <el-select
        v-model="form.roomId"
        :disabled="readonly"
        placeholder="请选择会议室"
        filterable
        clearable
        style="width:100%"
      >
        <el-option
          v-for="item in roomOptions"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="开始时间" prop="startDate" required>
      <el-date-picker
        v-model="form.startDate"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        placeholder="请选择开始时间"
        :disabled="readonly"
        style="width:100%"
      />
    </el-form-item>

    <el-form-item label="结束时间" prop="endDate" required>
      <el-date-picker
        v-model="form.endDate"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        placeholder="请选择结束时间"
        :disabled="readonly"
        style="width:100%"
      />
    </el-form-item>

    <el-form-item label="会议人数" prop="num" required>
      <el-input-number
        v-model="form.num"
        :min="1"
        :max="1000"
        placeholder="请输入会议人数"
        :disabled="readonly"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="会议需求">
      <el-checkbox-group v-model="form.requirementList" :disabled="readonly">
        <el-checkbox label="电子屏" />
        <el-checkbox label="投影背景" />
        <el-checkbox label="电脑" />
        <el-checkbox label="视频" />
        <el-checkbox label="购买水果" />
        <el-checkbox label="订餐" />
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="其他要求">
      <el-input
        v-model="form.requirements"
        type="textarea"
        rows="3"
        placeholder="请输入其他要求"
        :disabled="readonly"
        style="width: 100%"
      />
    </el-form-item>
  </el-form>
</template>

<script setup name="ConferenceFormData">
import { ref, reactive, onMounted, watch } from "vue";
import { getPageList } from "@/api/administration/conference/room/index.js";

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false
  }
});

const formRef = ref(null);

// 下拉选项数据
const roomOptions = ref([]);

// 保存原始数据，用于 roomOptions 加载完成后回显
const savedData = ref(null);

const form = reactive({
  id: undefined,
  title: "",
  roomId: null,
  startDate: "",
  endDate: "",
  num: 1,
  requirementList: [],
  requirements: "",
});

const rules = {
  title: [{ required: true, message: "请输入会议主题", trigger: "blur" }],
  roomId: [{ required: true, message: "请选择会议室", trigger: "change" }],
  startDate: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  endDate: [{ required: true, message: "请选择结束时间", trigger: "change" }],
  num: [
    { required: true, message: "请输入会议人数", trigger: "blur" },
    { type: 'number', min: 1, message: "会议人数必须大于0", trigger: "blur" }
  ]
};

/** 重置表单 */
function resetForm() {
  form.id = undefined;
  form.title = "";
  form.roomId = null;
  form.startDate = "";
  form.endDate = "";
  form.num = 1;
  form.requirementList = [];
  form.requirements = "";
  savedData.value = null;
  formRef.value?.clearValidate();
}

/** 解析需求字段 */
function parseRequirements(requirementsText) {
  let requirementList = [];
  let requirements = "";

  if (requirementsText) {
    const parts = requirementsText.split('；');
    if (parts.length > 0) {
      const firstPart = parts[0];
      const checkboxCandidates = firstPart.split('、').filter(Boolean);
      const checkboxOptions = ['电子屏', '投影背景', '电脑', '视频', '购买水果', '订餐'];
      requirementList = checkboxCandidates.filter(item => checkboxOptions.includes(item));
      const otherTexts = checkboxCandidates.filter(item => !checkboxOptions.includes(item));
      if (otherTexts.length > 0) {
        requirements = otherTexts.join('、');
      }
      if (parts.length > 1) {
        requirements += (requirements ? '；' : '') + parts.slice(1).join('；');
      }
    }
  }

  return { requirementList, requirements };
}

/** 设置表单数据 */
function setFormData(data) {
  // 保存原始数据
  savedData.value = data;

  const { requirementList, requirements } = parseRequirements(data.requirements);

  form.id = data.id;
  form.title = data.title || "";
  form.startDate = data.startDate || "";
  form.endDate = data.endDate || "";
  form.roomId = data.roomId ? Number(data.roomId) : null;
  form.num = data.num || 1;
  form.requirementList = requirementList;
  form.requirements = requirements;
}

/** 获取提交表单数据 */
function getSubmitData() {
  let requirementsText = form.requirementList.join('、');
  if (form.requirements && form.requirements.trim()) {
    requirementsText += (requirementsText ? '；' : '') + form.requirements;
  }

  return {
    id: form.id,
    title: form.title,
    roomId: Number(form.roomId),
    startDate: form.startDate,
    endDate: form.endDate,
    num: Number(form.num),
    requirements: requirementsText,
  };
}

/** 获取会议室列表 */
function getRoomList() {
  getPageList({ pageSize: 1000 }).then(res => {
    let list = [];
    if (res.rows && Array.isArray(res.rows)) {
      list = res.rows.map(row => {
        return Array.isArray(row) ? row[0] : row;
      }).filter(item => item && item.id);
    }
    roomOptions.value = list;
  });
}

/** 监听 roomOptions 加载完成，确保会议室能回显 */
watch(roomOptions, (newVal) => {
  if (newVal && newVal.length > 0 && savedData.value) {
    const data = savedData.value;
    form.roomId = data.roomId ? Number(data.roomId) : null;
  }
});

/** 验证表单 */
function validate() {
  return formRef.value?.validate();
}

defineExpose({
  formRef,
  resetForm,
  setFormData,
  getSubmitData,
  validate,
  form,
});

/** 初始化数据 */
onMounted(() => {
  getRoomList();
});
</script>

<style scoped>
</style>