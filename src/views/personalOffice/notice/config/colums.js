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
      fieldName: 'keyword',
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
    align: 'center',
  },
];



export const getOperationColumn = (onEdit, onView, onDelete) => {
  return {
    label: '操作',
    width: 120,
    fixed: 'right',
    show: true,
    actions: [
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
  getOperationColumn,
};
