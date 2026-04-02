<template>
  <div class="main-content">
    <div class="main">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="(tab, index) in tabs"
          :label="tab.label"
          :name="tab.name"
          ></el-tab-pane
        >
      </el-tabs>
      <RegularList :type="activeType" :label="activeLabel" />
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import RegularList from "./components/index.vue";
const route = useRoute();
const router = useRouter();
const activeName = ref("CustomerStatus");

// 计算当前选中的 type
const activeType = computed(() => {
  const currentTab = tabs.find(tab => tab.name === activeName.value);
  return currentTab ? currentTab.type : 1;
});

// 计算当前选中的 label
const activeLabel = computed(() => {
  const currentTab = tabs.find(tab => tab.name === activeName.value);
  return currentTab ? currentTab.label : "客户状态";
});

const tabs = reactive([
  { label: "职务", name: "CustomerStatus", type: 1 },
  { label: "职级", name: "CustomerIntention", type: 2 },
]);

function handleClick(tab) {
  console.log(tab.props.name);
}
</script>
<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 10px 20px;
}
</style>
