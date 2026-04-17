<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="70%"
    append-to-body
    class="car-dialog"
    @close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="isView ? {} : rules" 
      label-width="100px"
      style="margin-top: 15px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="name" required>
            <el-input v-model="form.name" placeholder="请输入项目名称" :disabled="isView" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属部门" prop="did" required>
            <el-cascader
              v-model="form.did"
              :options="deptOptions"
              :props="cascaderProps"
              :disabled="isView"
              placeholder="请选择归属部门"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="项目类别" prop="cateId" required>
            <el-select v-model="form.cateId" :disabled="isView" placeholder="请选择" filterable clearable>
              <el-option v-for="item in cateOptions" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目经理" prop="directorUid" required>
            <el-select v-model="form.directorUid" :disabled="isView" placeholder="请选择" filterable clearable>
              <el-option v-for="item in userOptions" :key="item.userId" :label="item.nickName" :value="item.userId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起止日期" prop="dateRange" required>
            <el-date-picker
              v-model="form.dateRange"
              type="daterange"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="项目成员" prop="customerId" required>
            <el-select v-model="form.customerId" multiple :disabled="isView" placeholder="请选择" filterable clearable>
              <el-option v-for="item in userOptions" :key="item.userId" :label="item.nickName" :value="item.userId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="关联合同" prop="contractId">
            <el-select v-model="form.contractId" :disabled="isView" placeholder="请选择" filterable clearable>
              <el-option v-for="item in contractOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="项目简介" prop="content">
            <el-input v-model="form.content" type="textarea" rows="3" placeholder="请输入项目简介" :disabled="isView" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="项目阶段" required>
        <el-button type="success" icon="el-icon-plus" @click="addStage" :disabled="isView">+ 添加阶段</el-button>
        <el-table :data="form.stageList" border size="small" style="margin-top: 10px">
          <el-table-column label="序号" width="70" align="center">
            <template #default="{ $index }">{{ $index + 1 }}</template>
          </el-table-column>

          <el-table-column label="阶段名称" min-width="120">
            <template #default="{ $index }">
              <el-form-item :prop="`stageList.${$index}.name`" :rules="stageNameRule" style="margin:0">
                <el-input v-model="form.stageList[$index].name" :disabled="isView" placeholder="阶段名称" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="阶段负责人" min-width="150">
            <template #default="{ $index }">
              <el-form-item :prop="`stageList.${$index}.directorUid`" :rules="stageLeaderRule" style="margin:0">
                <el-select v-model="form.stageList[$index].directorUid" :disabled="isView" placeholder="负责人" clearable>
                  <el-option v-for="item in userOptions" :key="item.userId" :label="item.nickName" :value="item.userId" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="阶段成员" min-width="260">
            <template #default="{ $index }">
              <el-select v-model="form.stageList[$index].memberUids" multiple :disabled="isView" placeholder="成员">
                <el-option v-for="item in userOptions" :key="item.userId" :label="item.nickName" :value="item.userId" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="阶段周期" min-width="260">
            <template #default="{ $index }">
              <el-form-item :prop="`stageList.${$index}.timeRange`" :rules="stageDateRule" style="margin:0">
                <el-date-picker
                  v-model="form.stageList[$index].timeRange"
                  type="daterange"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :disabled="isView"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="阶段说明" min-width="200">
            <template #default="{ $index }">
              <el-input v-model="form.stageList[$index].remark" :disabled="isView" placeholder="说明" />
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="{ $index }">
              <el-button size="small" type="success" @click="moveUp($index)">上移</el-button>
              <el-button size="small" type="primary" @click="moveDown($index)">下移</el-button>
              <el-button size="small" type="danger" @click="delStage($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <template #footer>
      <div style="text-align:center">
        <el-button type="primary" @click="handleSubmit" v-if="!isView">提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { addenterPrise, updateenterPrise } from "@/api/project/itemList/index.js";
import { listUser, deptTreeSelect } from "@/api/system/user.js";
import { getPageList } from "@/api/base/project/projectClassify/index.js";
import { getPageList as getContractList } from "@/api/contract/salesContract/index.js";

const emit = defineEmits(["success"]);

// ========== 常量配置 ==========
const cascaderProps = {
  value: "id",
  label: "label",
  children: "children",
  checkStrictly: true,
  emitPath: false
};

const stageNameRule = [{ required: true, message: "请输入阶段名称", trigger: "blur" }];
const stageLeaderRule = [{ required: true, message: "请选择负责人", trigger: "change" }];
const stageDateRule = [{ required: true, message: "请选择阶段周期", trigger: "change" }];

