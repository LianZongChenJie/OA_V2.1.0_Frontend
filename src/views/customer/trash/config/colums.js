import { getPageList as getCustomerLevelList } from '@/api/base/customer/level';
import { getPageList as getChannelPageList } from '@/api/base/customer/channel';
import { getPageList as getIndustryTypePageList } from '@/api/base/customer/industryType';
import { checkPermi } from '@/utils/permission';

// 列与 cusList 保持一致（列宽以 cusList 为准），仅新增「删除人」「删除时间」
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
    fieldName: 'source',
    label: '来源渠道',
    width: 120,
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
    width: 140,
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
  // 新增：删除人 / 删除时间
  {
    fieldName: 'deleteName',
    label: '删除人',
    width: 120,
    minWidth: 100,
    align: 'center',
  },
  {
    fieldName: 'deleteTimeStr',
    label: '删除时间',
    width: 170,
    minWidth: 160,
  },
  {
    fieldName: 'createTimeStr',
    label: '创建时间',
    width: 170,
    minWidth: 160,
  },
];

export const getHeaderButs = () => [];

// 操作列配置（按钮样式与客户列表 cusList 保持一致：small 填充按钮 + svg 图标）
export const getOperationColumn = (onDetail, onReceive) => {
  return {
    label: '操作',
    width: 180,
    fixed: 'right',
    show: true,
    actions: [
      {
        label: '详情',
        type: 'primary',
        size: 'small',
        icon: 'eye-open',
        isShow: () => checkPermi(['crm:customer:trash:query']),
        onClick: (row) => {
          onDetail && onDetail(row);
        },
      },
      {
        label: '领取',
        type: 'success',
        size: 'small',
        icon: 'edit',
        isShow: () => checkPermi(['crm:customer:trash:receive']),
        onClick: (row) => {
          onReceive && onReceive(row);
        },
      },
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
