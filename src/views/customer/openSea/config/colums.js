import {getPageList as getCustomerLevelList} from '@/api/base/customer/level';
import { getPageList as getChannelPageList } from '@/api/base/customer/channel';
import { getPageList as getIndustryTypePageList } from '@/api/base/customer/industryType';

export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: 80,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'grade',
    label: '客户等级',
    width: 120,
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'selectApi',
      api: getCustomerLevelList,
      optionValue: 'id',
      optionLabel: 'title',
      fieldName: 'gradeId',
      placeholder: '请选择客户等级',
      label: '客户等级',
      order: 1,
    },
  },
  {
    fieldName: 'name',
    label: '客户名称',
    minWidth: 200,
    searchable: {
      type: 'input',
      fieldName: 'name',
      placeholder: '请输入客户名称',
      label: '客户名称',
      order: 2,
    },
  },
  {
    fieldName: 'customerStatus',
    label: '客户状态',
    width: 120,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'customer_status',
    searchable: {
      type: 'select',
      fieldName: 'customerStatus',
      dictKey: 'customer_status',
      placeholder: '请选择客户状态',
      label: '客户状态',
      order: 3,
    },
  },
  {
    fieldName: 'intentStatus',
    label: '客户意向',
    width: 120,
    minWidth: 100,
    align: 'center',
    isDict: true,
    dict: 'customer_intent_status',
    searchable: {
      type: 'select',
      fieldName: 'intentStatus',
      dictKey: 'customer_intent_status',
      placeholder: '请选择客户意向',
      label: '客户意向',
      order: 4,
    },
  },
  {
    fieldName: 'contactName',
    label: '联系人',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'contactMobile',
    label: '联系电话',
    width: 130,
    minWidth: 120,
  },
  {
    fieldName: 'followTimeStr',
    label: '最近跟进时间',
    width: 180,
    minWidth: 160,
    searchable: {
      type: 'dateRange',
      fieldName: 'followTime',
      placeholder: '选择跟进时间',
      label: '最近跟进时间',
      order: 5,
      searchKey: ['followTimeStart', 'followTimeEnd'],
    },
  },
  {
    fieldName: 'nextTimeStr',
    label: '下次跟进时间',
    width: 180,
    minWidth: 160,
    searchable: {
      type: 'dateRange',
      fieldName: 'nextTime',
      placeholder: '选择下次跟进时间',
      label: '下次跟进时间',
      order: 6,
      searchKey: ['nextTimeStart', 'nextTimeEnd'],
    },
  },
  {
    fieldName: 'source',
    label: '来源渠道',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'selectApi',
      api: getChannelPageList,
      optionValue: 'id',
      optionLabel: 'title',
      fieldName: 'sourceId',
      placeholder: '请选择来源渠道',
      label: '来源渠道',
      order: 7,
    },
  },
  {
    fieldName: 'industry',
    label: '客户所属行业',
    width: 140,
    minWidth: 120,
    searchable: {
      type: 'selectApi',
      api: getIndustryTypePageList,
      optionValue: 'id',
      optionLabel: 'title',
      fieldName: 'industryId',
      placeholder: '请选择所属行业',
      label: '客户所属行业',
      order: 8,
    },
  },
  {
    fieldName: 'belongName',
    label: '所属员工',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'belongDepartment',
    label: '所属部门',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'createTimeStr',
    label: '创建时间',
    width: 180,
    minWidth: 160,
  },
];

export const getHeaderButs = () => [
];

export const getOperationColumn = (onEdit, onDelete) => {
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
  columns,
  getHeaderButs
};
