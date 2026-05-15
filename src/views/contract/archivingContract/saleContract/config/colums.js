import { getPageList as getClassifyPageList } from '@/api/base/contract/classify/index.js';
import { listUser } from '@/api/system/user.js';

export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: 80,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'code',
    label: '合同编号',
    width: 150,
    minWidth: 120,
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入合同编号、合同名称、关键字进行搜索',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'name',
    label: '合同名称',
    minWidth: 200,
  },
  {
    fieldName: 'cateName',
    label: '合同类别',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'selectApi',
      api: getClassifyPageList,
      optionValue: 'id',
      optionLabel: 'title',
      fieldName: 'cateId',
      placeholder: '请选择合同类别',
      label: '合同类别',
      order: 3,
    },
  },
  {
    fieldName: 'types',
    label: '合同性质',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'procurement_contract_types',
    searchable: {
      type: 'select',
      dictKey: 'procurement_contract_types',
      fieldName: 'types',
      placeholder: '请选择合同性质',
      label: '合同性质',
      order: 4,
    },
  },
  {
    fieldName: 'startTimeStr',
    label: '合同开始时间',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'endTimeStr',
    label: '合同结束时间',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'cost',
    label: '合同金额',
    width: 130,
    minWidth: 110,
    align: 'right',
  },
  {
    fieldName: 'signName',
    label: '签订人',
    width: 100,
    minWidth: 80,
    searchable: {
      type: 'selectApi',
      api: listUser,
      optionValue: 'userId',
      optionLabel: 'nickName',
      fieldName: 'signUid',
      placeholder: '请选择签订人',
      label: '签订人',
      order: 5,
    },
  },
  {
    fieldName: 'signTimeStr',
    label: '签订日期',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'dateRange',
      fieldName: 'signTimeRange',
      placeholder: '签订日期',
      label: '签订日期',
      order: 6,
      searchKey: ['signTimeStart', 'signTimeEnd'],
    },
  },
];

export const getHeaderButs = () => [];

export const getOperationColumn = (onView) => {
  return {
    label: '操作',
    width: 96,
    fixed: 'right',
    show: true,
    actions: [
      {
        label: '详情',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onView && onView(row);
        },
        icon: 'eye-open',
        link: true,
      },
    ],
  };
};

export default {
  columns,
  getHeaderButs,
  getOperationColumn
};