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
      :key="dialogVisible"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="name" required>
            <el-input 
              v-model="form.name" 
              placeholder="请输入项目名称" 
              :disabled="isView" 
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属部门" prop="did" required>
            <el-cascader
              v-model="form.did"
              :options="deptOptions"
              :multiple="false"
              :props="{
                value: 'id',
                label: 'label',
                children: 'children',
                checkStrictly: true,
                emitPath: false
              }"
              :disabled="isView"
              placeholder="请选择归属部门"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="项目类别" prop="cateId" required>
            <el-select
              v-model="form.cateId"
              :disabled="isView"
              placeholder="请选择"
              filterable
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in cateOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目经理" prop="directorUid" required>
            <el-select
              v-model="form.directorUid"
              :disabled="isView"
              placeholder="请选择项目经理"
              filterable
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
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
              style="width:100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="项目成员" prop="customerId" required>
            <el-select
              v-model="form.customerId"
              multiple
              :disabled="isView"
              placeholder="请选择项目成员"
              filterable
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="关联合同" prop="contractId">
            <el-select
              v-model="form.contractId"
              :disabled="isView"
              placeholder="请选择合同"
              filterable
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in contractOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="项目简介" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              rows="3"
              placeholder="请输入项目简介"
              :disabled="isView"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="项目阶段" required>
        <el-button type="success" icon="el-icon-plus" @click="addStage" :disabled="isView">+ 添加阶段</el-button>
        <el-table
          :data="form.stageList"
          style="width: 100%; margin-top: 10px"
          border
          size="small"
        >
          <el-table-column label="序号" width="70" align="center">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>

          <el-table-column label="阶段名称" min-width="150">
            <template #default="{ $index }">
              <el-form-item
                :prop="`stageList.${$index}.name`"
                :rules="[{ required: true, message: '请输入阶段名称', trigger: 'blur' }]"
                style="margin:0"
              >
                <el-input v-model="form.stageList[$index].name" :disabled="isView" placeholder="阶段名称" style="width:100%"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="阶段负责人" min-width="150">
            <template #default="{ $index }">
              <el-form-item
                :prop="`stageList.${$index}.directorUid`"
                :rules="[{ required: true, message: '请选择负责人', trigger: 'change' }]"
                style="margin:0"
              >
              <el-select v-model="form.stageList[$index].directorUid" :disabled="isView" placeholder="负责人" style="width:100%" clearable>
                <el-option
                  v-for="item in userOptions"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="阶段成员" min-width="180">
            <template #default="{ $index }">
              <el-select v-model="form.stageList[$index].memberUids" multiple :disabled="isView" placeholder="成员" style="width:100%">
                <el-option
                  v-for="item in userOptions"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="阶段周期" min-width="200">
            <template #default="{ $index }">
              <el-form-item
                :prop="`stageList.${$index}.timeRange`"
                :rules="[{ required: true, message: '请选择阶段周期', trigger: 'change' }]"
                style="margin:0"
              >
                <el-date-picker
                  v-model="form.stageList[$index].timeRange"
                  type="daterange"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :disabled="isView"
                  style="width:100%"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="阶段说明" min-width="200">
            <template #default="{ $index }">
              <el-input v-model="form.stageList[$index].remark" :disabled="isView" placeholder="说明" style="width:100%"/>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="180" align="center">
            <template #default="{ $index }">
              <el-button size="small" type="success" @click="moveUp($index)" style="width:42px">上移</el-button>
              <el-button size="small" type="primary" @click="moveDown($index)" style="width:42px">下移</el-button>
              <el-button size="small" type="danger" @click="delStage($index)" style="width:42px">删除</el-button>
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
import { ref, reactive, computed, onMounted, getCurrentInstance, nextTick } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/project/itemList/index.js";
import { listUser, deptTreeSelect } from "@/api/system/user.js";
import { getPageList } from "@/api/base/project/projectClassify/index.js";

