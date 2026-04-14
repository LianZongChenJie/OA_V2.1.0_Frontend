<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="car-dialog"
    @close="handleClose"
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="isView ? {} : rules" 
      label-width="130px"
      style="margin-top:15px"
    >

      <el-form-item label="会议时间" prop="meetingDate" required>
        <el-date-picker
          v-model="form.meetingDate"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择会议时间"
          :disabled="isView"
          style="width:100%"
        />
      </el-form-item>


      <el-form-item label="主持人" prop="anchorId" required>
        <el-select
          v-model="form.anchorId"
          :disabled="isView"
          placeholder="请选择主持人"
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


      <el-form-item label="记录人" prop="recorderId" required>
        <el-select
          v-model="form.recorderId"
          :disabled="isView"
          placeholder="请选择记录人"
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

      <el-form-item label="会议室" prop="roomId" required>
        <el-select
          v-model="form.roomId"
          :disabled="isView"
          placeholder="请选择会议室"
          filterable
          clearable
          style="width:100%"
        >
          <el-option
            v-for="item in roomOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>


      <el-form-item label="主办部门" prop="did" required>
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
          placeholder="请选择主办部门"
          clearable
          collapse-tags
          collapse-tags-tooltip
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="参会人员" prop="joinUids" required>
        <el-select
          v-model="form.joinUids"
          multiple
          :disabled="isView"
          placeholder="请选择参会人员"
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


      <el-form-item label="会议主题" prop="title" required>
        <el-input 
          v-model="form.title" 
          placeholder="请输入会议主题" 
          :disabled="isView" 
          style="width:100%"
        />
      </el-form-item>

      <el-form-item label="会议内容" prop="content" required>
        <el-input
          v-model="form.content"
          type="textarea"
          rows="4"
          placeholder="请输入会议内容"
          :disabled="isView"
          style="width:100%"
        />
      </el-form-item>

      <el-form-item label="下一步工作计划" prop="plans">
        <el-input
          v-model="form.plans"
          type="textarea"
          rows="4"
          placeholder="请输入计划"
          :disabled="isView"
          style="width:100%"
        />
      </el-form-item>

      <el-form-item label="参会人员签字" prop="signUids">
        <el-select
          v-model="form.signUids"
          multiple
          :disabled="isView"
          placeholder="请选择签字人员"
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

      <el-form-item label="共享给谁" prop="shareUids" >
        <el-select
          v-model="form.shareUids"
          multiple
          :disabled="isView"
          placeholder="请选择共享对象"
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
      
      <el-form-item label="备注信息" prop="remarks">
        <el-input
          v-model="form.remarks"
          type="textarea"
          rows="3"
          placeholder="请输入备注"
          :disabled="isView"
          style="width:100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div style="text-align:center">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from "vue";
import { addenterPrise, updateenterPrise } from "@/api/administration/conference/notes/index.js";
import { listUser, deptTreeSelect } from "@/api/system/user.js";
import { getPageList } from "@/api/administration/conference/room/index.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

const userOptions = ref([]);
const deptOptions = ref([]);
const roomOptions = ref([]);

const form = reactive({
  id: undefined,
  meetingDate: "",
  anchorId: null,
  recorderId: null,
  roomId: null,
  did: null,
  title: "",
  content: "",
  plans: "",
  joinUids: [],
  signUids: [],
  shareUids: [],
  remarks: ""
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看会议纪要";
  return isEdit.value ? "编辑会议纪要" : "新增会议纪要";
});

const rules = {
  meetingDate: [{ required: true, message: "请选择会议时间", trigger: "change" }],
  anchorId: [{ required: true, message: "请选择主持人", trigger: "change" }],
  recorderId: [{ required: true, message: "请选择记录人", trigger: "change" }],
  roomId: [{ required: true, message: "请选择会议室", trigger: "change" }],
  did: [{ required: true, message: "请选择部门", trigger: "change" }],
  title: [{ required: true, message: "请输入会议主题", trigger: "blur" }],
  content: [{ required: true, message: "请输入会议内容", trigger: "blur" }],
  joinUids: [{ required: true, message: "请选择参会人员", trigger: "change" }],
};

onMounted(() => {
  listUser({ pageSize: 1000 }).then(res => {
    userOptions.value = (res.rows || []).filter(u => u.status === "0");
  });
  deptTreeSelect().then(res => {
    deptOptions.value = res.data || [];
  });
  getPageList({ pageSize: 1000 }).then(res => {
    console.log("会议室原始数据：", res);
    let list = [];
    if (res.rows && Array.isArray(res.rows)) {
      list = res.rows.map(row => {
        return Array.isArray(row) ? row[0] : row;
      }).filter(item => item && item.id); 
    } else if (Array.isArray(res)) {
      list = res.map(row => Array.isArray(row) ? row[0] : row).filter(item => item && item.id);
    }
    roomOptions.value = list;
  });
});

function handleSubmit() {
  formRef.value.validate(valid => {
    if (!valid) return;
    const data = {
      ...form,
      joinUids: (form.joinUids || []).join(","),
      signUids: (form.signUids || []).join(","),
      shareUids: (form.shareUids || []).join(",")
    };
    const api = isEdit.value ? updateenterPrise : addenterPrise;
    api(data).then(() => {
      proxy.$modal.msgSuccess("操作成功");
      dialogVisible.value = false;
      emit("success");
    });
  });
}

function reset() {
  Object.assign(form, {
    id: undefined, meetingDate: "", anchorId: null, recorderId: null,
    roomId: null, did: null, title: "", content: "", plans: "",
    joinUids: [], signUids: [], shareUids: [], remarks: ""
  });
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
}

function handleClose() {
  reset();
  dialogVisible.value = false;
}

function open() {
  reset();
  dialogVisible.value = true;
}

// 编辑
function openEdit(data) {
  reset();
  Object.assign(form, {
    ...data,
    meetingDate: data.meetingDateStr || data.meetingDate || "",
    joinUids: data.joinUids ? data.joinUids.split(',').map(Number) : [],
    shareUids: data.shareUids ? data.shareUids.split(',').map(Number) : [],
    signUids: data.signUids ? data.signUids.split(',').map(Number) : []
  });
  isEdit.value = true;
  dialogVisible.value = true;
}

// 查看
function openView(data) {
  reset();
  Object.assign(form, {
    ...data,
    meetingDate: data.meetingDateStr || data.meetingDate || "",
    joinUids: data.joinUids ? data.joinUids.split(',').map(Number) : [],
    shareUids: data.shareUids ? data.shareUids.split(',').map(Number) : [],
    signUids: data.signUids ? data.signUids.split(',').map(Number) : []
  });
  isView.value = true;
  dialogVisible.value = true;
}

const emit = defineEmits(["success"]);
defineExpose({ open, openEdit, openView });
</script>

<style>
.car-dialog.el-dialog {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.car-dialog .el-dialog__body {
  overflow-y: auto;
}
</style>