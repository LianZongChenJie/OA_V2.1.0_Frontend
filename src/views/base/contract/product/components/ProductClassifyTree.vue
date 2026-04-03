<template>
  <el-tree
    style="max-width: 600px"
    :data="data"
    :props="defaultProps"
    @node-click="handleNodeClick"
  >
    <template #default="{ node }">
      <el-icon>
        <component :is="getIcon(node)" />
      </el-icon>
      <span class="tree-node-label">{{ node.label }}</span>
    </template>
  </el-tree>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getTree } from "@/api/base/contract/productClassify";
import { Folder, Document } from "@element-plus/icons-vue";

const data = ref([]);

const defaultProps = {
  children: "children",
  label: "title",
};

// 根据节点是否有子节点返回不同图标
const getIcon = (node) => {
  return node.childNodes && node.childNodes.length > 0 ? Folder : Document;
};

// 节点点击事件
const handleNodeClick = (data) => {
  console.log('点击节点:', data);
};

onMounted(() => {
  getTree().then((res) => {
    data.value = res.data;
  });
})
</script>

<style lang="scss" scoped>
.el-icon {
  margin-right: 5px;
}
</style>
