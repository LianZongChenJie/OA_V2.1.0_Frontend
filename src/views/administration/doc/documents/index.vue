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
      <DocumentList :type="activeType" :label="activeLabel" />
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import DocumentList from "./components/index.vue";
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
  { label: "全部公文", name: "AllDocuments", type: 0 },
  { label: "我创建的", name: "MyDocuments", type: 1 },
  { label: "待我审批", name: "WaitingDocuments", type: 2 },
  { label: "我已审批", name: "ApprovedDocuments", type: 3 },
  { label: "抄送给我的", name: "CopiedDocuments", type: 4 }
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
