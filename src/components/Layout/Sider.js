import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch, Popover } from 'antd'
import classnames from 'classnames'
import styles from './Layout.less'
import Menus from './Menu'
import logo from '../../../public/public/logo.png'

const Sider = ({
  siderFold, darkTheme, location, changeTheme, navOpenKeys, changeOpenKeys, menu, isNavbar, switchMenuPopover, menuPopoverVisible, switchSider,
}) => {
  const menusProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  // console.log('sider component', isNavbar)

  return (
    <div>
      <div className={styles.logo}>
        <img alt="logo" src={logo} className={siderFold ? styles.small : ''} />
        {/* {siderFold ? '' : <span>{config.name}</span>} */}
      </div>
      <Menus {...menusProps} />
      <div className={siderFold ? styles.felxBtn2 : styles.felxBtn}>
        {isNavbar
          ? <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...menusProps} />}>
            <div className={styles.button}>
              <Icon type="bars" />
            </div>
          </Popover>
          : <div
            className={styles.button}
          >
            <i></i>
            <Icon type={classnames({ 'menu-unfold': siderFold, 'menu-fold': !siderFold })} onClick={() => (switchSider())} />
          </div>}
      </div>
      {!siderFold ? <div className={styles.switchtheme}>
        <span><Icon type="bulb" />Switch Theme</span>
        <Switch onChange={changeTheme} defaultChecked={darkTheme} checkedChildren="Dark" unCheckedChildren="Light" />
      </div> : ''}
    </div>
  )
}

Sider.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  changeTheme: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Sider
