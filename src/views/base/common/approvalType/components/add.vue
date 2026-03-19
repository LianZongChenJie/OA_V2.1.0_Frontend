<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="approval-type-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="140px"
    >
      <el-divider class="divider" content-position="left">基础信息</el-divider>
      <el-form-item label="类型名称" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入类型名称"
          :disabled="isView"
        />
      </el-form-item>
      <el-form-item label="类型标识" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入类型标识"
          :disabled="isView"
        />
      </el-form-item>
      <el-form-item label="关联审批模块" prop="moduleId">
        <el-select
          v-model="form.moduleId"
          filterable
          placeholder="请选择关联审批模块"
          clearable
          :disabled="isView"
          :loading="moduleLoading"
          style="width: 100%"
        >
          <el-option
            v-for="item in moduleList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据表名" prop="checkTable">
        <el-input
          v-model="form.checkTable"
          placeholder="请输入数据表名"
          :disabled="isView"
        />
      </el-form-item>
      <el-form-item label="展示图标" prop="icon">
        <el-popover placement="bottom-start" :width="540" trigger="click">
          <template #reference>
            <el-input
              v-model="form.icon"
              placeholder="点击选择图标"
              @blur="showSelectIcon"
              readonly
              :disabled="isView"
            >
              <template #prefix>
                <svg-icon
                  v-if="form.icon"
                  :icon-class="form.icon"
                  class="el-input__icon"
                  style="height: 32px; width: 16px"
                />
              </template>
            </el-input>
          </template>
          <icon-select
            ref="iconSelectRef"
            @selected="selected"
            :active-icon="form.icon"
          />
        </el-popover>
      </el-form-item>
      <el-form-item label="应用部门" prop="departmentIds">
        <el-tree-select
          v-model="form.departmentIds"
          :data="deptOptions"
          :props="{ value: 'id', label: 'label', children: 'children' }"
          :render-after-expand="false"
          show-checkbox
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择应用部门"
          clearable
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>
      <el-divider class="divider" content-position="left">消息配置</el-divider>
      <el-form-item label="消息模板" prop="templateId">
        <el-select
          v-model="form.templateId"
          filterable
          placeholder="请选择消息模板"
          clearable
          :loading="templateLoading"
          style="width: 100%"
        >
          <el-option
            v-for="item in templateOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-divider class="divider" content-position="left">功能配置</el-divider>
      <el-form-item label="审批通过通知抄送" prop="isCopy">
        <el-radio-group v-model="form.isCopy" :disabled="isView">
          <el-radio :value="1">抄送</el-radio>
          <el-radio :value="0">不抄送</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支持上传附件" prop="isFile">
        <el-radio-group v-model="form.isFile" :disabled="isView">
          <el-radio :value="1">支持</el-radio>
          <el-radio :value="0">不支持</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支持导出PDF打印" prop="isExport">
        <el-radio-group v-model="form.isExport" :disabled="isView">
          <el-radio :value="1">支持</el-radio>
          <el-radio :value="0">不支持</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支持撤回" prop="isBack">
        <el-radio-group v-model="form.isBack" :disabled="isView">
          <el-radio :value="1">支持</el-radio>
          <el-radio :value="0">不支持</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支持反确认" prop="isReversed">
        <el-radio-group v-model="form.isReversed" :disabled="isView">
          <el-radio :value="1">支持</el-radio>
          <el-radio :value="0">不支持</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="工作台快捷展示" prop="isList">
        <el-radio-group v-model="form.isList" :disabled="isView">
          <el-radio :value="1">展示</el-radio>
          <el-radio :value="0">不展示</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-divider class="divider" content-position="left">链接配置</el-divider>
      <el-form-item label="新建审批链接" prop="addUrl">
        <el-input
          v-model="form.addUrl"
          placeholder="请输入新建审批链接"
          :disabled="isView"
        />
      </el-form-item>
      <el-form-item label="查看审批链接" prop="viewUrl">
        <el-input
          v-model="form.viewUrl"
          placeholder="请输入查看审批链接"
          :disabled="isView"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false">{{
          isView ? "关 闭" : "取 消"
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddApprovalType">
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
import {
  addApprovalType,
  updateApprovalType,
} from "@/api/base/common/approvalType/index.js";
import { getPageList as getModuleList } from "@/api/base/common/approvalModule/index.js";
import { getPageList as getTemplateList } from "@/api/base/common/messageModule/index.js";
import { deptTreeSelect } from "@/api/system/user.js";
import IconSelect from "@/components/IconSelect";
import SvgIcon from "@/components/SvgIcon";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false); // 是否为编辑模式
const isView = ref(false); // 是否为查看模式
const iconSelectRef = ref(null);

// 审批模块列表
const moduleList = ref([]);
// 消息模板列表
const templateOptions = ref([]);
// 消息模板加载状态
const templateLoading = ref(false);
// 部门树
const deptOptions = ref([]);
// 审批模块加载状态
const moduleLoading = ref(false);

const form = reactive({
  id: undefined,
  title: "",
  name: "",
  moduleId: "",
  checkTable: "",
  icon: "",
  departmentIds: [],
  isCopy: 0,
  isFile: 0,
  isExport: 0,
  isBack: 0,
  isReversed: 0,
  addUrl: "",
  viewUrl: "",
  isList: 0,
  templateId: "",
});

