import { getPageList } from "@/api/base/administration/assetBrand/index.js";
export const columns = [
  {
    fieldName: 'id',
    label: 'ID号',
    width: "8%",
    minWidth: 80,
    align: 'center',
  },
  {
    fieldName: 'code',
    label: '资产编码',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'cateName',
    label: '资产分类',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'title',
    label: '资产名称',
    width: "15%",
    minWidth: 100,
    searchable: {
      type: 'input',
      fieldName: 'keywords',
      placeholder: '请输入',
      label: '关键字',
      order: 1,
    },
  },
  {
    fieldName: 'brandName',
    label: '资产品牌',
    width: "8%",
    minWidth: 80,
    searchable: {
      type: 'selectApi',
      fieldName: 'brandId',
      label: '资产品牌',
      api: getPageList,
      apiParams: {
        pageNum: 1,
        pageSize: 10
      },
      optionValue: 'id',
      optionLabel: 'title',
      placeholder: '请选择',

    },
  },
  {
    fieldName: 'model',
    label: '型号',
    width: "10%",
    minWidth: 100,
  },
  {
    fieldName: 'unitName',
    label: '计量单位',
    width: "8%",
    minWidth: 80,
  },
  {
    fieldName: 'status',
    label: '状态',
    width: "8%",
    minWidth: 80,
    align: 'center',
    searchable: {
      type: 'select',
      fieldName: 'status',
      label: '状态',
      dictKey: 'assets_status',
    },
  },
  {
    fieldName: 'adminName',
    label: '创建人',
    width: "8%",
    minWidth: 80,
  },
  {
    fieldName: 'createTime',
    label: '创建时间',
    width: "12%",
    minWidth: 120,
  },
  {
    fieldName: 'updateName',
    label: '最后修改人',
    width: "8%",
    minWidth: 80,
  },
  {
    fieldName: 'updateTime',
    label: '最后修改时间',
    width: "12%",
    minWidth: 120,
  },
];

export const getHeaderButs = (onAdd) => [
  { label: '新增', type: 'primary', icon: 'plus', size: 'default', onClick: onAdd },
];

export const getOperationColumn = (onEdit, onDetail, onToggleStatus, onDelete) => {
  return {
    label: '操作',
    width: 340,
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
        isShow: (row) => ![-1, 4].includes(row.status),
      },
      {
        label: '查看',
        type: 'primary',
        size: 'small',
        onClick: (row) => {
          onDetail && onDetail(row);
        },
        icon: 'eye-open',
      },
      {
        label: '设置状态',
        type: 'danger',
        size: 'small',
        onClick: (row) => {
          onToggleStatus && onToggleStatus(row);
        },
        icon: 'lock'
      },
      {
        label: '删除',
        type: 'danger',
        size: 'small',
        onClick: (row) => {
          onDelete && onDelete(row);
        },
        icon: 'delete'
      },
    ],
  };
};

export default {
  columns,
  getHeaderButs
};
