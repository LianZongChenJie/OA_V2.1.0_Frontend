<template>
  <div class="main-content">
    <div class="main">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="(tab, index) in tabs"
          :key="index"
          :label="tab.label"
          :name="tab.name"
        />
      </el-tabs>
      <RegularList 
        :send="currentSend"
        :activeTab="activeName"
        ref="regularListRef"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import RegularList from "./components/index.vue";

const activeName = ref("CustomerStatus");
const regularListRef = ref(null);


const currentSend = computed(() => {
  const currentTab = tabs.find(tab => tab.name === activeName.value);
  return currentTab ? currentTab.send : 1;
});

const tabs = reactive([
  { label: "发送的汇报", name: "CustomerStatus", send: 1 },
  { label: "接收的汇报", name: "CustomerIntention", send: 0 },
]);


function handleClick(tab) {
  console.log(tab.props.name);
}
</script>