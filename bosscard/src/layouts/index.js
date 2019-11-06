import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import withRouter from 'umi/withRouter'
import App from './app'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

export default withRouter((props) => {
  // console.log('allRoutes',props.route.routes)
  return (
    <ConfigProvider locale={zhCN}>
      <App>
        {props.children}
      </App>
    </ConfigProvider>
  )
})
