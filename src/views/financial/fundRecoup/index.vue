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
      <HaveInvoice v-if="activeType === 0" :type="activeType" :label="activeLabel"></HaveInvoice>
      <NoInvoice v-if="activeType === 1" :type="activeType" :label="activeLabel"></NoInvoice>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import HaveInvoice from "./components/haveInvoice/index.vue";
import NoInvoice from "./components/noInvoice/index.vue";

const route = useRoute();
const router = useRouter();
const activeName = ref("haveInVoice");

// 计算当前选中的 type
const activeType = computed(() => {
  const currentTab = tabs.find((tab) => tab.name === activeName.value);
  return currentTab ? currentTab.type : 1;
});

// 计算当前选中的 label
const activeLabel = computed(() => {
  const currentTab = tabs.find((tab) => tab.name === activeName.value);
  return currentTab ? currentTab.label : "客户状态";
});

const tabs = reactive([
  { label: "有发票的回款", name: "haveInVoice", type: 0 },
  { label: "无发票的回款", name: "noInVoice", type: 1 },
]);

function handleClick(tab) {
  console.log(tab.props.name);
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
