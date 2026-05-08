export const columns = [
  {
    fieldName: 'id',
    label: '序号',
    width: 80,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'websiteName',
    label: '网站名称',
    width: "20%",
    minWidth: 120,
    align: 'center',
    searchable: {
      type: 'input',
      fieldName: 'websiteName',
      placeholder: '请输入网站名称',
      label: '网站名称',
      order: 0,
    },
  },
  {
    fieldName: 'websiteUrl',
    label: '网址',
    width: "20%",
    minWidth: 150,
    align: 'center',
  },
  {
    fieldName: 'username',
    label: '用户名',
    width: "15%",
    minWidth: 120,
    align: 'center',
  },
  {
    fieldName: 'password',
    label: '密码',
    width: "15%",
    minWidth: 120,
    align: 'center',
  },
  {
    fieldName: 'hasUk',
    label: '是否有UK',
    width: "10%",
    minWidth: 80,
    align: 'center',
    isDict: true,
    dict: 'have_uk',
    searchable: {
      type: 'select',
      dictKey: 'have_uk',
      fieldName: 'hasUk',
      placeholder: '请选择是否有UK',
      label: '是否有UK',
      order: 1,
    },
  },
  {
    fieldName: 'remark',
    label: '说明',
    width: "20%",
    minWidth: 150,
  },
];

export const getHeaderButs = (onAdd, onImport) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
  { label: '导入', type: 'success', icon: 'upload', size: 'default', onClick: onImport },
];

export const getOperationColumn = (onEdit, onView, onDelete) => {
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
  getHeaderButs
};
