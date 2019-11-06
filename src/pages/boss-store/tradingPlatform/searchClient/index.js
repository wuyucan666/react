import React,{ Component } from 'react'
import { Select  , Tabs  , Spin, Popover } from 'antd'
import style from './style.less'
import router from "umi/router"
import ClientDetail from '../../maintain-list/customerInfor'
import services from "services"
import moment from 'moment'
import img1 from './img/list_none01.png'
// import img2 from './img/list_none02.png'

const Option = Select.Option
const TabPane = Tabs.TabPane



class searchClient extends Component{
   constructor(){
       super()
       this.state={
           dataSource:[],
           value:null,
           brithdayList:[],
           isShowClient:false,
           clientList:[],
           clientId: 0,
           returnNumber:0,
           spinning:false,
       }
       this.page=1
       this.totalPage=1
       this.getBrithday= this.getBrithday.bind(this)
    }

    handleSearch=(value)=>{
      this.page=1
      this.setState({
        dataSource:[],
        value,
      },()=>{
       if(value) this.getClientData(value)
      })
    }
    getClientData=(name,isGetMore)=>{
      const { page } = this
      services.LIST({
        keys : {
          name: 'store/clients',
        },
        data:{
          name,
          q: { page },
        },
      }).then(res=>{
        if(res.success){
            const { list , totalPage } = res
            this.totalPage = totalPage
            let idArr = []
            let dataSource=[]
            let newList
            isGetMore ? newList = [...this.state.dataSource,...list]  : newList = [...list]
            newList
            .forEach(i=>{
              if(idArr.indexOf(i.clientId)<0){
                 idArr.push(i.clientId)
                 dataSource.push(i)
              }
            })
            this.setState({
              dataSource,
            },()=>{
              console.log('0000',this.state.dataSource)
            })
         }
      })
    }
    getMore =()=>{
      const { totalPage , page } = this
      const { value } = this.state
      if(totalPage === page ){
         return
      }else{
        this.page++
        this.getClientData(value,true)
      }
    }
    onSelect=(value)=>{
      this.setState({
        clientId:value,
        isShowClient:true,
      })
    }
    UNSAFE_componentWillMount(){
        this.getClientStage()
        this.getBrithday()
        this.getReturnList()
    }
    getClientStage=()=>{
      this.setState({
         spinning:true,
      },()=>{
        services.clientQuickSearch({ keys: { name: 'client/simple-selector' }, data: {  q:{   where: { mark :1  }  }    }})
        .then(res=>{
           if(res.code==='0'){
            const { list } = res
            this.setState({
              clientList : list,
              spinning:false,
            })
           }
        })
      })
    }
    getReturnList=()=>{
      this.setState({
        spinning:true,
      },()=>{
        services.getReturnTatal()
        .then(res=>{
          if(res.code==='0'){
            const { list } = res
            let returnNumber = 0
            list.forEach(item=>{
               if(item.state===1){
                  returnNumber = item.count
               }
            })
            this.setState({
              returnNumber,
              spinning:false,
            })
          }
        })
      })
    }
    async getBrithday(){
      let brithdayData
      await this.setState({
        spinning : true,
      })
      await  services.brithdayList().then(res=>{
        if(res.success){
           brithdayData = res.list
        }else{
           brithdayData = []
        }
      })
      let now = moment(new Date()).format('YYYY-MM-DD')
      let newBrithdayList = brithdayData.sort((b,a)=>a.birthdaty-b.birthdaty).map(i=>{
          if(moment(i.birthdaty).format('YYYY-MM-DD') === now ){
              return {
                 ...i,
                 birthdaty:moment(i.birthdaty*1000).format('MM.DD'),
                 isToday:true,
              }
          }
          else{
            return{
              ...i,
              birthdaty:moment(i.birthdaty*1000).format('MM.DD'),
              isToday:false,
            }
          }
      })
      this.setState({
        brithdayList:newBrithdayList,
        spinning:false,
      })
    }
    checkClient=(id)=>{
      this.setState({
        clientId:id,
        isShowClient:true,
      })
    }
    addClient=()=>{
       router.push({
        pathname: '/boss-store/client-manage',
        state: {
          showAdd: true,
          currentpath:this.props.location.pathname,
        },
       })
    }
    onBlur=()=>{
      this.setState({
        dataSource:[],
        value:null,
      })
    }
    goRuturn=(url)=>{
        router.push(url)
    }
    sonClick=()=>{
      this.setState({
        isShowClient:false,
        clientId:null,
        dataSource:[],
        value:null,
      })
    }
   render(){
       const { dataSource , value , spinning  , brithdayList , returnNumber , clientList , isShowClient ,clientId  } = this.state
       console.log(dataSource)
       return <div className={style.zl_box} >
                 <Spin spinning={spinning} >
                { isShowClient ?
                 <ClientDetail
                  clientId={ clientId }
                  updateOrder={this.props.updateOrder}
                  goBack={this.sonClick}
                  isRequsetList={false}
                    />
                :
                 <div className={ style.zlContent_one }>
                 <div className={ style.zl_searchClient  } >
                  <Select
                    size='large'
                    style={{ width: 642 , height:42+'px' ,boxShadow:'0 0 12px 0 rgba(153,153,153,0.1)'}}
                    onSelect={this.onSelect}
                    showSearch
                    showArrow={false}
                    placeholder="客户姓名/手机号/车牌号"
                    onSearch={this.handleSearch}
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    value={value ? value : undefined}
                    onBlur={this.onBlur}
                    onPopupScroll={ this.getMore }
                    >
                    {
                      dataSource.map(i=>(<Option key={i.carId} value={i.clientId} ><span style={{ color:'#70C1FF'  }} >{ i.name ? i.name : '散客' }</span><span style={{ float:'right' }} >{ i.phone*1 === 0 ? '散客' : i.phone  }</span> </Option>))
                    }
                    </Select>
                   <div className={ style.zl_about_client } >
                     <span onClick={ this.addClient }   >新建客户</span>
                     <span style={{ float:'right' }} onClick={ this.goRuturn.bind(this,'/boss-store/client-manage') }  >查看全部客户</span>
                   </div>
                 </div>
                 <div className={ style.zl_tab } >
                  <Tabs defaultActiveKey="1" tabBarStyle={{ fontWeight:'bold', width:'550px', marginLeft:'50%',transform:'translateX(-50%)', fontSize:'14px' ,margin:'0 anto' }} >
                    <TabPane
                      tab={(
                          <span>
                             <Popover placement="top" content='计次卡次数＜3次或充值卡余额＜100元的客户' trigger="hover">
                               <i className='iconfont icon-wenhao1' style={{marginRight: 5}}/>
                            </Popover>
                            {`升卡阶段客户(${clientList.length})`}
                          </span>
                      )}
                      key="1">
                       <div className={ style.zl_tab_content } >
                          {
                            clientList.length === 0 ?
                            <div className={style.zl_isnone} >
                                <img src={img1} alt=''  />
                                <p>暂无数据，请<span onClick={ this.getBrithday } >刷新列表</span></p>
                            </div>
                            :
                            <ul style={{textAlign:clientList.length >= 3 ?'left':'center'}}>
                                 {
                               clientList.map((item,i)=>
                               <li onClick={ this.checkClient.bind(this,item.id)}  key={i} > <span></span> { item.client_name }</li>)
                             }
                            </ul>
                          }
                       </div>
                    </TabPane>
                    <TabPane tab={`未来七天生日客户(`+brithdayList.length+')'} key="2">
                       <div className={ style.zl_tab_content } >
                         {
                           brithdayList.length === 0 ?
                           <div className={style.zl_isnone} >
                              <img src={img1} alt=''  />
                              <p>暂无数据，请<span onClick={ this.getBrithday } >刷新列表</span></p>
                           </div>
                           :
                           <ul>
                             {
                               brithdayList.map((item,i)=>
                               <li key={ i }  style={{ backgroundColor:'#FF7C66' }}  onClick={ this.checkClient.bind(this,item.clientId)}   >
                                <span></span>
                                <span>{item.cname}</span>
                                <span>{ item.isToday ? '今天' : item.birthdaty}</span>
                               </li>)
                             }
                           </ul>
                         }
                       </div>
                    </TabPane>
                    <TabPane tab={`待回访客户(${returnNumber})`} key="3">
                      <div className={ style.zl_tab_content } >
                      {
                           <div className={style.zl_isnone} >
                              <img src={img1} alt=''  />
                              <p style={{ marginLeft:'20px' }} >您有{returnNumber}个待回访客户，去<span onClick={ this.goRuturn.bind(this,'/boss-store/return-visit') } >待回访列表</span></p>
                           </div>
                         }
                      </div>
                    </TabPane>
                  </Tabs>
                 </div>
                 {/* {
                   brithdayShow &&
                   <div  className={style.zl_client_brithday} >
                    <ul>
                      {
                        brithdayList.map((i,idx)=><li key={idx}><span  onClick={ this.checkClient.bind(this,i.clientId) }   style={{ color: i.isToday ? '#333' : 'rgba(153,153,153,1)' }}  >{i.cname} {i.birthdaty}</span> </li>)
                      }
                    </ul>
                   </div>
                 } */}
                </div>
                 }
                 </Spin>
              </div>
   }
}

export default searchClient
