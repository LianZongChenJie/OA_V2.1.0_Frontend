import { getPageList as getNoteCateList } from "@/api/base/administration/noticeType";

export const getColumns = () => [
  {
    fieldName: 'id',
    label: '序号',
    width: 80,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'typeStr',
    label: '优先级',
    width: 100, 
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'workTimeRange',
    label: '日程时间范围',
    width: "20%",
    minWidth: 160,
    align: 'center',
    slot: true,
    slotName: 'workTimeRange',
  },
  {
    fieldName: 'title',
    label: '日程安排内容',
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
    fieldName: 'remindTime',
    label: '提醒时间',
    width: 180,
    minWidth: 160,
    align: 'center',
  },
];

export const getHeaderButs = (onAdd) => [
  { label: '新增日程安排', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
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
        label: '查看',
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
  getColumns,
  getHeaderButs,
  getOperationColumn,
};
