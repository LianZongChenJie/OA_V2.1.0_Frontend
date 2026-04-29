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
          :props="cascaderProps"
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
const deptMap = ref(new Map()); 

// 级联选择器配置
const cascaderProps = {
  value: 'id',
  label: 'label',
  children: 'children',
  checkStrictly: true,
  multiple: true,
  emitPath: true, 
  disabled: 'disabled'
};

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
  
  buildDeptMap(treeData);
  
  console.log('部门树加载完成:', deptOptions.value);
  return deptOptions.value;
}

// 构建部门映射表
function buildDeptMap(tree, parentPath = []) {
  if (!tree || !Array.isArray(tree)) return;
  
  for (const node of tree) {
    const currentPath = [...parentPath, node.id];
    deptMap.value.set(node.id, {
      ...node,
      path: currentPath
    });
    
    if (node.children && node.children.length) {
      buildDeptMap(node.children, currentPath);
    }
  }
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

// 将部门ID数组转换为路径数组
function convertIdsToPaths(deptIds) {
  if (!deptIds || deptIds.length === 0) return [];
  
  const paths = [];
  for (const id of deptIds) {
    const deptInfo = deptMap.value.get(Number(id));
    if (deptInfo && deptInfo.path) {
      paths.push(deptInfo.path);
    } else {
      console.warn(`未找到部门ID ${id} 的路径，使用单值`);
      paths.push([Number(id)]);
    }
  }
  return paths;
}

// 从路径数组中提取部门ID
function extractIdsFromPaths(paths) {
  if (!paths || !Array.isArray(paths)) return [];
  
  return paths.map(path => {
    if (Array.isArray(path) && path.length > 0) {
      return path[path.length - 1];
    }
    return path;
  }).filter(id => id !== null && id !== undefined);
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

// 编辑回显
async function openEdit(data) {
  reset();
  
  console.log('=== 编辑回显数据 ===', data);
  
  if (deptOptions.value.length === 0) {
    await loadDeptOptions();
  }
  
  // 填充基础信息
  form.id = data.id;
  form.title = data.title || "";
  form.keepUid = data.keepUid ? Number(data.keepUid) : null;
  form.remark = data.remark || "";
  form.status = data.status ?? 1;
  
  // 处理部门ID
  let deptIds = [];
  if (data.dids) {
    if (typeof data.dids === "string") {
      deptIds = data.dids.split(",").filter(Boolean).map(Number);
    } else if (Array.isArray(data.dids)) {
      deptIds = data.dids.map(id => Number(id));
    }
  }
  
  console.log('部门ID数组:', deptIds);
  
  // 转换为路径数组
  form.dids = convertIdsToPaths(deptIds);
  
  console.log('路径数组:', form.dids);
  
  isEdit.value = true;
  dialogVisible.value = true;
  
  // 强制刷新
  await nextTick();
  if (form.dids.length > 0) {
    const temp = [...form.dids];
    form.dids = [];
    await nextTick();
    form.dids = temp;
  }
}

// 查看回显
async function openView(data) {
  reset();
  
  // 确保部门树已加载
  if (deptOptions.value.length === 0) {
    await loadDeptOptions();
  }
  
  form.id = data.id;
  form.title = data.title || "";
  form.keepUid = data.keepUid ? Number(data.keepUid) : null;
  form.remark = data.remark || "";
  form.status = data.status ?? 1;
  
  // 处理部门ID
  let deptIds = [];
  if (data.dids) {
    if (typeof data.dids === "string") {
      deptIds = data.dids.split(",").filter(Boolean).map(Number);
    } else if (Array.isArray(data.dids)) {
      deptIds = data.dids.map(id => Number(id));
    }
  }
  
  form.dids = convertIdsToPaths(deptIds);
  
  isView.value = true;
  dialogVisible.value = true;
  
  await nextTick();
}

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (!valid) return;

    const deptIds = extractIdsFromPaths(form.dids);
    
    const submitData = {
      id: form.id,
      title: form.title,
      keepUid: form.keepUid,
      remark: form.remark,
      status: form.status
    };
    
    if (deptIds.length > 0) {
      submitData.dids = deptIds.join(",");
    }
    
    console.log('提交数据:', submitData);

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