<template>
  <div class="trace-list-container">
    <!-- 模块头部 -->
    <div class="trace-header">
      <span class="trace-title">
        跟进记录
        <el-tag v-if="traceList.length" size="small" type="info" effect="plain">{{ traceList.length }}</el-tag>
      </span>
      <el-button
        v-if="!disabled"
        type="primary"
        size="small"
        plain
        :icon="Plus"
        @click="handleAdd"
      >
        新增跟进记录
      </el-button>
    </div>

    <!-- 跟进记录列表 -->
    <div v-loading="loading" class="trace-table-wrapper">
      <el-table :data="traceList" border stripe size="small" style="width: 100%">
        <el-table-column label="跟进时间" prop="followTimeStr" width="150" align="center" />
        <el-table-column label="联系人" prop="contactName" width="90" align="center" show-overflow-tooltip />
        <el-table-column label="跟进方式" width="90" align="center">
          <template #default="{ row }">
            <el-tag
              :type="followTypeTagClass[row.types] || 'primary'"
              size="small"
              effect="dark"
            >
              {{ row.typesName || '跟进' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前阶段" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              v-if="row.stageName"
              :type="stageTagClass[row.stage] || 'primary'"
              size="small"
              effect="plain"
            >
              {{ row.stageName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下次沟通" prop="nextTimeStr" width="150" align="center" />
        <el-table-column label="跟进人" prop="adminName" width="90" align="center" show-overflow-tooltip />
        <el-table-column label="跟进内容" prop="content" min-width="160" show-overflow-tooltip />
        <el-table-column label="附件" width="120">
          <template #default="{ row }">
            <div v-if="row.attachments && row.attachments.length > 0">
              <div v-for="(file, fileIdx) in row.attachments" :key="fileIdx" class="cell-attachment">
                <el-icon class="file-icon"><Document /></el-icon>
                <el-link type="primary" @click="handleDownload(row, file)">{{ file.fileName }}</el-link>
              </div>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="!disabled && canEdit(row)"
              link
              type="primary"
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="!disabled && canEdit(row)"
              link
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无跟进记录" :image-size="80" />
        </template>
      </el-table>
    </div>

    <!-- 新增 / 编辑跟进记录表单 -->
    <el-dialog
      v-model="traceDialogVisible"
      :title="isEdit ? '编辑跟进记录' : '新增跟进记录'"
      width="700px"
      append-to-body
      destroy-on-close
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="traceForm" :rules="rules" label-width="110px">
        <el-form-item label="联系人" prop="contactId">
          <el-select v-model="traceForm.contactId" placeholder="请选择联系人" filterable style="width: 100%">
            <el-option
              v-for="user in userOptions"
              :key="user.userId"
              :label="user.nickName"
              :value="user.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="跟进方式" prop="types">
          <el-select v-model="traceForm.types" placeholder="请选择跟进方式" style="width: 100%">
            <el-option
              v-for="item in customer_follow_type"
              :key="item.value"
              :label="item.label"
              :value="Number(item.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前阶段" prop="stage">
          <el-select v-model="traceForm.stage" placeholder="请选择当前阶段" clearable style="width: 100%">
            <el-option
              v-for="item in customer_trace_stage"
              :key="item.value"
              :label="item.label"
              :value="Number(item.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="跟进时间" prop="followTime">
          <el-date-picker
            v-model="traceForm.followTime"
            type="datetime"
            placeholder="请选择跟进时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="下次沟通时间" prop="nextTime">
          <el-date-picker
            v-model="traceForm.nextTime"
            type="datetime"
            placeholder="请选择下次沟通时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="跟进内容" prop="content">
          <el-input
            v-model="traceForm.content"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            placeholder="请输入跟进内容"
          />
        </el-form-item>
        <el-form-item label="附件">
          <UploadAttachmentList
            v-model="attachments"
            :disabled="disabled"
            :limit="5"
            action="tender/attachment/upload"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleSave">保 存</el-button>
        <el-button @click="traceDialogVisible = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="TraceList">
import { ref, reactive, computed, watch, onMounted, nextTick, getCurrentInstance } from "vue";
import { Plus, Document } from "@element-plus/icons-vue";
import UploadAttachmentList from "@/components/UploadAttachmentList/index.vue";
import { getPageList, add, edit, getDetail, del } from "@/api/customer/trace";
import { listUser } from "@/api/system/user.js";
import { downloadFile } from "@/utils/download";
import useUserStore from "@/store/modules/user";

const { proxy } = getCurrentInstance();
const userStore = useUserStore();
const { customer_follow_type, customer_trace_stage } = proxy.useDict(
  "customer_follow_type",
  "customer_trace_stage"
);

const props = defineProps({
  // 当前客户 ID
  customerId: {
    type: [Number, String],
    default: undefined,
  },
  // 是否查看模式（详情弹窗中仅展示）
  disabled: {
    type: Boolean,
    default: false,
  },
});

// 跟进记录列表
const loading = ref(false);
const traceList = ref([]);

// 员工列表（与「归属员工」数据源一致，用于「联系人」下拉）
const userOptions = ref([]);

// 获取员工列表
function getUserList() {
  listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
    userOptions.value = response.rows || [];
  });
}

// 字典样式映射
const followTypeTagClass = computed(() => {
  const map = {};
  (customer_follow_type.value || []).forEach((item) => {
    map[Number(item.value)] = item.listClass || "primary";
  });
  return map;
});
const stageTagClass = computed(() => {
  const map = {};
  (customer_trace_stage.value || []).forEach((item) => {
    map[Number(item.value)] = item.listClass || "primary";
  });
  return map;
});

// 表单相关
const traceDialogVisible = ref(false);
const formRef = ref(null);
const isEdit = ref(false);
const attachments = ref([]);

const traceForm = reactive({
  id: undefined,
  contactId: undefined,
  types: undefined,
  stage: undefined,
  followTime: new Date(),
  nextTime: undefined,
  content: "",
});

const rules = {
  contactId: [{ required: true, message: "请选择联系人", trigger: "change" }],
  types: [{ required: true, message: "请选择跟进方式", trigger: "change" }],
  followTime: [{ required: true, message: "请选择跟进时间", trigger: "change" }],
  nextTime: [{ required: true, message: "请选择下次沟通时间", trigger: "change" }],
  content: [{ required: true, message: "请输入跟进内容", trigger: "blur" }],
};

// 是否可编辑（仅跟进人本人）
function canEdit(row) {
  return Number(row.adminId) === Number(userStore.id);
}

// 加载跟进记录列表
async function loadList() {
  if (!props.customerId) {
    traceList.value = [];
    return;
  }
  loading.value = true;
  try {
    const res = await getPageList({ pageNum: 1, pageSize: 999, cid: props.customerId });
    traceList.value = res.rows || [];
  } finally {
    loading.value = false;
  }
}

// 新增
function handleAdd() {
  isEdit.value = false;
  resetForm();
  traceDialogVisible.value = true;
}

// 编辑
async function handleEdit(row) {
  isEdit.value = true;
  resetForm();
  // 优先用列表行数据回填，缺失时拉取详情
  let data = row;
  if (!row.fileIds && row.id) {
    const res = await getDetail(row.id);
    data = res.data || res || row;
  }
  traceForm.id = data.id;
  traceForm.contactId = data.contactId || undefined;
  traceForm.types = data.types ? Number(data.types) : undefined;
  traceForm.stage = data.stage ? Number(data.stage) : undefined;
  traceForm.followTime = data.followTime ? new Date(Number(data.followTime) * 1000) : new Date();
  traceForm.nextTime = data.nextTime ? new Date(Number(data.nextTime) * 1000) : undefined;
  traceForm.content = data.content || "";
  attachments.value = Array.isArray(data.attachments) ? [...data.attachments] : [];
  traceDialogVisible.value = true;
  await nextTick();
  formRef.value?.clearValidate();
}

// 删除（仅跟进人本人）
function handleDelete(row) {
  proxy.$modal
    .confirm(`是否确认删除跟进时间为「${row.followTimeStr || ""}"的跟进记录？`)
    .then(() => {
      return del(row.id);
    })
    .then(() => {
      proxy.$modal.msgSuccess("删除成功");
      loadList();
    })
    .catch(() => {});
}

// 保存（独立保存，不依赖客户弹窗的确定按钮）
async function handleSave() {
  await formRef.value.validate();

  const payload = {
    cid: Number(props.customerId),
    contactId: Number(traceForm.contactId),
    types: Number(traceForm.types),
    stage: traceForm.stage ? Number(traceForm.stage) : 0,
    followTime: Math.floor(new Date(traceForm.followTime).getTime() / 1000),
    nextTime: Math.floor(new Date(traceForm.nextTime).getTime() / 1000),
    content: traceForm.content,
    fileIds: attachments.value.length ? JSON.stringify(attachments.value) : "",
  };

  if (isEdit.value) {
    payload.id = traceForm.id;
    await edit(payload);
    proxy.$modal.msgSuccess("修改成功");
  } else {
    await add(payload);
    proxy.$modal.msgSuccess("新增成功");
  }

  traceDialogVisible.value = false;
  await loadList();
}

// 下载附件（调用跟进记录专属下载接口）
function handleDownload(row, file) {
  if (!row.id || !file || !file.fileName) {
    proxy.$modal.msgWarning("附件信息不存在");
    return;
  }
  const baseUrl = import.meta.env.VITE_APP_BASE_API || "";
  const url = `${baseUrl}/system/customerTrace/attachment/download?traceId=${row.id}&fileName=${encodeURIComponent(file.fileName)}`;
  downloadFile(url, file.fileName).catch(() => {
    proxy.$modal.msgError("下载失败");
  });
}

// 重置表单
function resetForm() {
  traceForm.id = undefined;
  traceForm.contactId = undefined;
  traceForm.types = undefined;
  traceForm.stage = undefined;
  traceForm.followTime = new Date();
  traceForm.nextTime = undefined;
  traceForm.content = "";
  attachments.value = [];
  isEdit.value = false;
}

watch(
  () => props.customerId,
  (val) => {
    if (val) {
      loadList();
    } else {
      traceList.value = [];
    }
  }
);

onMounted(() => {
  getUserList();
  if (props.customerId) {
    loadList();
  }
});

// 暴露刷新方法，供父组件调用
defineExpose({
  loadList,
});
</script>

<style scoped lang="scss">
.trace-list-container {
  width: 100%;
}

.trace-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.trace-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}

.trace-table-wrapper {
  max-height: 420px;
  overflow-y: auto;

  .cell-attachment {
    display: flex;
    align-items: center;
    gap: 4px;
    line-height: 18px;
    font-size: 13px;

    .file-icon {
      color: #909399;
      flex-shrink: 0;
    }
  }
}
</style>
