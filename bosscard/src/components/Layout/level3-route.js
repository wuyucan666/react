import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Menu} from 'antd'
import {Link} from 'react-router-dom'
import {queryArray, arrayToTree} from 'utils'
import getListNumber from 'utils/getListNumber'
import {connect} from 'dva'


class Level3Route extends Component {

  state = {
    menuItems: [],
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    this.getDefaulMeuns(nextprops)
  }

  UNSAFE_componentWillMount() {
    this.props.dispatch({type: 'app/getSystemMessage'})
    this.getDefaulMeuns(this.props)
  }

  async getDefaulMeuns(props) {
    const {menu, location, customizeNumber} = props
    let permissionRole = JSON.parse(localStorage.getItem('permissionRole')) || []
    let temp = arrayToTree(menu)
    let newMenu = handelMenu(temp)

    function handelMenu(menus) {
      var menu = []
      menus.forEach(e => {
        // let o={}
        // if(e.notShowChildren) o.notShowChildren = e.notShowChildren
        // if(e.showListNum) o.showListNum=e.showListNum

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
                  showListNum: e.showListNum,
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
                showListNum: e.showListNum,
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
              showListNum: e.showListNum,
            }
            if (e.children) {
              data.children = handelMenu(e.children)
            }
            menu.push(data)
          }
        }
        // if (e.permissions && permissionRole.indexOf(e.permissions) !== -1) {
        //   console.log(e,555555555555)
        //   let data = {}
        //   data = {
        //       name: e.name,
        //       route: e.route ? e.route : '',
        //       permissions: e.permissions,
        //       id: e.id,
        //       bpid: e.bpid,
        //       mpid: e.mpid,
        //       range: e.range,
        //       isShow: e.isShow !== -1,
        //       ...o,
        //   }
        //   if (e.children) {
        //     console.log(e,e.children,666666666)
        //     data.children = e.children
        //   }
        //   menu.push(data)
        // } else if (e.children) {
        //     let data = {
        //         icon: e.icon,
        //         name: e.name,
        //         route: e.route ? e.route : '',
        //         id: e.id,
        //         bpid: e.bpid,
        //         mpid: e.mpid,
        //         range: e.range,
        //         isShow: e.isShow !== -1,
        //         ...o,
        //     }
        //     let children = handelMenu(e.children)
        //     if (children.length) {
        //       data.children = children
        //       menu.push(data)
        //     }
        // }
      })
      return menu
    }

    // 获取当前父id
    let curPath = window.localStorage.getItem('curPath')
    const getCur = (menu) => {
      let itemCur
      const find = (menu) => {
        menu.forEach(v => {
          if (v.route === curPath) {
            itemCur = v
          }
          if (v.children) {
            find(v.children)
          }
        })
      }
      find(menu)
      return itemCur
    }
    let now = getCur(newMenu)
    // 寻找选中路由
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
    let currentMenu = getCurMenu(newMenu)

    let defaultSelectedKeys
    const getPathArray = (array, current, pid, id) => {
      let result = [String(current[id])]
      const getPath = (item) => {
        if (item && item[pid]) {
          if (item[pid] === '-1') {
            result.unshift(String(item['bpid']))
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
      defaultSelectedKeys = getPathArray(newMenu, currentMenu, 'mpid', 'id')
    }
    if (!defaultSelectedKeys) {
      defaultSelectedKeys = ['1']
    }

    const getAsyncArray = async (o) => {
      let arr = [], asyncErr = false
      let asyncList = await getListNumber(o.showListNum) || []
      if (asyncList.length === 0) {
        asyncErr = true   //异步请求发生错误 处理错误
      }
      if (o.showListNum === customizeNumber.type) {
        asyncList.splice(customizeNumber.index, 1, customizeNumber.count)
      }
      o.children.forEach((i, n) => {
        if (i.isShow) {
          arr.push(<Menu.Item key={i.id} className='menu-forth'>
            <Link to={i.route || '#'}>
              {i.name}{asyncErr || asyncList[n] === false ? null : '(' + asyncList[n] + ')'}
            </Link>
          </Menu.Item>)
        }
      })
      return arr
    }
    const getMenus = async (menu) => {
      let arr = [], asyncObject, asyncLock = false //异步锁 开启异步操作
      menu.forEach(v => {
        if (v.children) {
          if(v.id === now.bpid && v.showListNum){
            asyncLock = true
            asyncObject = {...v}
          }
          v.children.forEach(j => {
            if (j.children && j.id === now.bpid) {
              if (j.showListNum) {
                asyncLock = true
                asyncObject = {...j}
              }
              else {
                j.children.forEach(k => {
                  if (k.isShow) {
                    arr.push(<Menu.Item key={k.id} className='menu-forth'>
                      <Link to={k.route || '#'}>
                        {k.name}
                      </Link>
                    </Menu.Item>)
                  }
                })
              }
            }
          })
        }
        if (v.notShowChildren) {
          v.children.forEach(j => {
            if (j.bpid === now.bpid) {
              arr.push(<Menu.Item key={j.id} className='menu-forth'>
                <Link to={j.route || '#'}>
                  {j.name}
                </Link>
              </Menu.Item>)
            }
          })
        }
      })
      if (asyncLock) {
        return await getAsyncArray(asyncObject)
      } else {
        return arr
      }
    }
    const menuItems = await getMenus(newMenu)
    this.setState({
      menuItems,
      defaultSelectedKeys,
    })
  }

  render() {
    const {menuItems, defaultSelectedKeys} = this.state
    return (
      <div>
        {
          menuItems.length > 0 &&
          <div style={{borderBottom: menuItems.length > 0 ? '1px solid #ccc' : ''}}>
            <Menu mode="horizontal" selectedKeys={defaultSelectedKeys} style={{marginTop: '32px'}}>
              {menuItems}
            </Menu>
          </div>
        }
      </div>
    )
  }
}

Level3Route.propTypes = {
  menu: PropTypes.array,
}

function mapStateToProps(state) {
  const {customizeNumber} = state.maintianList
  return {customizeNumber}
}

export default connect(mapStateToProps)(Level3Route)
