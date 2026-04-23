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
            <span class="node-user">
               <el-tag type="info" style="margin-right:10px"  v-for="(item, index) in node.checkUserInfo">{{ item.nickName }}</el-tag>
            </span>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else description="暂无审批节点信息" />
  </div>
</template>

<script setup>
const props = defineProps({
  nodes: { type: Array, default: () => [] },
  currentStepSort: { type: [Number, String], default: 0 },
});

function getTimelineItemType(node) {
  if (node.sort < props.currentStepSort || node.isFinished === 1)
    return "success";
  if (node.sort === props.currentStepSort) return "primary";
  return "info";
}

function getNodeStatusTag(node) {
  if (node.sort === props.currentStepSort)
    return { text: "审批中", type: "warning" };
  if (node.sort < props.currentStepSort)
    return { text: "已通过", type: "success" };
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
  color: #303133;
  font-weight: bold;
}
</style>
