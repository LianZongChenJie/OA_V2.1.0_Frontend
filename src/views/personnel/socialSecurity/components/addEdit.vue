<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="50%"
    append-to-body
    class="social-security-dialog"
    @close="handleClose"
    @opened="handleOpened"
  >
    <SocialSecurityForm
      ref="formCompRef"
      v-model="form"
      :user-options="userOptions"
      :rules="rules"
    />

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="SocialSecurityAddEdit">
import {
  ref,
  reactive,
  toRefs,
  computed,
  getCurrentInstance,
  onMounted,
  nextTick,
} from "vue";
import { add, update } from "@/api/personnel/socialSecurity";
import { listUser } from "@/api/system/user.js";
import useUserStore from "@/store/modules/user";
import SocialSecurityForm from "./socialSecurityForm.vue";

const { proxy } = getCurrentInstance();
const userStore = useUserStore();

const dialogVisible = ref(false);
const formCompRef = ref(null);
const isEdit = ref(false);

// 人员下拉选项
const userOptions = ref([]);

const data = reactive({
  form: {
    id: undefined,
    cityId: [],
    city: "",
    projectName: "",
    socialDate: 15,
    manager: undefined,
    relatedUsers: [],
    remark: "",
  },
});

const { form } = toRefs(data);

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑社保管理" : "新增社保管理";
});

const rules = {
  cityId: [{ required: true, message: "请选择所属城市", trigger: "change" }],
  projectName: [],
  socialDate: [
    { required: true, message: "请输入社保结算时间", trigger: "blur" },
    {
      type: "number",
      min: 1,
      max: 31,
      message: "请输入1-31之间的数字",
      trigger: "blur",
    },
  ],
  manager: [{ required: true, message: "请选择负责人", trigger: "change" }],
};

// 获取用户列表
function getUserOptions() {
  listUser({ pageSize: 1000 }).then((response) => {
    userOptions.value = response.rows || [];
  });
}

onMounted(() => {
  getUserOptions();
});

/** 弹窗打开动画完成后，设置城市级联器回显值 */
function handleOpened() {
  formCompRef.value?.handleOpened();
}

/** 表单重置 */
function reset() {
  form.value.id = undefined;
  form.value.cityId = [];
  form.value.city = "";
  form.value.projectName = "";
  form.value.socialDate = 15;
  form.value.manager = String(userStore.id);
  form.value.relatedUsers = [];
  form.value.remark = "";

  isEdit.value = false;
  formCompRef.value?.formRef?.clearValidate();
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
function openEdit(editData) {
  isEdit.value = true;
  dialogVisible.value = true;
  const pendingCityId = editData.cityId ? editData.cityId.split(",").map(Number) : [];
  formCompRef.value?.setPendingCityId(pendingCityId);
  nextTick(() => {
    form.value.id = editData.id;
    form.value.city = editData.city || "";
    form.value.projectName = editData.projectName || "";
    form.value.socialDate = editData.socialDate || 15;
    form.value.manager = editData.managerId
      ? String(editData.managerId)
      : (() => {
          const name = editData.manager || editData.managerName || "";
          if (name) {
            const found = userOptions.value.find((u) => u.nickName === name);
            if (found) return String(found.userId);
          }
          return undefined;
        })();
    form.value.relatedUsers = editData.relatedUsers
      ? editData.relatedUsers.split(",")
      : editData.users && editData.users.length > 0
        ? editData.users.map(u => String(u.userId))
        : [];
    form.value.remark = editData.remark || "";
  });
}

/** 提交表单 */
function handleSubmit() {
  formCompRef.value?.formRef.validate((valid) => {
    if (valid) {
      // 关联人员 userId 数组转逗号分隔字符串
      const selectedUserIds = form.value.relatedUsers.join(",");

      // 查找负责人名称
      let managerName = "";
      if (form.value.manager) {
        const found = userOptions.value.find(
          (u) => String(u.userId) === form.value.manager,
        );
        if (found) managerName = found.nickName;
      }

      const submitData = {
        ...form.value,
        cityId: Array.isArray(form.value.cityId) ? form.value.cityId.join(",") : form.value.cityId,
        relatedUsers: selectedUserIds,
        managerId: form.value.manager,
        manager: managerName,
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

<style scoped></style>

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