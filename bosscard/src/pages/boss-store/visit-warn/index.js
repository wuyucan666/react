import React, { Component } from 'react'
import FormTitle from 'components/FormTitle'
import { Switch,Button,Spin,message,Empty } from 'antd'
import styles from './style.less'
import services from '../../../services'
import noneImg from '../../../../public/public/none.png'
import Introduce from "components/IntroduceModal"
import tip1 from "./imgs/tip1.png"

export default class Index extends Component {
  constructor(props){
    super(props)
    this.state={
      data:[
        {
          id:null,
          type:1,
          isDisabled:true,
          values:{
            time:0,
          },
        },
        {
          id:null,
          type:2,
          isDisabled:true,
          values:{
            time:0,
          },
        },
        {
          id:null,
          type:3,
          isDisabled:true,
          values:{
            time:0,
          },
        },
        {
          id:null,
          type:4,
          isDisabled:true,
          values:{
            time:0,
            consume:'',
            lastTimeShop:0,
          },
        },
        {
          id:null,
          type:5,
          isDisabled:true,
          values:{
            time:0,
          },
        },
      ],
      load:false,
    }
  }
  /**
   * 请求自定义提醒列表
   */
  UNSAFE_componentWillMount(){
    var data=this.state.data
    this.setState({
      load:true,
    })
    services.remindList({keys:{name:"setting/remind"}}).then(res=>{
      this.setState({
        load:false,
      })
      if(res.code==='0'){
        res.list.map((item)=>{
          if(item.type===1){
            data.splice(0,1,item)
          }else if(item.type===2){
            data.splice(1,1,item)
          }else if(item.type===3){
            data.splice(2,1,item)
          }else if(item.type===4){
            data.splice(3,1,item)
          }else if(item.type===5){
            data.splice(4,1,item)
          }
        })
        this.setState({
          data,
        })
      }

    })
  }
  /**
   *
   * @param {*} index 下标
   * @param {*} type 类型 switch or input
   * @param {*} num 1,2,3,
   * @param {*} val input value
   * 编辑表单
   */
  onChange(idx,type,num,val){
   var arr=this.state.data
   let index=null
   arr.forEach((item,_index)=>{
     if(item.type===idx){
      index=_index
     }
   })
   console.log('inde',index,type,num,val)
   switch (type) {
     case 'switch':
       arr[index].isDisabled=!num
       break
     case 'input':
     if(num===1){
      arr[index].values.time=Number(val.target.value.replace(/\D/g,''))||0
     }else if(num===2){
      arr[index].values.consume=Number(val.target.value.replace(/\D/g,''))||0
     }else if(num===3){
      arr[index].values.lastTimeShop=Number(val.target.value.replace(/\D/g,''))||0
     }else{
      arr[index].values.time=Number(num.target.value.replace(/\D/g,''))||0
     }
     break
     default:
     break
   }
   this.setState({
     data:arr,
   })
  }
  /**
   * 保存发送
  */
  save(){
    this.setState({
      load:true,
    })
   services.addRemind({data:{remind:this.state.data},keys:{name:"setting/remind"}}).then(res=>{
     this.setState({
       load:false,
     })
     if(res.code==='0'){
      message.success('保存成功!')
     }else{
      message.error('保存失败!')
     }
   })
  }
  render() {
    const {data,load} = this.state
    const row1=data.filter(item=>item.type<4)
    console.log('row1',row1)
    return (
      <Spin tip='Loading...' spinning={load}>
      <div style={{padding:'32px 36px'}}>
        <FormTitle name="回访提醒设置"></FormTitle>
        <div style={{display:'flex'}}>
        {row1.map((item,index)=>{
          if(item.type===1){
            return (<div key={index} className={styles.lyc_set} style={{flex:1,marginRight:'30px'}} >
              <div><span>保险到期提醒</span><Switch onChange={this.onChange.bind(this,item.type,'switch')} checkedChildren="开" unCheckedChildren="关" checked={!item.isDisabled}/></div>
              <div>保险到期前<input type="text" style={{color:item.isDisabled?'#ccc':'',borderColor:!item.isDisabled?'#4aacf7':''}} value={item.values.time} onChange={this.onChange.bind(this,item.type,'input')}></input>天提醒</div>
            </div>)
          }else if(item.type===2){
            return (<div key={index} className={styles.lyc_set} style={{flex:1,marginRight:'30px'}} >
              <div><span>车检(年审)到期提醒</span><Switch onChange={this.onChange.bind(this,item.type,'switch')} checkedChildren="开" unCheckedChildren="关" checked={!item.isDisabled} /></div>
              <div>年审到期前<input  style={{color:item.isDisabled?'#ccc':'',borderColor:!item.isDisabled?'#4aacf7':''}} value={item.values.time} onChange={this.onChange.bind(this,item.type,'input')} type="text"></input>天提醒</div>
            </div>)
          }else if(item.type===3){
          return (<div key={index} className={styles.lyc_set} style={{flex:1}}>
            <div><span>会员卡到期提醒</span><Switch onChange={this.onChange.bind(this,item.type,'switch')} checkedChildren="开" unCheckedChildren="关" checked={!item.isDisabled} /></div>
            <div>会员卡到期前<input style={{color:item.isDisabled?'#ccc':'',borderColor:!item.isDisabled?'#4aacf7':''}} value={item.values.time} onChange={this.onChange.bind(this,item.type,'input')} type="text"></input>天提醒</div>
          </div>)
          }
        })}
        </div>
        {data?data.map((item,index)=>{
          // if(item.type===1){
          //   return (<div key={index} className={styles.lyc_set} >
          //     <div><span>保险到期提醒</span><Switch onChange={this.onChange.bind(this,index,'switch')} checkedChildren="开" unCheckedChildren="关" checked={!item.isDisabled}/></div>
          //     <div>保险到期前<input type="text" style={{color:item.isDisabled?'#ccc':'',borderColor:!item.isDisabled?'#4aacf7':''}} value={item.values.time} onChange={this.onChange.bind(this,index,'input')}></input>天提醒</div>
          //   </div>)
          // }else if(item.type===2){
          //   return (<div key={index} className={styles.lyc_set} >
          //     <div><span>车检(年审)到期提醒</span><Switch onChange={this.onChange.bind(this,index,'switch')} checkedChildren="开" unCheckedChildren="关" checked={!item.isDisabled} /></div>
          //     <div>年审到期前<input  style={{color:item.isDisabled?'#ccc':'',borderColor:!item.isDisabled?'#4aacf7':''}} value={item.values.time} onChange={this.onChange.bind(this,index,'input')} type="text"></input>天提醒</div>
          //   </div>)
          // }else if(item.type===3){
          // return (<div key={index} className={styles.lyc_set} >
          //   <div><span>会员卡到期提醒</span><Switch onChange={this.onChange.bind(this,index,'switch')} checkedChildren="开" unCheckedChildren="关" checked={!item.isDisabled} /></div>
          //   <div>会员卡到期前<input style={{color:item.isDisabled?'#ccc':'',borderColor:!item.isDisabled?'#4aacf7':''}} value={item.values.time} onChange={this.onChange.bind(this,index,'input')} type="text"></input>天提醒</div>
          // </div>)
          // }else 
          if(item.type===4){
           return (<div key={index}><FormTitle name="客户异常提醒设置"></FormTitle>
           <div className={styles.lyc_set} >
              <div><span>客户到店异常提醒</span><Switch onChange={this.onChange.bind(this,item.type,'switch')} checkedChildren="开" unCheckedChildren="关" checked={!item.isDisabled} /></div>
              <div>到店异常后
               <input type="text" style={{color:item.isDisabled?'#ccc':'',borderColor:!item.isDisabled?'#4aacf7':''}} onChange={this.onChange.bind(this,item.type,'input',1)} value={item.values.time}></input>天提醒，<span>到店异常规则：
               </span>累计消费<input style={{color:item.isDisabled?'#ccc':'',borderColor:!item.isDisabled?'#4aacf7':''}} onChange={this.onChange.bind(this,item.type,'input',2)} type="text" value={item.values.consume?item.values.consume:''}></input>（选填）元以上的客户上次到店
               <input type="text" style={{color:item.isDisabled?'#ccc':'',borderColor:!item.isDisabled?'#4aacf7':''}} onChange={this.onChange.bind(this,item.type,'input',3)} value={item.values.lastTimeShop}></input>天以上的客户</div>
            </div></div>)
          }else if(item.type===5){
            return (<div key={index}><FormTitle name="回访逾期设置"></FormTitle>
            <div className={styles.lyc_set} style={{height:'232px'}} >
                <p>施工项目回访，客户到店异常回访，其他回访，如在提示回访后<input style={{color:item.values.time===0?'#ccc':''}} onChange={this.onChange.bind(this,item.type,'input')} type="text" value={item.values.time}></input>天“未回访”，则为逾期；</p>
                <p>车辆保险到期、车检(年审)到期、会员卡到期需提前回访，如果在到期之前“未回访”，则为逾期；</p>
                <p>逾期后可以继续回访但是该回访会保留“逾期”的标记。</p>
             </div></div>)
          }
        }):<Empty
        className='animated bounceIn'
        image={noneImg}
        description={
          <span>
            暂无相关提醒设置
          </span>
        }
      >
    </Empty>}
         {data&&<Button type="primary" style={{width:'120px'}} onClick={this.save.bind(this)}>保存</Button>}
      </div>
        <Introduce
          title='关于回访提醒'
          content={
            [
              {
                special: true,
                title: <div style={{color: '#333',fontWeight: 'bold'}}>什么是回访提醒？</div>,
                content: (
                  <div>
                    <div>1、设置回访提醒项目内容，开启后可对所有会员启用，触发提醒时门店将受到消息通知，便于门店多方面维护客户关系。</div>
                    <div>2、客户异常提醒设置开启后可针对消费额及到店次数异常的客户触发提醒门店，便于门店主动了解客户异常信息及提供帮助</div>
                  </div>
                ),
              },
              {
                special: true,
                title: <div style={{color: '#333',fontWeight: 'bold'}}>如何使用回访提醒？</div>,
                content: (
                  <div>
                    <div style={{marginBottom: 20}}>输入到期提醒天数，并点击开启启用即可实现该项目回访提醒</div>
                    <img src={tip1} alt=""/>
                  </div>
                ),
              },
            ]
          }
        />
      </Spin>
    )
  }
}
