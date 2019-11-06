import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb } from 'antd'
// import { Link } from 'react-router-dom'
import pathToRegexp from 'path-to-regexp'
import { queryArray, arrayToTree } from 'utils'
import styles from './Layout.less'
import TipsHelpful from './tipsHelpful.js'

const Bread = ({ menu, location, addBreads, resetBreads }) => {
  let permissionRole = JSON.parse(localStorage.getItem('permissionRole')) || []
  let temp = arrayToTree(menu)
  let newMenu = handelMenu(temp)
  function handelMenu(menus) {
    var menu = []
    menus.forEach(e => {
      if(e.permissions){
        const isParentMenu = Array.isArray(e.permissions)
        if(isParentMenu){
          for(let i = 0; i < permissionRole.length; i++){
            if(e.permissions.indexOf(permissionRole[i]) > -1){
              const data = {
                name: e.name,
                route: e.route,
                permissions: e.permissions,
                id: e.id,
                bpid: e.bpid,
                mpid: e.mpid,
              }
              if (e.children) {
                data.children = handelMenu(e.children)
              }
              menu.push(data)
              break
            }
          }
        }else {
          if (permissionRole.indexOf(e.permissions) !== -1) {
            const data = {
              name: e.name,
              route: e.route,
              permissions: e.permissions,
              id: e.id,
              bpid: e.bpid,
              mpid: e.mpid,
            }
            if (e.children) {
              data.children = handelMenu(e.children)
            }
            menu.push(data)
          }
        }
      }else {
        if(e.show && e.show()){
          const data = {
            name: e.name,
            route: e.route,
            id: e.id,
            bpid: e.bpid,
            mpid: e.mpid,
          }
          if (e.children) {
            data.children = handelMenu(e.children)
          }
          menu.push(data)
        }
      }

      // if (permissionRole.indexOf(e.permissions) !== -1) {
      //   let data = {}
      //   data = {
      //     name: e.name,
      //     route: e.route,
      //     permissions: e.permissions,
      //     id: e.id,
      //     bpid: e.bpid,
      //     mpid: e.mpid,
      //   }
      //   if (e.children) {
      //     data.children = e.children
      //   }
      //   menu.push(data)
      // } else if (e.children) {
      //   let data = {
      //     icon: e.icon,
      //     name: e.name,
      //     route: e.route,
      //     id: e.id,
      //     bpid: e.bpid,
      //     mpid: e.mpid,
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

  let curTemp
  const getCurMenu = (menu) => {
    menu.forEach(e => {
      if (e.route && e.route === location.pathname) {
        curTemp = e
      }
      if (e.children) {
        getCurMenu(e.children)
      }
    })
    return curTemp
  }

  // 匹配当前路由
  let pathArray = []
  let current = getCurMenu(newMenu)

  const getPathArray = (item) => {
    if (item) {
      pathArray.unshift(item)
    }
    if (item && item.bpid) {
      getPathArray(queryArray(newMenu, item.bpid, 'id'))
    }
  }
  let paramMap = {}
  if (!current) {
    pathArray.push(newMenu[0] || {
      id: 1,
      icon: 'laptop',
      name: 'Dashboard',
    })
    pathArray.push({
      id: 404,
      name: 'Not Found',
    })
  } else {
    getPathArray(current)

    let keys = []
    let values = pathToRegexp(current.route, keys).exec(location.pathname.replace('#', ''))
    if (keys.length) {
      keys.forEach((currentValue, index) => {
        if (typeof currentValue.name !== 'string') {
          return
        }
        paramMap[currentValue.name] = values[index + 1]
      })
    }
  }
  // 面包屑新增
  if (addBreads && addBreads.title) {
    pathArray.push({
      name: addBreads.title,
      new: true,
    })
  } else {
    if (pathArray[pathArray.length - 1].new) {
      pathArray.splice(0, -1)
    }
  }

  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      // <span>{item.icon
      //   ? <Icon type={item.icon} style={{ marginRight: 4 }} />
      //   : ''}{item.name}</span>
      <span>{item.name}</span>
    )
    return (
      <Breadcrumb.Item key={key}>
        {
          content
        }
        {/* {((pathArray.length - 1) !== key)
          ? <Link to={pathToRegexp.compile(item.route || '')(paramMap) || '#'}>
            {content}
          </Link>
          : content} */}
      </Breadcrumb.Item>
    )
  })

  return (
    <div className={styles.bread} id='breadcrumb'>
      {!resetBreads.breadsName ?
        <Breadcrumb>
          {breads}
        </Breadcrumb>
        :
        <div className={styles.reset_breads}>{resetBreads.breadsName}</div>
      }
      {(current.route === '/boss-store/product' || current.route === '/boss-store/project-store') ? <TipsHelpful route={current.route}></TipsHelpful> : ''}
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array,
  location: PropTypes.object,
}

export default Bread
