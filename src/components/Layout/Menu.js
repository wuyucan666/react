import React, {useState} from "react"
import PropTypes from "prop-types"
import {Menu} from "antd"
import {Link} from "react-router-dom"
import {queryArray, arrayToTree} from "utils"


const {SubMenu} = Menu

const Menus = ({
  siderFold,
  darkTheme,
  navOpenKeys,
  changeOpenKeys,
  menu,
  location,
}) => {
  const [openKeys, changeOpens] = useState(null)
  const giveKey = function (val) {
    if (val.key === '6' || val.key === '5') {
      changeOpenKeys([val.key])
      changeOpens(val.keyPath)
    }
    else {
      changeOpens(null)
    }
  }
  const patchPath = (id) => {
    const pathname = window.location.pathname
    let pathArr = []
    let className = ''
    switch (id) {
      case 6: // 交易中心
        pathArr = [
          '/boss-store/tradingPlatform',
          '/boss-store/speedy-billing',
          '/boss-store/maintain-billing',
          '/boss-store/member-center/business/apply-card',
          '/boss-store/pending-order',
          '/boss-store/member-center/business/number-card/give',
          '/boss-store/member-center/business/extend-card',
          '/boss-store/tradingPlatform/searchClient',
          '/boss-store/member-center/business/customers-import',
        ]
        break
      case 7: // 订单中心
        pathArr = [
          '/boss-store/order',
          '/boss-store/maintain-list/orderAll',
          '/boss-store/maintain-list/blist',
        ]
        break
      default:
        console.log(id)
    }
    if (pathArr.includes(pathname)) {
      className = 'activeMenuTab'
    }
    return className
  }
  let permissionRole = JSON.parse(localStorage.getItem("permissionRole")) || []
  // 生成树状
  let temp = arrayToTree(menu)
  let newMenu = handelMenu(temp)
  handelMenu(newMenu)

  function handelMenu(menus) {
    var menu = []
    menus.forEach((e) => {
      if (e.notShowChildren) {
        e.children = false
      }

      if (e.permissions) {
        const isParentMenu = Array.isArray(e.permissions)
        if (isParentMenu) {
          for (let i = 0; i < permissionRole.length; i++) {
            if (e.permissions.indexOf(permissionRole[i]) > -1) {
              const data = {
                ...e,
                name: e.name,
                route: e.route ? e.route : '',
                permissions: e.permissions,
                id: e.id,
                bpid: e.bpid,
                mpid: e.mpid,
                range: e.range,
                isShow: e.isShow !== -1,
                notShowChildren: e.notShowChildren,
              }
              if (e.children) {
                data.children = handelMenu(e.children)
              }
              menu.push(data)
              break
            }
          }
        } else {
          if (permissionRole.indexOf(e.permissions) !== -1) {
            const data = {
              ...e,
              name: e.name,
              route: e.route ? e.route : '',
              permissions: e.permissions,
              id: e.id,
              bpid: e.bpid,
              mpid: e.mpid,
              range: e.range,
              isShow: e.isShow !== -1,
              notShowChildren: e.notShowChildren,
            }
            if (e.children) {
              data.children = handelMenu(e.children)
            }
            menu.push(data)
          }
        }
      } else {
        if (e.show && e.show()) {
          const data = {
            ...e,
            name: e.name,
            route: e.route ? e.route : '',
            id: e.id,
            bpid: e.bpid,
            mpid: e.mpid,
            range: e.range,
            isShow: e.isShow !== -1,
            notShowChildren: e.notShowChildren,
          }
          if (e.children) {
            data.children = handelMenu(e.children)
          }
          menu.push(data)
        }
      }


      //
      // if (e.permissions && permissionRole.indexOf(e.permissions) !== -1) {
      // // if (e.permissions) {
      //   let data = {}
      //   data = {
      //     name: e.name,
      //     route: e.route ? e.route : "",
      //     permissions: e.permissions,
      //     id: e.id,
      //     bpid: e.bpid,
      //     mpid: e.mpid,
      //     range: e.range,
      //     icon: e.icon,
      //     ...o,
      //   }
      //   if (e.children) {
      //     data.children = e.children
      //   }
      //   menu.push(data)
      // } else if (e.children) {
      //   let data = {
      //     icon: e.icon,
      //     name: e.name,
      //     route: e.route ? e.route : "",
      //     id: e.id,
      //     bpid: e.bpid,
      //     mpid: e.mpid,
      //     range: e.range,
      //     ...o,
      //   }
      //   let children = handelMenu(e.children)
      //   if (children.length) {
      //     data.children = children
      //     menu.push(data)
      //   }
      // }
    })
    return menu
  }

  const levelMap = {}
  // 递归生成菜单
  const getMenus = (menuTreeN, siderFoldN) => {
    return menuTreeN.map((item) => {
      if (item.children) {
        if (item.mpid) {
          levelMap[item.id] = item.mpid
        }
        return (
          <SubMenu
            key={item.id}

            title={
              <span >
                {item.icon && (
                  <span
                    style={{ marginRight: "14px", fontSize: "16px",display:'inline-block',width: "16px", height: "18px" }}
                    className={"iconfont " + item.icon}
                  />
                )}
                <span>{(!siderFoldN || !menu.includes(item)) && item.name}</span>
              </span>
            }
          >
            {item.notShowChildren
              ? null
              : item.children.map((nav) => {
                if (nav.range === 2) {
                  if (nav.route.length === 0) {
                    if (nav.children && nav.children.length ) {
                      return (
                        //二级可点击 有子
                        <Menu.Item key={nav.id} className="menu-second">
                          <Link
                            to={nav.children[0].route}
                            style={siderFoldN ? { width: 10 } : {}}
                          >
                            <span className="iconfont icon-biaodian" />
                            {nav.name}
                          </Link>
                        </Menu.Item>
                      )
                    }
                    return (
                      //二级不可点击
                      <Menu.Item key={nav.id} className="menu-second">
                        <span className="iconfont icon-biaodian" />
                        <span style={{ color: "#666" }}>{nav.name}</span>
                      </Menu.Item>
                    )
                  }
                  return (
                    //二级可点击
                    <Menu.Item key={nav.id} className="menu-second">
                      <Link
                        to={nav.route || "#"}
                        style={siderFoldN ? { width: 10 } : {}}
                      >
                        <span className="iconfont icon-biaodian" />
                        {nav.name}
                      </Link>
                    </Menu.Item>
                  )
                }
                if (nav.range === 3) {
                  if (nav.children && nav.children.length) {
                    return (
                      //三级可点击 有子
                      <Menu.Item key={nav.id} className="menu-third">
                        <Link
                          to={nav.children[0].route}
                          style={siderFoldN ? { width: 10 } : {}}
                        >
                          {nav.name}
                        </Link>
                      </Menu.Item>
                    )
                  }
                  return (
                    <Menu.Item key={nav.id} className="menu-third">
                      <Link
                        to={nav.route || "#"}
                        style={siderFoldN ? { width: 10 } : {}}
                      >
                        {nav.name}
                      </Link>
                    </Menu.Item>
                  )
                }
                return nav
              })}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={item.id} className={patchPath(item.id)}>
          <Link to={item.route || "#"} style={siderFoldN ? { width: 10 } : {}} >
            <span>
                {item.icon && (
                  <span
                    style={{ marginRight: "14px", fontSize: "16px",display:'inline-block',width: "16px", height: "18px"  }}
                    className={"iconfont " + item.icon}
                  />
                )}
              <span>{(!siderFoldN || !menu.includes(item)) && item.name}</span>
           </span>
          </Link>
        </Menu.Item>
      )
    })
  }

  const menuItems = getMenus(newMenu, siderFold)

  // 保持选中
  const getAncestorKeys = (key) => {
    let map = {}
    const getParent = (index) => {
      const result = [String(levelMap[index])]
      if (levelMap[result[0]]) {
        result.unshift(getParent(result[0])[0])
      }
      return result
    }
    for (let index in levelMap) {
      if ({}.hasOwnProperty.call(levelMap, index)) {
        map[index] = getParent(index)
      }
    }
    return map[key] || []
  }

  const onOpenChange = (openKeys) => {
    if (openKeys !== null) {
      changeOpens(null)
    }
    const latestOpenKey = openKeys.find((key) => !navOpenKeys.includes(key))
    const latestCloseKey = navOpenKeys.find((key) => !openKeys.includes(key))
    let nextOpenKeys = []
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey)
    }
    changeOpenKeys(nextOpenKeys)
  }

  let menuProps = !siderFold
    ? {
      onOpenChange,
      openKeys: navOpenKeys,
    }
    : {}

  let curTemp
  const getCurMenu = (menu) => {
    menu.forEach((e) => {
      if (e.route && e.route === location.pathname) {
        curTemp = e
      }
      if (e.children) {
        getCurMenu(e.children)
      }
    })
    return curTemp
  }
  // 寻找选中路由
  let currentMenu = getCurMenu(newMenu)
  let defaultSelectedKeys

  const getPathArray = (array, current, pid, id) => {
    let result = [String(current[id])]
    const getPath = (item) => {
      if (item && item[pid]) {
        if (item[pid] === "-1") {
          result.unshift(String(item["bpid"]))
        } else {
          result.unshift(String(item[pid]))
          getPath(queryArray(array, item[pid], id))
        }
      }
    }
    getPath(current)
    return result
  }
  if (currentMenu) {
    defaultSelectedKeys = getPathArray(newMenu, currentMenu, "mpid", "id")
  }
  if (!defaultSelectedKeys) {
    defaultSelectedKeys = ["1"]
  }

  openKeys && !siderFold ? menuProps.openKeys = openKeys : null

  return (
    <Menu
      {...menuProps}
      mode={siderFold ? "vertical" : "inline"}
      collapsed={siderFold ? siderFold : undefined}
      theme={darkTheme ? "dark" : "light"}
      selectedKeys={defaultSelectedKeys}
      // openKeys={openKeys}
      onClick={giveKey}
    >
      {menuItems}
    </Menu>
  )
}

Menus.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
  location: PropTypes.object,
}

export default Menus
