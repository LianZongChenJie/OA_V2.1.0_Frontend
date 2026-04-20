import { getPageList } from "@/api/project/itemList/index.js";
import { listUser } from '@/api/system/user.js';
import { getWorkCateList } from "@/api/project/task/index.js";

// 查询表单
export const queryForm = {
  statusName: '',         
  priorityName: '',       
  workId: '',      
  projectId: '',      
  directorUid: '',    
  keywords: ''        
};

// 表格列配置
export const columns = [
  {
    fieldName: 'id',
    label: '任务编号',
    width: "8%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'statusName',
    label: '任务状态',
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
      fieldName: 'statusName',
      label: '任务状态',
      placeholder: '请选择任务状态',
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
    fieldName: 'priorityName',
    label: '优先级',
    width: "10%",
    minWidth: 80,
    align: 'center',
    enum: {
      1: '低',
      2: '中'
    },
    searchable: {
      type: 'select',
      fieldName: 'priorityName',
      label: '优先级',
      placeholder: '请选择优先级',
      order: 2,
      options: [
        { label: '低', value: 1 },
        { label: '中', value: 2 },
        { label: '高', value: 3 },
        { label: '紧急', value: 4 },
      ]
    },
  },
    {
    fieldName: 'workName',
    label: '工作类型',
    width: "12%",
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'selectApi',      
      api: getWorkCateList,  
      optionValue: 'id',      
      optionLabel: 'title',    
      fieldName: 'workId',    
      placeholder: '请选择工作类型',
      label: '工作类型',
      order: 3
    }
  },
  {
    fieldName: 'projectName',
    label: '所属项目',
    width: "18%",
    minWidth: 150,
    align: 'center',
    searchable: {
      type: 'selectApi',
      api: getPageList,
      optionValue: 'id',       
      optionLabel: 'title',
      fieldName: 'projectId',  
      placeholder: '请选择所属项目',
      label: '所属项目',
      order: 4,
    },
  },
  {
    fieldName: 'adminName',
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
      placeholder: '请选择任务负责人（可多选）',
      label: '任务负责人',
      order: 5,
      multiple: true 
    },
  },
  {
    fieldName: 'title',
    label: '任务主题',
    minWidth: 200,
    align: 'center',
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入任务主题/描述内容',
      label: '关键字',
      order: 6,
    },
  },
  {
    fieldName: 'directorName',
    label: '协作人',
    width: "15%",
    minWidth: 120,
    align: 'center',
  },
  {
    fieldName: 'planHours',
    label: '预估工时',
    width: "10%",
    minWidth: 80,
    align: 'center',
  },
  {
  fieldName: 'endTimeStr',  
  label: '预计结束日期',
  width: "25%", 
  minWidth: 200,
  align: 'center',
},
];

// 操作列
export const operationColumn = {
  label: '操作',
  width: 160,
  fixed: 'right',
  show: true,
  actions: [
    { label: '查看', type: 'primary', size: 'small', icon: 'eye-open' },
    { label: '删除', type: 'danger', size: 'small', icon: 'delete' },
  ]
};

// 头部按钮
export const getHeaderButs = (onAdd) => [
  {
    label: '新建任务',
    type: 'success',
    icon: 'plus',
    size: 'default',
    onClick: onAdd
  }
];

// 操作列生成函数
export const getOperationColumn = (onView, onDelete) => ({
  label: '操作',
  width: 160,
  fixed: 'right',
  show: true,
  actions: [
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

// 生成搜索字段
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