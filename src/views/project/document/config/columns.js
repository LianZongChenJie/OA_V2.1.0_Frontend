import { getPageList } from "@/api/project/itemList/index.js";
import { listUser } from '@/api/system/user.js';

// 查询表单
export const queryForm = {  
  projectId: '',        
  keywords: ''        
};

// 表格列配置
export const columns = [
  {
    fieldName: 'id',
    label: '文档编号',
    width: "8%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'title',
    label: '文档主题',
    minWidth: 160,
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入关键字',
      label: '关键字',
      order: 2,
    },
  },
  {
    fieldName: 'projectName',
    label: '所属项目',
    width: "25%",
    minwidth: 180,
    align: 'center',
    searchable: {
      type: 'selectApi',
      api: getPageList,
      optionValue: 'id',       
      optionLabel: 'title',
      fieldName: 'projectId',  
      placeholder: '请选择所属项目',
      label: '所属项目',
      order: 1,
    },
  },
  {
    fieldName: 'adminName',
    label: '创建人',
    width: "12%",
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'uid',
      placeholder: '请选择创建人',
      label: '创建人',
      order: 3,
    },
  },
  {
    fieldName: 'updateTimeStr',
    label: '创建时间',
    width: "auto",
    minWidth: 100,
    align: 'center',
  }
];

// 操作列
export const operationColumn = {
  label: '操作',
  width: 240,
  fixed: 'right',
  show: true,
  actions: [
    { label: '编辑', type: 'success', size: 'small', icon: 'edit' },
    { label: '查看', type: 'primary', size: 'small', icon: 'eye-open' },
    { label: '删除', type: 'danger', size: 'small', icon: 'delete' },
  ]
};

// 头部按钮
export const getHeaderButs = (onAdd) => [
  {
    label: '新建文档',
    type: 'success',
    icon: 'plus',
    size: 'default',
    onClick: onAdd
  }
];

// 操作列生成函数
export const getOperationColumn = (onEdit, onView, onDelete) => ({
  label: '操作',
  width: 240,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '编辑',
      type: 'success',
      size: 'small',
      onClick: (row) => onEdit?.(row),
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
      onClick: (row) => onDelete?.(row),
      icon: 'delete'
    }
  ]
});

export default {
  columns,
  operationColumn,
  getHeaderButs,
  getOperationColumn,
  queryForm
};