const defaultStageList = [
  { name: "立项阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
  { name: "规划阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
  { name: "执行阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
  { name: "监控阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
  { name: "收尾阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
  { name: "测试阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
];

// ========== 响应式数据 ==========
const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const userOptions = ref([]);
const deptOptions = ref([]);
const contractOptions = ref([]);
const cateOptions = ref([]);

const form = reactive({
  id: undefined,
  name: "",
  code: "",
  amount: "",
  cateId: null,
  customerId: [],
  contractId: "",
  adminId: null,
  directorUid: null,
  did: null,
  dateRange: [],
  content: "",
  stageList: structuredClone(defaultStageList)  // 使用 structuredClone 深拷贝
});

// ========== 计算属性 ==========
const dialogTitle = computed(() => {
  if (isView.value) return "查看项目";
  return isEdit.value ? "编辑项目" : "新建项目";
});

const rules = {
  name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  cateId: [{ required: true, message: "请选择项目类别", trigger: "change" }],
  directorUid: [{ required: true, message: "请选择项目经理", trigger: "change" }],
  did: [{ required: true, message: "请选择归属部门", trigger: "change" }],
  dateRange: [{ required: true, message: "请选择起止日期", trigger: "change" }],
  customerId: [{ required: true, message: "请选择项目成员", trigger: "change" }],
};

// ========== 工具函数 ==========
const toSeconds = (dateStr) => {
  if (!dateStr) return null;
  if (typeof dateStr === "number") return dateStr > 1e10 ? Math.floor(dateStr / 1000) : dateStr;
  if (typeof dateStr === "string") {
    const d = new Date(dateStr.replace(/-/g, "/"));
    return isNaN(d.getTime()) ? null : Math.floor(d.getTime() / 1000);
  }
  return null;
};

const formatTime = (ts) => {
  if (!ts) return "";
  let date;
  if (typeof ts === "number") {
    const timeMs = ts.toString().length === 10 ? ts * 1000 : ts;
    date = new Date(timeMs);
  } else if (typeof ts === "string") {
    date = new Date(ts);
    if (isNaN(date.getTime())) date = new Date(ts.replace(/-/g, "/"));
  } else if (ts instanceof Date) {
    date = ts;
  } else {
    return "";
  }
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const safeSplit = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return String(val).split(",").map(Number).filter(Boolean);
};

// ========== 数据加载 ==========
const loadContractList = async () => {
  try {
    const res = await getContractList({ pageSize: 1000 });
    const list = res.rows || res.data?.rows || [];
    contractOptions.value = list.filter(item => item.checkStatus === 2);
  } catch (err) {
    console.error("加载合同失败", err);
  }
};

const loadProjectCategory = async () => {
  const res = await getPageList({ pageSize: 100, pageNum: 1 });
  cateOptions.value = res.rows || [];
};

onMounted(() => {
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(u => u.status === "0");
  });
  deptTreeSelect().then(res => {
    deptOptions.value = res.data || [];
  });
  loadProjectCategory();
  loadContractList();
});

// ========== 阶段操作 ==========
const addStage = () => {
  form.stageList.push({ name: "", directorUid: null, memberUids: [], timeRange: [], remark: "" });
};

const delStage = (index) => {
  form.stageList.splice(index, 1);
};

const moveUp = (index) => {
  if (index === 0) return;
  [form.stageList[index], form.stageList[index - 1]] = [form.stageList[index - 1], form.stageList[index]];
};

const moveDown = (index) => {
  if (index === form.stageList.length - 1) return;
  [form.stageList[index], form.stageList[index + 1]] = [form.stageList[index + 1], form.stageList[index]];
};

// ========== 提交 ==========
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;

    const [startDate, endDate] = form.dateRange || [];
    const startTime = toSeconds(startDate);
    const endTime = toSeconds(endDate);

    let didVal = form.did;
    if (Array.isArray(didVal)) didVal = didVal.at(-1);

    const data = {
      id: form.id,
      name: form.name,
      code: form.code,
      amount: form.amount || 0,
      cateId: form.cateId,
      customerId: form.customerId?.length ? form.customerId[0] : null,
      contractId: form.contractId || null,
      adminId: form.adminId,
      directorUid: form.directorUid,
      did: didVal,
      startTime,
      endTime,
      status: 0,
      content: form.content,
      stages: form.stageList.map(({ name, directorUid, memberUids, timeRange, remark }) => {
        const [s, e] = timeRange || [];
        return {
          name,
          directorUid,
          memberUids: (memberUids || []).join(","),
          startTime: toSeconds(s),
          endTime: toSeconds(e),
          remark
        };
      })
    };

    const action = isEdit.value ? updateenterPrise(data) : addenterPrise(data);
    action
      .then(() => {
        ElMessage.success("操作成功");
        handleClose();
        emit("success");
      })
      .catch((e) => console.error("提交失败", e));
  });
};

// ========== 重置 ==========
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    name: "",
    code: "",
    amount: "",
    cateId: null,
    customerId: [],
    contractId: "",
    adminId: null,
    directorUid: null,
    did: null,
    dateRange: [],
    content: "",
    stageList: structuredClone(defaultStageList)
  });
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
};

// ========== 关闭 ==========
const handleClose = () => {
  resetForm();
  dialogVisible.value = false;
};

// ========== 打开方法 ==========
const open = () => {
  resetForm();
  loadContractList();
  dialogVisible.value = true;
};

const openEdit = (row) => {
  resetForm();
  
  Object.assign(form, {
    id: row.id,
    name: row.name,
    did: row.did,
    cateId: row.cateId,
    directorUid: row.directorUid,
    contractId: row.contractId || "",
    content: row.content,
    adminId: row.adminId,
    customerId: safeSplit(row.customerId)
  });

  // 回填日期
  if (row.startTime && row.endTime) {
    form.dateRange = [formatTime(row.startTime), formatTime(row.endTime)];
  }

  // 回填阶段
  if (row.stages?.length) {
    form.stageList = row.stages.map(s => ({
      name: s.name || "",
      directorUid: s.directorUid || null,
      memberUids: safeSplit(s.memberUids),
      timeRange: (s.startTime && s.endTime) ? [formatTime(s.startTime), formatTime(s.endTime)] : [],
      remark: s.remark || ""
    }));
  }

  isEdit.value = true;
  dialogVisible.value = true;
};

const openView = (row) => {
  openEdit(row);
  isView.value = true;
};

defineExpose({ open, openEdit, openView });
</script>

<style>
.car-dialog.el-dialog {
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}
.car-dialog .el-dialog__body {
  overflow-y: auto;
}
.car-dialog .el-form-item__label {
  white-space: nowrap !important;
  overflow: visible !important;
}
</style>