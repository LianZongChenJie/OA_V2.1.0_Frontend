
export const queryForm = {
  keywords: '', 
};


export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: "5%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'title',
    label: '车辆名称',
    width: "10%",
    minWidth: 120,

    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '车辆名称/车牌号码',
      label: '车辆名称/车牌号码',
      order: 1,
    },
  },
  {
    fieldName: 'name',
    label: '车牌号码',
    width: "10%",
    minWidth: 140,
  },
  {
    fieldName: 'buyTime',
    label: '购买日期',
    width: "8%",
    minWidth: 120,
    align: 'center',
  },
  {
    fieldName: 'price',
    label: '购买价格',
    width: "8%",
    minWidth: 120,
    align: 'right',
  },
  {
    fieldName: 'color',
    label: '车身颜色',
    width: "8%",
    minWidth: 120,
  },
  {
    fieldName: 'seats',
    label: '座位数',
    width: "6%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'driverName',
    label: '驾驶员',
    width: "8%",
    minWidth: 120,
  },
  {
    fieldName: 'oil',
    label: '燃油类型',
    width: "6%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'mileage',
    label: '开始里程数',
    width: "8%",
    minWidth: 120,
    align: 'right',
  },
  {
    fieldName: 'currentMileage',
    label: '当前里程数',
    width: "8%",
    minWidth: 120,
    align: 'right',
  },
  {
    fieldName: 'insureTime',
    label: '保险到期日期',
    width: "8%",
    minWidth: 140,
    align: 'center',

    slot: true,
    slotName: 'insureTime',
  },
  {
    fieldName: 'insureWarn',
    label: '保险到期提醒',
    width: "8%",
    minWidth: 120,
    align: 'center',
    slot: true,
    slotName: 'insureWarn',
  },
  {
    fieldName: 'reviewTime',
    label: '车审到期日期',
    width: "8%",
    minWidth: 140,
    align: 'center',
    slot: true,
    slotName: 'reviewTime',
  },
  {
    fieldName: 'reviewWarn',
    label: '车审到期提醒',
    width: "8%",
    minWidth: 120,
    align: 'center',
    slot: true,
    slotName: 'reviewWarn',
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: "10%",
    minWidth: 160,
    align: 'center',
  },
  {
    fieldName: 'status',
    label: '状态',
    width: "5%",
    minWidth: 100,
    align: 'center',
    show: false,
  },
];


export const operationColumn = {
  label: '操作',
  width: 280,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '查看',
      type: 'primary',
      size: 'small',
      onClick: (row, onView) => {
        onView && onView(row);
      },
      icon: 'eye-open',
    },
    {
      label: '编辑',
      type: 'success',
      size: 'small',
      onClick: (row, onEdit) => {
        onEdit && onEdit(row);
      },
      icon: 'edit',
    },
    {
      label: '删除',
      type: 'danger',
      size: 'small',
      onClick: (row, onDelete) => {
        onDelete && onDelete(row);
      },
      icon: 'delete',
    },
  ],
};

// 头部按钮
export const getHeaderButs = (onAdd) => [
  {
    label: '添加车辆',
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
      label: '查看',
      type: 'primary',
      size: 'small',
      onClick: (row) => {
        onView && onView(row);
      },
      icon: 'eye-open'
    },
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

// 提取搜索配置（对应截图搜索框）
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