const { proxy } = getCurrentInstance();
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
  contractId: null,
  adminId: null,
  directorUid: null,
  did: null,
  dateRange: [],
  content: "",
  stageList: [
    { name: "立项阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
    { name: "规划阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
    { name: "执行阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
    { name: "监控阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
    { name: "收尾阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
    { name: "测试阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
  ]
});

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

onMounted(() => {
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(u => u.status === "0");
  });
  deptTreeSelect().then(res => {
    deptOptions.value = res.data || [];
  });
  loadProjectCategory();
});

async function loadProjectCategory() {
  const res = await getPageList({ pageSize: 100, pageNum: 1 });
  cateOptions.value = res.rows || [];
}

function addStage() {
  form.stageList.push({ name: "", directorUid: null, memberUids: [], timeRange: [], remark: "" });
}

function delStage(index) {
  form.stageList.splice(index, 1);
}

function moveUp(index) {
  if (index === 0) return;
  [form.stageList[index], form.stageList[index - 1]] = [form.stageList[index - 1], form.stageList[index]];
}

function moveDown(index) {
  if (index === form.stageList.length - 1) return;
  [form.stageList[index], form.stageList[index + 1]] = [form.stageList[index + 1], form.stageList[index]];
}

function toSeconds(dateStr) {
  if (!dateStr) return null;
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

function handleSubmit() {
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
      contractId: form.contractId,
      adminId: form.adminId,
      directorUid: form.directorUid,
      did: didVal,
      startTime: startTime,
      endTime: endTime,
      status: 0,
      content: form.content,
      stages: form.stageList.map(it => {
        const [s, e] = it.timeRange || [];
        return {
          name: it.name,
          directorUid: it.directorUid,
          memberUids: (it.memberUids || []).join(','),
          startTime: toSeconds(s),
          endTime: toSeconds(e),
          remark: it.remark
        };
      })
    };

    (isEdit.value ? updateenterPrise(data) : addenterPrise(data))
      .then(() => {
        proxy.$modal.msgSuccess("操作成功");
        handleClose();
        emit("success");
      })
      .catch((e) => {

        console.error("提交失败", e);
      });
  });
}

function resetForm() {
  Object.assign(form, {
    id: undefined,
    name: "",
    code: "",
    amount: "",
    cateId: null,
    customerId: [],
    contractId: null,
    adminId: null,
    directorUid: null,
    did: null,
    dateRange: [],
    content: "",
    stageList: [
      { name: "立项阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
      { name: "规划阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
      { name: "执行阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
      { name: "监控阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
      { name: "收尾阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
      { name: "测试阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
    ]
  });
  isEdit.value = false;
  isView.value = false;
  nextTick(() => formRef.value?.clearValidate());
}

function handleClose() {
  resetForm();
  dialogVisible.value = false;
}

function open() {
  resetForm();
  dialogVisible.value = true;
}

// ✅【修复】安全解析数组
function safeSplit(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return String(val).split(',').map(Number).filter(Boolean);
}

function openEdit(row) {
  resetForm();

  form.id = row.id;
  form.name = row.name;
  form.did = row.did;
  form.cateId = row.cateId;
  form.directorUid = row.directorUid;
  form.contractId = row.contractId || null;
  form.content = row.content;
  form.adminId = row.adminId;

  // ✅ 安全转数组
  form.customerId = safeSplit(row.customerId);

  try {
    form.dateRange = row.startTime && row.endTime
      ? [formatTime(row.startTime), formatTime(row.endTime)]
      : [];
  } catch (e) {}

  try {
    if (row.stages) {
      form.stageList = row.stages.map(s => ({
        name: s.name,
        directorUid: s.directorUid,
        memberUids: safeSplit(s.memberUids),
        timeRange: s.startTime && s.endTime ? [formatTime(s.startTime), formatTime(s.endTime)] : [],
        remark: s.remark || ""
      }));
    }
  } catch (e) {}

  isEdit.value = true;
  dialogVisible.value = true;
}

function openView(row) {
  openEdit(row);
  isView.value = true;
}

function formatTime(ts) {
  if (!ts) return "";
  const time = ts.toString().length === 10 ? ts * 1000 : ts;
  const d = new Date(time);
  return d.toISOString().split("T")[0];
}

const emit = defineEmits(["success"]);
defineExpose({ open, openEdit, openView });
</script>