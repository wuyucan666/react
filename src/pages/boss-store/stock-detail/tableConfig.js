export default {
  screen: {
    col: 5,
    rules: [
      {
        type: 'text',
        prop: 'storageNo,spec,name,supplierName,remark,productName,commodityCode',
        placeholder: '单号/商品名称/编码',
      },
      {
        type: 'list',
        label: '类型',
        prop: 'typeId',
        list: [
          {
            name: '采购',
            value: 17,
          },
          {
            name: '出库',
            value: 16,
          },
          {
            name: '全部',
            value: -999,
          },
        ],
      },
      {
        type: 'list',
        label: '仓库',
        prop: 'warehouseId',
        list: [],
      },
      {
        type: 'date',
        prop: 'created',
        label: '日期',
      },
    ],
  },
}
