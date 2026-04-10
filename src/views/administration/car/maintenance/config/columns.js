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
  },

  {
    fieldName: 'types',
    label: '类型',
    width: "5%",
    minWidth: 80,
    align: 'center',
    enum: {
      1: '保养',
      2: '维修'
    },
    searchable: {
      type: 'select',
      fieldName: 'types',
      label: '类型',
      placeholder: '请选择',
      order: 2,
      options: [
        { label: '保养', value: 1 },
        { label: '维修', value: 2 }
      ]
    },
  },

  {
    fieldName: 'repairTime',
    label: '维修日期',
    width: "12%",
    minWidth: 140,
    align: 'center',
    slot: true,
    slotName: 'repairTime',
    searchable: {
      type: 'date',
      fieldName: 'repairTime',
      label: '维修日期',
      order: 1,
    },
  },
  {
    fieldName: 'amount',
    label: '维修费用(元)',
    width: "5%",
    minWidth: 100,
    align: 'right',
  },
  {
    fieldName: 'content',
    label: '维修内容',
    width: "25%",
    minWidth: 300,
  searchable: {
    type: 'input',
    fieldName: 'keywords',
    placeholder: '关键词',
    label: '关键词',
    order: 3,
  },
  },
  {
    fieldName: 'address',
    label: '维修地点',
    width: "25%",
    minWidth: 300,
  },
  {
    fieldName: 'handledName',
    label: '经手人',
    width: "8%",
    minWidth: 100,
    slot: true, 
    slotName: 'handled',
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
    label: '添加维修记录',
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
    label: '维修日期',
    placeholder: '请选择维修日期',
    order: 1,
  },
  {
    type: 'select',
    fieldName: 'types',
    label: '维修类型',
    placeholder: '请选择',
    options: [
      { label: '保养', value: 1 },
      { label: '维修', value: 2 }
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