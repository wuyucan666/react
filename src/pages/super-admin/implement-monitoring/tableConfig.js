import moment from 'moment'

export default {
  id: 'storeId',
  isScroll: false,
  screen: {
    col: 3,
    query: {},
    rules: [
      {
        type: 'text',
        prop: 'storeName[~]|storeOperator[~]|adminPhone',
        placeholder: '门店名/经营者/联系方式',
      },
      {
        type: 'list',
        label: '品牌商',
        prop: 'brandId',
        list: [],
      },
      {
        type: 'list',
        label: '门店',
        prop: 'storeId',
        list: [],
      },
      {
        type: 'date<>',
        label: '实施时间',
        prop: 'implementTime',
        disabledDate: (current) => {
          return current > moment().endOf('day')
        },
      },
      {
        type: 'list',
        label: '是否实施',
        prop: 'implement',
        list: [
          {name: '已实施', value: 1},
          {name: '未实施', value: 2},
        ],
      },
      {
        type: 'list',
        label: '负责人',
        prop: 'implementAdminId',
        list: [],
      },
      {
        type: 'list',
        label: '区域',
        prop: 'areaId',
        list: [],
      },
      {
        type: 'list',
        label: '门店状态',
        prop: 'status',
        list: [
          {name: '未用', value: 1},
          {name: '在用', value: 2},
          {name: '会用', value: 3},
          {name: '常用', value: 4},
          {name: '睡眠', value: 5},
        ],
      },
      {
        type: 'list',
        label: '标签',
        mode: 'multiple',
        prop: 'storeTag',
        converWidth: 2,
        list: [],
      },
    ],
  },
}
