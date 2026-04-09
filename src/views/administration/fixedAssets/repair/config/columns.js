export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: "8%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'repairTime',
    label: '维修日期',
    width: "12%",
    minWidth: 120,
    align: 'center',
    format: (value) => {
      if (!value) return '-';
      // 精确到天，去掉时间部分
      return value.split(' ')[0];
    },
    searchable: {
      type: 'dateRange',
      fieldName: 'repairTime',
      searchKey: ['beginTime', 'endTime'],
      label: '维修日期',
      placeholder: '维修日期'
    }
  },
  {
    fieldName: 'cost',
    label: '维修费用(元)',
    width: "12%",
    minWidth: 120,
    align: 'right',
  },
  {
    fieldName: 'propertyName',
    label: '资产名称',
    width: "15%",
    minWidth: 150,
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      label: '资产名称'
    }
  },
  {
    fieldName: 'cateName',
    label: '资产分类',
    width: "12%",
    minWidth: 120,
  },
  {
    fieldName: 'brandName',
    label: '资产品牌',
    width: "12%",
    minWidth: 120,
  },
  {
    fieldName: 'directorName',
    label: '跟进人',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'createTime',
    label: '记录时间',
    width: "15%",
    minWidth: 150,
    align: 'center',
  },
];

export const operationColumn = {
  label: '操作',
  width: 200,
  fixed: 'right',
  show: true,
  actions: [
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
      label: '禁用',
      type: 'danger',
      size: 'small',
      onClick: (row) => {
        console.log('===禁用', row)
      },
      icon: 'lock',
      isShow: (row) => row.status === 1,
    },
    {
      label: '启用',
      type: 'primary',
      size: 'small',
      onClick: (row) => {
        console.log('===启用', row)
      },
      icon: 'unlock',
      isShow: (row) => row.status === 0,
    },
  ],
};

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onDelete) => {
  return {
    label: '操作',
    width: 260,
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
        label: '详情',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onView && onView(row);
        },
        icon: 'eye-open',
      },
      {
        label: '删除',
        type: 'danger',
        size: 'small',
        onClick: (row) => {
          onDelete && onDelete(row);
        },
        icon: 'delete',
      },
    ],
  };
};

export default {
  columns,
  operationColumn,
  getHeaderButs
};
