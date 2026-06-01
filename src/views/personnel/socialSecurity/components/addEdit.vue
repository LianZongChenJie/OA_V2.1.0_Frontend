<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="social-security-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属城市" prop="city">
            <el-input
              v-model="form.city"
              placeholder="请输入所属城市"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在项目" prop="projectId">
            <el-select
              v-model="form.projectId"
              placeholder="请选择项目"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in projectOptions"
                :key="item.id"
                :label="item.projectName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="社保日期" prop="socialDate">
            <el-date-picker
              v-model="form.socialDate"
              type="date"
              placeholder="请选择社保日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="manager">
            <el-select
              v-model="form.manager"
              placeholder="请选择负责人"
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
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="关联人员" prop="relatedUsers">
            <el-select
              v-model="form.relatedUsers"
              placeholder="请选择关联人员"
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
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
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="SocialSecurityAddEdit">
import { ref, reactive, computed, getCurrentInstance, onMounted, nextTick } from "vue";
import {
  add,
  update,
} from "@/api/personnel/socialSecurity";
import { listUser } from "@/api/system/user.js";
import { getPageList as getProjectList } from "@/api/project/itemList/index.js";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const userStore = useUserStore();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);

// 项目下拉选项
const projectOptions = ref([]);
// 人员下拉选项
const userOptions = ref([]);

const form = reactive({
  id: undefined,
  city: "",
  projectId: undefined,
  socialDate: "",
  manager: undefined,
  relatedUsers: [],
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑社保" : "新增社保";
});

const rules = {
  city: [{ required: true, message: "请输入所属城市", trigger: "blur" }],
  projectId: [{ required: true, message: "请选择所在项目", trigger: "change" }],
  socialDate: [{ required: true, message: "请选择社保日期", trigger: "change" }],
  manager: [{ required: true, message: "请选择负责人", trigger: "change" }],
};

// 获取项目列表
function getProjectOptions() {
  getProjectList({ pageSize: 1000 }).then((response) => {
    projectOptions.value = response.rows || [];
  });
}

// 获取用户列表
function getUserOptions() {
  listUser({ pageSize: 1000 }).then((response) => {
    userOptions.value = response.rows || [];
  });
}

onMounted(() => {
  getProjectOptions();
  getUserOptions();
});

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.city = "";
  form.projectId = undefined;
  form.socialDate = "";
  form.manager = userStore.id;
  form.relatedUsers = [];

  isEdit.value = false;
  formRef.value?.clearValidate();
}

/** 关闭弹窗 */
function handleClose() {
  reset();
}

/** 显示弹窗 - 新增模式 */
function open() {
  isEdit.value = false;
  dialogVisible.value = true;
  nextTick(() => {
    reset();
  });
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  isEdit.value = true;
  dialogVisible.value = true;
  nextTick(() => {
    form.id = data.id;
    form.city = data.city || "";
    form.projectId = data.projectId;
    form.socialDate = data.socialDate || "";
    form.manager = data.manager;
    form.relatedUsers = data.relatedUsers ? data.relatedUsers.split(",") : [];
  });
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      // 将关联人员 userId 数组转换为以逗号分隔的用户名
      const selectedUsers = form.relatedUsers
        .map(id => userOptions.value.find(u => u.userId === id)?.nickName)
        .filter(Boolean)
        .join(",");

      const submitData = {
        ...form,
        relatedUsers: selectedUsers,
      };

      const apiMethod = isEdit.value ? update : add;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      apiMethod(submitData).then(() => {
        proxy.$modal.msgSuccess(successMsg);
        dialogVisible.value = false;
        emit("success");
      });
    }
  });
}

const emit = defineEmits(["success"]);

defineExpose({
  open,
  openEdit,
});
</script>

<style scoped>
.social-security-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.social-security-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.social-security-dialog .el-dialog__footer {
  border-top: 1px solid #f7f7f7;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
}
</style>