<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="600px"
    append-to-body
    class="repair-dialog"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="isView ? {} : rules" label-width="120px">
      <!-- 资产名称 -->
      <el-form-item label="资产名称" prop="propertyId">
        <el-select
          v-model="form.propertyId"
          placeholder="请选择资产"
          style="width: 100%"
          :disabled="isView"
          filterable
          remote
          :remote-method="handlePropertySearch"
          @change="handlePropertyChange"
          @focus="loadPropertyList()"
        >
          <el-option
            v-for="item in propertyList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      
      <!-- 维修日期 -->
      <el-form-item label="维修日期" prop="repairTime">
        <el-date-picker
          v-model="form.repairTime"
          type="date"
          placeholder="请选择维修日期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
          :disabled="isView"
        />
      </el-form-item>
      
      <!-- 维修费用 -->
      <el-form-item label="维修费用(元)" prop="cost">
        <el-input-number
          v-model="form.cost"
          :min="0"
          :precision="2"
          :disabled="isView"
          placeholder="请输入维修费用"
          style="width: 100%"
          controls-position="right"
        />
      </el-form-item>
      
      <!-- 跟进人 -->
      <el-form-item label="跟进人" prop="directorId">
        <el-select
          v-model="form.directorId"
          placeholder="请选择跟进人"
          style="width: 100%"
          :disabled="isView"
          filterable
          remote
          :remote-method="handleDirectorSearch"
          @change="handleDirectorChange"
          @focus="loadDirectorList()"
        >
          <el-option
            v-for="item in directorList"
            :key="item.userId"
            :label="item.nickName || item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      
      <!-- 维修原因 -->
      <el-form-item label="维修原因" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          placeholder="请输入维修原因"
          :disabled="isView"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">{{ isView ? '关 闭' : '取 消' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddRepair">
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { add, update, getPropertyList, getUserList } from "@/api/administration/fixedAssets/repair";
import { debounce } from "lodash-es";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 资产列表
const propertyList = ref([]);
// 跟进人列表
const directorList = ref([]);

/** 获取资产列表 */
async function loadPropertyList(title = '') {
  try {
    const res = await getPropertyList({ title, pageSize: 100 });
    propertyList.value = res.rows || res.data || [];
  } catch (error) {
    console.error('获取资产列表失败', error);
  }
}

/** 资产搜索 */
function handlePropertySearch(keyword) {
  loadPropertyList(keyword);
}

/** 资产选择变化 */
function handlePropertyChange(val) {
  const selected = propertyList.value.find(item => item.id === val);
  form.propertyId = val;
  form.propertyName = selected ? selected.title : '';
}

/** 获取跟进人列表 */
async function loadDirectorList(nickName = '') {
  try {
    const res = await getUserList({ nickName, pageSize: 100 });
    directorList.value = res.rows || res.data || [];
  } catch (error) {
    console.error('获取跟进人列表失败', error);
  }
}

/** 跟进人搜索 */
function handleDirectorSearch(keyword) {
  loadDirectorList(keyword);
}

/** 跟进人选择变化 */
function handleDirectorChange(val) {
  const selected = directorList.value.find(item => item.userId === val);
  form.directorId = val;
  form.directorName = selected ? (selected.nickName || selected.userName) : '';
}

const form = reactive({
  id: undefined,
  propertyId: undefined,
  propertyName: "",
  repairTime: "",
  cost: undefined,
  directorId: undefined,
  directorName: "",
  content: "",
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看维修记录";
  return isEdit.value ? "编辑维修记录" : "新增维修记录";
});

const rules = {
  propertyId: [{ required: true, message: "请选择资产", trigger: "change" }],
  repairTime: [{ required: true, message: "请选择维修日期", trigger: "change" }],
  cost: [{ required: true, message: "请输入维修费用", trigger: "blur" }],
  directorId: [{ required: true, message: "请选择跟进人", trigger: "change" }],
};

/** 表单重置 */
function reset() {
  form.id = undefined;
  form.propertyId = undefined;
  form.propertyName = "";
  form.repairTime = "";
  form.cost = undefined;
  form.directorId = undefined;
  form.directorName = "";
  form.content = "";
  isEdit.value = false;
  isView.value = false;
  proxy.resetForm("formRef");
}

/** 关闭弹窗 */
function handleClose() {
  reset();
}

/** 显示弹窗 - 新增模式 */
function open() {
  reset();
  dialogVisible.value = true;
}

/** 显示弹窗 - 编辑模式 */
function openEdit(data) {
  reset();
  // 填充表单数据
  form.id = data.id;
  form.propertyId = data.propertyId;
  form.propertyName = data.propertyName;
  form.repairTime = data.repairTime;
  form.cost = data.cost;
  form.directorId = data.directorId;
  form.directorName = data.directorName;
  form.content = data.content;

  // 加载资产和跟进人列表以便显示
  loadPropertyList();
  loadDirectorList();

  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  // 填充表单数据
  form.id = data.id;
  form.propertyId = data.propertyId;
  form.propertyName = data.propertyName;
  form.repairTime = data.repairTime;
  form.cost = data.cost;
  form.directorId = data.directorId;
  form.directorName = data.directorName;
  form.content = data.content;

  // 加载资产和跟进人列表以便显示
  loadPropertyList();
  loadDirectorList();

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? update : add;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";

      apiMethod(form).then(() => {
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
  openView,
});
</script>

<style scoped>
</style>

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
.repair-dialog.el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.repair-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>
