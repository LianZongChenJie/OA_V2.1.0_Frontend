<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="60%"
    append-to-body
    class="notice-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="isView ? {} : rules"
      label-width="100px"
    >
      <!-- 第一行：公告标题 + 公告分类 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="公告标题" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入公告标题"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公告分类" prop="cateId">
            <el-select
              v-model="form.cateId"
              :disabled="isView"
              placeholder="请选择公告分类"
              clearable
              filterable
              remote
              :remote-method="handleCateSearch"
              :loading="cateLoading"
              style="width: 100%"
              @visible-change="handleCateVisible"
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
      </el-row>

      <!-- 第二行：排序 + 公告状态 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="form.sort"
              :min="0"
              :disabled="isView"
              controls-position="right"
              style="width: 100%"
              placeholder="请输入排序"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公告状态" prop="status">
            <el-radio-group v-model="form.status" :disabled="isView">
              <el-radio
                v-for="dict in note_status"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行：公告内容（独占一行） -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="公告内容" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="8"
              placeholder="请输入公告内容"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isView" type="primary" @click="handleSubmit">
          确 定
        </el-button>
        <el-button @click="dialogVisible = false">
          {{ isView ? "关 闭" : "取 消" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="AddNotice">
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { add, edit } from "@/api/administration/notice";
import { getPageList as getNoteCateList } from "@/api/base/administration/noticeType";

const { proxy } = getCurrentInstance();
const { note_status } = proxy.useDict("note_status");

const dialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const isView = ref(false);

// 分类下拉选项数据
const cateOptions = ref([]);
const cateLoading = ref(false);

const form = reactive({
  id: undefined,
  title: "",
  cateId: undefined,
  sort: 1,
  status: "1",
  content: "",
});

const dialogTitle = computed(() => {
  if (isView.value) return "查看公告";
  return isEdit.value ? "编辑公告" : "新增公告";
});

const rules = {
  title: [{ required: true, message: "请输入公告标题", trigger: "blur" }],
  cateId: [{ required: true, message: "请选择公告分类", trigger: "change" }],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
  status: [{ required: true, message: "请选择公告状态", trigger: "change" }],
  content: [{ required: true, message: "请输入公告内容", trigger: "blur" }],
};

function reset() {
  form.id = undefined;
  form.title = "";
  form.cateId = undefined;
  form.sort = 1;
  form.status = "1";
  form.content = "";
  isEdit.value = false;
  isView.value = false;
  formRef.value?.clearValidate();
}

function getCateList(query = "") {
  const params = {
    pageNum: 1,
    pageSize: 100,
  };
  if (query) {
    params.keyword = query;
  }
  cateLoading.value = true;
  getNoteCateList(params)
    .then((response) => {
      if (response.code === 200) {
        cateOptions.value = response.rows || [];
      }
    })
    .finally(() => {
      cateLoading.value = false;
    });
}

function handleCateVisible(visible) {
  if (visible && cateOptions.value.length === 0) {
    getCateList();
  }
}

function handleCateSearch(query) {
  getCateList(query);
}

function handleClose() {
  reset();
}

function open() {
  reset();
  dialogVisible.value = true;
}

function openEdit(data) {
  reset();
  form.id = data.id;
  form.title = data.title || "";
  form.cateId = data.cateId || undefined;
  form.sort = data.sort || 1;
  // 状态值转换为字符串以匹配 radio 的 label
  form.status = data.status !== undefined ? String(data.status) : "1";
  form.content = data.content || "";
  isEdit.value = true;
  dialogVisible.value = true;
  getCateList();
}

function openView(data) {
  reset();
  form.id = data.id;
  form.title = data.title || "";
  form.cateId = data.cateId || undefined;
  form.sort = data.sort || 1;
  form.status = data.status !== undefined ? String(data.status) : "1";
  form.content = data.content || "";
  isView.value = true;
  dialogVisible.value = true;
  getCateList();
}

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiMethod = isEdit.value ? edit : add;
      const successMsg = isEdit.value ? "编辑成功" : "新增成功";
      apiMethod({ ...form }).then(() => {
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

<style>
.notice-dialog .el-dialog {
  max-height: 88vh;
  display: flex;
  flex-direction: column;
}

.notice-dialog .el-dialog__body {
  max-height: calc(88vh - 120px);
  overflow-y: auto;
}
</style>
