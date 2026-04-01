<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="approval-module-dialog"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="isView ? {} : rules" label-width="120px">
      <el-form-item label="印章名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入印章名称" :disabled="isView" />
      </el-form-item>
       <el-form-item label="保管人" prop="keepUid">
        <el-input v-model="form.keepUid" placeholder="请输入保管人" :disabled="isView" />
      </el-form-item>
      <el-form-item label="应用部门" prop="dids">
        <el-tree-select
          v-model="form.dids"
          :data="deptOptions"
          :props="{ value: 'id', label: 'label', children: 'children' }"
          :render-after-expand="false"
          show-checkbox
          multiple
          collapse-tags
          placeholder="请选择应用部门"
          clearable
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="用途简述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="2"
          placeholder="请输入用途简述"
          :disabled="isView"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">{{ isView ? "关 闭" : "取 消" }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="Addseal">
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/base/administration/seal/index.js";
import { deptTreeSelect } from "@/api/system/user.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);
const deptOptions = ref([]);

const form = reactive({
  id: undefined,
  title: "",
  keepUid: "",
  dids: [], // 🔴 修复：多选必须是数组
  remark: "",
  status: 1
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看印章";
  return isEdit.value ? "编辑印章" : "新增印章";
});

const rules = {
  title: [{ required: true, message: "请输入印章名称", trigger: "blur" }],
  keepUid: [{ required: true, message: "请输入保管人", trigger: "blur" }]
};

// 获取部门树
onMounted(() => {
  deptTreeSelect().then(res => {
    deptOptions.value = res.data;
  });
});

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.title = "";
  form.keepUid = "";
  form.dids = [];
  form.remark = "";
  form.status = 1;

  isEdit.value = false;
  isView.value = false;
  proxy.resetForm(formRef);
}

/** 关闭弹窗 */
function handleClose() {
  reset();
}

/** 新增 */
function open() {
  reset();
  dialogVisible.value = true;
}

/** 编辑 */
function openEdit(data) {
  reset();
  form.id = data.id;
  form.title = data.title;
  form.keepUid = data.keepUid;
  form.dids = data.dids ? (Array.isArray(data.dids) ? data.dids : data.dids.split(',')) : [];
  form.remark = data.remark;
  form.status = data.status;
  
  isEdit.value = true;
  dialogVisible.value = true;
}

/** 查看 */
function openView(data) {
  reset();
  form.id = data.id;
  form.title = data.title;
  form.keepUid = data.keepUid;
  form.dids = data.dids ? (Array.isArray(data.dids) ? data.dids : data.dids.split(',')) : [];
  form.remark = data.remark;
  form.status = data.status;

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = { ...form };
      // 数组转逗号字符串给后端
      submitData.dids = Array.isArray(form.dids) ? form.dids.join(',') : form.dids;

      const apiMethod = isEdit.value ? updateenterPrise : addenterPrise;
      apiMethod(submitData).then(() => {
        proxy.$modal.msgSuccess(isEdit.value ? "编辑成功" : "新增成功");
        dialogVisible.value = false;
        emit("success");
      });
    }
  });
}

const emit = defineEmits(["success"]);
defineExpose({ open, openEdit, openView });
</script>

<style>
.approval-module-dialog .el-dialog { max-height: 88vh; display: flex; flex-direction: column; }
.approval-module-dialog .el-dialog__body { max-height: calc(88vh - 120px); overflow-y: auto; }
</style>