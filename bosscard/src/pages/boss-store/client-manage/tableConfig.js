export default {
  id: 'clientId',
  isScroll: true,
  screen: {
    query: {
      'phoneTem[>]':0,
    },
    col: 3,
    rules: [
      {
        type: 'text',
        prop: 'clientName,phoneTem,licenseNo',
        placeholder: '姓名/手机号/车牌号',
      },
      {
        type: 'list',
        label: '会员阶段',
        placeholder: '全部阶段',
        prop : 'stage',
        list: [
          {
            name: '全部',
            value: -999,
          },
          {
            name: '吸客',
            value: 1,
          },
          {
            name: '养客',
            value: 2,
          },
          {
            name: '黏客',
            value: 3,
          },
          {
            name: '升客',
            value: 4,
          },
          {
            name: '无阶段',
            value: 0,
          },
        ],
      },
      {
        type: 'check',
        label: '仅显示待升卡客户',
        prop : 'stageMark',
        regProp : 'stageMark',
        value: 1,
      },
      {
        type: 'list' ,
        label: '账户类型',
        placeholder: '全部',
        prop: 'isIndividual',
        list: [
          {
            name:'全部',
            value: -999,
          },
          {
            name: '会员',
            value: 1,
          },
          {
            name:'散客',
            value: 0,
          },
        ],
      },
    ],
  },
}
