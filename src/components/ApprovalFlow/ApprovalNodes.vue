<template>
  <!-- 审批节点时间轴 -->
  <div class="approval-nodes-timeline">
    <el-timeline v-if="nodes.length > 0">
      <el-timeline-item
        v-for="node in nodes"
        :key="node.id"
        :type="getTimelineItemType(node)"
        :timestamp="node.stepName"
        placement="top"
      >
        <div class="timeline-node" v-if="node.isFinished != 1">
          <div class="node-title">
            <span class="node-flow-name">{{ node.flowName }}</span>
            <el-tag :type="getNodeStatusTag(node).type" size="small">
              {{ getNodeStatusTag(node).text }}
            </el-tag>
          </div>
          <div class="node-content">
            <span class="node-label">审批人：</span>
            <span class="node-user">{{
              node.checkUserInfo?.[0]?.nickName || "-"
            }}</span>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else description="暂无审批节点信息" />
  </div>
</template>

<script setup name="ApprovalNodes">
const props = defineProps({
  // 审批节点数据
  nodes: {
    type: Array,
    default: () => [],
  },
  // 当前审批步骤序号
  currentStepSort: {
    type: [Number, String],
    default: 0,
  },
});

/** 获取时间轴节点类型 */
function getTimelineItemType(node) {
  const nodeSort = node.sort;
  const currentSort = props.currentStepSort;

  // 已通过的节点（sort < 当前步骤）
  if (nodeSort < currentSort || node.isFinished === 1) {
    return "success";
  }

  // 当前审批节点
  if (nodeSort === currentSort) {
    return "primary"; // 审批中
  }

  // 未审批的节点（sort > 当前步骤）
  return "info";
}

/** 获取节点状态标签 */
function getNodeStatusTag(node) {
  const nodeSort = node.sort;
  const currentSort = props.currentStepSort;

  if (nodeSort === currentSort) {
    return { text: "审批中", type: "warning" };
  }
  if (nodeSort < currentSort) {
    return { text: "已通过", type: "success" };
  }
  return { text: "待审批", type: "info" };
}
</script>

<style scoped>
.approval-nodes-timeline {
  padding: 10px 20px;
}

.timeline-node {
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.node-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.node-flow-name {
  font-weight: bold;
  color: #303133;
  font-size: 14px;
}

.node-content {
  font-size: 13px;
  color: #606266;
}

.node-label {
  color: #909399;
}
</style>
