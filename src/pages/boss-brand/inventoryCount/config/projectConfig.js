// import moment from "moment"

export default {
  hasCheck: false,
  id: "key",
  moreBtn: [],
  headers: [
    {
      name: "商品名称",
      prop: "productName",
      width: "128px",
      render: (text, item) => {
        return <div style={{width:'128px', wordWrap:'break-word',wordBreak:'break-all'}}>
          {text.productName}
        </div>
      },
    },
    {
      name:'规格',
      prop:"specification",
      width:'114px',
    },
    {
      name: "编码",
      prop: "commodityCode",
      width: "114px",
      render: (text, item) => {
        return <div style={{width:'114px', wordWrap:'break-word',wordBreak:'break-all'}}>
          {text.commodityCode}
        </div>
      },
    },
    {
      name: "期初单价",
      prop: "fristAveragePrice",
      width: "114px",
    },
    {
      name: "期初数量",
      prop: "fristGoodsNum",
      width: "114px",
    },
    {
      name: "期初金额",
      prop: "fristTotalPrice",
      width: "114px",
    },
    {
      name: "本期入库数量",
      prop: "byIntoGoodsNum",
      width: "114px",
    },
    {
      name: "本期入库金额",
      prop: "byIntoAveragePrice",
      width: "114px",
    },
    {
      name: "本期出库数量",
      prop: "byOutGoodsNum",
      width: "114px",
    },
    {
      name: "本期出库金额",
      prop: "byOutTotalPrice",
      width: "114px",
    },
    {
      name: "期末单价",
      prop: "endAveragePrice",
      width: "114px",
    },
    {
      name: "期末数量",
      prop: "endGoodsNum",
      width: "114px",
    },
    {
      name: "期末金额",
      prop: "endTotalPrice",
      width: "110px",
    },

  ],
  isScroll: true,

  screen: {
    col: 3,
    rules: [
      {
        type: 'component',
        prop: 'storeId',
        // placeholder:'选择门店',
        label:'门店:',
        // list:[],
      },
      {
        type: "text",
        prop: "productName,specification,commodityCode",
        placeholder: "商品名称/编码/规格",
      },
      {
        type: "component",
        label: '选择月份',
        prop: 'date',
      },
    ],
  },
}
