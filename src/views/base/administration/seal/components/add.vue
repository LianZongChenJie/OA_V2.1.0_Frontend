<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="approval-module-dialog"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="isView ? {} : rules" label-width="130px">
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
      <div style="text-align:center">
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
const deptLoaded = ref(false);

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
  dids: [
    { 
      required: true, 
      validator: (rule, value, callback) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          callback(new Error("请选择应用部门"));
        } else {
          callback();
        }
      }, 
      trigger: "change" 
    }
  ]
};

// 加载部门树
async function loadDeptOptions() {
  if (deptOptions.value.length > 0) return deptOptions.value;
  const res = await deptTreeSelect();
  const treeData = setDeptDisabled(res.data || []);
  deptOptions.value = treeData;
  deptLoaded.value = true;
  console.log('部门树加载完成:', deptOptions.value);
  return deptOptions.value;
}

// 部门禁用递归处理
function setDeptDisabled(depts) {
  if (!depts || !Array.isArray(depts)) return [];
  return depts.map(item => {
    const newItem = { ...item };
    newItem.disabled = item.status === "1" || item.status === 1;
    if (newItem.children && newItem.children.length) {
      newItem.children = setDeptDisabled(newItem.children);
    }
    return newItem;
  });
}

function reset() {
  if (formRef.value) formRef.value.clearValidate();
  Object.assign(form, {
    id: undefined,
    title: "",
    keepUid: null,
    dids: [],
    remark: "",
    status: 1
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

// 编辑回显处理
async function openEdit(data) {
  reset();
  
  console.log('=== 编辑回显调试 ===');
  console.log('1. 原始 data:', data);
  console.log('2. 原始 data.dids:', data.dids, typeof data.dids);
  
  // 确保部门树已加载
  if (!deptLoaded.value && deptOptions.value.length === 0) {
    console.log('等待部门树加载...');
    await loadDeptOptions();
  }
  
  console.log('3. deptOptions 加载完成，长度:', deptOptions.value.length);
  console.log('4. deptOptions 中的部门ID示例:', deptOptions.value[0]?.id, typeof deptOptions.value[0]?.id);
  
  form.id = data.id;
  form.title = data.title || "";
  form.keepUid = data.keepUid ? Number(data.keepUid) : null;
  form.remark = data.remark || "";
  form.status = data.status ?? 1;
  
  // 统一转为数字数组
  if (data.dids) {
    if (typeof data.dids === "string") {
      form.dids = data.dids.split(",").filter(Boolean).map(Number);
    } else if (Array.isArray(data.dids)) {
      form.dids = data.dids.map(item => Number(item));
    } else {
      form.dids = [];
    }
  } else {
    form.dids = [];
  }
  
  console.log('5. 转换后 form.dids (数字数组):', form.dids);
  
  // 检查部门是否存在
  const checkDepts = form.dids.map(id => {
    const found = findDeptById(deptOptions.value, id);
    return { id, found: !!found, name: found?.label };
  });
  console.log('6. 部门检查结果:', checkDepts);
  
  isEdit.value = true;
  
  // 先打开弹窗
  dialogVisible.value = true;
  
  // 等待 DOM 更新后强制刷新 cascader
  await nextTick();
  await nextTick(); // 双重 nextTick 确保 DOM 完全渲染
  
  // 如果还是没显示，强制重新赋值
  if (form.dids.length > 0) {
    const temp = [...form.dids];
    form.dids = [];
    await nextTick();
    form.dids = temp;
    console.log('7. 强制刷新后的 form.dids:', form.dids);
  }
}

// 查看回显处理
async function openView(data) {
  reset();
  
  // 确保部门树已加载
  if (!deptLoaded.value && deptOptions.value.length === 0) {
    await loadDeptOptions();
  }
  
  form.id = data.id;
  form.title = data.title || "";
  form.keepUid = data.keepUid ? Number(data.keepUid) : null;
  form.remark = data.remark || "";
  form.status = data.status ?? 1;
  
  // 统一转为数字数组
  if (data.dids) {
    if (typeof data.dids === "string") {
      form.dids = data.dids.split(",").filter(Boolean).map(Number);
    } else if (Array.isArray(data.dids)) {
      form.dids = data.dids.map(item => Number(item));
    } else {
      form.dids = [];
    }
  } else {
    form.dids = [];
  }

  isView.value = true;
  dialogVisible.value = true;
  
  await nextTick();
  await nextTick();
}

// 辅助函数：递归查找部门
function findDeptById(tree, id) {
  if (!tree || !Array.isArray(tree)) return null;
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children && node.children.length) {
      const found = findDeptById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (!valid) return;

    const submitData = {
      id: form.id,
      title: form.title,
      keepUid: form.keepUid,
      remark: form.remark,
      status: form.status
    };
    
    // 确保 dids 是数组并转为字符串再 join
    let didsArray = form.dids;
    if (!Array.isArray(didsArray)) {
      didsArray = didsArray ? [String(didsArray)] : [];
    } else if (didsArray.length > 0) {
      didsArray = didsArray.map(String);
    }
    
    if (didsArray.length > 0) {
      submitData.dids = didsArray.join(",");
    }

    const apiMethod = isEdit.value ? updateenterPrise : addenterPrise;
    apiMethod(submitData).then(() => {
      proxy.$modal.msgSuccess(isEdit.value ? "编辑成功" : "新增成功");
      dialogVisible.value = false;
      emit("success");
    }).catch(error => {
      console.error('提交失败:', error);
      proxy.$modal.msgError("操作失败");
    });
  });
}

// 初始化加载
onMounted(async () => {
  await loadDeptOptions();
  
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(u => u.status === "0");
  });
});

const emit = defineEmits(["success"]);
defineExpose({ open, openEdit, openView });
</script>

<style>
.approval-module-dialog.el-dialog {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.approval-module-dialog .el-dialog__body {
  overflow-y: auto;
}
</style>

<style scoped>
:deep(.el-cascader__tags) {
  flex-wrap: wrap;
}
:deep(.el-cascader__collapse-tags) {
  flex-wrap: wrap;
}
</style>