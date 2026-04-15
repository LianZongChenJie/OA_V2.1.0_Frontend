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
    fieldName: 'checkStatus',
    label: '审批状态',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'contract_check_status',
    searchable: {
      type: 'select',
      dictKey: 'contract_check_status',
      fieldName: 'checkStatus',
      placeholder: '请选择审批状态',
      label: '审批状态',
      order: 1,
    },
  },
  {
    fieldName: 'code',
    label: '合同编号',
    width: 150,
    minWidth: 120,
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入合同编号',
      label: '合同编号',
      order: 1,
    },
  },
  {
    fieldName: 'name',
    label: '合同名称',
    minWidth: 200,
  },
  {
    fieldName: 'types',
    label: '合同性质',
    width: 100,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'contract_types',
    searchable: {
      type: 'select',
      dictKey: 'contract_types',
      fieldName: 'types',
      placeholder: '请选择合同性质',
      label: '合同性质',
      order: 2,
    },
  },
  {
    fieldName: 'subjectName',
    label: '签约主体',
    width: 150,
    minWidth: 120,
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
    fieldName: 'customer',
    label: '客户名称',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'contactName',
    label: '客户代表',
    width: 100,
    minWidth: 80,
  },
  {
    fieldName: 'contactMobile',
    label: '联系方式',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'startTimeStr',
    label: '开始时间',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'endTimeStr',
    label: '结束时间',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'cost',
    label: '合同金额(元)',
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
      order: 6,
    },
  },
  {
    fieldName: 'deptName',
    label: '所属部门',
    width: 120,
    minWidth: 100,
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
      order: 4,
      searchKey: ['signTimeStart', 'signTimeEnd'],
    },
  },
  {
    fieldName: 'preparedName',
    label: '制定人',
    width: 100,
    minWidth: 80,
  },
  {
    fieldName: 'keeperName',
    label: '保管人',
    width: 100,
    minWidth: 80,
  },
];


export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
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
        isShow: (row) => Number(row.checkStatus) === 0,
        onClick: (row) => {
          onEdit && onEdit(row);
        },
        icon: 'edit',
      },
      {
        label: '详情',
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
        isShow: (row) => Number(row.checkStatus) === 0,
        onClick: (row) => {
          onDelete && onDelete(row);
        },
        icon: 'delete',
      },
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
