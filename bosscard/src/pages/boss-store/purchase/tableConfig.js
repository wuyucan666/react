export default {
  screen: {
    col: 5,
    rules: [
      {
        type: 'text',
        prop: 'no,operatorName',
        placeholder: '单号/采购员',
      },
      // {
      //   type: 'list',
      //   label: '供应商',
      //   placeholder: '全部供应商',
      //   prop: 'supplier',
      //   list: [],
      // },
      {
        type: 'component',
        label: '',
        prop: '',
        query:{}
      },
      {
        type: 'check',
        label: '仅显示挂账订单',
        prop: 'surplus',
        regProp: 'surplus[>]',
        value: 0,
      },
      {
        type: 'list',
        label: '状态',
        placeholder: '全部状态',
        prop: 'state',
        list: [
          {
            name:'采购中',
            value:0,
          },
          {
            name:'部分入库',
            value:1,
          },
          {
            name:'全部入库',
            value:2,
          },
          {
            name:'挂单',
            value:3,
          },
          {
            name:'已作废',
            value:4,
          },
        ],
      },
      {
        type: 'date',
        label: '日期',
        prop: 'created',
      },
    ],
  },
}
