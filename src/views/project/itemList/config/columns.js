import { getPageList } from "@/api/base/project/projectClassify/index.js";
import { listUser } from '@/api/system/user.js';

// 查询表单（和搜索框一一对应）
export const queryForm = {
  code: '',
  projectName: '',
  categoryId: '',
  directorUid: ''
};

// 表格列配置
export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: "8%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'code',
    label: '项目状态',
    width: "12%",
    minWidth: 100,
    align: 'center',
    enum: {
      0: '未设置',
      1: '未开始',
      2: '进行中',
      3: '已完成',
      4: '已关闭'
    },
    searchable: {
      type: 'select',
      fieldName: 'code',
      label: '项目状态',
      placeholder: '请选择项目状态',
      order: 1,
      options: [
        { label: '未设置', value: 0 },
        { label: '未开始', value: 1 },
        { label: '进行中', value: 2 },
        { label: '已完成', value: 3 },
        { label: '已关闭', value: 4 }
      ]
    },
  },
  {
    fieldName: 'name',
    label: '项目名称',
    minWidth: 200,
    align: 'center',
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入项目名称',
      label: '项目名称',
      order: 2,
    },
  },
  {
    fieldName: 'categoryName',
    label: '项目类别',
    width: "18%",
    minWidth: 150,
    align: 'center',
    searchable: {
      type: 'selectApi',
      api: getPageList,
      optionValue: 'id',       
      optionLabel: 'title',
      fieldName: 'categoryId',  
      placeholder: '请选择项目类别',
      label: '项目类别',
      order: 3,
    },
  },
  {
    fieldName: 'directorName',
    label: '负责人',
    width: "12%",
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'directorUid', 
      placeholder: '请选择负责人',
      label: '负责人',
      order: 4,
    },
  },
  {
    fieldName: 'planCycle',
    label: '项目计划周期',
    width: "20%",
    minWidth: 180,
    align: 'center',
  },
  {
    fieldName: 'currentStage',
    label: '当前阶段及负责人',
    minWidth: 200,
    align: 'center',
  },
  {
    fieldName: 'taskCount',
    label: '进行中任务',
    width: "10%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'completedTaskCount',
    label: '已完成任务',
    width: "10%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'taskCompletionRate',
    label: '任务完成率',
    width: "12%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'createByName',
    label: '创建人',
    width: "12%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: "20%",
    minWidth: 180,
    align: 'center',
  }
];

// 操作列
export const operationColumn = {
  label: '操作',
  width: 280,
  fixed: 'right',
  show: true,
  actions: [
    { label: '编辑', type: 'success', size: 'small', icon: 'edit' },
    { label: '查看', type: 'info', size: 'small', icon: 'view' },
    { label: '删除', type: 'danger', size: 'small', icon: 'delete' },
  ]
};

// 头部按钮
export const getHeaderButs = (onAdd) => [
  {
    label: '添加项目',
    type: 'success',
    icon: 'plus',
    size: 'default',
    onClick: onAdd
  }
];

// 操作列生成函数
export const getOperationColumn = (onEdit, onView, onDelete) => ({
  label: '操作',
  width: 280,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '编辑',
      type: 'success',
      size: 'small',
      onClick: (row) => {
        onEdit && onEdit(row);
      },
      icon: 'edit'
    },
    {
      label: '查看',
      type: 'primary',
      size: 'small',
      onClick: (row) => {
        onView && onView(row);
      },
      icon: 'eye-open'
    },
    {
      label: '删除',
      type: 'danger',
      size: 'small',
      onClick: (row) => {
        onDelete && onDelete(row);
      },
      icon: 'delete'
    }
  ]
});

export const searchFields = columns
  .filter(col => col.searchable)
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName,
  }))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

export default {
  columns,
  operationColumn,
  getHeaderButs,
  getOperationColumn,
  searchFields,
  queryForm
};