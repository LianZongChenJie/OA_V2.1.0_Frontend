<template>
  <el-dialog
    title="操作日志详细"
    v-model="dialogVisible"
    width="800px"
    append-to-body
    @close="handleClose"
  >
    <el-form :model="form" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
          <el-form-item
            label="登录信息："
          >{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
          <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="请求参数：" style="word-break: break-all; white-space: pre-wrap;">{{ form.operParam }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作状态：">
            <div v-if="form.status === 0">正常</div>
            <div v-else-if="form.status === 1">失败</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="消耗时间：">{{ form.costTime }}毫秒</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="OperlogDetail">
import { ref, reactive, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const { sys_oper_type } = proxy.useDict("sys_oper_type");

const dialogVisible = ref(false);
const form = reactive({});

/** 操作日志类型字典翻译 */
function typeFormat(row, column) {
  return proxy.selectDictLabel(sys_oper_type.value, row.businessType);
}

/** 关闭弹窗 */
function handleClose() {
  Object.assign(form, {});
}

/** 显示弹窗 */
function open(data) {
  Object.assign(form, data);
  dialogVisible.value = true;
}

defineExpose({
  open,
});
</script>
