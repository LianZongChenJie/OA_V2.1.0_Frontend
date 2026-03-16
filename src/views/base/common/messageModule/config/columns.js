export const columns = [
  {
    fieldName: 'title',
    label: '模版名称',
    searchable: {
      type: 'input',
      fieldName: 'username',
      placeholder: '输入用户名搜索',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'title',
    label: '模版名称',
    searchable: {
      type: 'input',
      fieldName: 'username',
      placeholder: '输入用户名搜索',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'title',
    label: '模版名称',
    searchable: {
      type: 'input',
      fieldName: 'username',
      placeholder: '输入用户名搜索',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'title',
    label: '模版名称',
    searchable: {
      type: 'input',
      fieldName: 'username',
      placeholder: '输入用户名搜索',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'title',
    label: '模版名称',
    searchable: {
      type: 'input',
      fieldName: 'username',
      placeholder: '输入用户名搜索',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'title',
    label: '模版名称',
    searchable: {
      type: 'input',
      fieldName: 'username',
      placeholder: '输入用户名搜索',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'title',
    label: '模版名称',
    searchable: {
      type: 'input',
      fieldName: 'username',
      placeholder: '输入用户名搜索',
      label: '关键字',
      order: 1,
    },
  }, 
  {
    fieldName: 'name',
    label: '模版标识',
  },
];

export const operationColumn = {
  label: '操作',
  width: 140,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '编辑',
      type: 'primary',
      onClick: (row) => {
        console.log('===编辑', row)
      },
      disabled: (row) => row.status === 1,
      isShow: (row) => row.status === 1,
      icon: 'edit',
    },
    {
      label: '删除',
      type: 'danger',
      onClick: (row) => {
        console.log('===删除', row)
      },
      disabled: (row) => row.status === 1,
    },
  ],
};

export default {
  columns,
  operationColumn,
};
