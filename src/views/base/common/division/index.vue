<template>
  <div class="main-content">
    <ThreeList
      ref="threeListRef"
      :api="getThreeList"
      :demand-expand="true"
      :toolbar-buttons="toolbarButtons"
      :columns="columns"
      :operation-column="getOperationColumn(add, edit, del)"
    />

    <!-- 新增/编辑节点弹窗 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级节点" prop="pid">
          <el-input v-model="form.parentName" disabled placeholder="上级节点" />
        </el-form-item>
        <!-- 编辑模式下显示ID（不可编辑） -->
        <el-form-item v-if="isEdit" label="区划ID" prop="id">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <template v-else>
          <el-form-item label="ID模式" prop="idMode">
            <el-radio-group v-model="form.idMode" @change="handleIdModeChange">
              <el-radio label="prefix">前缀模式</el-radio>
              <el-radio label="custom">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 前缀模式 -->
          <el-form-item v-if="form.idMode === 'prefix'" label="区划ID" prop="idSuffix">
            <el-input
              v-model="form.idSuffix"
              :placeholder="idPlaceholder"
              :maxlength="2"
              :disabled="!form.level"
            >
              <template #prefix>
                <span v-if="idPrefix" class="id-prefix">{{ idPrefix }}</span>
              </template>
              <template #suffix>
                <span v-if="showIdSuffix" class="id-suffix">{{ idSuffixValue }}</span>
              </template>
            </el-input>
          </el-form-item>
          <!-- 自定义模式 -->
          <el-form-item v-else label="区划ID" prop="customId">
            <el-input
              v-model="form.customId"
              placeholder="请输入区划ID"
              :maxlength="6"
            />
          </el-form-item>
        </template>
        <el-form-item label="区划名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入区划名称" />
        </el-form-item>
        <el-form-item label="区划简称" prop="shortname">
          <el-input v-model="form.shortname" placeholder="请输入区划简称" />
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-tag :type="levelTagType" size="default">{{ levelLabel }}</el-tag>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, getCurrentInstance, computed } from "vue";
import ThreeList from "@/components/threeList/index.vue";
import { getThreeList, exportAreaData, addArea, updateArea } from "@/api/base/common/division";
import { exportExcel } from "@/utils/export";
import { columns, getOperationColumn } from "./config/columns";

const { proxy } = getCurrentInstance();
const threeListRef = ref(null);

// 弹窗相关
const open = ref(false);
const title = ref("");
const formRef = ref(null);
const isEdit = ref(false);

const data = reactive({
  form: { idMode: 'prefix' },
  rules: {
    name: [{ required: true, message: "区划名称不能为空", trigger: "blur" }],
    level: [{ required: true, message: "请选择级别", trigger: "change" }],
    idSuffix: [{ required: true, message: "区划ID不能为空", trigger: "blur" }],
    customId: [{ required: true, message: "区划ID不能为空", trigger: "blur" }],
  },
});
const { form, rules } = toRefs(data);

// 计算区划ID前缀
const idPrefix = computed(() => {
  if (!form.value.pid) return '';
  const pid = String(form.value.pid);
  if (form.value.level === 2) {
    // 市级别：取pid前2位
    return pid.substring(0, 2);
  } else if (form.value.level === 3) {
    // 区级别：取pid前4位
    return pid.substring(0, 4);
  }
  return '';
});

// 是否显示后缀（市级别显示00）
const showIdSuffix = computed(() => {
  return form.value.level === 2;
});

// 后缀值
const idSuffixValue = computed(() => {
  return form.value.level === 2 ? '00' : '';
});

// placeholder
const idPlaceholder = computed(() => {
  if (!form.value.level) return '请先选择级别';
  return '请输入2位区划ID';
});

// 级别标签
const levelLabel = computed(() => {
  const levelMap = { 1: '省', 2: '市', 3: '区' };
  return levelMap[form.value.level] || '';
});

// 级别标签类型
const levelTagType = computed(() => {
  const typeMap = { 1: 'danger', 2: 'warning', 3: 'success' };
  return typeMap[form.value.level] || 'info';
});

// 表单重置
function reset() {
  form.value = {
    id: undefined,
    idSuffix: undefined,
    customId: undefined,
    idMode: 'prefix',
    pid: undefined,
    parentName: undefined,
    name: undefined,
    shortname: undefined,
    level: undefined,
    longitude: undefined,
    latitude: undefined,
    sort: 0,
  };
  isEdit.value = false;
  formRef.value?.resetFields();
}

