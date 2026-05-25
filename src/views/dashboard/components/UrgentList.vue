<template>
  <a-card
    :style="{ marginBottom: '24px' }"
    title="紧急事项"
    :bordered="false"
    :body-style="{ padding: 0 }"
  >
    <div class="urgent-cards">
      <div
        v-for="(item, index) in urgentData"
        :key="index"
        class="urgent-card"
      >
        <div class="card-content">
          <div class="card-num" :class="{ 'has-num': item.num > 0 }">
            {{ item.num }}
          </div>
          <div class="card-name">{{ item.name }}</div>
          <div class="card-action">
            <a :href="item.targetPath">查看 →</a>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { Card } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { urgentList } from "@/api/home";

export default {
  name: "UrgentList",
  components: {
    ACard: Card,
  },
  data() {
    return {
      urgentData: [],
    };
  },
  mounted() {
    this.fetchUrgentList();
  },
  methods: {
    async fetchUrgentList() {
      try {
        const res = await urgentList();
        if (res.success && res.data) {
          this.urgentData = res.data || [];
        }
      } catch (error) {
        console.error("获取紧急事项失败:", error);
      }
    },
  },
};
</script>

<style scoped lang="less">
.urgent-cards {
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  gap: 16px;
}

.urgent-card {
  width: calc(33.333% - 12px);
  background: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.card-content {
  text-align: center;
}

.card-num {
  font-size: 32px;
  font-weight: bold;
  color: var(--el-text-color-placeholder);
  line-height: 1.2;

  &.has-num {
    color: var(--el-color-danger);
  }
}

.card-name {
  margin-top: 8px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.card-action {
  margin-top: 8px;

  a {
    color: var(--el-color-primary);
    font-size: 13px;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>