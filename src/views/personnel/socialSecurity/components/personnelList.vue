<template>
  <el-dialog
    title="关联人员"
    v-model="dialogVisible"
    width="65%"
    append-to-body
    class="personnel-list-dialog"
    @close="handleClose"
    :close-on-click-modal="false"
  >
    <div>
      <!-- 操作按钮区 -->
      <div style="margin-bottom: 15px">
        <el-button
          type="primary"
          size="small"
          icon="plus"
          @click="handleAddPersonnel"
        >
          添加人员
        </el-button>
        <el-button
          type="danger"
          size="small"
          icon="delete"
          :disabled="selectedIds.length === 0"
          @click="handleRemovePersonnel"
        >
          移除选中
        </el-button>
      </div>

      <!-- 关联人员列表 -->
      <TableList
        :api="getUserPageList"
        :columns="personnelColumns"
        :params="tableParams"
        :show-selection="true"
        :toolbar-buttons="[]"
        :page-size="10"
        row-key="userId"
        ref="personnelTableRef"
        @selection-change="handleSelectionChange"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </template>

    <!-- 添加人员弹窗 -->
    <el-dialog
      title="选择人员"
      v-model="addDialogVisible"
      width="65%"
      append-to-body
      class="personnel-choose-list-dialog"
      :close-on-click-modal="false"
      @close="handleAddDialogClose"
    >
      <TableList
        v-if="addDialogVisible"
        :api="listUser"
        :columns="addUserColumns"
        :show-selection="true"
        :toolbar-buttons="[]"
        :page-size="10"
        row-key="userId"
        ref="addTableRef"
        @selection-change="handleAddSelectionChange"
      >
        <template #dept="{ row }">
          <span>{{ row.dept.deptName || "-" }}</span>
        </template>
      </TableList>

      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            :disabled="addSelectedIds.length === 0"
            @click="handleConfirmAdd"
          >
            确定添加
          </el-button>
          <el-button @click="addDialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup name="PersonnelList">
import { ref, reactive, computed, getCurrentInstance } from "vue";
import TableList from "@/components/tableList/index.vue";
import {
  getUserPageList,
  addUser,
  delUser,
} from "@/api/personnel/socialSecurity";
import { listUser } from "@/api/system/user.js";

const { proxy } = getCurrentInstance();

const dialogVisible = ref(false);
const selectedIds = ref([]);
const currentId = ref(null);
const personnelTableRef = ref(null);
const addTableRef = ref(null);

// 关联人员表格参数
const tableParams = computed(() => ({
  socialId: currentId.value,
}));

// 关联人员列配置
const personnelColumns = [
  {
    fieldName: "nickName",
    width: "30%",
    label: "姓名",
    minWidth: 120,
    align: "center",
  },
  {
    fieldName: "dept",
    width: "30%",
    label: "部门",
    minWidth: 150,
    align: "center",
  },
  {
    fieldName: "createTime",
    width: "10%",
    label: "入职时间",
    minWidth: 130,
    align: "center",
  },
];

// 添加人员弹窗
const addDialogVisible = ref(false);
const addSelectedIds = ref([]);

// 添加人员列配置
const addUserColumns = [
  {
    fieldName: "nickName",
    label: "姓名",
    width: "30%",
    minWidth: 120,
    align: "center",
    searchable: {
      type: "input",
      fieldName: "nickName",
      placeholder: "请输入姓名",
      label: "姓名",
      order: 1,
    },
  },
  {
    fieldName: "dept",
    width: "30%",
    label: "部门",
    minWidth: 150,
    align: "center",
  },
  {
    fieldName: "createTime",
    width: "10%",
    label: "入职时间",
    minWidth: 130,
    align: "center",
  },
];

/** 打开弹窗 */
function open(row) {
  currentId.value = row.id;
  dialogVisible.value = true;
}

/** 关联人员表格多选变化 */
function handleSelectionChange(selection) {
  selectedIds.value = selection.map((item) => item.userId || item.uid);
}

/** 打开添加人员弹窗 */
function handleAddPersonnel() {
  addDialogVisible.value = true;
}

/** 添加弹窗 - 选择变化 */
function handleAddSelectionChange(selection) {
  addSelectedIds.value = selection.map((item) => item.userId);
}

/** 确认添加人员 */
async function handleConfirmAdd() {
  if (addSelectedIds.value.length === 0) {
    proxy.$modal.msgWarning("请选择要添加的人员");
    return;
  }
  try {
    const res = await addUser({
      socialId: currentId.value,
      uids: addSelectedIds.value,
    });
    if (res) {
      proxy.$modal.msgSuccess("添加成功");
      addDialogVisible.value = false;
      personnelTableRef.value?.refresh();
    }
  } catch (error) {
    console.error("添加人员失败:", error);
  }
}

/** 添加弹窗关闭 */
function handleAddDialogClose() {
  addSelectedIds.value = [];
}

/** 移除选中人员 */
async function handleRemovePersonnel() {
  if (selectedIds.value.length === 0) {
    proxy.$modal.msgWarning("请选择要移除的人员");
    return;
  }
  proxy.$modal
    .confirm("确定要移除选中的人员吗？")
    .then(async () => {
      try {
        const res = await delUser({
          socialId: currentId.value,
          uids: selectedIds.value,
        });
        if (res) {
          proxy.$modal.msgSuccess("移除成功");
          selectedIds.value = [];
          personnelTableRef.value?.refresh();
        }
      } catch (error) {
        console.error("移除人员失败:", error);
      }
    })
    .catch(() => {});
}

/** 关闭主弹窗 */
function handleClose() {
  currentId.value = null;
  selectedIds.value = [];
}

defineExpose({
  open,
});
</script>

<style scoped>
.personnel-list-dialog .dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>

<style>
.personnel-choose-list-dialog {
  background-color: #f5f7fa;
}
</style>
