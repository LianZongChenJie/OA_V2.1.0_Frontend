import { listUser } from "@/api/system/user";
import { formatDate } from "@/utils/index";

export const columns = [
  {
    fieldName: 'id',
    label: '序号',
    width: 80,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'month',
    label: '月份',
    width: 100,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'tenderLeader',
    label: '标书负责人',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'selectApi',
      searchParam: 'nickName',  // ← 指定搜索参数名
      api: listUser,
      optionValue: 'userName',
      optionLabel: 'nickName',
      fieldName: 'tenderLeader',
      placeholder: '请选择标书负责人',
      label: '标书负责人',
      order: 0,
    },
  },
  {
    fieldName: 'purchaseDate',
    label: '购买日期',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'customerName',
    label: '客户名称',
    width: 150,
    minWidth: 120,
    searchable: {
      type: 'input',
      fieldName: 'customerName',
      placeholder: '请输入客户名称',
      label: '客户名称',
      order: 2,
    },
  },
  {
    fieldName: 'projectName',
    label: '项目名称',
    width: 200,
    minWidth: 150,
    searchable: {
      type: 'input',
      fieldName: 'projectName',
      placeholder: '请输入项目名称',
      label: '项目名称',
      order: 1,
    },
  },
  {
    fieldName: 'tenderAgency',
    label: '招标机构',
    width: 150,
    minWidth: 120,

  },
  {
    fieldName: 'projectCycle',
    label: '项目周期',
    width: 120,
    minWidth: 100,
  },
  {
    fieldName: 'shortlistedCountries',
    label: '入围家数',
    width: 100,
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'budgetAmount',
    label: '预算金额(元)',
    width: 130,
    minWidth: 110,
    align: 'right',
  },
  {
    fieldName: 'bidOpeningDate',
    label: '开标日期',
    width: 120,
    minWidth: 100,
    searchable: {
      type: 'dateRange',
      fieldName: 'bidOpeningDate',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      searchKey: ['beginTime', 'endTime'],
      label: '开标日期',
      order: 3,
    },
  },
  {
    fieldName: 'tenderDocumentFee',
    label: '标书款(元)',
    width: 120,
    minWidth: 100,
    align: 'right',
  },
  {
    fieldName: 'hasTenderInvoice',
    label: '标书款发票',
    width: 110,
    minWidth: 90,
    align: 'center',
  },
  {
    fieldName: 'isTenderSubmitted',
    label: '是否投标',
    width: 100,
    minWidth: 80,
    align: 'center',
    isDict: true,
    dict: 's_f_c',
    searchable: {
      type: 'select',
      dictKey: 's_f_c',
      fieldName: 'isTenderSubmitted',
      placeholder: '请选择是否投标',
      label: '是否投标',
      order: 4,
    },
  },
  {
    fieldName: 'nonTenderReason',
    label: '未投原因',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'isDepositPaid',
    label: '是否缴纳保证金',
    width: 130,
    minWidth: 110,
    align: 'center',
    isDict: true,
    dict: 's_f_c',
  },
  {
    fieldName: 'tenderDeposit',
    label: '保证金金额(元)',
    width: 140,
    minWidth: 120,
    align: 'right',
  },
  {
    fieldName: 'depositPaidTime',
    label: '保证金缴纳截止日期',
    width: 160,
    minWidth: 140,
    formatter: (row) => formatDate(row.depositPaidTime),
  },
  {
    fieldName: 'depositAccountName',
    label: '保证金账户名',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'depositAccountNo',
    label: '保证金账号',
    width: 180,
    minWidth: 150,
  },
  {
    fieldName: 'depositBank',
    label: '开户银行',
    width: 150,
    minWidth: 120,
  },
  {
    fieldName: 'isDepositRefunded',
    label: '是否退回保证金',
    width: 130,
    minWidth: 110,
    align: 'center',
    isDict: true,
    dict: 's_f_c',
  },
  {
    fieldName: 'bidResult',
    label: '中标结果',
    width: 100,
    minWidth: 80,
    align: 'center',
    isDict: true,
    dict: 'bid_result',
    searchable: {
      type: 'select',
      dictKey: 'bid_result',
      fieldName: 'bidResult',
      placeholder: '请选择中标结果',
      label: '中标结果',
      order: 5,
    },
  },
  {
    fieldName: 'bidServiceFee',
    label: '中标服务费(元)',
    width: 140,
    minWidth: 120,
    align: 'right',
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: 180,
    minWidth: 160,
    formatter: (row) => formatDate(row.createTime),
  },
  {
    fieldName: 'updateTime',
    label: '更新时间',
    width: 180,
    minWidth: 160,
    formatter: (row) => formatDate(row.updateTime),
  },
  // 排序条件（仅搜索栏显示，不在表格中展示）
  {
    fieldName: 'sortOrder',
    label: '排序',
    searchableOnly: true,
    searchable: {
      type: 'select',
      fieldName: 'orderDirection',
      placeholder: '请选择排序',
      label: '排序',
      options: [
        { label: '正序', value: 'asc' },
        { label: '倒序', value: 'desc' },
      ],
      order: 6,
    },
  },
];

export const getHeaderButs = (onAdd, onImport, onExport) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
  { label: '导入', type: 'success', icon: 'upload', size: 'default', onClick: onImport },
  { label: '导出', type: 'warning', icon: 'Download', size: 'default', onClick: onExport },
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
