<template>
  <div class="main-content">
    <div class="product-classify">
      <ProductClassifyTree ref="treeRef" @node-click="handleNodeClick" />
    </div>
    <div class="product-list"><List :cate-id="cateId" :refresh-tree="refreshTree" /></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ProductClassifyTree from "./components/ProductClassifyTree.vue";
import List from "./list.vue";

const cateId = ref(null);
const treeRef = ref(null);

// 节点点击事件
const handleNodeClick = (data) => {
  cateId.value = data;
};

// 刷新分类树
function refreshTree() {
  treeRef.value?.refresh();
}

defineExpose({
  refreshTree,
});
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  flex-direction: row;
  gap: 20px;
  .product-classify {
    width: 220px;
    background-color: #fff;
    height: 100%;
  }
  .product-list {
    width: calc(100% - 220px);
    height: 100%;
  }
}
</style>
