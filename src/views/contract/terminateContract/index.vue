<template>
  <div class="main-content">
    <div class="main">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="(tab, index) in tabs"
          :label="tab.label"
          :name="tab.name"
        ></el-tab-pane>
      </el-tabs>
      <SaleContract v-if="activeName === 'sale'" />
      <PurchaseContract v-if="activeName === 'purchase'" />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import SaleContract from "./saleContract/index.vue";
import PurchaseContract from "./purchaseContract/index.vue";

const route = useRoute();
const router = useRouter();
const activeName = ref("sale");

const tabs = [
  { label: "销售合同", name: "sale", component: SaleContract },
  { label: "采购合同", name: "purchase", component: PurchaseContract },
];

function handleClick(tab) {
  activeName.value = tab.props.name;
  // console.log(tab.props.name);
}
</script>
<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
}
.demo-tabs {
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 4px;
}
</style>
