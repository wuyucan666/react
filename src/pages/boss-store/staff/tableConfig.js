export default {
  screen: {
    col: 5,
    rules: [
      {
        type: "text",
        prop: "staffName,phoneTem",
        placeholder: "姓名/手机",
      },
      {
        type: "list",
        label: "角色",//以前的工种
        prop: "roleId",
        list: [],
      },
      {
        type: "list",
        label: "班组",
        prop: "groupId",
        list: [],
      },
      {
        type: 'list',
        label: '状态',
        placeholder: '全部状态',
        prop: 'isJob',
        list: [
          {
            name: '全部',
            value: 0,
          },
          {
            name: '在职',
            value: 1,
          },
          {
            name: '离职',
            value: 2,
          },
        ],
      },
    ],
  },
}
