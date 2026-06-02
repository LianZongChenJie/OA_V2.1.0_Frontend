<template>
  <a-card
    v-if="settlementData.length > 0"
    :bordered="false"
    title="社保结算管理事项"
    :body-style="{ padding: '0' }"
  >
    <el-table
      :data="settlementData"
      style="width: 100%"
      :show-header="false"
      @row-click="handleClick"
    >
      <el-table-column min-width="140">
        <template #default="{ row }">
        <el-tag type="danger"> {{ (row.city || '').replace(/,/g, '/') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="100">
        <template #default="{ row }">
        {{ row.projectName }}
        </template>
      </el-table-column>
      <el-table-column align="right" min-width="100">
        <template #default="{ row }">
          <span class="ss-date">每月{{ row.socialDate }}号</span>
        </template>
      </el-table-column>
      <template #empty>
        <div class="empty-ss">暂无数据</div>
      </template>
    </el-table>
  </a-card>
</template>

<script>
import useUserStore from "@/store/modules/user";
import { Card } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { getExpireList } from "@/api/personnel/socialSecurity";

export default {
  name: "SocialSecuritySettlement",
  components: {
    ACard: Card,
  },
  data() {
    return {
      settlementData: [],
    };
  },
  mounted() {
    this.fetchSettlementData();
  },
  methods: {
    async fetchSettlementData() {
      try {
        const userStore = useUserStore();
        const param = {
          managerId: userStore.id,
        }
        const res = await getExpireList(param);
        if (res.success && res.data) {
          this.settlementData = res.data || [];
        }
      } catch (error) {
        console.error("获取社保结算管理事项失败:", error);
      }
    },
    handleClick(item) {
      this.$router.push("/personnel/socialSecurity");
    },
  },
};
</script>

<style scoped lang="less">
.ss-date {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.empty-ss {
  text-align: center;
  padding: 40px 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.el-table {
  cursor: pointer;
}
</style>
