export const queryForm = {
  meetingDate: '',
  anchorId: '',
  title: '',
};

export const columns = [
  {
    fieldName: 'id',
    label: '序号',
    width: "8%",
    minWidth: 60,
    align: 'center',
  },
  {
    fieldName: 'meetingDate',
    label: '会议时间',
    width: "15%",
    minWidth: 120,
    align: 'center',
    searchable: {
      type: 'dateRange',
      fieldName: 'meetingDate',
      searchKey: ['beginTime', 'endTime'],
      placeholder: '请选择会议时间',
      label: '会议时间',
      order: 1,
    },
  },
  {
    fieldName: 'title',
    label: '会议主题',
    minWidth: 200,
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '会议主题',
      label: '会议主题',
      order: 3,
    },
  },
  {
    fieldName: 'deptName',
    label: '主办部门',
    width: "20%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'anchorName',
    label: '主持人',
    width: "15%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'recorderName',
    label: '记录人',
    width: "auto",
    minWidth: 100,
    align: 'center',
  }
];

// 操作列生成函数
export const getOperationColumn = (onEdit, onView, onDelete) => ({
  label: '操作',
  width: 120,
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
  ]
});

// 提取搜索配置
export const searchFields = columns
  .filter(col => col.searchable)
  .map(col => ({
    ...col.searchable,
    field: col.searchable.fieldName || col.fieldName,
  }))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

export default {
  columns,
  getOperationColumn,
  searchFields,
  queryForm
};