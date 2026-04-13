export const queryForm = {
  repairTime: '',
  types: '',
  keywords: ''
};

export const columns = [
  {
    fieldName: 'id',
    label: 'ID',
    width: "5%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'carName',
    label: '车辆名称',
    width: "10%",
    minWidth: 120,
    searchable: {
    type: 'input',
    fieldName: 'keywords',
    placeholder: '关键词',
    label: '关键词',
    order: 3,
    },
  },
  {
    fieldName: 'title',
    label: '费用主题',
    width: "25%",
    minWidth: 200,
  },
  {
    fieldName: 'content',
    label: '收费内容',
    width: "25%",
    minWidth: 200,
  },
  {
    fieldName: 'feeTime',
    label: '收费日期',
    width: "12%",
    minWidth: 140,
    align: 'center',
    slot: true,
    slotName: 'feeTime',
    searchable: {
      type: 'date',
      fieldName: 'feeTime',
      label: '收费日期',
      order: 1,
    },
  },
  {
    fieldName: 'types',
    label: '费用类型',
    width: "5%",
    minWidth: 100,
    align: 'center',
    enum: {
      1: '停车费',
      2: '洗车费',
      3: '保养费',
      4: '维修费',
      5: '过路费',
      6: '过桥费',
      7: '养路费',
      8: '保险费',
      9: '年检费',
      10: '违章费',
      11: '其他费'
    },
    searchable: {
      type: 'select',
      fieldName: 'types',
      label: '费用类型',
      placeholder: '请选择',
      order: 2,
      options: [
        { label: '停车费', value: 1 },
        { label: '洗车费', value: 2 },
        { label: '保养费', value: 3 },
        { label: '维修费', value: 4 },
        { label: '过路费', value: 5 },
        { label: '过桥费', value: 6 },
        { label: '养路费', value: 7 },
        { label: '保险费', value: 8 },
        { label: '年检费', value: 9 },
        { label: '违章费', value: 10 },
        { label: '其他费', value: 11 }
      ]
    },
  },
  {
    fieldName: 'amount',
    label: '费用金额(元)',
    width: "5%",
    minWidth: 100,
    align: 'right',
  },

  {
    fieldName: 'handledName',
    label: '经手人',
    width: "8%",
    minWidth: 100,
    align: 'center'
  },

  {
    fieldName: 'updateTime',
    label: '记录时间',
    width: "12%",
    minWidth: 200,
    align: 'center',
    slot: true,
    slotName: 'updateTime',
  }
];

export const operationColumn = {
  label: '操作',
  width: 280,
  fixed: 'right',
  show: true,
  actions: [
    { label: '编辑', type: 'success', size: 'small', icon: 'edit' },
    { label: '查看', type: 'primary', size: 'small', icon: 'eye-open' },
    { label: '删除', type: 'danger', size: 'small', icon: 'delete' },
  ]
};

export const getHeaderButs = (onAdd) => [
  {
    label: '添加费用记录',
    type: 'success',
    icon: 'plus',
    size: 'default',
    onClick: onAdd
  }
];

export const getOperationColumn = (onEdit, onView, onDelete) => ({
  ...operationColumn,
  actions: operationColumn.actions.map(item => ({
    ...item,
    onClick: (row) => {
      if (item.label === '编辑') onEdit && onEdit(row);
      if (item.label === '查看') onView && onView(row);
      if (item.label === '删除') onDelete && onDelete(row);
    }
  }))
});

export const searchFields = [
  {
    type: 'date',
    fieldName: 'repairTime',
    label: '费用日期',
    placeholder: '请选择费用日期',
    order: 1,
  },
  {
    type: 'select',
    fieldName: 'types',
    label: '类型',
    placeholder: '请选择',
    options: [
      { label: '停车费', value: 1 },
      { label: '洗车费', value: 2 },
      { label: '保养费', value: 3 },
      { label: '维修费', value: 4 },
      { label: '过路费', value: 5 },
      { label: '过桥费', value: 6 },
      { label: '养路费', value: 7 },
      { label: '保险费', value: 8 },
      { label: '年检费', value: 9 },
      { label: '违章费', value: 10 },
      { label: '其他费', value: 11 }
    ],
    order: 2,
  },
];

export default {
  columns,
  operationColumn,
  getHeaderButs,
  getOperationColumn,
  searchFields,
  queryForm
};