//新增子节点
const add = (row) => {
  reset();
  form.value.pid = row.id;
  form.value.parentName = row.name;
  // 根据父节点级别自动设置子节点级别
  if (row.level && row.level < 3) {
    form.value.level = row.level + 1;
  }
  isEdit.value = false;
  open.value = true;
  title.value = "添加子节点";
};

//编辑子节点
const edit = (row) => {
  reset();
  // 填充表单数据
  form.value = {
    id: row.id,
    pid: row.pid,
    parentName: row.parentName || row.parent?.name || '根节点',
    name: row.name,
    shortname: row.shortname,
    level: row.level,
    longitude: row.longitude,
    latitude: row.latitude,
    sort: row.sort || 0,
    idMode: 'prefix',
    idSuffix: undefined,
    customId: undefined,
  };

  // 判断ID模式：如果ID符合前缀规则则用前缀模式，否则用自定义模式
  const pid = String(row.pid || '');
  const id = String(row.id || '');
  if (row.level === 2 && id.startsWith(pid.substring(0, 2)) && id.endsWith('00')) {
    form.value.idMode = 'prefix';
    form.value.idSuffix = id.substring(pid.length, pid.length + 2);
  } else if (row.level === 3 && id.startsWith(pid.substring(0, 4))) {
    form.value.idMode = 'prefix';
    form.value.idSuffix = id.substring(4);
  } else {
    form.value.idMode = 'custom';
    form.value.customId = id;
  }

  isEdit.value = true;
  open.value = true;
  title.value = "编辑节点";
};

//删除子节点
const del = (row) => {
  console.log("====del===>", row);
};

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// ID模式切换处理
function handleIdModeChange() {
  form.value.idSuffix = undefined;
  form.value.customId = undefined;
}

// 提交按钮
function submitForm() {
  formRef.value.validate((valid) => {
    if (valid) {
      let fullId = '';

      if (form.value.idMode === 'prefix') {
        // 前缀模式：自动拼接
        const suffix = String(form.value.idSuffix).padStart(2, '0');
        if (form.value.level === 2) {
          fullId = `${idPrefix.value}${suffix}00`;
        } else if (form.value.level === 3) {
          fullId = `${idPrefix.value}${suffix}`;
        } else {
          fullId = form.value.idSuffix;
        }
      } else {
        // 自定义模式：直接使用用户输入的ID
        fullId = form.value.customId;
      }

      const submitData = {
        ...form.value,
        id: fullId,
      };
      delete submitData.idMode;
      delete submitData.customId;
      if (isEdit.value) {
        // 编辑模式
        updateArea(submitData).then(() => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          threeListRef.value?.refresh();
        });
      } else {
        // 新增模式
        addArea(submitData).then(() => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          threeListRef.value?.refresh();
        });
      }
    }
  });
}

// 导出区域数据
async function handleExport(level) {
  const levelMap = { 1: "省", 2: "市", 3: "区" };
  try {
    const res = await exportAreaData(level);
    if (res.code === 200 && res.data) {
      // 定义列配置
      const columns = [
        { key: "id", title: "ID" },
        { key: "name", title: "名称" },
        { key: "shortname", title: "简称" },
        { key: "level", title: "级别" },
        { key: "pid", title: "父ID" },
        { key: "longitude", title: "经度" },
        { key: "latitude", title: "纬度" },
        { key: "sort", title: "排序" },
      ];
      exportExcel(
        res.data,
        `导出${levelMap[level]}级数据`,
        levelMap[level],
        columns,
      );
    }
  } catch (error) {
    console.error("导出失败:", error);
  }
}

// 工具栏按钮配置
const toolbarButtons = ref([
  {
    label: "导出省",
    icon: "Download",
    onClick: () => {
      handleExport(1);
    },
  },
  {
    label: "导出市",
    icon: "Download",
    onClick: () => {
      handleExport(2);
    },
  },
  {
    label: "导出区",
    icon: "Download",
    onClick: () => {
      handleExport(3);
    },
  },
]);
</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;
}

.id-prefix {
  color: #909399;
  font-weight: 500;
}

.id-suffix {
  color: #909399;
  font-weight: 500;
}
</style>
