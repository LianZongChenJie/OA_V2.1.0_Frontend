import { getPageList as getNoteCateList } from "@/api/base/administration/noticeType";

export const getColumns = () => [
  {
    fieldName: 'id',
    label: 'ID号',
    width: 80,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'title',
    label: '公告主题',
    minWidth: 200,
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入关键字',
      label: '关键字',
      order: 0,
    },
  },
  {
    fieldName: 'cateName',
    label: '所属分类',
    width: 120,
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'selectApi',
      fieldName: 'cateId',
      label: '所属分类',
      placeholder: '请选择所属分类',
      api: getNoteCateList,
      optionLabel: 'title',
      optionValue: 'id',
      pageSize: 10,
      order: 1,
    },
  },
  {
    fieldName: 'status',
    label: '状态',
    width: 100,
    minWidth: 80,
    align: 'center',
    isDict: true,
    dict: 'note_status',
    searchable: {
      type: 'select',
      dictKey: 'note_status',
      fieldName: 'status',
      placeholder: '请选择状态',
      label: '状态',
      order: 2,
    },
  },
  {
    fieldName: 'adminName',
    label: '创建人',
    width: 100,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: 180,
    minWidth: 160,
  },
  {
    fieldName: 'sourse',
    label: '公告平台',
    width: 120,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'note_sourse',
    searchable: {
      type: 'select',
      dictKey: 'note_sourse',
      fieldName: 'sourse',
      placeholder: '请选择公告平台',
      label: '公告平台',
      order: 3,
    },
  },
];

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onView, onDelete) => {
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
        label: '查看',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onView && onView(row);
        },
        icon: 'eye-open',
      },
    ],
  };
};

export default {
  getColumns,
  getHeaderButs,
  getOperationColumn,
};
