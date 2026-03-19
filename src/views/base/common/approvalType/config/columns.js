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
    fieldName: 'moduleId',
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
    fieldName: 'departmentIds',
    label: '应用部门',
    width: "10%",
    minWidth: 150,
    format: (value) => {
      if (!value || !Array.isArray(value) || value.length === 0) {
        return '-';
      }
      return value.join(', ');
    }
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
    label: '列表显示',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'sort',
    label: '排序',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
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

export const getOperationColumn = (onEdit, onView) => {
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
        onClick: (row) => {
          console.log('===禁用', row)
        },
        icon: 'lock',
      }
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
