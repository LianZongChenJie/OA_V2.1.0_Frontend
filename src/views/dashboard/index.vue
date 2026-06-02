<template>
  <div>
    <a-config-provider
      :theme="{
        algorithm: settingsStore.isDark
          ? theme.darkAlgorithm
          : theme.defaultAlgorithm,
      }"
    >
      <div class="pageHeaderContent">
        <div class="avatar">
          <el-avatar size="large" :src="currentUser.avatar" />
        </div>
        <div class="content">
          <div class="contentTitle">
            {{ greeting }}，
            {{ currentUser.name }}
            ，祝你开心每一天！
          </div>
          <div>{{ currentUser.group }}</div>
        </div>
        <div class="extraContent">
          <StatCount />
        </div>
      </div>

      <div class="mainContent">
        <div class="leftPanel">
          <TodoList />
          <UrgentList />
        </div>
        <div class="rightPanel">
          <SocialSecuritySettlement />
          <div style="height: 20px"></div>
          <NoticeList />
          <div style="height: 20px"></div>
          <NewsList />
        </div>
      </div>
    </a-config-provider>
  </div>
</template>

<script setup>
import { ConfigProvider, theme } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import UrgentList from "./components/UrgentList.vue";
import TodoList from "./components/TodoList.vue";
import StatCount from "./components/StatCount.vue";
import NoticeList from "./components/NoticeList.vue";
import SocialSecuritySettlement from "./components/SocialSecuritySettlement.vue";
import NewsList from "./components/NewsList.vue";
import useSettingsStore from "@/store/modules/settings";
import useUserStore from "@/store/modules/user";

const settingsStore = useSettingsStore();
const userStore = useUserStore();

defineOptions({
  name: "DashBoard",
});

const currentUser = computed(() => ({
  avatar:
    userStore.avatar ||
    "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
  name: userStore.nickName || userStore.name || "用户",
  userid: userStore.id || "",
  email: "",
  signature: "",
  title: "",
  group: userStore.deptName || "",
}));

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "早安";
  if (hour >= 12 && hour < 14) return "午安";
  if (hour >= 14 && hour < 18) return "下午好";
  return "晚上好";
});
</script>

<style scoped lang="less">
.pageHeaderContent {
  display: flex;
  padding: 12px;
  box-shadow: var(--el-box-shadow-light);
  .avatar {
    flex: 0 1 72px;
    & > span {
      display: block;
      width: 72px;
      height: 72px;
      border-radius: 72px;
    }
  }
  .content {
    position: relative;
    top: 4px;
    flex: 1 1 auto;
    margin-left: 24px;
    color: var(--el-text-color-secondary);
    line-height: 22px;
    .contentTitle {
      margin-bottom: 12px;
      color: var(--el-text-color-primary);
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }
  }
}

.extraContent {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.mainContent {
  display: flex;
  gap: 16px;
  padding: 10px;
  .leftPanel {
    flex: 0 0 60%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .rightPanel {
    flex: 0 0 40%;
    background: var(--el-bg-color);
  }
}

@media screen and (max-width: 576px) {
  .pageHeaderContent {
    display: block;
    .content {
      margin-left: 0;
    }
  }
  .mainContent {
    flex-direction: column;
    .leftPanel,
    .rightPanel {
      flex: 1 1 auto;
    }
  }
  .extraContent {
    justify-content: center;
    padding-top: 12px;
  }
}
</style>
