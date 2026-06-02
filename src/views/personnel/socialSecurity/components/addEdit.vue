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
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属城市" prop="cityId">
            <el-cascader
              ref="cascaderRef"
              v-model="form.cityId"
              :props="cascaderProps"
              placeholder="请选择所属城市"
              clearable
              style="width: 100%"
              @change="handleCityChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="form.projectName"
              placeholder="请输入项目名称"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="社保结算时间" prop="socialDate">
            <el-input
              v-model.number="form.socialDate"
              placeholder="请输入"
              style="width: 100%"
            >
              <template #prepend>每月</template>
              <template #append>日</template>
            </el-input>
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
                :value="String(item.userId)"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="关联人员">
            <el-select
              v-model="form.relatedUsers"
              placeholder="请选择关联人员"
              multiple
              collapse-tags-tooltip
              filterable
              :close-on-select="false"
              style="width: 100%"
            >
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="String(item.userId)"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注说明" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="3"
              maxlength="300"
              show-word-limit
              placeholder="请输入备注说明（最多300字）"
              style="width: 100%"
            />
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
import { getThreeList } from "@/api/base/common/division";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const userStore = useUserStore();

const dialogVisible = ref(false);
const formRef = ref(null);
const cascaderRef = ref(null);
const isEdit = ref(false);
let pendingCityId = null;

// 人员下拉选项
const userOptions = ref([]);

// 地区级联配置（远程懒加载）
const cascaderProps = {
  value: "id",
  label: "name",
  children: "children",
  checkStrictly: true,
  emitPath: true,
  lazy: true,
  lazyLoad(node, resolve) {
    const params = node.level === 0 ? { pid: 0 } : { pid: node.data.id };
    getThreeList(params).then((res) => {
      const nodes = (res.data || []).map((item) => ({
        ...item,
        leaf: item.hasChildren === false || item.level >= 3,
      }));
      resolve(nodes);
    });
  },
};

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
  return isEdit.value ? "编辑社保" : "新增社保";
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

/** 城市选择变更：保存完整路径名称到 form.city */
function handleCityChange(value) {
  const nodes = cascaderRef.value?.getCheckedNodes();
  if (nodes && nodes.length > 0) {
    const node = nodes[0];
    form.value.city = node.pathLabels ? node.pathLabels.join(",") : node.label || "";
  } else {
    form.value.city = "";
    form.value.cityId = [];
  }
}

/** 弹窗打开动画完成后，设置城市级联器回显值 */
function handleOpened() {
  if (pendingCityId) {
    form.value.cityId = pendingCityId;
    pendingCityId = null;
  }
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
  pendingCityId = null;
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
function openEdit(editData) {
  isEdit.value = true;
  dialogVisible.value = true;
  pendingCityId = editData.cityId ? editData.cityId.split(",") : [];
  nextTick(() => {
    form.value.id = editData.id;
    form.value.city = editData.city || "";
    form.value.projectName = editData.projectName || "";
    form.value.socialDate = editData.socialDate || 15;
    form.value.manager = editData.manager;
    form.value.relatedUsers = editData.relatedUsers
      ? editData.relatedUsers.split(",")
      : [];
    form.value.remark = editData.remark || "";
  });
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      // 关联人员 userId 数组转逗号分隔字符串
      const selectedUserIds = form.value.relatedUsers.join(",");

      const submitData = {
        ...form.value,
        cityId: Array.isArray(form.value.cityId) ? form.value.cityId.join(",") : form.value.cityId,
        relatedUsers: selectedUserIds,
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