// 根据模式动态显示标题
const dialogTitle = computed(() => {
  if (isView.value) return "查看审批类型";
  return isEdit.value ? "编辑审批类型" : "新增审批类型";
});

const rules = {
  title: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
  name: [{ required: true, message: "请输入类型标识", trigger: "blur" }],
  moduleId: [
    { required: true, message: "请选择关联审批模块", trigger: "change" },
  ],
};

/** 获取审批模块列表 */
function getModules() {
  moduleLoading.value = true;
  getModuleList({ pageNum: 1, pageSize: 1000 })
    .then((res) => {
      if (res && res.rows) {
        moduleList.value = res.rows || [];
      }
    })
    .finally(() => {
      moduleLoading.value = false;
    });
}

/** 获取消息模板列表 */
function getTemplates() {
  templateLoading.value = true;
  getTemplateList({ pageNum: 1, pageSize: 1000 })
    .then((res) => {
      if (res && res.rows) {
        templateOptions.value = res.rows || [];
      }
    })
    .catch((error) => {
      console.error("==消息模板加载失败==>", error);
    })
    .finally(() => {
      templateLoading.value = false;
    });
}

/** 获取部门树 */
function getDeptTree() {
  deptTreeSelect().then((response) => {
    deptOptions.value = response.data;
  });
}

/** 展示下拉图标 */
function showSelectIcon() {
  iconSelectRef.value.reset();
}

/** 选择图标 */
function selected(name) {
  form.icon = name;
}

/** 表单重置 */
function reset() {
  // 重置表单数据
  form.id = undefined;
  form.title = "";
  form.name = "";
  form.moduleId = "";
  form.checkTable = "";
  form.icon = "";
  form.departmentIds = [];
  form.isCopy = 0;
  form.isFile = 0;
  form.isExport = 0;
  form.isBack = 0;
  form.isReversed = 0;
  form.addUrl = "";
  form.viewUrl = "";
  form.isList = 0;
  form.templateId = "";

  // 重置模式状态
  isEdit.value = false;
  isView.value = false;

  // 重置表单验证
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
  form.title = data.title || "";
  form.name = data.name || "";
  form.moduleId = data.moduleId || "";
  form.checkTable = data.checkTable || "";
  form.icon = data.icon || "";
  form.departmentIds = data.departmentIds || [];
  form.isCopy = data.isCopy != null ? (data.isCopy === true ? 1 : (data.isCopy === false ? 0 : data.isCopy)) : 0;
  form.isFile = data.isFile != null ? (data.isFile === true ? 1 : (data.isFile === false ? 0 : data.isFile)) : 0;
  form.isExport = data.isExport != null ? (data.isExport === true ? 1 : (data.isExport === false ? 0 : data.isExport)) : 0;
  form.isBack = data.isBack != null ? (data.isBack === true ? 1 : (data.isBack === false ? 0 : data.isBack)) : 0;
  form.isReversed = data.isReversed != null ? (data.isReversed === true ? 1 : (data.isReversed === false ? 0 : data.isReversed)) : 0;
  form.addUrl = data.addUrl || "";
  form.viewUrl = data.viewUrl || "";
  form.isList = data.isList != null ? (data.isList === true ? 1 : (data.isList === false ? 0 : data.isList)) : 0;
  form.templateId = data.templateId || "";

  isEdit.value = true;
  dialogVisible.value = true;
}

/** 显示弹窗 - 查看模式 */
function openView(data) {
  reset();
  // 填充表单数据
  form.id = data.id;
  form.title = data.title || "";
  form.name = data.name || "";
  form.moduleId = data.moduleId || "";
  form.checkTable = data.checkTable || "";
  form.icon = data.icon || "";
  form.departmentIds = data.departmentIds || [];
  form.isCopy = data.isCopy != null ? (data.isCopy === true ? 1 : (data.isCopy === false ? 0 : data.isCopy)) : 0;
  form.isFile = data.isFile != null ? (data.isFile === true ? 1 : (data.isFile === false ? 0 : data.isFile)) : 0;
  form.isExport = data.isExport != null ? (data.isExport === true ? 1 : (data.isExport === false ? 0 : data.isExport)) : 0;
  form.isBack = data.isBack != null ? (data.isBack === true ? 1 : (data.isBack === false ? 0 : data.isBack)) : 0;
  form.isReversed = data.isReversed != null ? (data.isReversed === true ? 1 : (data.isReversed === false ? 0 : data.isReversed)) : 0;
  form.addUrl = data.addUrl || "";
  form.viewUrl = data.viewUrl || "";
  form.isList = data.isList != null ? (data.isList === true ? 1 : (data.isList === false ? 0 : data.isList)) : 0;
  form.templateId = data.templateId || "";

  isView.value = true;
  dialogVisible.value = true;
}

/** 提交表单 */
function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? updateApprovalType : addApprovalType;
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

onMounted(() => {
  getModules();
  getTemplates();
  getDeptTree();
});
</script>

<style scoped>
.divider {
  margin: 20px 0;
  font-weight: bold;
}
</style>

<style>
/* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
.approval-type-dialog.el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.approval-type-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}

/* 隐藏滚动条但保持滚动功能 */
.approval-type-dialog .el-dialog__body::-webkit-scrollbar {
  display: none;
}

/* Firefox 隐藏滚动条 */
.approval-type-dialog .el-dialog__body {
  scrollbar-width: none;
}
</style>
