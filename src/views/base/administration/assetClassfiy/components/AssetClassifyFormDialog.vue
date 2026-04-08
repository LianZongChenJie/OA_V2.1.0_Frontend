<template>
  <!-- 新增/编辑节点弹窗 -->
  <el-dialog :title="title" v-model="open" width="500px" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="上级节点" prop="pid">
        <el-input v-model="form.parentName" disabled placeholder="请选择上级节点" />
      </el-form-item>
      <el-form-item label="分类名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input
          v-model="form.desc"
          type="textarea"
          :rows="3"
          :maxlength="200"
          show-word-limit
          placeholder="请输入描述（200字以内）"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" placeholder="请输入排序" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, getCurrentInstance } from "vue";
import { addAssetClassify, updateAssetClassify } from "@/api/base/administration/assetClassfiy";

const emit = defineEmits(["success"]);
const { proxy } = getCurrentInstance();

// 弹窗相关
const open = ref(false);
const title = ref("");
const formRef = ref(null);
const isEdit = ref(false);

const data = reactive({
  form: {},
  rules: {
    title: [{ required: true, message: "分类名称不能为空", trigger: "blur" }],
  },
});
const { form, rules } = toRefs(data);

// 表单重置
function reset() {
  form.value = {
    id: undefined,
    pid: undefined,
    parentName: undefined,
    title: undefined,
    desc: undefined,
    status: 1, // 默认启用
    sort: 0,
  };
  isEdit.value = false;
  formRef.value?.resetFields();
}

// 新增
const add = (row) => {
  reset();
  // 如果有 row，说明是添加子节点
  if (row) {
    form.value.pid = row.id;
    form.value.parentName = row.title; // 从列表行中读取上级节点名称
  } else {
    form.value.pid = 0;
    form.value.parentName = "根节点";
  }
  isEdit.value = false;
  open.value = true;
  title.value = "添加子分类";
};

// 编辑
const edit = (row) => {
  reset();
  form.value = {
    id: row.id,
    pid: row.pid,
    parentName: row.pid === 0 ? '根节点' : row.title,
    title: row.title,
    desc: row.desc,
    status: row.status !== undefined ? row.status : 1,
    sort: row.sort || 0,
  };
  isEdit.value = true;
  open.value = true;
  title.value = "编辑分类";
};

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 提交按钮
function submitForm() {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = {
        ...form.value,
      };
      // pid 为 0 时不传
      if (submitData.pid === 0) {
        delete submitData.pid;
      }
      delete submitData.parentName;

      if (isEdit.value) {
        // 编辑时调用 updateAssetClassify
        updateAssetClassify(submitData).then(() => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          // 编辑时返回 pid，用于刷新对应父节点的子节点
          emit("success", submitData.pid || 0);
        });
      } else {
        // 新增时调用 addAssetClassify
        addAssetClassify(submitData).then(() => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          // 新增时返回 pid，用于刷新对应父节点的子节点
          emit("success", submitData.pid || 0);
        });
      }
    }
  });
}

// 暴露方法给父组件调用
defineExpose({
  add,
  edit,
});
</script>

<style lang="scss" scoped>
</style>