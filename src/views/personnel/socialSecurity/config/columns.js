import { formatDate } from '@/utils/index'
import { listUser } from '@/api/system/user.js'
import { getPageList as getProjectList } from '@/api/project/itemList/index.js'

export const columns = [
  {
    fieldName: 'city',
    label: '所属城市',
    width: "10%",
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'projectName',
    label: '所在项目',
    width: "15%",
    minWidth: 120,
    align: 'center',
    searchable: {
      type: 'selectApi',
      searchParam: 'projectName',
      api: getProjectList,
      optionValue: 'id',
      optionLabel: 'projectName',
      fieldName: 'projectId',
      placeholder: '请选择项目',
      label: '所在项目',
      order: 1,
    },
  },
  {
    fieldName: 'socialDate',
    label: '社保日期',
    width: "10%",
    minWidth: 100,
    align: 'center',
    formatter: (row) => formatDate(row.socialDate),
  },
  {
    fieldName: 'relatedUsers',
    label: '关联人员',
    width: "20%",
    minWidth: 160,
    align: 'center',
  },
  {
    fieldName: 'managerName',
    label: '负责人',
    width: "10%",
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'selectApi',
      searchParam: 'nickName',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'manager',
      placeholder: '请选择负责人',
      label: '负责人',
      order: 2,
    },
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: "10%",
    minWidth: 100,
    align: 'center',
    formatter: (row) => formatDate(row.createTime),
  },
];

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onPersonnel) => {
  return {
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
      },
      {
        label: '人员',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onPersonnel && onPersonnel(row);
        },
        icon: 'user',
      },
    ],
  };
};