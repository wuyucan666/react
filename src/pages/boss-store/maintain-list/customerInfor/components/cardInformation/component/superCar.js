import { Component } from "react"
import style from "./styles.less"
import { InputNumber, Button, message, Input, Select } from "antd"
import services from "services"

const InputGroup = Input.Group
const Option = Select.Option

export default class superCar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      remainNum: '',
      cardType: -1,
    }
  }
  UNSAFE_componentWillMount() {
    const { dataList, remainNum, cardType } = this.props
    console.log(dataList)
    this.setState({
      dataList:dataList.map(i=>{
          return {
            ...i,
            protoNumber:i.remainNum,
          }
      }),
      remainNum: remainNum*1,
      cardType,
    })
  }
  changeNumber = (index, value) => {
    const { dataList } = this.state
    if(~dataList[index].protoNumber){
      ( value === null ||  value ===undefined || value===''  || value==='~'  ) && (value = dataList[index].protoNumber  )
    }else{
       value==='~' && (value = 1 )
    }
    let newList = dataList.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          remainNum: value >=0 ? Math.floor(value) : -1,
        }
      } else {
        return item
      }
    })
    this.setState({
      dataList: newList,
    },()=>{
    
    })
  }
  submit = () => {
    const { cardId, clientId, showSuper, getData } = this.props
    const {cardType, remainNum} = this.state
    if(cardType === 4 && (!remainNum || remainNum*1 === 0)) {
      return message.info('请输入随意卡总次数！')
    }
    let project = [...this.state.dataList].map(i => {
      return {
        projectId: i.cardRecordId,
        num: i.remainNum,
      }
    })
    let obj = {
      cardId,
      clientId,
      project,
      type: 1,
      cardNum: cardType === 4 ? remainNum : undefined,
    }
    services
      .superPrivilege({
        keys: { name: "store/superPrivilege" },
        data: { ...obj },
      })
      .then(res => {
        if (res.success) {
          message.success("保存成功")
          showSuper(-1)
          getData(true)
        } else {
          message.info(res.message)
        }
      })
  }
  changeRemainNum=(e)=>{
    let remainNum = e.target.value.match(/[\d]*/)[0]
    this.setState({remainNum})
    const { dataList } = this.state
    let arr = []
    for(let i in dataList) {
      if(!remainNum) {
        dataList[i].remainNum = -1
      } else if(dataList[i].remainNum*1 >= remainNum) {
        dataList[i].remainNum = (remainNum*-1)
      }
      arr.push({...dataList[i]})
    }
    this.setState({dataList: arr})
  }
  render() {
    const { dataList, cardType, remainNum } = this.state
    const { showSuper } = this.props
    function showMax (){
       return cardType === 4 ?{ max: (remainNum-1) } : {}
    }
    return (
      <div style={{ paddingBottom: "40px" }}>
        {cardType === 4 && <div style={{lineHeight: '40px', marginBottom: '20px'}}>卡总次数 <Input value={remainNum} onChange={this.changeRemainNum} style={{width: '120px'}} size='large' addonAfter="次" /></div>}
        <div className={style.zl_tableHead}>
          <span>项目</span>
          <span>剩余次数</span>
        </div>
        <ul className={style.zl_tableContent}>
          {dataList.map((item, i) => (
            <li key={i}>
              <span>{item.projectName}</span>
              <div style={{ float: "right", marginRight: "200px", marginTop:'7px' }}>
                <InputGroup compact style={{ width: '220px' }} size="large">
                  <Select  style={{ width: '90px' }} size="large" value={item.remainNum === -1 ? -1 : '~'} onChange={this.changeNumber.bind(this, i)}>
                    <Option value={'~'}>有限</Option>
                    <Option value={-1}>无限</Option>
                  </Select>
                  {item.remainNum !== -1 && <InputNumber
                    onChange={this.changeNumber.bind(this, i)}
                    size="large"
                    min={0}
                    { ...showMax() }
                    style={{ width: "120px", textAlign: "center" }}
                    value={item.remainNum}
                  />}
                </InputGroup>
              </div>
            </li>
          ))}
        </ul>
        <div className={style.zl_buttons}>
          <Button
            onClick={this.submit}
            style={{ position: "absolute", bottom: "0", right: "0" }}
            size="large"
            type="primary"
          >
            确定
          </Button>
          <Button
            onClick={() => showSuper(-1)}
            style={{ position: "absolute", bottom: "0", right: "93px" }}
            size="large"
            type="default"
          >
            取消
          </Button>
        </div>
      </div>
    )
  }
}
