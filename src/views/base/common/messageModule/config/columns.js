const handleAdd = () => {
  console.log('==新增==>')
}

export const columns = [
  {
    fieldName: 'name',
    label: '模版标识',
    width: "10%",
    minWidth: 150,
  },
  {
    fieldName: 'title',
    label: '模版名称',
    width: "50%",
    minWidth: 300,
    searchable: {
      type: 'input',
      fieldName: 'title',
      placeholder: '请输入',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'adminId',
    label: '创建人',
    width: "10%",
    minWidth: 150,
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: "10%",
    minWidth: 150,
  },
  {
    fieldName: 'status',
    label: '状态',
    width: "5%",
    minWidth: 100,
    align: 'center',
  },
];

export const operationColumn = {
  label: '操作',
  width: 360,
  fixed: 'right',
  show: true,
  actions: [
    {
      label: '编辑',
      type: 'success',
      size: 'small',
      onClick: (row) => {
        console.log('===编辑', row)
      },
      icon: 'edit',
    },
    {
      label: '查看',
      type: 'primary',
      size: 'small',
      onClick: (row) => {
        console.log('===查看', row)
      },
      isShow: (row) => row.status === 1,
      icon: 'eye-open',
    },
    {
      label: '禁用',
      type: 'danger',
      size: 'small',
      onClick: (row) => {
        console.log('===禁用', row)
      },
      icon: 'lock',
    },
    {
      label: '复制',
      type: 'primary',
      size: 'small',
      onClick: (row) => {
        console.log('===复制', row)
      },
      icon: 'clipboard',
    },
  ],
};

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const headerButs = getHeaderButs(handleAdd);


export default {
  columns,
  operationColumn,
  headerButs,
  getHeaderButs
};
