<template>
  <div class="main-content">
    <div class="product-classify">
      <ProductClassifyTree @node-click="handleNodeClick" />
    </div>
    <div class="product-list"></div>
  </div>
</template>

<script setup>
import ProductClassifyTree from "./components/ProductClassifyTree.vue";

// 节点点击事件
const handleNodeClick = (data) => {
  console.log('点击节点:', data);
};
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
    background-color: #fff;
    height: 100%;
  }
}
</style>
