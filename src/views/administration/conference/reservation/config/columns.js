
export const queryForm = {
  keywords: '',
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
    fieldName: 'checkStatus',
    label: '审批状态',
    width: "8%",
    align: 'center',
    isDict: true,
    dict: 'check_status'
  },
  {
    fieldName: 'title',
    label: '会议主题',
    width: "15%",
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '关键词',
      label: '关键词',
      order: 1,
    },
  },
  {
    fieldName: 'meetingTimeStr',
    label: '会议时间',
    width: "30%",
    minWidth: 320,
    align: 'center',
  },
  {
    fieldName: 'roomName',
    label: '会议室',
    width: "15%",
    align: 'center'
  },
  {
    fieldName: 'num',
    label: '人数',
    width: "6%",
    align: 'center'
  },
  {
    fieldName: 'checkName',
    label: '当前审核人',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'adminName',
    label: '申请人',
    width: "10%",
    align: 'center'
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: "18%",
    align: 'center'
  }
];


export const operationColumn = {
  label: '操作',
  width: 240,
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
      label: '查看',
      type: 'primary',
      size: 'small',
      onClick: (row, onView) => {
        onView && onView(row);
      },
      icon: 'eye-open',
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
    label: '添加会议室',
    type: 'success',
    icon: 'plus',
    size: 'default',
    onClick: onAdd
  }
];

// 操作列生成函数
export const getOperationColumn = (onEdit, onView, onDelete, currentUserId) => ({
  label: '操作',
  width: 170,
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
      isShow: (row) => {
        // 只有待提交(0)、已驳回(3)可以编辑，且是申请人
        return [0, 3, 4].includes(Number(row.checkStatus)) && Number(row.adminId) === Number(currentUserId);
      }
    },

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
      label: '删除',
      type: 'danger',
      size: 'small',
      onClick: (row) => {
        onDelete && onDelete(row);
      },
      icon: 'delete',
      isShow: (row) => {
        // 只有待提交(0)、已驳回(3)、已撤回(4)可以删除
        return [0, 3, 4].includes(Number(row.checkStatus));
      }
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