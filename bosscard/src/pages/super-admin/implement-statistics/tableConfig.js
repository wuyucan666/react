import moment from 'moment'

export default {
  screen: {
    col: 3,
    query: {
      // implementAdminId: -1,
      // brandId: 0,
      // 'created[<>]': [moment().startOf('month').unix(), moment().endOf('month').unix()],
    },
    rules: [
      {
        type: 'list',
        label: '负责人',
        prop: 'implementAdminId',
        value: -1,
        list: [{name: '全部负责人', value: -1},{name: '未指定', value: 0}],
      },
      {
        type: 'list',
        label: '品牌商',
        placeholder: '品牌商',
        prop: 'brandId',
        value: 0,
        list: [{name: '全部品牌', value: 0}],
      },
      {
        type: 'month',
        label: '时间',
        prop: 'created',
        value: moment(),
        disabledDate: (current) => {
          return current > moment().endOf('day')
        },
      },
    ],
  },
}
