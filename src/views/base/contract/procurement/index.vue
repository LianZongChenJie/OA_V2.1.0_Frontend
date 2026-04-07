<template>
  <div class="main-content">
    <div class="product-classify">
      <ProductClassifyTree @node-click="handleNodeClick" />
    </div>
    <div class="product-list"><List :cate-id="cateId" /></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ProductClassifyTree from "./components/ProductClassifyTree.vue";
import List from "./list.vue";

const cateId = ref(null);

// 节点点击事件
const handleNodeClick = (data) => {
  cateId.value = data;
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
    height: 100%;
  }
}
</style>
