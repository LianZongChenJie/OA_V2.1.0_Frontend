<template>
  <a-card
    :style="{ marginBottom: '24px' }"
    title="待办事项"
    :bordered="false"
    :body-style="{ padding: 0 }"
  >
    <div class="todo-cards">
      <div
        v-for="(item, index) in todoData"
        :key="index"
        class="todo-card"
        @click="handleClick(item)"
      >
        <div class="card-content">
          <div class="card-num" :class="{ 'has-num': item.num > 0 }">
            {{ item.num }}
          </div>
          <div class="card-name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { Card } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { todoList } from "@/api/home";

export default {
  name: "TodoList",
  components: {
    ACard: Card,
  },
  data() {
    return {
      todoData: [],
    };
  },
  mounted() {
    this.fetchTodoList();
  },
  methods: {
    async fetchTodoList() {
      try {
        const res = await todoList();
        if (res.success && res.data) {
          const data = res.data;
          this.todoData = [
            { name: "待审公文", num: data.officialDoc || 0, path: "/document" },
            { name: "待审公章", num: data.seal || 0, path: "/seal" },
            { name: "待审采购合同", num: data.purchase || 0, path: "/contract/purchase" },
            { name: "待审销售合同", num: data.contract || 0, path: "/contract/sale" },
            { name: "待审报销", num: data.expense || 0, path: "/expense" },
            { name: "待审开票", num: data.invoice || 0, path: "/invoice" },
            { name: "待审收票", num: data.ticket || 0, path: "/ticket" },
            { name: "待完成任务", num: data.projectTask || 0, path: "/task" },
          ];
        }
      } catch (error) {
        console.error("获取待办事项失败:", error);
      }
    },
    handleClick(item) {
      this.$router.push(item.path);
    },
  },
};
</script>

<style scoped lang="less">
.todo-cards {
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  gap: 16px;
}

.todo-card {
  width: calc(25% - 12px);
  background: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    background: var(--el-fill-color);
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
</style>