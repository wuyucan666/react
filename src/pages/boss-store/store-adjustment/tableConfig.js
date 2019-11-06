export default {
    screen: {
      col: 5,
      rules: [
        {
          type: 'text',
          prop: 'storageNo,staffName',
          placeholder: '单号/员工',
        },
        // {
        //   type: 'list',
        //   label: '供应商',
        //   placeholder: '全部供应商',
        //   prop: 'supplier',
        //   list: [],
        // },
        {
          type: 'list',
          label: '分类',
          placeholder: '全部',
          prop: 't',
          list: [
            {
              name:'入库',
              value:1,
            },
            {
              name:'出库',
              value:2,
            },
            {
              name:'全部',
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
