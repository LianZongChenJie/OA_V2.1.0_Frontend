import { getPageList } from "@/api/base/project/projectClassify/index.js";
import { listUser } from '@/api/system/user.js';


// 查询表单
export const queryForm = {
  statusFilter: undefined,
  keywords: '',
  cateIdFilter: undefined,
  directorUidFilter: undefined
};

// 表格列配置（完全适配格式化后字段）
export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: "8%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'statusText',
    label: '项目状态',
    width: "12%",
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'select',
      fieldName: 'statusFilter',
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
    fieldName: 'cateTitle',
    label: '项目类别',
    width: "18%",
    minWidth: 150,
    align: 'center',
    searchable: {
      type: 'selectApi',
      api: getPageList,
      optionValue: 'id',       
      optionLabel: 'title',
      fieldName: 'cateIdFilter',  
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
      fieldName: 'directorUidFilter', 
      placeholder: '请选择负责人',
      label: '负责人',
      order: 4,
    },
  },
  {
    fieldName: 'rangeTime',
    label: '项目计划周期',
    width: "20%",
    minWidth: 180,
    align: 'center',
  },
  {
    fieldName: 'step',
    label: '当前阶段及负责人',
    minWidth: 200,
    align: 'center',
    formatter: () => '-'
  },
  {
    fieldName: 'tasksUnfinish',
    label: '进行中任务',
    width: "10%",
    minWidth: 80,
    align: 'center',
    formatter: () => '-'
  },
  {
    fieldName: 'tasksFinish',
    label: '已完成任务',
    width: "10%",
    minWidth: 80,
    align: 'center',
    formatter: () => '-'
  },
  {
    fieldName: 'tasksPensent',
    label: '任务完成率',
    width: "12%",
    minWidth: 100,
    align: 'center',
    formatter: () => '-'
  },
  {
    fieldName: 'adminName', 
    label: '创建人',
    width: "12%",
    minWidth: 100,
    align: 'center',
  },
  {
  fieldName: 'updateTime',
  label: '创建时间',
  width: "20%",
  minWidth: 180,
  align: 'center',
  formatter: (row) => {
    let timestamp = row.create_time;
    if (!timestamp) return '-';
    
    // 秒级时间戳（10位）转毫秒
    if (String(timestamp).length === 10) {
      timestamp = timestamp * 1000;
    }
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '-';
    
    // YYYY-MM-DD HH:mm:ss
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
];

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
      onClick: (row) => onView?.(row),
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

export const searchFields = columns
  .filter(col => col.searchable)
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName,
  }))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

export default {
  columns,
  getHeaderButs,
  getOperationColumn,
  searchFields,
  queryForm
};