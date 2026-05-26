import { getPageList as getCustomerLevelList } from '@/api/base/customer/level';
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
    width: "15%",
    minWidth: 100,
    align: 'center',
    searchable: {
      type: 'selectApi',
      searchParam: 'keywords',
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
    width: "25%",
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
    width: "15%",
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
    fieldName: 'contactName',
    label: '联系人',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'contactMobile',
    label: '联系电话',
    width: "10%",
    minWidth: 120,
  },
  {
    fieldName: 'source',
    label: '来源渠道',
    width: "10%",
    minWidth: 100,
    searchable: {
      type: 'selectApi',
      searchParam: 'keywords',
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
    width: "10%",
    minWidth: 120,
    searchable: {
      type: 'selectApi',
      searchParam: 'keywords',
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
    width: "10%",
    minWidth: 160,
  },
];

export const getHeaderButs = () => [
];

export const getOperationColumn = (onReceive, onRestore) => {
  return {
    label: '操作',
    width: 96,
    fixed: 'right',
    show: true,
    actions: [
      {
        label: '领取',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onReceive && onReceive(row);
        },
        icon: 'edit',
      },
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
