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
                <el-select
                    v-model="form.checkType"
                    :disabled="isView"
                    placeholder="请选择审批流程类型"
                    clearable
                    style="width: 100%"
                >
                    <el-option label="固定审批" value="1" />
                    <el-option label="会签审批" value="2" />
                    <el-option label="或签审批" value="3" />
                </el-select>
            </el-form-item>
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

    const { proxy } = getCurrentInstance();

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
    });

    // 下拉选项数据
    const departmentOptions = ref([]);
    const approvalTypeOptions = ref([]);
    const userOptions = ref([]);

    // 根据模式动态显示标题
    const dialogTitle = computed(() => {
        if (isView.value) return "查看审批流程";
        return isEdit.value ? "编辑审批流程" : "新增审批流程";
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

    /** 初始化数据 */
    onMounted(() => {
        getDepartmentTree();
        getApprovalTypes();
        getUserList();
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
                        : form.departmentIds
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
