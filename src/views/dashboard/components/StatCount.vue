<template>
  <div class="statContent">
    <div v-for="(item, index) in statList" :key="index" class="statItem">
      <a-statistic :title="item.name" :value="item.value" />
    </div>
  </div>
</template>

<script>
import { Statistic } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { countList } from "@/api/home";

export default {
  name: "StatCount",
  components: {
    AStatistic: Statistic,
  },
  data() {
    return {
      statList: [],
    };
  },
  mounted() {
    this.fetchCountList();
  },
  methods: {
    async fetchCountList() {
      try {
        const res = await countList();
        if (res.success && res.data) {
          const data = res.data;
          this.statList = [
            { name: "销售合同总数", value: data.contract || 0 },
            { name: "采购合同总数", value: data.purchase || 0 },
            { name: "报销总数", value: data.expense || 0 },
            { name: "开票总数", value: data.invoice || 0 },
            { name: "收票总数", value: data.ticket || 0 },
            { name: "项目总数", value: data.project || 0 },
            { name: "任务总数", value: data.projectTask || 0 },
          ];
        }
      } catch (error) {
        console.error("获取统计数据失败:", error);
      }
    },
  },
};
</script>

<style scoped lang="less">
.statContent {
  display: flex;
  flex-wrap: wrap;
  white-space: nowrap;
}

.statItem {
  padding: 0 32px;
  position: relative;

  &::after {
    position: absolute;
    top: 8px;
    right: 0;
    width: 1px;
    height: 40px;
    background-color: var(--el-border-color);
    content: "";
  }

  &:last-child {
    padding-right: 0;

    &::after {
      display: none;
    }
  }
}

@media screen and (max-width: 992px) {
  .statItem {
    padding: 0 16px;
    text-align: left;

    &::after {
      display: none;
    }
  }
}
</style>
