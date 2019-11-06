import React , { useState , useCallback } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Menu, Icon, Popover, Layout ,Badge, Button  } from 'antd'
import classnames from 'classnames'
import styles from './Header.less'
import Menus from './Menu'
import F from '../functionGuidance'
import M from '../systemMessage'
import DataPageGuide from './DataPageGuide'
import Feedback from './feedback'
import kefuImg from './qr_code.png'

const { SubMenu } = Menu

const Header = ({
  logout,
  switchSider,
  siderFold,
  goFeedback,
  isNavbar,
  menuPopoverVisible,
  feedbackVisible,
  location,
  switchMenuPopover,
  navOpenKeys,
  changeOpenKeys,
  menu,
  isModal,
  changeModal,
  setPassword,
  messageList,
  toshowService,
}) => {
  let handleClickMenu = e => {
    e.key === 'logout' && logout()
    e.key === 'setPassword' && setPassword()
  }
  let goQQ = () => {
    window.open('http://wpa.qq.com/msgrd?v=3&uin=3421208224&site=qq&menu=yes', '_blank', 'height=502, width=644,toolbar=no,scrollbars=no,menubar=no,status=no')
  }
  const [ messageShow , showMessage ] = useState(false)
  const handerShow =useCallback(()=>{
      showMessage(!messageShow)
  },[messageShow])
  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  let day = moment().format('YYYY-MM-DD')
  let days = day + ' 23:59:59'
  let start = moment(day).unix()*1000
  let end = moment(days).unix()*1000
  let newList =messageList.filter(i=>start <= i.time*1000 && i.time*1000 <= end  )
  const setFeedback = function() {
    goFeedback()
  }
  const isShowService = function() {
    toshowService()
  }
  const popoverContent = (
    <ul className={styles.services}>
      <li>
        <span>服务热线</span><br />
        <span>185 6551 3563</span>
      </li>
      <li>
        <span>QQ在线客服</span><br />
        <Button type='primary' size='large' onClick={goQQ}><i className="iconfont icon-qq" />在线客服</Button>
      </li>
      <li className={styles.kefu_day}>
        <span>微信在线客服</span>
        <span>周一~周六</span>
        <span>9:30-12:30  14:00-18:30</span>
        <img src={kefuImg} alt='' />
      </li>
      {window.localStorage.getItem('loginType') !== '2' && <li>
        <span>意见反馈</span><br />
        <Button type='primary' size='large' onClick={goFeedback}>我要提意见</Button>
      </li>}
  </ul>
  )
  return (
    <Layout.Header className={styles.header}>
      {isModal && <F isModal={isModal} changeModal={changeModal} />}
      <div className ={ messageShow ? styles.zl_showMes + '  ' + styles.zl_animate  : styles.zl_showMes} >
        <M list={messageList}  handerShow={handerShow}  />
      </div>
      <div className={styles.hidden}>
        {isNavbar ? (
          <Popover
            placement="bottomLeft"
            onVisibleChange={switchMenuPopover}
            visible={menuPopoverVisible}
            overlayClassName={styles.popovermenu}
            trigger="click"
            content={<Menus {...menusProps} />}
          >
            <div className={styles.button}>
              <Icon type="bars" />
            </div>
          </Popover>
        ) : (
            <div className={styles.button} onClick={switchSider}>
              <Icon type={classnames({ 'menu-unfold': siderFold, 'menu-fold': !siderFold })} />
            </div>
          )}
      </div>
      <span className={styles.leftInfo}>
        <span>{window.localStorage.getItem('loginType') === '1' ? '' : JSON.parse(window.localStorage.getItem('loginInfo')).brandName}</span>
        <span
          style={{
            display: JSON.parse(window.localStorage.getItem('loginInfo')).brandName && JSON.parse(window.localStorage.getItem('loginInfo')).storeName ? '' : 'none',
          }}>-</span>
        <span>{window.localStorage.getItem('loginType') === '3' ? JSON.parse(window.localStorage.getItem('loginInfo')).storeName : ''}</span>
      </span>
      <div className={styles.rightWarpper}>
        <div className={styles.setting}>
          {window.localStorage.getItem('loginType') === '2' ? (
            <div className={styles.setdiv}>
              <i className="iconfont icon-yindao" style={{ marginRight: '5px' }} />
              <span onClick={changeModal}>基础设置助手</span>
            </div>
          ) : null}
        </div>
        {/* {window.localStorage.getItem('loginType') === '2' ? '' : <div className={styles.feedback_btn} onClick={goFeedback}>意见反馈</div>} */}
        <DataPageGuide />
        {/* <div className={styles.button}>
          <i className="iconfont icon-zhuti" />
        </div> */}
        <Popover content={popoverContent}>
          <div className={styles.button} onClick={isShowService}>
            <i className="iconfont icon-kefu1" />
          </div>
        </Popover>
        <div className={styles.button}  onClick={()=>{ showMessage(!messageShow)  }} >
          <Badge count={newList.length}>
            <i className="iconfont icon-xiaoxi"  />
          </Badge>
        </div>
        <div className={styles.person + ' header-right'}>
          <Menu mode="horizontal" onClick={handleClickMenu}>
            <SubMenu
              style={{
                float: 'right',
              }}
              title={
                <div className="flex center">
                  <img
                    className={styles.portrait}
                    src={`${JSON.parse(window.localStorage.getItem('loginInfo'))['img']}`}
                    alt="portrait"
                  />
                  <span>{JSON.parse(window.localStorage.getItem('loginInfo')).name}</span>
                  <span className={styles.rolename} style={{ display: JSON.parse(window.localStorage.getItem('loginInfo')).roleName ? '' : 'none' }}><span>{JSON.parse(window.localStorage.getItem('loginInfo')).roleName}</span></span>
                  <Icon type="down" style={{ color: '#999', fontSize: '9px', margin: '0 8px' }} />
                </div>
              }
            >
              <Menu.Item key="setPassword">修改密码</Menu.Item>
              <Menu.Item key="logout">退出登录</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
        <Feedback feedbackVisible={feedbackVisible} goFeedback={setFeedback}></Feedback>
      </div>
    </Layout.Header>
  )
}
Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  feedbackVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
  goFeedback: PropTypes.func,
  toshowService:PropTypes.func,
  showService:PropTypes.bool,
}

export default Header
