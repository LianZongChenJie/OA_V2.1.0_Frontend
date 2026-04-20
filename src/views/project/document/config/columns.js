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
    align: 'center',
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入关键字',
      label: '关键字',
      order: 6,
      },
  },
  {
    fieldName: 'projectName',
    label: '所属项目',
    width: "25%",
    minWidth: 180,
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
    label: '创建人',
    width: "12%",
    minWidth: 100,
    align: 'center',
  },
  {
  fieldName: 'updateTime',
  label: '创建时间',
  width: "aotn",
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