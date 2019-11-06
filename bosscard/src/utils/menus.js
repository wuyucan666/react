/*
 * 调整菜单位置需同时更改权限
 * 调整菜单位置需同时更改权限
 * 调整菜单位置需同时更改权限
 *
 * 权限控制
 *
 * permissions -》array or number
 *
 * 根据权限列表设置权限
 * 若父级菜单和子级菜单同时出现在权限列表，则父级菜单权限不需要包含子级权限； =》 子级菜单有权限父级菜单没权限，仍不显示菜单
 * 否则一般父级菜单值为数组，数组项值为直接子级（不包括孙级和更深的）所有权限的集合，子集值为该子集菜单的权限   =》 出现任意子菜单则必定显示父级菜单
 *
 * show 不受权限控制，可控制显示隐藏 -》 function  为一个函数返回布尔值
 *
 * */

import hasPermission from "./hasPermission"

export default [
  // 品牌商
  {
    icon: "icon-guanlizhongxin",
    name: "数据看板",
    route: "/boss-brand/index",
    show: () => {
      return localStorage.getItem("loginType") === "2"
    },
  },
  {
    icon: "icon-pinpaishang-liansuoguanli",
    name: "连锁管理",
    permissions: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    children: [
      {
        name: "角色列表",
        range: 2,
        route: "/boss-brand/administor",
        permissions: [2, 5],
        children: [
          {
            name: "管理员",
            range: 3,
            route: "/boss-brand/administor",
            permissions: 2,
          },
          {
            name: "督导员",
            range: 3,
            route: "/boss-brand/supervisor",
            permissions: 5,
          },
        ],
      },
      {
        name: "大区管理",
        range: 2,
        route: "/boss-brand/store-regional",
        permissions: 3,
      },
      {
        name: "角色管理",
        range: 2,
        route: "/boss-brand/role",
        permissions: 4,
      },
      // {
      //   name: "工种管理",
      //   range: 2,
      //   route: "/boss-brand/work-type",
      //   permissions: "brand_staff_level_list",
      // },
      // {
      //   name: "督导管理",
      //   range: 2,
      //   route: "/boss-brand/supervisor",
      //   permissions: 5,
      // },
      {
        icon: "play-circle-o",
        name: "门店管理",
        range: 2,
        permissions: [6],
        children: [
          {
            name: "门店列表",
            range: 3,
            route: "/boss-brand/shop",
            permissions: 6,
          },
          {
            name: "门店类别",
            range: 3,
            route: "/boss-brand/store-category",
            permissions: 6,
          },
          {
            name: "班次管理",
            range: 3,
            route: "/boss-brand/classManagement",
            permissions: [6],
            children: [
              {
                name: "新建班次",
                route: "/boss-brand/addClassGroup",
                range: 3,
                permissions: 6,
              },
            ],
          },
          {
            name: "支付方式",
            range: 3,
            route: "/boss-brand/pay",
            permissions: 6,
          },
        ],
      },
      {
        icon: "play-circle-o",
        name: "顾客管理",
        range: 2,
        permissions: [7, 8, 9],
        children: [
          {
            name: "入店渠道",
            range: 3,
            route: "/boss-brand/channel",
            permissions: 7,
          },
          {
            name: "顾客积分",
            range: 3,
            route: "/boss-brand/customer-integral",
            permissions: 8,
          },
          {
            name: "顾客标签",
            range: 3,
            route: "/boss-brand/label",
            permissions: 9,
          },
        ],
      },
      {
        icon: "play-circle-o",
        name: "薪资管理",
        range: 2,
        permissions: [10],
        children: [
          {
            name: "薪资列表",
            range: 3,
            route: "/boss-brand/salaryList",
            permissions: 10,
          },
        ],
      },
    ],
  },
  /**
   * 服务管理
   */
  {
    icon: "icon-pinpaishang-fuwuguanli",
    name: "服务管理",
    permissions: [12, 13, 14],
    children: [
      {
        name: "业务类型",
        range: 2,
        route: "/boss-brand/maintenance-category",
        permissions: 12,
      },
      {
        name: "项目管理",
        range: 2,
        permissions: [13],
        children: [
          {
            name: "项目列表",
            range: 3,
            route: "/boss-brand/project",
            permissions: 13,
          },
          // {
          //   name: "附加项目列表",
          //   range: 3,
          //   route: "/boss-brand/additional-project",
          //   permissions: "brand_project_list",
          // },
          {
            name: "项目分类",
            range: 3,
            route: "/boss-brand/project-category",
            permissions: 13,
          },
        ],
      },
      {
        name: "产品管理",
        range: 2,
        permissions: [14],
        children: [
          {
            name: "产品列表",
            range: 3,
            route: "/boss-brand/product",
            permissions: 14,
          },
          {
            name: "产品分类",
            range: 3,
            route: "/boss-brand/product-category",
            permissions: 14,
          },
          {
            name: "单位管理",
            range: 3,
            route: "/boss-brand/unit",
            permissions: 14,
          },
        ],
      },
    ],
  },
  /**
   * 数据中心
   */
  {
    icon: "icon-shuju1",
    name: "数据中心",
    permissions: [16, 17, 18],
    children: [
      {
        name: "连锁汇总",
        range: 2,
        permissions: [16],
        children: [
          {
            name: "服务分类统计",
            route: "/boss-brand/data-center/serviceClass",
            permissions: 16,
          },
          {
            name: "项目产品表现",
            route: "/boss-brand/data-center/expression",
            permissions: 16,
          },
          {
            name: "财务报表",
            route: "/boss-brand/data-center/financial",
            permissions: 16,
          },
        ],
      },
      {
        name: "门店数据",
        range: 2,
        permissions: [17],
        children: [
          {
            name: "门店表现",
            route: "/boss-brand/storesData/performance",
            permissions: 17,
          },
          {
            name: "门店产值",
            route: "/boss-brand/storesData/store-value",
            permissions: 17,
          },
          {
            name: "服务分类统计",
            route: "/boss-brand/storesData/service-statistic",
            permissions: 17,
          },
          {
            name: "项目产品表现",
            route: "/boss-brand/storesData/project-product",
            permissions: 17,
          },
        ],
      },
      {
        name: "库存统计",
        range: 2,
        permissions: [18],
        children: [
          {
            name: "门店库存总控",
            route: "/boss-brand/inventoryCount/inventoryControl",
            permissions: 18,
          },
          {
            name: "门店收发汇总",
            route: "/boss-brand/inventoryCount/projectControl",
            permissions: 18,
          },
        ],
      },
    ],
  },
  /** 门店首页-------------------------------------------------------------------------------------------------------------------------- */
  {
    name: "数据看板",
    icon: "icon-shouye2",
    route: "/boss-store/index",
    // permissions: 147,
    show: () => {
      return localStorage.getItem("loginType") === "3"
    },
  },
  /** 交易台 ***/
  {
    name: "交易中心",
    icon: "icon-zhifu",
    notShowChildren: true,
    route: "/boss-store/tradingPlatform",
    permissions: [20, 21, 24, 25, 26, 31, 83, 89], // 该页面比较特殊  需同步更改/boss-store/tradingPlatform页面 permissions
    children: [
      {
        name: "快捷开单",
        range: 3,
        route: "/boss-store/speedy-billing",
        permissions: 20,
      },
      {
        name: "维修开单",
        range: 3,
        route: "/boss-store/maintain-billing",
        permissions: 21,
      },
      {
        name: "办卡",
        range: 3,
        route: "/boss-store/member-center/business/apply-card",
        permissions: 89,
      },
      // {
      //   name: "办计次卡",
      //   range: 3,
      //   route: "/boss-store/member-center/business/number-card",
      //   permissions: 23,
      // },
      // {
      //   name: "办充值卡",
      //   range: 3,
      //   route: "/boss-store/member-center/business/up-card",
      //   permissions: 23,
      // },
      {
        name: "进行中订单",
        range: 3,
        route: "/boss-store/pending-order",
        permissions: 83,
      },
      {
        name: "赠送",
        range: 3,
        route: "/boss-store/member-center/business/number-card/give",
        permissions: 24,
      },
      {
        name: "续卡",
        route: "/boss-store/member-center/business/extend-card",
        range: 3,
        permissions: 25,
      },
      {
        name: "客户查询",
        route: "/boss-store/tradingPlatform/searchClient",
        range: 3,
        permissions: 26,
      },
      {
        name: "客户导入",
        range: 3,
        route: "/boss-store/member-center/business/customers-import",
        permissions: 31,
      },
    ],
  },
  {
    icon: "icon-dingdanzhongxin",
    name: "订单中心",
    notShowChildren: true,
    showListNum: "getPersonListTotal",
    route: "/boss-store/order",
    permissions: [35, 'c7ef7040','d72d9eaa'], // 该页面比较特殊  需同步更改/boss-store/order permissions
    children: [
      {
        name: "已完成订单",
        range: 3,
        route: "/boss-store/maintain-list/orderAll",
        permissions: 35,
      },
      {
        name: "B单",
        range: 3,
        route: "/boss-store/maintain-list/blist",
        permissions: 'c7ef7040',
      },
      {
        name: "车检报告列表",
        range: 3,
        route: "/boss-store/car-report",
        permissions: 'd72d9eaa',
      },
    ],
  },
  /**
   * 客户管理
   */
  {
    name: "客户管理",
    icon: "icon-huiyuan",
    permissions: [29, 30, 32, '8e03bbed'],
    children: [
      {
        name: "客户列表",
        range: 2,
        route: "/boss-store/client-manage",
        permissions: 29,
      },
      {
        name: "客户车辆",
        range: 2,
        route: "/boss-store/car-manage",
        permissions: 30,
      },
      {
        name: "客户回访",
        range: 2,
        permissions: [32],
      },
      {
        name: "回访列表",
        range: 3,
        showListNum: "getReturnTatal",
        icon: "payload-circle-o",
        permissions: [32],
        children: [
          {
            name: "未回访",
            route: "/boss-store/return-visit",
            permissions: 32,
          },
          {
            name: "回访中",
            route: "/boss-store/return-visit/visit-active",
            permissions: 32,
          },
          {
            name: "逾期",
            route: "/boss-store/return-visit/visit-overdue",
            permissions: 32,
          },
          {
            name: "已回访",
            route: "/boss-store/return-visit/visit-already",
            permissions: 32,
          },
          {
            name: "回访汇总",
            route: "/boss-store/review-summary",
            permissions: 32,
            // isShow: -1,
          },
        ],
      },
      {
        name: "回访设置",
        range: 3,
        permissions: [32],
        children: [
          {
            name: "回访提醒设置",
            route: "/boss-store/visit-warn",
            permissions: 32,
          },
          {
            name: "回访项设置",
            route: "/boss-store/project-warn",
            permissions: 32,
          },
          {
            name: "施工回访提醒",
            route: "/boss-store/work-warn",
            permissions: 32,
          },
        ],
      },
      {
        name: "发送短信",
        range: 2,
        permissions: ['8e03bbed'],
        children: [
          {
            name: "短信群发",
            route: "/boss-store/short-message",
            permissions: '8e03bbed',
          },
          {
            name: "服务短信模块",
            route: "/boss-store/sevice-message",
            permissions: '8e03bbed',
          },
        ],
      },
    ],
  },
  /**
   * 门店管理
   */
  {
    icon: "icon-mendian",
    name: "门店管理",
    permissions: [38, 39, 40, 41, 'd9bee9e4'],
    children: [
      {
        name: "计划",
        range: 2,
        route: "/boss-store/plan",
        permissions: 38,
      },
      {
        name: "角色管理",
        range: 2,
        route: "/boss-store/role",
        permissions: 39,
      },
      {
        name: "支付方式",
        route: "/boss-store/pay",
        range: 2,
        permissions: 40,
      },
      {
        name: "打印设置",
        range: 2,
        route: "/boss-store/mimeograph",
        permissions: 41,
      },
      {
        name: "门店信息",
        range: 2,
        route: "/boss-store/store-set",
        permissions: 'd9bee9e4',
      },
    ],
  },
  {
    icon: "icon-yuangongguanli",
    name: "员工管理",
    permissions: [36,37,42,43],
    children: [
      {
        name: "员工列表",
        range: 2,
        permissions: [36],
        children: [
          {
            name: "员工列表",
            route: "/boss-store/staff",
            permissions: 36,
          },
          {
            name: "班组管理",
            route: "/boss-store/team-group",
            permissions: 36,
          },
        ],
      },
      {
        name: "员工排班",
        range: 2,
        route: "/boss-store/classSchedual",
        permissions: 37,
      },
      {
        name: "业绩奖励规则",
        range: 2,
        route: "/boss-store/perform-rewards",
        permissions: 43,
      },
      {
        name: "工资单",
        range: 2,
        route: "/boss-store/salaryList",
        permissions: 42,
      },
    ],
  },
  /**
   * 服务管理
   */
  {
    icon: "icon-kefu",
    name: "服务管理",
    permissions: [45, 47, 50, 'a7fd8a1f', 54],
    children: [
      {
        name: "充值卡",
        range: 2,
        route: "/boss-store/cards",
        permissions: 45,
        // permissions: 'store_card_species_list',
      },
      {
        name: "计次卡",
        range: 2,
        route: "/boss-store/meter-combo",
        permissions: 47,
        // permissions: 'store_card_records_list',
      },
      {
        name: "卡阶段管理",
        range: 2,
        route: "/boss-store/card-stage",
        show: () => {
          return true
        },
        // permissions: 'store_card_records_list',
      },

      {
        name: "产品管理",
        range: 2,
        icon: "play-circle-o",
        permissions: ['a7fd8a1f', 53],
        children: [
          {
            name: "产品列表",
            route: "/boss-store/product",
            permissions: 'a7fd8a1f',
          },
          {
            name: "产品分类",
            route: "/boss-store/product-category",
            permissions: 'a7fd8a1f',
          },
          {
            name: "外采默认提成",
            route: "/boss-store/mining-outside",
            permissions: 53,
          },
        ],
      },
      {
        name: "项目管理",
        range: 2,
        icon: "payload-circle-o",
        permissions: [50],
        children: [
          {
            name: "项目列表",
            route: "/boss-store/project-store",
            permissions: 50,
          },
          // {
          //   name: "附加项目列表",
          //   route: "/boss-store/additional-project",
          //   permissions: "store_project_list",
          // },
          {
            name: "项目分类",
            route: "/boss-store/project-category",
            permissions: 50,
          },
        ],
      },
      // 李冯 2019-1-21
      {
        name: "业务类型管理", //原维修类型
        range: 2,
        route: "/boss-store/maintenance-category",
        permissions: 54,
      },
      {
        name: "服务导入",
        range: 2,
        route: "/boss-store/import-good",
        show: () => {
          return hasPermission(88) && localStorage.getItem('coiling') !== '1'
        },
      },
    ],
  },

  /**
   * 库存管理
   */
  {
    icon: "icon-kucun1",
    name: "库存管理",
    permissions: ['f4aef7fc', 56, 57, 58, '18470dd4',84],
    children: [
      //——————————————————————————————————————————————
      {
        name: "库存设置",
        range: 2,
        icon: "play-circle-o",
        permissions: ['f4aef7fc',84],
        children: [
          {
            name: "供应商管理",
            route: "/boss-store/brand",
            permissions: 'f4aef7fc',
          },
          {
            name: "仓库管理",
            route: "/boss-store/warehouse",
            permissions: 'f4aef7fc',
          },
          {
            name: "库存预警",
            route: "/boss-store/stock-early-warning",
            permissions: 'f4aef7fc',
          },
          {
            name: "成本调整",
            route: "/boss-store/cost-adjustment",
            permissions: 84,
          },
        ],
      },
      {
        name: "出入库",
        range: 2,
        icon: "play-circle-o",
        permissions: [56],
        children: [
          {
            name: "采购单列表",
            route: "/boss-store/purchase",
            permissions: 56,
          },
          {
            name: "出库单列表",
            route: "/boss-store/out-stock",
            permissions: 56,
          },
          {
            name: "出入库明细",
            route: "/boss-store/stock-detail",
            permissions: 56,
          },
          {
            name: "退货记录",
            route: "/boss-store/refund",
            permissions: 56,
          },
          {
            name: "退货明细",
            route: "/boss-store/refund-detail",
            permissions: 56,
          },
        ],
      },
      //赵林库存调整模块________________________________
      {
        name: "库存调整",
        icon: "play-circle-o",
        route: "/boss-store/store-adjustment",
        permissions: [57],
        range: 2,
        children: [
          // {
          //   name: "库存调整列表",
          //   route: "/boss-store/store-adjustment",
          //   permissions: "store_staff_list",
          //   isShow:-1,
          // },
          {
            name: "入库调整",
            route: "/boss-store/store-adjustment/inStore",
            permissions: 57,
            isShow: -1,
          },
          {
            name: "出库调整",
            route: "/boss-store/store-adjustment/outStore",
            permissions: 57,
            isShow: -1,
          },
        ],
      },
      {
        name: "库存盘点",
        range: 2,
        icon: "play-circle-o",
        permissions: [58],
        children: [
          {
            name: "盘点单列表",
            route: "/boss-store/stock-taking",
            permissions: 58,
          },
          {
            name: "盘点明细",
            route: "/boss-store/stock-taking-detail",
            permissions: 58,
          },
        ],
      },
      {
        name: "库存统计",
        range: 2,
        icon: "play-circle-o",
        permissions: ['18470dd4'],
        children: [
          {
            name: "库存总览",
            route: "/boss-store/warehouse-total",
            permissions: '18470dd4',
          },
          {
            name: "库存查询",
            route: "/boss-store/warehouse-query",
            permissions: '18470dd4',
          },
          {
            name: "收发汇总",
            route: "/boss-store/receive-summary",
            permissions: '18470dd4',
          },
          {
            name: "收发明细",
            route: "/boss-store/send-receive-details",
            permissions: '18470dd4',
          },
          {
            name: "销售出库明细",
            route: "/boss-store/warehousing-details",
            permissions: '18470dd4',
          },
          {
            name: "畅滞销商品",
            route: "/boss-store/stock-inquiry",
            permissions: '18470dd4',
          },
          {
            name: "寄存明细",
            route: "/boss-store/deposit-details",
            permissions: '18470dd4',
          },
        ],
      },
    ],
  },
  /**
   * 数据统计
   */
  {
    icon: "icon-shujuj",
    name: "数据中心",
    permissions: [61, 62, 63, 64, 65],
    children: [
      {
        name: "业务报表",
        range: 2,
        permissions: [61],
        children: [
          {
            name: "业绩明细",
            route: "/boss-store/performance-report",
            permissions: 61,
          },
          {
            name: "财务报表",
            route: "/boss-store/financial-statements",
            permissions: 61,
          },
          {
            name: "办卡列表",
            permissions: 61,
            route: "/boss-store/member-card",
          },
          {
            name: "卡消耗列表",
            permissions: 61,
            route: "/boss-store/client-card-consumption-list",
          },
          {
            name: "还款列表",
            route: "/boss-store/payment-reimbursement",
            permissions: 61,
          },
          {
            name: "续卡明细",
            route: "/boss-store/extend-card-detail",
            permissions: 61,
          },
          {
            name: "赠送列表",
            route: "/boss-store/give-list",
            permissions: 61,
          },
        ],
      },
      {
        name: "员工提成",
        range: 2,
        permissions: [62],
        children: [
          {
            name: "提成汇总",
            route: "/boss-store/performance-summary",
            permissions: 62,
          },
          {
            name: "提成明细",
            route: "/boss-store/commission-detail",
            permissions: 62,
          },
          {
            name: "销售提成",
            route: "/boss-store/commission-set/sellList",
            permissions: 62,
          },
          {
            name: "施工提成",
            route: "/boss-store/commission-set/constructList",
            permissions: 62,
          },
          {
            name: "充值卡提成",
            route: "/boss-store/commission-set/memberList",
            permissions: 62,
          },
          {
            name: "计次卡提成",
            route: "/boss-store/commission-set/countList",
            permissions: 62,
          },
          // {
          //   name: "业绩提成报表",
          //   route: "/boss-store/commission-set/performanceList",
          //   permissions: 63,
          // },
        ],
      },
      {
        name: "营业分析",
        range: 2,
        permissions: [63],
        children: [
          {
            name: "营业总览",
            route: "/boss-store/business-total",
            permissions: 63,
          },

          {
            name: "业务类型分析",
            route: "/boss-store/repair-type",
            permissions: 63,
          },
          // {
          //   name: "服务分类",
          //   route: "/boss-store/service-type",
          //   permissions: 63,
          // },
          // {
          //   name: "服务表现",
          //   route: "/boss-store/performance-detail",
          //   permissions: 63,
          // },
          /**李冯 2019-7-3 */
          {
            name: '项目/产品分析',
            route: '/boss-store/project-product-analysis',
            permissions: 63,
          },
          {
            name: "会员卡分析",
            permissions: 63,
            route: "/boss-store/card-statistics",
          },
          {
            name: "员工分析",
            route: "/boss-store/employee-output",
            permissions: 63,
          },
          {
            name: "客户分析",
            route: "/boss-store/client-analysis",
            permissions: 63,
          },
          // {
          //   name: "结算类型",
          //   permissions: 63,
          //   route: "/boss-store/settlement-type",
          // },

          // {
          //   name: "车辆分析",
          //   route: "/boss-store/arrive-num",
          //   permissions: 63,
          // },
        ],
      },
      {
        name: "其他报表",
        range: 2,
        permissions: [64],
        children: [
          {
            name: "超级权限日志",
            permissions: 65,
            route: "/boss-store/superMissionNode",
          },
        ],
      },
    ],
  },

  // 超级后台-------------------------------------------------------------------------------------------------------------------------------
  {
    name: "管理中心",
    icon: "icon-guanlizhongxin",
    permissions: [79, 81, 82, '1fe723bb', '3403ea6c'], // 修改超级后台需同步修改 pages/login/model   peimissions
    children: [
      {
        name: "管理员",
        range: 2,
        route: "/super-admin/administor",
        permissions: 79,
      },
      {
        name: "角色管理",
        range: 2,
        route: "/super-admin/role",
        permissions: 81,
      },
      {
        name: "品牌商",
        range: 2,
        route: "/super-admin/brand-manage",
        permissions: 82,
      },
      {
        name: "系统通知",
        range: 2,
        route: "/super-admin/systemInformation",
        permissions: '1fe723bb',
      },
      {
        name: "实施管理",
        range: 2,
        route: "/super-admin/implement-monitoring",
        permissions: ['3403ea6c'],
        children: [
          {
            name: "实施监控",
            permissions: '3403ea6c',
            route: "/super-admin/implement-monitoring",
          },
          {
            name: "实施统计",
            permissions: '3403ea6c',
            route: "/super-admin/implement-statistics",
          },
          {
            name: "实施标签",
            permissions: '3403ea6c',
            route: "/super-admin/implement-tag",
          },
        ],
      },
    ],
  },
  {
    name: "意见反馈",
    range: 1,
    icon: "icon-yijianfankui",
    route: "/super-admin/feedback",
    permissions: 82,
  },
]
