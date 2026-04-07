<template>
  <h3 class="header" @click="$emit('node-click', null, null)">采购品分类</h3>
  <el-menu
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
  >
    <template v-for="(menu, index) in data" :key="index">
      <!-- 如果一级菜单有子项，则显示为子菜单 -->
      <el-sub-menu
        v-if="menu.children && menu.children.length > 0"
        :index="String(menu.id)"
      >
        <template #title>
          <el-icon
            ><component
              :is="openedMenus.has(String(menu.id)) ? FolderOpened : Folder"
          /></el-icon>
          <span>{{ menu.title }}</span>
        </template>
        <template
          v-for="(child, childIndex) in menu.children"
          :key="childIndex"
        >
          <!-- 如果二级菜单有子项，则显示为子菜单 -->
          <el-sub-menu
            v-if="child.children && child.children.length > 0"
            :index="String(child.id)"
          >
            <template #title>
              <span>{{ child.title }}</span>
            </template>
            <el-menu-item
              v-for="(item, itemIndex) in child.children"
              :key="itemIndex"
              :index="String(item.id)"
              >{{ item.title }}</el-menu-item
            >
          </el-sub-menu>
          <!-- 如果二级菜单没有子项，则显示为可点击的菜单项 -->
          <el-menu-item v-else :index="String(child.id)">
            <el-icon><Tickets /></el-icon>
            {{ child.title }}</el-menu-item
          >
        </template>
      </el-sub-menu>
      <!-- 如果一级菜单没有子项，则显示为可点击的菜单项 -->
      <el-menu-item v-else :index="String(menu.id)"
        ><el-icon><Tickets /></el-icon>{{ menu.title }}</el-menu-item
      >
    </template>
  </el-menu>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getTree } from "@/api/base/contract/procurementClassify";
import { Folder, Document, FolderOpened } from "@element-plus/icons-vue";

const data = ref([]);
const openedMenus = ref(new Set()); // 跟踪打开的菜单

// 定义emit事件
const emit = defineEmits(["node-click"]);

const defaultProps = {
  children: "children",
  label: "title",
};

// 刷新树数据
const refresh = () => {
  getTree({ pid: 0 }).then((res) => {
    data.value = res.data;
  });
};

// 根据节点是否有子节点返回不同图标
const getIcon = (node) => {
  return node.childNodes && node.childNodes.length > 0 ? Folder : Document;
};

// 节点点击事件
const handleNodeClick = (data) => {
  console.log("点击节点:", data);
};

// 菜单打开事件
const handleOpen = (index) => {
  console.log("==handleOpen==>",index);
  
  openedMenus.value.add(index);
};

// 菜单关闭事件
const handleClose = (index) => {
  openedMenus.value.delete(index);
};

// 递归查找节点数据
const findNodeById = (items, id) => {
  for (const item of items) {
    if (String(item.id) === id) {
      return item;
    }
    if (item.children && item.children.length > 0) {
      const found = findNodeById(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

// 菜单选择事件 - 捕获点击的菜单ID
const handleSelect = (index, indexPath) => {
  const nodeData = findNodeById(data.value, index);
  emit("node-click", index, nodeData);
};

onMounted(() => {
  getTree({pid: 0}).then((res) => {
    data.value = res.data;
  });
});

// 暴露方法给父组件
defineExpose({
  refresh,
});
</script>

<style lang="scss" scoped>
.header {
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  cursor: pointer;
}
.header:hover {
  color: #409eff;
}

.el-menu-vertical-demo {
  border-right: 1px solid #e4e7ed;
  background-color: #ffffff;

  :deep(.el-sub-menu__title) {
    padding: 12px 20px;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;

    &:hover {
      background-color: #f5f7fa;
      color: #409eff;
      border-left-color: #409eff;
    }
  }

  :deep(.el-menu-item) {
    padding-left: 50px;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;

    &:hover {
      background-color: #ecf5ff;
      color: #409eff;
      border-left-color: #409eff;
    }

    &.is-active {
      background-color: #ecf5ff;
      color: #409eff;
      border-left-color: #409eff;
      font-weight: 500;
    }
  }

  :deep(.el-menu-item-group__title) {
    padding: 10px 20px 5px 30px;
    font-size: 13px;
    color: #909399;
    font-weight: 500;
  }

  :deep(.el-sub-menu) {
    .el-icon {
      margin-right: 8px;
      font-size: 18px;
      transition: transform 0.3s ease;
    }

    &.is-opened {
      > .el-sub-menu__title {
        background-color: #f0f2f5;
        color: #303133;
      }
    }
  }
}

.el-icon {
  color: #909399;
}

:deep(.el-sub-menu__title):hover .el-icon {
  color: #409eff;
}
</style>
