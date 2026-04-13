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
      
      <el-form-item label="保管人" prop="keepUid" required>
        <el-select
          v-model="form.keepUid"
          :disabled="isView"
          :teleported="false"
          placeholder="请选择保管人"
          filterable
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

      <el-form-item label="应用部门" prop="dids" required>
        <el-cascader
          v-model="form.dids"
          :options="deptOptions"
          :multiple="true"
          :props="{
            value: 'id',
            label: 'label',
            children: 'children',
            checkStrictly: true,
            emitPath: false,
            disabled: 'disabled'
          }"
          :disabled="isView"
          placeholder="请选择应用部门"
          clearable
          collapse-tags
          collapse-tags-tooltip
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
        <el-button @click="handleClose">{{ isView ? "关 闭" : "取 消" }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="Addseal">
import { ref, reactive, computed, getCurrentInstance, onMounted, nextTick } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/base/administration/seal/index.js";
import { deptTreeSelect } from "@/api/system/user.js";
import { listUser } from "@/api/system/user.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);
const deptOptions = ref([]);
const userOptions = ref([]);

const form = reactive({
  id: undefined,
  title: "",
  keepUid: null,
  dids: [],
  remark: "",
  status: 1
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看印章";
  return isEdit.value ? "编辑印章" : "新增印章";
});

const rules = {
  title: [{ required: true, message: "请输入印章名称", trigger: "blur" }],
  keepUid: [{ required: true, message: "请选择保管人", trigger: "change" }],
  dids: [{ required: true, message: "请选择应用部门", trigger: "change" }]
};

// 递归给部门设置禁用状态
function setDeptDisabled(depts) {
  return depts.map(item => {
    item.disabled = item.status === "1" || item.status === 1;
    if (item.children && item.children.length) {
      item.children = setDeptDisabled(item.children);
    }
    return item;
  });
}

onMounted(() => {
  // 加载部门树
  deptTreeSelect().then(res => {
    deptOptions.value = setDeptDisabled(res.data || []);
  });

  // 加载用户（过滤禁用）
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(u => u.status === "0");
  });
});

function reset() {
  if (formRef.value) formRef.value.clearValidate();
  Object.assign(form, {
    id: undefined, title: "", keepUid: null, dids: [], remark: "", status: 1
  });
  isEdit.value = false;
  isView.value = false;
}

function handleClose() {
  reset();
  dialogVisible.value = false;
}

function open() {
  reset();
  dialogVisible.value = true;
}

// 🔥 核心修复：确保 keepUid 永远是单个ID，不是数组
function openEdit(data) {
  reset();
  form.id = data.id;
  form.title = data.title || "";
  
  // ✅ 关键修复：处理 keepUid，确保是单个数字ID
  if (data.keepUid) {
    if (Array.isArray(data.keepUid)) {
      // 如果是数组，取第一个元素
      form.keepUid = Number(data.keepUid[0]?.userId || data.keepUid[0]);
    } else {
      // 普通情况，直接转数字
      form.keepUid = Number(data.keepUid);
    }
  } else {
    form.keepUid = null;
  }

  form.remark = data.remark || "";
  form.status = data.status ?? 1;
  
  // 处理部门回显
  if (data.dids) {
    if (typeof data.dids === "string") {
      form.dids = data.dids.split(",").filter(Boolean).map(Number);
    } else {
      form.dids = data.dids;
    }
  } else {
    form.dids = [];
  }

  isEdit.value = true;
  nextTick(() => {
    dialogVisible.value = true;
  });
}

function openView(data) {
  reset();
  form.id = data.id;
  form.title = data.title || "";
  
  // ✅ 同样修复 keepUid
  if (data.keepUid) {
    if (Array.isArray(data.keepUid)) {
      form.keepUid = Number(data.keepUid[0]?.userId || data.keepUid[0]);
    } else {
      form.keepUid = Number(data.keepUid);
    }
  } else {
    form.keepUid = null;
  }

  form.remark = data.remark || "";
  form.status = data.status ?? 1;

  if (data.dids) {
    if (typeof data.dids === "string") {
      form.dids = data.dids.split(",").filter(Boolean).map(Number);
    } else {
      form.dids = data.dids;
    }
  } else {
    form.dids = [];
  }

  isView.value = true;
  nextTick(() => {
    dialogVisible.value = true;
  });
}

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      // 双重保险：确保 dids 是数组
      const deptIds = Array.isArray(form.dids) ? form.dids : [];
      const submitData = {
        ...form,
        dids: deptIds.join(",")
      };
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

<style scoped>
:deep(.el-cascader__tags) {
  flex-wrap: wrap;
}
:deep(.el-cascader__collapse-tags) {
  flex-wrap: wrap;
}
</style>