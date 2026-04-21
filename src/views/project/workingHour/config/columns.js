import { listUser } from '@/api/system/user.js';

// 查询表单
export const queryForm = {
  dateRange: [],
  userIdFilter: undefined,
  keywords: ''
};

// 表格列配置 - 字段名与 formatTaskData 返回的字段保持一致
export const columns = [
  {
    fieldName: 'id',
    label: '序号',
    width: "6%",
    minWidth: 60,
    align: 'center',
    formatter: (row, index) => index + 1
  },
  {
    fieldName: 'laborType',
    label: '工作类型',
    width: "10%",
    minWidth: 90,
    align: 'center',
  },
  {
    fieldName: 'workCategoryName',
    label: '工作类别',
    width: "10%",
    minWidth: 90,
    align: 'center',
  },
  {
    fieldName: 'workTimeRange',
    label: '工作时间范围',
    width: "18%",
    minWidth: 160,
    align: 'center',
    formatter: (row) => {
      if (!row.startTime || !row.endTime) return '-';
      const start = formatDateTime(row.startTime, 'YYYY-MM-DD HH:mm');
      const end = formatDateTime(row.endTime, 'HH:mm');
      return `${start}至${end}`;
    }
  },
  {
    fieldName: 'executorName',
    label: '执行人',
    width: "10%",
    minWidth: 90,
    align: 'center',
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'userIdFilter',
      placeholder: '请选择员工',
      label: '请选择员工',
      order: 2,
    },
  },
  {
    fieldName: 'workHour',
    label: '工时',
    width: "6%",
    minWidth: 60,
    align: 'center',
  },
  {
    fieldName: 'workContent',
    label: '工作内容',
    minWidth: 150,
    align: 'center',
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '关键字，输入工作内容',
      label: '工作内容',
      order: 3,
    },
  },
  {
    fieldName: 'taskName',
    label: '关联任务',
    minWidth: 150,
    align: 'center',
  },
  {
    fieldName: 'projectName',
    label: '关联项目',
    minWidth: 150,
    align: 'center',
  },
  {
    fieldName: 'recordTime',
    label: '记录时间',
    width: "16%",
    minWidth: 140,
    align: 'center',
    formatter: (row) => formatDateTime(row.recordTime, 'YYYY-MM-DD HH:mm:ss')
  }
];

// 头部按钮
export const getHeaderButs = (onAdd) => [
  {
    label: '新增',
    type: 'primary',
    onClick: onAdd
  }
];

// 操作列
export const getOperationColumn = (onDelete, onView) => ({
  label: '操作',
  width: 200,
  fixed: 'right',
  show: true,
  actions: [
    { label: '删除', type: 'danger', size: 'small', onClick: (row) => onDelete?.(row) },
    { label: '查看', type: 'primary', size: 'small', onClick: (row) => onView?.(row) },
  ]
});

// 时间格式化
function formatDateTime(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!timestamp) return '-';
  let timeMs = timestamp;
  if (String(timestamp).length === 10) timeMs = timestamp * 1000;
  const date = new Date(timeMs);
  if (isNaN(date.getTime())) return '-';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format.replace('YYYY', year).replace('MM', month).replace('DD', day)
    .replace('HH', hours).replace('mm', minutes).replace('ss', seconds);
}

// 搜索条件
export const searchFields = [
  {
    type: 'daterange',
    field: 'dateRange',
    label: '时间区间',
    placeholder: '请选择时间区间',
    order: 1
  },
  ...columns
    .filter(col => col.searchable)
    .map(col => ({
      ...col.searchable,
      field: col.searchable.fieldName || col.fieldName,
    }))
    .sort((a, b) => (a.order || 0) - (b.order || 0))
];

export default {
  columns,
  getHeaderButs,
  getOperationColumn,
  searchFields,
  queryForm
};