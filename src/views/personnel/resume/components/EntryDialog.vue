<template>
  <el-dialog
    v-model="visible"
    title="确认入职"
    width="50%"
    append-to-body
    class="car-dialog"
    @close="handleClose"
    :close-on-click-modal="false"
    :show-close="true"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      style="margin-top: 15px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="登录账号" prop="username" required>
            <el-input v-model="form.username" placeholder="请输入登录账号" style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="登录密码" prop="password" required>
            <el-input v-model="form.password" placeholder="请输入密码" show-password style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="归属部门" prop="deptId" required>
            <DeptCascader v-model="form.deptId" :readonly="false" :emit-path="false" />
          </el-form-item>
        </el-col>

        <!-- 岗位：接口获取 -->
        <el-col :span="24">
          <el-form-item label="岗位" prop="postId" required>
            <el-select 
              v-model="form.postId" 
              placeholder="请选择岗位" 
              style="width: 100%"
              filterable
              clearable
              @focus="loadPostList"
            >
              <el-option 
                v-for="item in postOptions" 
                :key="item.id || item.postId" 
                :label="item.postName" 
                :value="item.id || item.postId"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 角色：接口获取（多选） -->
        <el-col :span="24">
          <el-form-item label="角色" prop="roleIds" required>
            <el-select
              v-model="form.roleIds"
              multiple
              placeholder="请选择角色"
              style="width: 100%"
              filterable
              clearable
              @focus="loadRoleList"
            >
              <el-option 
                v-for="item in roleOptions" 
                :key="item.id || item.roleId" 
                :label="item.roleName" 
                :value="item.id || item.roleId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div style="text-align: center">
        <el-button type="primary" @click="submit" :loading="loading">确认提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, defineEmits, defineExpose, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import DeptCascader from '@/components/DeptCascader/index.vue'

// 接口（按你系统通用写法）
import { listPost } from '@/api/system/post.js'
import { listRole } from '@/api/system/role.js'

const emit = defineEmits(['success'])
const visible = ref(false)
const formRef = ref(null)
const loading = ref(false)

// 下拉数据
const postOptions = ref([])    // 岗位
const roleOptions = ref([])    // 角色

// 表单初始值（用于重置）
const getInitialForm = () => ({
  resumeId: '',
  username: '',
  password: '',
  deptId: '',
  postId: '',
  roleIds: [],
})

// 表单
const form = reactive(getInitialForm())

// 校验规则
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  postId: [{ required: true, message: '请选择岗位', trigger: 'change' }],
  roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

// 重置表单（完全重置）
const resetForm = () => {
  const initial = getInitialForm()
  Object.keys(initial).forEach(key => {
    form[key] = initial[key]
  })
  formRef.value?.clearValidate()
}

// 加载岗位
const loadPostList = async () => {
  if (postOptions.value.length > 0) return
  
  try {
    const res = await listPost({ pageNum: 1, pageSize: 1000 })
    console.log('岗位数据：', res)
    postOptions.value = (res.rows || res.data || [])
  } catch (error) {
    console.error('加载岗位失败：', error)
    ElMessage.error('加载岗位列表失败')
  }
}

// 加载角色
const loadRoleList = async () => {
  if (roleOptions.value.length > 0) return
  
  try {
    const res = await listRole({ pageNum: 1, pageSize: 1000 })
    console.log('角色数据：', res)
    roleOptions.value = (res.rows || res.data || [])
  } catch (error) {
    console.error('加载角色失败：', error)
    ElMessage.error('加载角色列表失败')
  }
}

// 强制加载岗位
const forceLoadPostList = async () => {
  try {
    const res = await listPost({ pageNum: 1, pageSize: 1000 })
    postOptions.value = (res.rows || res.data || [])
    console.log('强制加载岗位完成，共', postOptions.value.length, '条')
  } catch (error) {
    console.error('加载岗位失败：', error)
  }
}

// 强制加载角色
const forceLoadRoleList = async () => {
  try {
    const res = await listRole({ pageNum: 1, pageSize: 1000 })
    roleOptions.value = (res.rows || res.data || [])
    console.log('强制加载角色完成，共', roleOptions.value.length, '条')
  } catch (error) {
    console.error('加载角色失败：', error)
  }
}

// 初始化加载
onMounted(() => {
  loadPostList()
  loadRoleList()
})

// 打开弹窗 - 每次打开都强制重置，账号密码始终为空
async function open(row) {
  // ⭐ 关键：先完全重置表单
  resetForm()
  
  // 等待 nextTick 确保重置完成
  await nextTick()
  
  // 只保存简历ID，其他字段保持为空
  form.resumeId = row?.id || ''
  // 再次确保账号密码为空（防止 row 中有值被误赋值）
  form.username = ''
  form.password = ''
  form.deptId = ''
  form.postId = ''
  form.roleIds = []
  
  // 清除验证
  formRef.value?.clearValidate()
  
  // 打开弹窗时重新加载岗位和角色，确保数据最新
  await Promise.all([forceLoadPostList(), forceLoadRoleList()])
  
  // 打开弹窗
  visible.value = true
}

// 关闭重置
function handleClose() {
  visible.value = false
  // 完全重置表单
  resetForm()
}

// 提交
async function submit() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  // 检查岗位是否已选
  if (!form.postId) {
    ElMessage.warning('请选择岗位')
    return
  }

  // 检查角色是否已选
  if (!form.roleIds || form.roleIds.length === 0) {
    ElMessage.warning('请选择角色')
    return
  }

  try {
    loading.value = true
    const params = {
      resumeId: form.resumeId,
      username: form.username,
      password: form.password,
      deptId: Number(form.deptId),
      postId: Number(form.postId),
      roleIds: form.roleIds.map(Number),
    }

    console.log('提交参数：', params)

    const res = await request({
      url: '/resume/entry',
      method: 'POST',
      data: params
    })

    if (res.code === 200) {
      ElMessage.success('入职成功')
      emit('success')
      handleClose()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (e) {
    console.error('入职失败：', e)
    ElMessage.error(e.message || '操作失败')
  } finally {
    loading.value = false
  }
}

// 暴露方法给父组件
defineExpose({ open, close: handleClose })
</script>

<style scoped>
.dialog-title {
  font-weight: 500;
  font-size: 16px;
}
</style>

<style>
.car-dialog.el-dialog {
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}
.car-dialog .el-dialog__body {
  overflow-y: auto;
}
</style>