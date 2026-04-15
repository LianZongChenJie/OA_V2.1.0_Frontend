<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="70%"
    append-to-body
    class="car-dialog"
    @close="handleClose"
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="isView ? {} : rules" 
      label-width="100px"
      style="margin-top: 15px"
    >
      <!-- 第一行：项目名称 + 主办部门 -->
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
          placeholder="请选择归属部门"
          clearable
          collapse-tags
          collapse-tags-tooltip
          style="width: 100%"
        />
      </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行：项目类别 + 项目经理 + 起止日期 -->
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
              placeholder="请选择项目经理(负责人)"
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
          <el-form-item label="起止日期" prop="startTime" required>
            <el-date-picker
              v-model="form.startTime"
              type="daterange"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
              :disabled="isView"
              style="width:100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：项目成员 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="项目成员" prop="joinUids" required>
            <el-select
              v-model="form.joinUids"
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

      <!-- 第四行：关联合同 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="关联合同" prop="contractId">
            <el-select
              v-model="form.contractId"
              :disabled="isView"
              placeholder="请选择需要关联的合同"
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

      <!-- 第五行：项目简介 -->
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

      <!-- 项目阶段表格 -->
      <el-form-item label="项目阶段" required>
        <el-button type="success" icon="el-icon-plus" @click="addStage" :disabled="isView">+ 添加阶段</el-button>
        <el-table
          :data="stageList"
          style="width: 100%; margin-top: 10px"
          border
          size="small"
          :scrollbar-always-on="true"
        >
          <el-table-column prop="sort" label="序号" width="80" align="center" />
          
          <!-- 阶段名称 去掉了多余布局，只保留输入框 -->
          <el-table-column prop="name" label="阶段名称" min-width="150">
            <template #default="{ row }">
              <el-input
                v-model="row.name"
                :disabled="isView"
                placeholder="请输入阶段名称"
                style="width:100%"
              />
            </template>
          </el-table-column>

          <el-table-column prop="directorUid" label="阶段负责人" min-width="150">
            <template #default="{ row }">
              <el-select
                v-model="row.directorUid"
                :disabled="isView"
                placeholder="负责人"
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
            </template>
          </el-table-column>

          <el-table-column prop="memberUids" label="阶段成员" min-width="180">
            <template #default="{ row }">
              <el-select
                v-model="row.memberUids"
                multiple
                :disabled="isView"
                placeholder="成员"
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
            </template>
          </el-table-column>

          <el-table-column prop="timeRange" label="阶段周期" min-width="200">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.timeRange"
                type="daterange"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="结束"
                :disabled="isView"
                style="width: 100%"
              />
            </template>
          </el-table-column>

          <el-table-column prop="remark" label="阶段说明" min-width="200">
            <template #default="{ row }">
              <el-input
                v-model="row.remark"
                :disabled="isView"
                placeholder="请输入阶段说明"
                style="width: 100%"
              />
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="180"
            align="center"
            :resizable="false"
          >
            <template #default="{ row, $index }">
              <el-button type="success" size="small" @click="moveUp($index)" style="width:45px;padding:0">上移</el-button>
              <el-button type="primary" size="small" @click="moveDown($index)" style="width:45px;padding:0">下移</el-button>
              <el-button type="danger" size="small" @click="delStage($index)" style="width:45px;padding:0">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

    </el-form>

    <template #footer>
      <div style="text-align: center">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">立即提交</el-button>
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
  amount: 0,
  cateId: null,
  customerId: 0,
  contractId: null,
  adminId: 0,
  directorUid: null,
  did: null,
  startTime: "",
  endTime: "",
  startTimeStr: [],
  status: 0,
  content: "",
  createTime: 0,
  updateTime: 0,
  deleteTime: 0,
  joinUids: []
});

