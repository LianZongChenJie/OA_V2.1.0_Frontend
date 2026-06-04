<template>
  <el-form ref="formRef" :model="localForm" :rules="computedRules" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="所属城市" prop="cityId">
          <CityCascader
            ref="cityCascaderRef"
            v-model="localForm.cityId"
            :disabled="disabled"
            @city-change="handleCityChange"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="localForm.projectName"
            :disabled="disabled"
            placeholder="请输入项目名称"
            clearable
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="社保结算时间" prop="socialDate">
          <el-input
            v-model.number="localForm.socialDate"
            :disabled="disabled"
            placeholder="请输入"
            style="width: 100%"
          >
            <template #prepend>每月</template>
            <template #append>日</template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="负责人" prop="manager">
          <el-select
            v-model="localForm.manager"
            :disabled="disabled"
            placeholder="请选择负责人"
            filterable
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="String(item.userId)"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="关联人员">
          <el-select
            v-model="localForm.relatedUsers"
            :disabled="disabled"
            placeholder="请选择关联人员"
            multiple
            collapse-tags-tooltip
            filterable
            :close-on-select="false"
            style="width: 100%"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="String(item.userId)"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="备注说明" prop="remark">
          <el-input
            v-model="localForm.remark"
            :disabled="disabled"
            type="textarea"
            :rows="3"
            maxlength="300"
            show-word-limit
            placeholder="请输入备注说明（最多300字）"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import CityCascader from "@/components/CityCascader/index.vue";

const props = defineProps({
  modelValue: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
  userOptions: { type: Array, default: () => [] },
  rules: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["update:modelValue", "city-change"]);

const formRef = ref(null);
const cityCascaderRef = ref(null);
let syncing = false;

// 本地表单数据，与父组件同步
const localForm = reactive({ ...props.modelValue });

// 监听父组件数据变化同步到本地
watch(
  () => props.modelValue,
  (val) => {
    if (syncing) return;
    syncing = true;
    Object.assign(localForm, val);
    syncing = false;
  },
  { deep: true },
);

// 监听本地数据变化同步到父组件
watch(
  localForm,
  (val) => {
    if (syncing) return;
    syncing = true;
    emit("update:modelValue", { ...val });
    syncing = false;
  },
  { deep: true },
);

// 查看模式下禁用校验
const computedRules = computed(() => {
  return props.disabled ? {} : props.rules;
});

/** 城市选择变更：保存完整路径名称到 localForm.city */
function handleCityChange(cityName) {
  localForm.city = cityName;
}

/** 弹窗打开后设置级联值 */
function handleOpened() {
  cityCascaderRef.value?.handleOpened();
}

/** 设置待处理的 cityId（用于编辑回显） */
function setPendingCityId(cityIdArray) {
  cityCascaderRef.value?.setPendingCityId(cityIdArray);
}

/** 重置本地表单 */
function resetForm(defaultForm) {
  syncing = true;
  Object.assign(localForm, defaultForm);
  syncing = false;
}

defineExpose({
  formRef,
  handleOpened,
  setPendingCityId,
  resetForm,
});
</script>