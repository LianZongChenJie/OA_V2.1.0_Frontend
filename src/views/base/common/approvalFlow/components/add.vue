<template>
    <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="50%"
        append-to-body
        class="approval-flow-dialog"
        @close="handleClose"
    >
        <el-form
            ref="formRef"
            :model="form"
            :rules="isView ? {} : rules"
            label-width="120px"
        >
            <el-form-item label="应用部门" prop="departmentIds">
                <el-cascader
                    v-model="form.departmentIds"
                    :options="departmentOptions"
                    :multiple="true"
                    :props="{
            value: 'id',
            label: 'label',
            children: 'children',
            checkStrictly: true,
            emitPath: false,
          }"
                    :disabled="isView"
                    placeholder="请选择应用部门"
                    clearable
                    collapse-tags
                    collapse-tags-tooltip
                    style="width: 100%"
                />
            </el-form-item>
            <el-form-item label="流程名称" prop="title">
                <el-input
                    v-model="form.title"
                    placeholder="请输入流程名称"
                    :disabled="isView"
                />
            </el-form-item>
            <el-form-item label="审批类型" prop="cateId">
                <el-select
                    v-model="form.cateId"
                    :disabled="isView"
                    placeholder="请选择审批类型"
                    clearable
                    style="width: 100%"
                >
                    <el-option
                        v-for="item in approvalTypeOptions"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="审批流程类型" prop="checkType">
                <el-radio-group v-model="form.checkType" :disabled="isView" @change="handleCheckTypeChange">
                    <el-radio
                        v-for="item in approval_flow_type"
                        :key="item.value"
                        :label="item.value"
                    >
                        {{ item.label }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>

            <!-- 审批流程配置（固定审批流程时显示） -->
            <template v-if="showFlowConfig">
                <el-form-item label="审批流程配置">
                    <div class="flow-config">
                        <div
                            v-for="(flow, index) in form.flowList"
                            :key="index"
                            class="flow-item"
                        >
                            <div class="flow-item-header">
                                <span class="flow-level">第 {{ index + 1 }} 级审批</span>
                                <el-button
                                    v-if="!isView && form.flowList.length > 1"
                                    type="danger"
                                    link
                                    @click="removeFlow(index)"
                                >
                                    删除
                                </el-button>
                            </div>
                            <el-form-item
                                :label="`审批人类型${index + 1}`"
                                :prop="`flowList.${index}.approverType`"
                                :rules="{ required: true, message: '请选择审批人类型', trigger: 'change' }"
                            >
                                <el-select
                                    v-model="flow.approverType"
                                    :disabled="isView"
                                    placeholder="请选择审批人类型"
                                    clearable
                                    @change="handleApproverTypeChange(index)"
                                    style="width: 100%"
                                >
                                    <el-option label="当前部门负责人" value="1" />
                                    <el-option label="上一级部门负责人" value="2" />
                                    <el-option label="指定岗位职称人" value="3" />
                                    <el-option label="指定成员" value="4" />
                                </el-select>
                            </el-form-item>

                            <!-- 指定成员时显示成员选择 -->
                            <el-form-item
                                v-if="flow.approverType === '4'"
                                :label="`选择成员${index + 1}`"
                                :prop="`flowList.${index}.userIds`"
                                :rules="{ required: true, message: '请选择成员', trigger: 'change' }"
                            >
                                <el-select
                                    v-model="flow.userIds"
                                    :disabled="isView"
                                    placeholder="请选择成员"
                                    multiple
                                    filterable
                                    clearable
                                    collapse-tags
                                    collapse-tags-tooltip
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="item in userOptions"
                                        :key="item.userId"
                                        :label="item.userName"
                                        :value="item.userId"
                                    />
                                </el-select>
                            </el-form-item>

                            <!-- 指定岗位职称人时显示岗位选择 -->
                            <el-form-item
                                v-if="flow.approverType === '3'"
                                :label="`选择岗位${index + 1}`"
                                :prop="`flowList.${index}.postId`"
                                :rules="{ required: true, message: '请选择岗位', trigger: 'change' }"
                            >
                                <el-select
                                    v-model="flow.postId"
                                    :disabled="isView"
                                    placeholder="请选择岗位"
                                    clearable
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="post in postOptions"
                                        :key="post.postId"
                                        :label="post.postName"
                                        :value="post.postId"
                                    />
                                </el-select>
                            </el-form-item>

                            <!-- 审批方式选择 -->
                            <el-form-item
                                :label="`审批方式${index + 1}`"
                                :prop="`flowList.${index}.approvalMode`"
                                :rules="{ required: true, message: '请选择审批方式', trigger: 'change' }"
                            >
                                <el-radio-group v-model="flow.approvalMode" :disabled="isView">
                                    <el-radio :label="1">或签</el-radio>
                                    <el-radio :label="2">会签</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>

                        <el-button
                            v-if="!isView"
                            type="primary"
                            link
                            @click="addFlowNode"
                            style="margin-top: 10px;"
                        >
                            + 添加审批节点
                        </el-button>
                    </div>
                </el-form-item>
            </template>

            <el-form-item label="抄送人" prop="copyUids">
                <el-select
                    v-model="form.copyUids"
                    :disabled="isView"
                    :teleported="false"
                    placeholder="请选择抄送人"
                    multiple
                    filterable
                    clearable
                    collapse-tags
                    collapse-tags-tooltip
                    style="width: 100%"
                >
                    <el-option
                        v-for="item in userOptions"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="流程说明" prop="remark">
                <el-input
                    v-model="form.remark"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入流程说明"
                    :disabled="isView"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button v-if="!isView" type="primary" @click="handleSubmit"
                >确 定</el-button
                >
                <el-button @click="dialogVisible = false">{{
                    isView ? "关 闭" : "取 消"
                    }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup name="AddApprovalModule">
    import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";
    import { addFlow, updateFlow } from "@/api/base/common/approvalFlow/index.js";
    import { getPageList as getApprovalTypeList } from "@/api/base/common/approvalType/index.js";
    import { deptTreeSelect, listUser } from "@/api/system/user.js";
    import { listPost } from "@/api/system/post.js";

    const { proxy } = getCurrentInstance();
    const { approval_flow_type } = proxy.useDict("approval_flow_type");

    const dialogVisible = ref(false);
    const formRef = ref(null);
    const isEdit = ref(false); // 是否为编辑模式
    const isView = ref(false); // 是否为查看模式

    const form = reactive({
        id: undefined,
        title: "",
        departmentIds: [],
        cateId: "",
        remark: "",
        checkType: "",
        copyUids: [],
        flowList: [], // 审批流程配置列表
    });

    // 下拉选项数据
    const departmentOptions = ref([]);
    const approvalTypeOptions = ref([]);
    const userOptions = ref([]);
    const postOptions = ref([]); // 岗位选项

    // 根据模式动态显示标题
    const dialogTitle = computed(() => {
        if (isView.value) return "查看审批流程";
        return isEdit.value ? "编辑审批流程" : "新增审批流程";
    });

    // 是否显示审批流程配置（固定审批流程时显示）
    const showFlowConfig = computed(() => {
        // 假设 value="2" 是固定审批流程
        return form.checkType === "2";
    });

    const rules = {
        title: [{ required: true, message: "请输入流程名称", trigger: "blur" }],
        departmentIds: [
            { required: true, message: "请选择应用部门", trigger: "change" },
        ],
        cateId: [{ required: true, message: "请选择审批类型", trigger: "change" }],
        checkType: [
            { required: true, message: "请选择审批流程类型", trigger: "change" },
        ],
    };

    /** 表单重置 */
    function reset() {
        form.id = undefined;
        form.title = "";
        form.departmentIds = [];
        form.cateId = "";
        form.remark = "";
        form.checkType = "";
        form.copyUids = [];
        form.flowList = [];
        isEdit.value = false;
        isView.value = false;
        proxy.resetForm("formRef");
    }

    /** 获取部门树数据 */
    function getDepartmentTree() {
        deptTreeSelect().then((response) => {
            departmentOptions.value = response.data;
        });
    }

    /** 获取审批类型列表 */
    function getApprovalTypes() {
        getApprovalTypeList({ pageNum: 1, pageSize: 1000 }).then((response) => {
            approvalTypeOptions.value = response.rows || [];
        });
    }

    /** 获取用户列表 */
    function getUserList() {
        listUser({ pageNum: 1, pageSize: 1000 }).then((response) => {
            userOptions.value = response.rows || [];
        });
    }

    /** 获取岗位列表 */
    function getPostList() {
        listPost({ pageNum: 1, pageSize: 1000 }).then((response) => {
            postOptions.value = response.rows || [];
        });
    }

    /** 审批流程类型变更处理 */
    function handleCheckTypeChange(value) {
        if (value === "2") {
            // 固定审批流程，初始化一个默认审批节点
            if (form.flowList.length === 0) {
                addFlowNode();
            }
        } else {
            // 自由审批流程，清空审批流程配置
            form.flowList = [];
        }
    }

    /** 添加审批节点 */
    function addFlowNode() {
        form.flowList.push({
            approverType: "", // 审批人类型：1-当前部门负责人，2-上一级部门负责人，3-指定岗位职称人，4-指定成员
            userIds: [], // 指定成员ID列表
            postId: "", // 岗位ID
            approvalMode: 1, // 审批方式：1-或签，2-会签
        });
    }

    /** 删除审批节点 */
    function removeFlow(index) {
        form.flowList.splice(index, 1);
    }

    /** 审批人类型变更处理 */
    function handleApproverTypeChange(index) {
        const flow = form.flowList[index];
        if (flow.approverType !== "4") {
            flow.userIds = [];
        }
        if (flow.approverType !== "3") {
            flow.postId = "";
        }
    }

    /** 初始化数据 */
    onMounted(() => {
        getDepartmentTree();
        getApprovalTypes();
        getUserList();
        getPostList();
    });

    /** 关闭弹窗 */
    function handleClose() {
        reset();
    }

    /** 显示弹窗 - 新增模式 */
    function open() {
        reset();
        dialogVisible.value = true;
    }

    /** 显示弹窗 - 编辑模式 */
    function openEdit(data) {
        reset();
        // 填充表单数据
        form.id = data.id;
        form.title = data.title;
        // 将 departmentIds 字符串转换为数组
        form.departmentIds = data.departmentIds
            ? Array.isArray(data.departmentIds)
                ? data.departmentIds
                : data.departmentIds.split(",")
            : [];
        form.cateId = data.cateId || "";
        form.remark = data.remark || "";
        form.checkType = data.checkType || "";
        form.copyUids = data.copyUids
            ? Array.isArray(data.copyUids)
                ? data.copyUids
                : data.copyUids.split(",")
            : [];
        // 解析 flowList
        const flowList = data.flowList
            ? typeof data.flowList === 'string'
                ? JSON.parse(data.flowList)
                : data.flowList
            : [];
        // 确保 approvalMode 是字符串类型
        form.flowList = flowList.map(flow => ({
            ...flow,
            approvalMode: flow.approvalMode ? String(flow.approvalMode) : "1"
        }));

        isEdit.value = true;
        dialogVisible.value = true;
    }

    /** 显示弹窗 - 查看模式 */
    function openView(data) {
        reset();
        // 填充表单数据
        form.id = data.id;
        form.title = data.title;
        // 将 departmentIds 字符串转换为数组
        form.departmentIds = data.departmentIds
            ? Array.isArray(data.departmentIds)
                ? data.departmentIds
                : data.departmentIds.split(",")
            : [];
        form.cateId = data.cateId || "";
        form.remark = data.remark || "";
        form.checkType = data.checkType || "";
        form.copyUids = data.copyUids
            ? Array.isArray(data.copyUids)
                ? data.copyUids
                : data.copyUids.split(",")
            : [];
        // 解析 flowList
        const flowList = data.flowList
            ? typeof data.flowList === 'string'
                ? JSON.parse(data.flowList)
                : data.flowList
            : [];
        // 确保 approvalMode 是字符串类型
        form.flowList = flowList.map(flow => ({
            ...flow,
            approvalMode: flow.approvalMode ? String(flow.approvalMode) : "1"
        }));

        isView.value = true;
        dialogVisible.value = true;
    }

    /** 提交表单 */
    function handleSubmit() {
        formRef.value.validate((valid) => {
            if (valid) {
                // 将 copyUids 数组转换为以逗号分隔的字符串
                const submitData = {
                    ...form,
                    copyUids: Array.isArray(form.copyUids)
                        ? form.copyUids.join(',')
                        : form.copyUids,
                    // 将 departmentIds 数组转换为以逗号分隔的字符串
                    departmentIds: Array.isArray(form.departmentIds)
                        ? form.departmentIds.join(',')
                        : form.departmentIds + "",
                    // 将 flowList 转换为 JSON 字符串
                    flowList: JSON.stringify(form.flowList),
                };

                const apiMethod = isEdit.value ? updateFlow : addFlow;
                const successMsg = isEdit.value ? "编辑成功" : "新增成功";

                apiMethod(submitData).then(() => {
                    proxy.$modal.msgSuccess(successMsg);
                    dialogVisible.value = false;
                    emit("success");
                });
            }
        });
    }

    const emit = defineEmits(["success"]);

    defineExpose({
        open,
        openEdit,
        openView,
    });
</script>

<style scoped>
/* 级联选择器标签样式 */
:deep(.el-cascader__tags) {
    flex-wrap: wrap;
}

:deep(.el-cascader__collapse-tags) {
    flex-wrap: wrap;
}

/* 审批流程配置样式 */
.flow-config {
    width: 100%;
}

.flow-item {
    background-color: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
}

.flow-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e4e7ed;
}

.flow-level {
    font-weight: bold;
    color: #409eff;
    font-size: 14px;
}

.flow-item :deep(.el-form-item) {
    margin-bottom: 12px;
}
</style>

<style>
    /* dialog 使用 append-to-body 后会挂载到 body 下，scoped 样式无法穿透，需要使用非 scoped 样式 */
    .approval-flow-dialog.el-dialog {
        max-height: 88vh;
        display: flex;
        flex-direction: column;
    }

    .approval-flow-dialog .el-dialog__body {
        max-height: calc(88vh - 120px);
        overflow-y: auto;
    }

    /* 级联选择器下拉框 z-index */
    .approval-flow-dialog .el-cascader-panel {
        z-index: 9999 !important;
    }
</style>
