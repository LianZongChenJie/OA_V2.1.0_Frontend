<template>
  <a-card
    :bordered="false"
    title="公司新闻"
    :body-style="{ padding: '16px' }"
  >
    <div class="news-list">
      <div
        v-for="(item, index) in newsData"
        :key="index"
        class="news-item"
        @click="handleClick(item)"
      >
        <div class="news-title">
          <span class="news-tag">新闻</span>
          <span class="title-text" :title="item.title">{{ item.title }}</span>
        </div>
        <div class="news-time">{{ formatTime(item.createTime) }}</div>
      </div>
      <div v-if="newsData.length === 0" class="empty-news">
        暂无新闻
      </div>
    </div>
  </a-card>

  <!-- 新闻详情弹窗 -->
  <el-dialog
    title="新闻详情"
    v-model="detailVisible"
    width="60%"
    append-to-body
    class="news-detail-dialog"
  >
    <div class="detail-content" v-if="detailData">
      <div class="detail-header">
        <h2 class="detail-title">{{ detailData.title }}</h2>
        <div class="detail-meta">
          <span class="detail-time">
            <el-icon><Clock /></el-icon>
            {{ detailData.createTime }}
          </span>
          <span class="detail-cate" v-if="detailData.cateName">
            <el-icon><Collection /></el-icon>
            {{ detailData.cateName }}
          </span>
        </div>
      </div>
      <div class="detail-body">
        <div class="detail-content-text" v-html="detailData.content"></div>
      </div>
    </div>
    <template #footer>
      <el-button @click="detailVisible = false">关 闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { Card } from "ant-design-vue";
import { Clock, Collection } from "@element-plus/icons-vue";
import "ant-design-vue/dist/reset.css";
import { getPageList, getDetail } from "@/api/administration/news";

export default {
  name: "NewsList",
  components: {
    ACard: Card,
    Clock,
    Collection,
  },
  data() {
    return {
      newsData: [],
      detailVisible: false,
      detailData: null,
    };
  },
  mounted() {
    this.fetchNewsList();
  },
  methods: {
    async fetchNewsList() {
      try {
        const params = {
          pageNum: 1,
          pageSize: 5,
          status: 1,
        };
        const res = await getPageList(params);
        if (res.success && res.rows) {
          this.newsData = res.rows || [];
        }
      } catch (error) {
        console.error("获取新闻列表失败:", error);
      }
    },
    formatTime(time) {
      if (!time) return "";
      return time.split(" ")[0] || time;
    },
    async handleClick(item) {
      try {
        const res = await getDetail(item.id);
        if (res.success && res.data) {
          this.detailData = res.data;
        } else if (res.data) {
          this.detailData = res.data;
        } else {
          this.detailData = item;
        }
        this.detailVisible = true;
      } catch (error) {
        console.error("获取新闻详情失败:", error);
        this.detailData = item;
        this.detailVisible = true;
      }
    },
  },
};
</script>

<style scoped lang="less">
.news-list {
  .news-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
    cursor: pointer;
    transition: all 0.3s;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: var(--el-fill-color-light);
      margin: 0 -16px;
      padding-left: 16px;
      padding-right: 16px;
    }
  }

  .news-title {
    display: flex;
    align-items: center;
    flex: 1;
    overflow: hidden;

    .news-tag {
      display: inline-block;
      padding: 2px 8px;
      background: var(--el-color-success-light-9);
      color: var(--el-color-success);
      font-size: 12px;
      border-radius: 4px;
      margin-right: 8px;
      flex-shrink: 0;
    }

    .title-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--el-text-color-primary);
      font-size: 14px;
    }
  }

  .news-time {
    color: var(--el-text-color-secondary);
    font-size: 13px;
    margin-left: 12px;
    flex-shrink: 0;
  }

  .empty-news {
    text-align: center;
    padding: 40px 0;
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
}

// 新闻详情弹窗样式
.news-detail-dialog {
  .detail-content {
    .detail-header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--el-border-color-lighter);
      margin-bottom: 20px;

      .detail-title {
        font-size: 20px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0 0 12px 0;
        line-height: 1.4;
      }

      .detail-meta {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 24px;
        color: var(--el-text-color-secondary);
        font-size: 14px;

        .detail-time,
        .detail-cate {
          display: flex;
          align-items: center;
          gap: 6px;

          .el-icon {
            font-size: 16px;
          }
        }

        .detail-cate {
          padding: 2px 10px;
          background: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
          border-radius: 4px;
          font-size: 13px;
        }
      }
    }

    .detail-body {
      .detail-content-text {
        color: var(--el-text-color-primary);
        font-size: 15px;
        line-height: 1.8;
        padding: 0 10px;

        :deep(p) {
          margin: 0 0 16px 0;
        }

        :deep(img) {
          max-width: 100%;
          height: auto;
        }
      }
    }
  }
}
</style>
