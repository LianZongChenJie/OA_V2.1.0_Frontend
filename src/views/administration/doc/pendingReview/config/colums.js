export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: 80,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'title',
    label: '公文主题',
    minWidth: 200,
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入关键字',
      label: '关键字',
      order: 0,
    },
  },
  {
    fieldName: 'code',
    label: '公文编号',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'secrets',
    label: '密级程度',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'secrets_level',
  },
  {
    fieldName: 'urgency',
    label: '紧急程度',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'urgency_level',
  },
  {
    fieldName: 'draftUid',
    label: '拟稿人',
    width: 100,
    minWidth: 80,
  },
  {
    fieldName: 'draftTime',
    label: '拟稿日期',
    width: 160,
    minWidth: 140,
  },
  {
    fieldName: 'did',
    label: '拟稿部门',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: 180,
    minWidth: 160,
  },
];

export const getOperationColumn = (onView) => {
  return {
    label: '操作',
    width: 120,
    fixed: 'right',
    show: true,
    actions: [
      {
        label: '详情',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onView && onView(row);
        },
        icon: 'eye-open',
      },
    ],
  };
};

export default {
  columns,
  getOperationColumn
};
