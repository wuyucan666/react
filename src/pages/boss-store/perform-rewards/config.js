import moment from 'moment'
import style from './style.less'

const headers = [
  {
    name: '员工',
    prop: 'staffName',
    width: '10%',
  },
  {
    name: '状态',
    prop: 'status',
    width: '10%',
    render(text) {
      // console.log(33333 ,text)
      return <div>
        {
          text.status === 0 ?
          <span className="radio-red">停用</span>
          :
          <span className="radio-green">启用</span>
        }
      </div>
    },
  },
  {
    name: '提成类型',
    prop: 'type',
    width: '10%',
    render(record) {
      return (
        <div>
          {
            record.type === 0 ?
            <div style={{color: '#FF4646'}}>未设置</div>
            :
            (record.type === 1 ? '固定提成' : '销售比例提成')
          }
        </div>
      )
    },
  },
  {
    name: '业绩范围',
    prop: 'list',
    width: '17%',
    className: 'table-padding0',
    render(record) {
      return (
        <div>
          {
            record.type === 0 ?
            <div style={{color: '#FF4646'}}>未设置</div>
            :
            record.list && record.list.map((v,i) => {
              return <div className={style.rowItem} key={i}>{v.min}≤个人业绩＜{v.max}</div>
            })
          }
        </div>
      )
    },
  },
  {
    name: '提成',
    prop: 'temp1',
    width: '17%',
    className: 'table-padding0',
    render(record) {
      return(
        <div>
          {
            record.type === 0 ?
            <div style={{color: '#FF4646'}}>未设置</div>
            :
            record.list && record.list.map((v,i) => {
              return (
                <div key={i} className={style.rowItem2}>{v.commission}{record.type === 1 ? '元' : '%'}</div>
              )
            })
          }
        </div>
      )
    },
  },
  {
    name: '更新时间',
    prop: 'updated',
    width: '16%',
    render(record) {
      return <div>
        {
          record.type === 0 ?
          <span>--</span> :
          moment(record.updated* 1000).format('YYYY-MM-DD')
        }
      </div>
    },
  },
]

const config = {
  id: 'id',
  headers,
  hasCheck: true,
  hidePagenation: true,
}

export default config
