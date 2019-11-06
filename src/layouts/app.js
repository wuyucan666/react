/* global window */
/* global document */
import React from 'react'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
// import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { Loader, MyLayout } from 'components'
// import { hashHistory } from 'react-router'
import { BackTop, Layout, message } from 'antd'
import { classnames, config } from 'utils'
import { Helmet } from 'react-helmet'
import { withRouter } from 'dva/router'
import Error from '../pages/404'
import 'themes/index.less'
import './app.less'

import API from '../services'

window.API = API

console.log('-------加载样式----------')

// const { Content, Footer, Sider } = Layout
const { Content, Sider } = Layout
const { Header, Bread, styles, Level3Route, ResetPassword } = MyLayout
const { prefix, openPages } = config

let lastHref

const App = ({ children, dispatch, app, loading, location }) => {
  const { user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys, menu, addBreads, isModal, messageList, feedbackVisible, showService, resetBreads } = app
  let { pathname } = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { logo } = config
  // const current = menu.filter(item => pathToRegexp(item.route || '').exec(pathname))
  const hasPermission = true
  const { href } = window.location

  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }
  const headerProps = {
    menu,
    user,
    location,
    siderFold,
    isNavbar,
    menuPopoverVisible,
    feedbackVisible,
    navOpenKeys,
    isModal,
    showService,
    goFeedback() {
      dispatch({ type: 'app/goFeedback' })
    },
    toshowService() {
      dispatch({ type: 'app/toshowService' })
    },
    messageList,
    switchMenuPopover() {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout() {
      dispatch({ type: 'app/logout' })
    },
    setPassword() {
      dispatch({ type: 'app/showSetPassword', payload: true })
    },
    switchSider() {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys(openKeys) {
      dispatch({
        type: 'app/handleNavOpenKeys',
        payload: { navOpenKeys: openKeys },
      })
    },
    changeModal() {
      dispatch({ type: 'app/changeModal' })
    },
  }

  const siderProps = {
    menu,
    location,
    siderFold,
    darkTheme,
    navOpenKeys,
    isNavbar,
    menuPopoverVisible,
    changeTheme() {
      dispatch({ type: 'app/switchTheme' })
    },
    switchMenuPopover() {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    switchSider() {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys(openKeys) {
      window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({
        type: 'app/handleNavOpenKeys',
        payload: { navOpenKeys: openKeys },
      })
    },
  }

  const breadProps = {
    menu,
    location,
    addBreads,
    resetBreads
  }

  if (openPages && openPages.includes(pathname)) {
    return (
      <div>
        <Loader fullScreen />
        {children}
      </div>
    )
  }

  // 全局message配置
  message.config({
    duration: 2,
    maxCount: 2,
  })

  return (
    <div>
      <Loader fullScreen />
      <Helmet>
        <title>智联车宝</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {/*{iconFontJS && <script src={iconFontJS} />}*/}
        {/*{iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}*/}
      </Helmet>
      <Layout
        className={classnames({
          [styles.dark]: darkTheme,
          [styles.light]: !darkTheme,
        })}
      >
        <Sider trigger={null} collapsible collapsed={siderFold}>
          {siderProps.menu.length === 0 ? null : <MyLayout.Sider {...siderProps} />}
        </Sider>
        <Layout style={{ height: '100vh' }} id="mainContainer">
          <BackTop target={() => document.querySelector('.ant-layout-content')} />
          <Header {...headerProps} />
          <Content>
            <Bread {...breadProps} />
            <Level3Route menu={menu} location={location} />
            <div className="contentData" style={app.contentStyle}>
              {hasPermission ? children : <Error />}
            </div>
          </Content>
          {/*<Footer>
            {config.footerText}
          </Footer>*/}
        </Layout>
      </Layout>
      <ResetPassword />
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App))
