export const columns = [
  {
    fieldName: 'id',
    label: 'ID',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'code',
    label: '产品编码',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'cateId',
    label: '产品分类',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'title',
    label: '产品名称',
    width: "30%",
    minWidth: 100,
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'salePrice',
    label: '销售价(元)',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'purchasePrice',
    label: '采购价(元)',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'basePrice',
    label: '成本价(元)',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'unit',
    label: '计量单位',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'specs',
    label: '规格',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'specs',
    label: '规格',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'status',
    label: '状态',
    width: "auto",
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'select',
      fieldName: 'status',
      label: '状态',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ]
    },
  },
];

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onDetail, onToggleStatus) => {
  return {
    label: '操作',
    width: 240,
    fixed: 'right',
    show: true,
    actions: [
      {
        label: '编辑',
        type: 'success',
        size: 'small',
        onClick: (row) => {
          onEdit && onEdit(row);
        },
        icon: 'edit',
      },
      {
        label: '查看',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onDetail && onDetail(row);
        },
        icon: 'eye-open',
      },
      {
        label: '禁用',
        type: 'danger',
        size: 'small',
        onClick: (row) => {
          onToggleStatus && onToggleStatus(row);
        },
        icon: 'lock',
        isShow: (row) => row.status === 1,
      },
      {
        label: '启用',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onToggleStatus && onToggleStatus(row);
        },
        icon: 'enable',
        isShow: (row) => row.status === 0,
      },
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
