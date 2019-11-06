export default {
  screen: {
    col: 3,
    rules: [
      {
        type: 'text',
        prop: 'state,cardName',
        placeholder: '卡名称',
      },
      {
        type: 'list',
        label: '卡状态',
        prop: 'state',
        list: [
          {
            name: '启用',
            value: 1,
          },
          {
            name: '停用',
            value: 0,
          },
          {
            name: '全部状态',
            value: -999,
          },
        ],
      },
    ],
  },
}
