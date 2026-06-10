import { listUser } from '@/api/system/user.js';
import { getPageList } from '@/api/base/hr/careProgram/index.js';

// 搜索表单
export const queryForm = {
  rewardType: '',
  rewardItem: '',
  rewardEmp: '',
  rewardDate: '',
  keywords: ''
};

// 列表列配置
export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: "6%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'name',
    label: '姓名',
    width: "10%",
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'input',
      fieldName: 'thing',
      placeholder: '请输入',
      label: '姓名',
      order: 1,
    },
  },
  {
    fieldName: 'sex',
    label: '性别',
    width: "6%",
    minWidth: 140,
    align: 'center',
  },
  {
    fieldName: 'status',
    label: '面试结果',
    width: "6%",
    minWidth: 140,
    align: 'center',
    slot: 'status',
  },
  {
    fieldName: 'phone',
    label: '手机号',
    width: "14%",
    minWidth: 120,
    align: 'center',
  },
  {
    fieldName: 'city',
    label: '所在城市',
    width: "auto",
    minWidth: 180,
    align: 'center',
    searchable: {
      type: 'input',
      fieldName: 'thing',
      placeholder: '请输入',
      label: '所在城市',
      order: 1,
    },
  },
  {
    fieldName: 'age',
    label: '年龄',
    width: "6%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'entryProjectName',
    label: '入职项目',
    width: "10%",
    minWidth: 120,
    align: 'center',
  },
  {
    fieldName: 'education',
    label: '最高学历',
    width: "8%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'graduateSchool',
    label: '毕业院校',
    width: "10%",
    minWidth: 120,
    align: 'center',
  },
  {
    fieldName: 'graduateYear',
    label: '毕业年份',
    width: "8%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'remark',
    label: '备注',
    width: "8%",
    minWidth: 100,
    align: 'center',
  },
];

// 头部按钮
export const getHeaderButs = (onAdd) => [
  {
    label: '添加简历',
    type: 'success',
    icon: 'plus',
    size: 'default',
    onClick: onAdd
  }
];

// 推荐简历按钮显示条件（status 在 [0, 3, 5] 时显示）
const showRecommendBtn = (row) => [0, 3, 5].includes(Number(row.status));

// 操作列生成函数
export const getOperationColumn = (onEdit, onView, onDelete, onInterviewResult, onEntry, onRecommend, onRelease) => ({
  label: '操作',
  width: 340,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '简历编辑',
      type: 'success',
      size: 'small',
      onClick: row => onEdit?.(row),
      icon: 'edit'
    },
    {
      label: '简历查看',
      type: 'primary',
      size: 'small',
      onClick: row => onView?.(row),
      icon: 'eye-open'
    },
    {
      label: '删除简历',
      type: 'info',
      size: 'small',
      isShow: row => showRecommendBtn(row),
      onClick: row => onDelete?.(row),
      icon: 'delete'
    },
    {
      label: '面试结果',
      type: 'warning',
      size: 'small',
      isShow: row => row.status == 1,
      onClick: row => onInterviewResult?.(row),
      icon: 'pass'
    },
    {
      label: '正式入场',
      type: 'danger',
      size: 'small',
      isShow: row => row.status == 2,
      onClick: row => onEntry?.(row),
      icon: 'onboarding'
    },
    {
      label: '推荐简历',
      type: 'success',
      size: 'small',
      isShow: row => showRecommendBtn(row),
      onClick: row => onRecommend?.(row),
      icon: 'recommend'
    },
    {
      label: '释放简历',
      type: 'warning',
      size: 'small',
      isShow: row => row.status == 4,
      onClick: row => onRelease?.(row),
      icon: 'component'
    },
  ]
});

export const basicSearchFields = columns
  .filter(col => col.searchable && col.show !== false && (col.searchable.order <= 4))
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName
  }))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

export const advancedSearchFields = columns
  .filter(col => col.searchable && col.show !== false)
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName
  }))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

export const allSearchFields = columns
  .filter(col => col.searchable)
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName
  }))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

export default {
  columns,
  getHeaderButs,
  getOperationColumn,
  basicSearchFields,
  advancedSearchFields,
  allSearchFields,
  queryForm
};