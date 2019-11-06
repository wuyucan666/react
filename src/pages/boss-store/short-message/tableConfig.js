// import styles from './styles.less'
// import {Tag} from 'antd'
import Status from "components/CommonTable/status"
import moment from 'moment'
export default {
  //  hasCheck: false,
    // hasTotal:true,
    // pagination:true,
    // isScroll:false,
    id: "id",
    moreBtn:[
      {
      name: "删除",
      icon: "icon-shanchu",
      type: 11,
      power: "Delete",
      show:(v)=>{
        if(v.state===0){
          return true
        }
      },
    },
    ],
    headers:[
      {
        name: "标题",
        prop: "title",
        width: '10%',
      },
      {
        name: "内容",
        prop: "content",
        width: '30%',
      },
      {
        name: "发送人数",
        prop: "amount",
        width: '10%',
      },
      {
        name: "员工",
        prop: "staffName",
        width: '10%',
      },
      {
        name: "是否发送完毕",
        prop: "state",
        width: '10%',
        render: (c) => {
          return c.state === 2 ? (
            <Status status={true}>是</Status>
          ) : (
            <Status status={false}>否</Status>
          )
        },
      },
      {
        name: "时间",
        prop: "timingSendingTime",
        width: '18%',
        render: (c) => {
          return moment(c.timingSendingTime * 1000).format("YYYY-MM-DD")
        },
      },
    ],
}