const stageList = reactive([
  { sort: 1, name: "立项阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
  { sort: 2, name: "规划阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
  { sort: 3, name: "执行阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
  { sort: 4, name: "监控与控制阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
  { sort: 5, name: "收尾阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
  { sort: 6, name: "测试阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" }
]);

const dialogTitle = computed(() => {
  if (isView.value) return "查看项目";
  return isEdit.value ? "编辑项目" : "新建项目";
});

const rules = {
  name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  cateId: [{ required: true, message: "请选择项目类别", trigger: "change" }],
  directorUid: [{ required: true, message: "请选择项目经理", trigger: "change" }],
  did: [{ required: true, message: "请选择归属部门", trigger: "change" }],
  startTime: [{ required: true, message: "请选择起止日期", trigger: "change" }],
  joinUids: [{ required: true, message: "请选择项目成员", trigger: "change" }],
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
  try {
    const res = await getPageList({ pageSize: 100 , pageNum: 1});
    cateOptions.value = res.rows || [];
  } catch (err) {
    console.error("加载项目分类失败", err);
  }
}

function addStage() {
  stageList.push({
    sort: stageList.length + 1,
    name: "",
    directorUid: null,
    memberUids: [],
    timeRange: [],
    remark: ""
  });
}

function delStage(index) {
  stageList.splice(index, 1);
  stageList.forEach((item, idx) => {
    item.sort = idx + 1;
  });
}

function moveUp(index) {
  if (index === 0) return;
  const temp = stageList[index];
  stageList.splice(index, 1);
  stageList.splice(index - 1, 0, temp);
  stageList.forEach((item, idx) => {
    item.sort = idx + 1;
  });
}

function moveDown(index) {
  if (index === stageList.length - 1) return;
  const temp = stageList[index];
  stageList.splice(index, 1);
  stageList.splice(index + 1, 0, temp);
  stageList.forEach((item, idx) => {
    item.sort = idx + 1;
  });
}

function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return;

    const [startDate, endDate] = form.startTime || [];
    const startTime = startDate ? new Date(startDate).getTime() : 0;
    const endTime = endDate ? new Date(endDate).getTime() : 0;
    let did = 0;
    if (form.did) {
      did = Number(form.did);
    }

    // 提交参数（完全按后端接口文档）
    const data = {
      id: form.id || undefined,
      name: form.name || '',
      code: form.code || '',
      amount: Number(form.amount) || 0,
      cateId: Number(form.cateId) || 0,
      customerId: 0,
      contractId: Number(form.contractId) || 0,
      adminId: 0,
      directorUid: Number(form.directorUid) || 0,
      did: did,                
      startTime: startTime,    
      endTime: endTime,        
      status: 0,
      content: form.content || '',
      joinUids: (form.joinUids || []).join(','),
      stages: stageList.map(item => ({
        sort: item.sort || 0,
        name: item.name || '',
        directorUid: Number(item.directorUid) || 0,
        memberUids: (item.memberUids || []).join(','),
        startTime: item.timeRange?.[0] ? new Date(item.timeRange[0]).getTime() : 0,
        endTime: item.timeRange?.[1] ? new Date(item.timeRange[1]).getTime() : 0,
        remark: item.remark || ''
      }))
    };

    // 发送请求
    const api = isEdit.value ? updateenterPrise : addenterPrise;
    api(data).then(() => {
      proxy.$modal.msgSuccess("操作成功");
      dialogVisible.value = false;
      emit("success");
    }).catch(err => {
      console.error("提交失败", err);
      proxy.$modal.msgError("提交失败：参数格式不正确");
    });
  });
}

function reset() {
  Object.assign(form, {
    id: undefined, name: "", code: "", amount: 0, cateId: null, customerId: 0,
    contractId: null, adminId: 0, directorUid: null, did: null, startTime: "",
    endTime: "", startTimeStr: [], status: 0, content: "", createTime: 0, updateTime: 0, deleteTime: 0,
    joinUids: []
  });
  Object.assign(stageList, [
    { sort: 1, name: "立项阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
    { sort: 2, name: "规划阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
    { sort: 3, name: "执行阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
    { sort: 4, name: "监控与控制阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
    { sort: 5, name: "收尾阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" },
    { sort: 6, name: "测试阶段", directorUid: null, memberUids: [], timeRange: [], remark: "" }
  ]);
  isEdit.value = false;
  isView.value = false;
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

function handleClose() {
  reset();
  dialogVisible.value = false;
}

function open() {
  reset();
  dialogVisible.value = true;
}

function openEdit(data) {
  reset();
  Object.assign(form, {
    ...data,
    directorUid: data.directorUid || null,
    did: data.did || null, 
    contractId: data.contractId || null,
    cateId: data.cateId || null,
    joinUids: data.joinUids ? data.joinUids.split(',').map(Number) : [],
    startTime: [data.startTime, data.endTime]
  });

  if (data.stages && Array.isArray(data.stages)) {
    stageList.splice(0, stageList.length, ...data.stages.map((item, idx) => ({
      ...item,
      sort: idx + 1,
      timeRange: [item.startTime, item.endTime],
      memberUids: item.memberUids ? item.memberUids.split(',').map(Number) : []
    })));
  }
  
  isEdit.value = true;
  dialogVisible.value = true;
}

function openView(data) {
  reset();
  Object.assign(form, {
    ...data,
    directorUid: data.directorUid || null,
    did: data.did || null,
    contractId: data.contractId || null,
    cateId: data.cateId || null,
    joinUids: data.joinUids ? data.joinUids.split(',').map(Number) : [],
    startTimeStr: [data.startTime, data.endTime]
  });
  if (data.stages && Array.isArray(data.stages)) {
    stageList.splice(0, stageList.length, ...data.stages.map((item, idx) => ({
      ...item,
      sort: idx + 1,
      timeRange: [item.startTime, item.endTime],
      memberUids: item.memberUids ? item.memberUids.split(',').map(Number) : []
    })));
  }
  isView.value = true;
  dialogVisible.value = true;
}

const emit = defineEmits(["success"]);
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
.car-dialog .el-table .el-button {
  margin: 0 2px;
}
</style>