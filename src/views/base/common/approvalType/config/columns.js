export const columns = [
  {
    fieldName: 'id',
    label: '模版ID',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'title',
    label: '审批类型名称',
    width: "15%",
    minWidth: 150,
  },
  {
    fieldName: 'name',
    label: '模版标识',
    width: "10%",
    minWidth: 150
  },
  {
    fieldName: 'moduleName',
    label: '审批模块',
    width: "10%",
    minWidth: 150,
  },
  {
    fieldName: 'checkTable',
    label: '数据表名',
    width: "10%",
    minWidth: 150,
  },
  {
    fieldName: 'deptName',
    label: '应用部门',
    width: "10%",
    minWidth: 150,
  },
  {
    fieldName: 'addUrl',
    label: '审批新增链接',
    width: "15%",
    minWidth: 200,
  },
  {
    fieldName: 'viewUrl',
    label: '审批查看链接',
    width: "15%",
    minWidth: 200,
  },
  {
    fieldName: 'isCopy',
    label: '抄送',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'isFile',
    label: '附件',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'isExport',
    label: 'PDF打印',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'isBack',
    label: '撤回',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'isReversed',
    label: '反确认',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'isList',
    label: '快捷展示',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
  // {
  //   fieldName: 'sort',
  //   label: '排序',
  //   width: "5%",
  //   minWidth: 100,
  //   align: 'center',
  // },
  {
    fieldName: 'status',
    label: '状态',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
];
export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onChangeStatus) => {
  return {
    label: '操作',
    width: 180,
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
        label: '禁用',
        type: 'danger',
        size: 'small',
        isShow: (row) => row.status === 1,
        onClick: (row) => {
          onChangeStatus && onChangeStatus(row);
        },
        icon: 'lock',
      },
      {
        label: '启用',
        type: 'warning',
        size: 'small',
        isShow: (row) => row.status === 0,
        onClick: (row) => {
          onChangeStatus && onChangeStatus(row);
        },
        icon: 'enter',
      }
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
