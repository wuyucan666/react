const host = require("../../host")

module.exports = {
  name: "智联车宝",
  prefix: "bosscard",
  footerText: "赞播智店提供技术支持 © 2018",
  logo: "/public/favicon.ico",
  iconFontJS: "",
  CORS: [],
  openPages: ["/login"],
  apiPrefix: "/api",
  api: {
    domain: host || process.env.API_DOMAIM,
    // domain: "http://api.zanbogroup.com",
    img: "/file/getimg/",
  },
  /** 不需要初始样式的页面 */
  dontNeedBackgroundPages: [
    "/boss-store/index",
    "/boss-brand/index",
    "/boss-store/member-center/business/up-card",
    "/boss-store/member-center/business/customers-import",
    "/boss-store/member-center/business/number-card",
    "/boss-store/member-center/business/apply-card",
    "/boss-store/member-center/business/number-card/give",
    "/boss-store/maintain-billing",
    "/boss-store/speedy-billing",
    "/boss-store/plan",
    "/boss-store/member-center/business/extend-card",
    "/boss-brand/role",
    "/boss-store/role",
  ],
}
