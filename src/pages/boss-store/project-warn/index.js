import React, { Component } from 'react'
import { Tabs, Button, Table, Tooltip, Input,Select ,Empty,Icon,message,Spin, Modal} from 'antd'
import styles from './styles.less'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import services from "../../../services"
import noneImg from './images/no_data.jpg'
import AddItem from './components/addItem'
import { async } from 'q';
const Option = Select.Option
function handleChange(value) {
  console.log(`selected ${value}`)
  console.log('this',this.state.data)
}
const TabPane = Tabs.TabPane
let dragingIndex = -1

class Index extends Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      ...restProps
    } = this.props
    const style = { ...restProps.style, cursor: 'move' }

    let className = restProps.className
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' '+styles.dropOverDownward
      }
      if (restProps.index < dragingIndex) {
        className +=' '+styles.dropOverUpward
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr
          {...restProps}
          className={className}
          style={style}
        />
      )
    )
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index
    return {
      index: props.index,
    }
  },
}

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
  },
}

const DragableBodyRow = DropTarget(
  'row',
  rowTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }),
)(
  DragSource(
    'row',
    rowSource,
    (connect) => ({
      connectDragSource: connect.dragSource(),
    }),
  )(Index),
)


class DragSortingTable extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      testdata:'',
      data: [],
      one:[],//分别对应五个状态的数组
      two:[],
      tree:[],
      four:[],
      five:[],
      add:false,
      arrlength:5,
      addItem:[],
      activeIndex:null,
      currentTab:6,
      currentType:6,
      initValue:'',
      current:'1',
      status:false,
      spin:false,
      rowId:'',//标记每行数据的id标识
      isShow: false, // 是否显示查看示例弹窗
    }
    this.isEmpty=this.isEmpty.bind(this)
    this.deteteItem=this.deteteItem.bind(this)
    this.getData=this.getData.bind(this)
  }

  components = {
    body: {
      row: DragableBodyRow,
    },
  }
  componentDidMount(){
    let o = this.props.location.state
    console.log('第一步：是否接收到回访列表跳转过来的参数',o)
    if(o){
      //先获取数据
      this.hasQueryGetData()
      //把路由带过来的参数存档到state里
      this.setState({...o})
      //高亮对应的tab
      switch(Number(o.type)){
        case 6:
        this.setState({
          current: '1',
          currentTab:6,
          currentType:6
        })
        services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:6}}).then(res=>{
          if(res.list.length){
            this.setState({
              status:true,
            })
          }else{
            this.setState({
              status:false,
            })
          }
        })
        break
        case 1:
        this.setState({
          current: '2',
          currentTab:1,
          currentType:1
        })
        services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:1}}).then(res=>{
          if(res.list.length){
            this.setState({
              status:true,
            })
          }else{
            this.setState({
              status:false,
            })
          }
        })
        break
        case 2:
        this.setState({
          current: '3',
          currentTab:2,
          currentType:2
        })
        services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:2}}).then(res=>{
          if(res.list.length){
            this.setState({
              status:true,
            })
          }else{
            this.setState({
              status:false,
            })
          }
        })
        break
        case 4:
        this.setState({
          current: '4',
          currentTab:4,
          currentType:4
        })
        services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:4}}).then(res=>{
          if(res.list.length){
            this.setState({
              status:true,
            })
          }else{
            this.setState({
              status:false,
            })
          }
        })
        break
        case 3:
        this.setState({
          current: '5',
          currentTab:3,
          currentType:3
        })
        services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:3}}).then(res=>{
          if(res.list.length){
            this.setState({
              status:true,
            })
          }else{
            this.setState({
              status:false,
            })
          }
        })
        break
        // 开单回访
        case 7:
        this.setState({
          current: '1',
          currentTab:6,
          currentType:6
        })
        services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:6}}).then(res=>{
          if(res.list.length){
            this.setState({
              status:true,
            })
          }else{
            this.setState({
              status:false,
            })
          }
        })
        break
        default:
        return true
      }
    }else{
      this.getData()
    }
  }
  //如果有路由参数时候，请求数据
  hasQueryGetData(){
    services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:6}}).then(res=>{
      this.setState({
        one:res.list.reverse(),
      })
    })
    services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:1}}).then(res=>{
      this.setState({
        two:res.list.reverse(),
      })
    })
    services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:2}}).then(res=>{
      this.setState({
        tree:res.list.reverse(),
      })
    })
    services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:4}}).then(res=>{
      this.setState({
        four:res.list.reverse(),
      })
    })
    services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:3}}).then(res=>{
      this.setState({
        five:res.list.reverse(),
      })
    })
  }
  //默认请求数据
  getData(){
    services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:6}}).then(res=>{
        this.setState({
          one:res.list.reverse(),
        })
      if(res.list.length){
        this.setState({
          status:true,
        })
      }
    })
    services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:1}}).then(res=>{
      this.setState({
        two:res.list.reverse(),
      })
    })
    services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:2}}).then(res=>{
      this.setState({
        tree:res.list.reverse(),
      })
    })
    services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:4}}).then(res=>{
      this.setState({
        four:res.list.reverse(),
      })
    })
    services.getReturnProject({keys:{name:'returnVisit/item'},data:{type:3}}).then(res=>{
      this.setState({
        five:res.list.reverse(),
      })
    })
  }
  /**
   * 拖拽行
   */
  moveRow = (dragIndex, hoverIndex) => {
    const { one,two,tree,four,five } = this.state
    var type=this.state.currentTab
    var order={}
    switch (Number(type)) {
        case 6:
        order={...one[dragIndex]}
        one[dragIndex].order=one[hoverIndex].order
        one[hoverIndex].order=order.order
        // one[dragIndex].item=one[hoverIndex].item
        // one[dragIndex].score=one[hoverIndex].score
        // one[hoverIndex].item=order.item
        // one[hoverIndex].score=order.score
        one[dragIndex].edit=true
        one[hoverIndex].edit=true
        this.setState({
          one,
        })
          break
          case 1:
          order={...two[dragIndex]}
          two[dragIndex].order=two[hoverIndex].order
          two[hoverIndex].order=order.order
          two[dragIndex].edit=true
          two[hoverIndex].edit=true
          this.setState({
            two,
          })
        break
        case 2:
        order={...tree[dragIndex]}
        tree[dragIndex].order=tree[hoverIndex].order
        tree[hoverIndex].order=order.order
        tree[dragIndex].edit=true
        tree[hoverIndex].edit=true
        this.setState({
          tree,
        })
        break
        case 4:
        order={...four[dragIndex]}
        four[dragIndex].order=four[hoverIndex].order
        four[hoverIndex].order=order.order
        four[dragIndex].edit=true
        four[hoverIndex].edit=true
        this.setState({
          four,
        })
        break
      default:
      order={...five[dragIndex]}
      five[dragIndex].order=five[hoverIndex].order
      five[hoverIndex].order=order.order
      five[dragIndex].edit=true
      five[hoverIndex].edit=true
      this.setState({
        five,
      })
        break
    }
  }
  callback(e) {
    const {one,two,tree,four,five}=this.state
    // console.log(e,one,two,tree,four,five)
    // var commitArr=[...one,...two,...tree,...four,...five]
    // var addArr=commitArr.filter((item)=>{
    //   return item.add
    // })
    // console.log(addArr,'add')
    // addArr.map(item=>{
    //   if(item===undefined||item.score===null||item.item===null){
    //     this.deteteItem(0)
    //   }
    // })
    this.setState({
      status:false,
    })//判断是否有数据，没有数据显示空状态
    this.setState({activeIndex:null,current:e},()=>{
      switch (Number(e)) {
      case 1:
        this.setState({
          currentTab:6,
          currentType:6,
        })
        if(one.length){
          this.setState({
            status:true,
          })
        }
        break
        case 2:
        this.setState({
          currentTab:1,
          currentType:1,
        })
        if(two.length){
          this.setState({
            status:true,
          })
        }
        break
        case 3:
        this.setState({
          currentTab:2,
          currentType:2,
        })
        if(tree.length){
          this.setState({
            status:true,
          })
        }
        break
        case 4:
        this.setState({
          currentTab:4,
          currentType:4,
        })
        if(four.length){
          this.setState({
            status:true,
          })
        }
        break
      default:
      this.setState({
        currentTab:3,
        currentType:3,
      })
      if(five.length){
        this.setState({
          status:true,
        })
      }
        break
    }})
  }
  edit(index,record){
  //  console.log('tab',this.state.currentTab,this.state.currentType)
   this.setState({
     activeIndex:index,
     currentType:record.type,
     initValue:record.item,
     rowId:record.id
   })
   //点击修改记录当前这条数据

  }
  delete(idx,record){
    let that = this
    Modal.confirm({
      title: '您确定要删除吗?',
      content: '',
      okText: '确认',
      cancelText: '取消',
      icon:<div style={{width:'37px',height:'37px',background:'#FF303D',borderRadius:'50%',textAlign:'center',lineHeight:'37px',marginLeft:'177px',marginBottom:'10px'}}><i className='iconfont icon-shanchu' style={{color:'#fff'}}/></div>,
      closable: true,
      centered: true,
      maskClosable: true,
      maskStyle:{
        background:'rgba(0,0,0,0.65)',
      },
      className:'madalDiv',
      onOk () {
        if(record.id){
          services.deteteProject({keys:{name:'/returnVisit/item',id:record.id}}).then((res)=>{
            if(res.code==='0'){
              message.success('删除成功')
              that.deteteItem(idx)
            }else{
              message.error('删除失败')
            }
          })
        }else{
          that.deteteItem(idx)
        }
      },
    })
  }
  /**
   * 删除封装
   */
  deteteItem(idx){
    console.log(idx,'6666666')
    var type=this.state.currentTab
      var arr=[]
      switch (Number(type)) {
          case 6:
          arr=this.state.one
         arr.splice(idx,1)
          this.setState({
            one:arr,
          },()=>{this.isEmpty()})
            break
            case 1:
        arr=this.state.two
        arr.splice(idx,1)
        this.setState({
          two:arr,
        },()=>{this.isEmpty()})
          break
          case 2:
        arr=this.state.tree
        arr.splice(idx,1)
        this.setState({
          tree:arr,
        },()=>{this.isEmpty()})
          break
          case 4:
        arr=this.state.four
        arr.splice(idx,1)
        this.setState({
          four:arr,
        },()=>{this.isEmpty()})
          break
        default:
         arr=this.state.five
         arr.splice(idx,1)
        this.setState({
          five:arr,
        },()=>{this.isEmpty()})
          break
      }
  }
  /**
   *
   * @param {添加项目类型判断} type
   */
  addProject(){
    var type=this.state.currentTab
    var projectType=this.state.currentType
    var arr=[]
    var leng=null
    const {one,two,tree,four,five}=this.state
    var commitArr=[...one,...two,...tree,...four,...five]
    // services.setReturnProject({keys:{name:'returnVisit/item'},data:{items:commitArr}}).then((res)=>{
    //   if(res.code==='0'){
    //     message.success('保存成功')
    //   }else{
    //     message.error('保存失败')
    //   }
    // })
    var isEmpty=true
    var addArr=commitArr.filter((item)=>{
      return item.add
    })
    /**
     * 遍历过滤为添加的项目
     */
    console.log(addArr,'addArr')
    addArr.map((item,index)=>{
      if(item===undefined||item.score===null||item.item===null){
        var type=item.type
        isEmpty=false
        switch (Number(type)) {
          case 6:
          this.setState({
            current:'1',
            currentTab:type,
            currentType:type,
          })
          one.map((val,idxs)=>{
            if(val===undefined||val.score===null||val.item===null){
              this.setState({
                activeIndex:idxs,
              })
            }
          })
          if(one.length){
            this.setState({
              status:true
            })
          }
          break
            case 1:
            this.setState({
              current:'2',
              currentTab:type,
              currentType:type,
            })
            two.map((val,idxs)=>{
              if(val===undefined||val.score===null||val.item===null){
                this.setState({
                  activeIndex:idxs,
                })
              }
            })
            if(two.length){
              this.setState({
                status:true
              })
            }
            break
          case 2:
          this.setState({
            current:'3',
            currentTab:type,
            currentType:type,
          })
          tree.map((val,idxs)=>{
            if(val===undefined||val.score===null||val.item===null){
              this.setState({
                activeIndex:idxs,
              })
            }
          })
          if(tree.length){
            this.setState({
              status:true
            })
          }
          break
          case 4:
          this.setState({
            current:'4',
            currentTab:type,
            currentType:type,
          })
          four.map((val,idxs)=>{
            if(val===undefined||val.score===null||val.item===null){
              this.setState({
                activeIndex:idxs,
              })
            }
          })
          if(four.length){
            this.setState({
              status:true
            })
          }
          break
        case 3:
        this.setState({
          current:'5',
          currentTab:type,
          currentType:type,
        })
        five.map((val,idxs)=>{
          if(val===undefined||val.score===null||val.item===null){
            this.setState({
              activeIndex:idxs,
            })
          }
        })
        if(five.length){
          this.setState({
            status:true
          })
        }
        break
          default:
          return true
      }
      }
    })
    if(isEmpty){
      switch (Number(type)) {
        case 6:
        arr=this.state.one
        leng=arr.length
        arr.push({sequence:null,order:leng+1,score:null,type:projectType ,item:null,add:true})
        this.setState({
          one:arr,
          activeIndex:leng,
        },()=>this.isEmpty())
          break
          case 1:
      arr=this.state.two
      leng=arr.length
      arr.push({sequence:null,order:leng+1,score:null,type:projectType ,item:null,add:true})
      this.setState({
        two:arr,
        activeIndex:leng,
      },()=>this.isEmpty())
        break
        case 2:
      arr=this.state.tree
      leng=arr.length
      arr.push({sequence:null,order:leng+1,score:null,type:projectType ,item:null,add:true})
      this.setState({
        tree:arr,
        activeIndex:leng,
      },()=>this.isEmpty())
        break
        case 4:
      arr=this.state.four
      leng=arr.length
      arr.push({sequence:null,order:leng+1,score:null,type:projectType ,item:null,add:true})
      this.setState({
        four:arr,
        activeIndex:leng,
      },()=>this.isEmpty())
        break
      default:
       arr=this.state.five
       leng=arr.length
      arr.push({sequence:null,order:leng+1,score:null,type:projectType ,item:null,add:true})
      this.setState({
        five:arr,
        activeIndex:leng,
      },()=>this.isEmpty())
        break
    }
    }else{

      var nulltype = addArr[0].type
      if(Number(nulltype)===6){
        message.warn('请先完善施工项目到期-回访项和合格分')
      }else if(Number(nulltype)===1){
        message.warn('请先完善车辆保险到期-回访项和合格分')
      }else if(Number(nulltype)===2){
        message.warn('请先完善车检(年审)到期-回访项和合格分')
      }else if(Number(nulltype)===4){
        message.warn('请先完善客户异常到店-回访项和合格分')
      }else if(Number(nulltype)===3){
        message.warn('请先完善会员卡到期-回访项和合格分')
      }
      // message.warn('请选择合格分或回访项')
    }
  }
  /**
   * 编辑输入框
   * @param {回访项下标} idx
   * @param {*值} v
   */
  onChangeValue(idx,v){
    var type=this.state.currentTab
    var arr=[]
    switch (Number(type)) {
        case 6:
        arr=this.state.one
        arr[idx]['item']=v.target.value
        this.setState({
          one:arr,
        })
          break
          case 1:
      arr=this.state.two
      arr[idx]['item']=v.target.value
      this.setState({
        two:arr,
      })
        break
        case 2:
      arr=this.state.tree
      arr[idx]['item']=v.target.value
      this.setState({
        tree:arr,
      })
        break
        case 4:
      arr=this.state.four
      arr[idx]['item']=v.target.value
      this.setState({
        four:arr,
      })
        break
      default:
       arr=this.state.five
       arr[idx]['item']=v.target.value
      this.setState({
        five:arr,
      })
        break
    }
  }
  /**
   * 编辑选择框
   * @param {编辑分数行下标} idx
   * @param {*编辑的值} s
   */
  onChangeSelect(idx,val){
    var type=this.state.currentTab
    var s=Number(val)
      var arr=[]
      switch (Number(type)) {
        case 6:
        arr=this.state.one
        arr[idx]['score']=s
        this.setState({
          one:arr,
        })
          break
          case 1:
      arr=this.state.two
      arr[idx]['score']=s
      this.setState({
        two:arr,
      })
        break
        case 2:
      arr=this.state.tree
      arr[idx]['score']=s
      this.setState({
        tree:arr,
      })
        break
        case 4:
      arr=this.state.four
      arr[idx]['score']=s
      this.setState({
        four:arr,
      })
        break
      default:
       arr=this.state.five
       arr[idx]['score']=s
      this.setState({
        five:arr,
      })
        break
    }
    }
    /**
     * 判断数据是否为空，空时隐藏按钮显示图片
     */
    isEmpty(){
      var type=this.state.currentTab
      switch (Number(type)) {
        case 6:
        if(this.state.one.length!==0){
          this.setState({
            status:true,
          })
        }else{
          this.setState({
            status:false,
          })
        }
        break
          case 1:
          if(this.state.two.length!==0){
            this.setState({
              status:true,
            })
          }else{
            this.setState({
              status:false,
            })
          }
          break
        case 2:
        if(this.state.tree.length!==0){
          this.setState({
            status:true,
          })
        }else{
          this.setState({
            status:false,
          })
        }
        break
        case 4:
        if(this.state.four.length!==0){
          this.setState({
            status:true,
          })
        }else{
          this.setState({
            status:false,
          })
        }
        break
      case 3:
      if(this.state.five.length!==0){
        this.setState({
          status:true,
        })
      }else{
        this.setState({
          status:false,
        })
      }
      break
        default:
        this.setState({
          status:false,
        })
    }
    }
  /**
   * 保存
   */
  onSave(){
    const {one,two,tree,four,five}=this.state
  var commitArr=[...one,...two,...tree,...four,...five]
  // services.setReturnProject({keys:{name:'returnVisit/item'},data:{items:commitArr}}).then((res)=>{
  //   if(res.code==='0'){
  //     message.success('保存成功')
  //   }else{
  //     message.error('保存失败')
  //   }
  // })
  var isEmpty=true
  var addArr=commitArr.filter((item)=>{
    return item.add
  })
  console.log('add',addArr)
  console.log('commitArr',addArr)

  /**
   * 遍历过滤为添加的项目
   */
  addArr.map((item,index)=>{
    if(item===undefined||item.score===null||item.item===null){
      var type=item.type
      isEmpty=false
      switch (Number(type)) {
        case 6:
        this.setState({
          current:'1',
          currentTab:type,
          currentType:type,
        })
        one.map((val,idxs)=>{
          if(val===undefined||val.score===null||val.item===null){
            this.setState({
              activeIndex:idxs,
            })
          }
        })
        break
          case 1:
          this.setState({
            current:'2',
            currentTab:type,
            currentType:type,
          })
          two.map((val,idxs)=>{
            if(val===undefined||val.score===null||val.item===null){
              this.setState({
                activeIndex:idxs,
              })
            }
          })
          break
        case 2:
        this.setState({
          current:'3',
          currentTab:type,
          currentType:type,
        })
        tree.map((val,idxs)=>{
          if(val===undefined||val.score===null||val.item===null){
            this.setState({
              activeIndex:idxs,
            })
          }
        })
        break
        case 4:
        this.setState({
          current:'4',
          currentTab:type,
          currentType:type,
        })
        four.map((val,idxs)=>{
          if(val===undefined||val.score===null||val.item===null){
            this.setState({
              activeIndex:idxs,
            })
          }
        })
        break
      case 3:
      this.setState({
        current:'5',
        currentTab:type,
        currentType:type,
      })
      five.map((val,idxs)=>{
        if(val===undefined||val.score===null||val.item===null){
          this.setState({
            activeIndex:idxs,
          })
        }
      })
      break
        default:
        return true
    }
    }
  })

    if(isEmpty){
      /**
       * 过滤拖拽过的项目
       */
    var arr=commitArr.filter((item)=>{
        return item.edit
      })
      arr.map((item)=>
      delete item.edit
      )
      if(arr.length||addArr.length){
        this.setState({
          spin:true,
        })
        addArr.map((item,index)=>{
          delete item.add
          addArr[index].item=String(item.item)
          addArr[index].order=Number(item.order)
          addArr[index].sequence=Number(item.sequence)
        })
        services.editReturnProject({keys:{name:'returnVisit/item'},data:{items:[...arr,...addArr]}}).then((res)=>{
        this.setState({
          spin:false,
        })
        if(res.code==='0'){
          message.success('保存成功')
          this.setState({
            activeIndex:null,
          })
          this.getData()
          //保存成功后，如果是路由跳转过来的，我们给它跳回去
          const {currentpath,type,rowData,visitStaff,survey} = this.state
          if(currentpath&&type){
            this.props.history.push({
              pathname: currentpath,
              state: {
                type,
                rowData,
                visitStaff,
                survey
              }
            })
          }
        }else{
          message.error('保存失败')
        }
      })
    }else if(addArr.length===0){
      // 点了编辑后再点保存触发下面代码
      const {rowId,currentType} = this.state

      if(rowId&&currentType){
        switch(currentType*1){
          case 6:
          var reqItem = one.find(v=>v.id*1===rowId*1)
          if(reqItem){
            this.setState({
              spin:true,
            })
            services.deteteProject({keys:{name:'/returnVisit/item',id:rowId}}).then((res)=>{
              if(res.code==='0'){
                delete reqItem.id
                services.editReturnProject({keys:{name:'returnVisit/item'},data:{items:[{...reqItem}]}}).then((res)=>{
                  this.setState({
                    spin:false,
                    activeIndex:null
                  },()=>{
                    this.getData()
                  })
                })
              }
            })
          }
          break;
          case 1:
          var reqItem = two.find(v=>v.id*1===rowId*1)
          if(reqItem){
            this.setState({
              spin:true,
            })
            services.deteteProject({keys:{name:'/returnVisit/item',id:rowId}}).then((res)=>{
              if(res.code==='0'){
                delete reqItem.id
                services.editReturnProject({keys:{name:'returnVisit/item'},data:{items:[{...reqItem}]}}).then((res)=>{
                  this.setState({
                    spin:false,
                    activeIndex:null
                  },()=>{
                    this.getData()
                  })
                })
              }
            })
          }
          break;
          case 2:
          var reqItem = tree.find(v=>v.id*1===rowId*1)
          if(reqItem){
            this.setState({
              spin:true,
            })
            services.deteteProject({keys:{name:'/returnVisit/item',id:rowId}}).then((res)=>{
              if(res.code==='0'){
                delete reqItem.id
                services.editReturnProject({keys:{name:'returnVisit/item'},data:{items:[{...reqItem}]}}).then((res)=>{
                  this.setState({
                    spin:false,
                    activeIndex:null
                  },()=>{
                    this.getData()
                  })
                })
              }
            })
          }
          break;
          case 4:
          var reqItem = four.find(v=>v.id*1===rowId*1)
          if(reqItem){
            this.setState({
              spin:true,
            })
            services.deteteProject({keys:{name:'/returnVisit/item',id:rowId}}).then((res)=>{
              if(res.code==='0'){
                delete reqItem.id
                services.editReturnProject({keys:{name:'returnVisit/item'},data:{items:[{...reqItem}]}}).then((res)=>{
                  this.setState({
                    spin:false,
                    activeIndex:null
                  },()=>{
                    this.getData()
                  })
                })
              }
            })
          }
          break;
          case 3:
          var reqItem = five.find(v=>v.id*1===rowId*1)
          if(reqItem){
            this.setState({
              spin:true,
            })
            services.deteteProject({keys:{name:'/returnVisit/item',id:rowId}}).then((res)=>{
              if(res.code==='0'){
                delete reqItem.id
                services.editReturnProject({keys:{name:'returnVisit/item'},data:{items:[{...reqItem}]}}).then((res)=>{
                  this.setState({
                    spin:false,
                    activeIndex:null
                  },()=>{
                    this.getData()
                  })
                })
              }
            })
          }
          break;
        }
      }
    }

  }else{
    message.warn('请选择合格分或回访项')
  }
  }

  showMadal=()=>{
    this.setState({
      isShow: true
    })
  }

  hideMadal=()=>{
    this.setState({
      isShow: false
    })
  }
  render() {
    const {currentType,currentTab,activeIndex,current}= this.state
    const columns = [{
      title: '排序',
      key:'sequence',
      width: '8%',
      render:()=>{
        return <Tooltip title='可拖动'><Icon type='ordered-list'/></Tooltip>
      },
    }, {
      title: '序号',
      dataIndex: 'order',
      width: '8%',
    }, {
      title: '回访项',
      dataIndex: 'item',
      width: '56%',
      render:(text,record,index)=>{
        if((activeIndex===index)&&(currentTab===currentType)){
         return <Input onChange={this.onChangeValue.bind(this,index)} value={text}></Input>
        }else{
          return <p style={{width: '1100px', wordBreak:'break-all', marginRight:'30px'}}>{text}</p>
          // return text
        }
      },
    },
    {
      title: '合格分',
      dataIndex: 'score',
      width: '28%',
      render: (text,record,index) => {
          if((activeIndex===index)&&(currentTab===currentType)){
           return (<div className={styles.rowbtns}>
            <Select onChange={this.onChangeSelect.bind(this,index)} defaultValue={record.score} style={{ width: '120px' }}>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
          </Select>
            <div className={styles.btnWrap}>
              {/* <Tooltip onClick={this.addProject.bind(this,index,record)} title='添加'>
                <i style={{ marginLeft: "12px" }} className="iconfont icon-tianjia" />
              </Tooltip>
              <Tooltip onClick={this.delete.bind(this,index,record)} title='删除'>
                <i style={{ marginLeft: "12px" }} className="iconfont icon-shanchu" />
              </Tooltip> */}
              <span style={{fontSize:'14px',fontFamily:'MicrosoftYaHei',fontWeight:'400',color:'#FE6060',marginLeft:'8px'}} onClick={this.delete.bind(this,index,record)}>删除</span>
            </div>
          </div>)
          }else{
          return (<div className={styles.rowbtns}>
            <div>{text}</div>
            <div className={styles.btnWrap}>
              {/* {<Tooltip onClick={this.edit.bind(this,index,record)} title='修改'>
                <i style={{ marginLeft: "12px" }} className="iconfont icon-bianji" />
              </Tooltip> }
              <Tooltip onClick={this.delete.bind(this,index,record)} title='删除'>
                <i style={{ marginLeft: "12px" }} className="iconfont icon-shanchu" />
              </Tooltip> */}
              <span style={{fontSize:'14px',fontFamily:'MicrosoftYaHei',fontWeight:'400',color:'#4AACF7'}} onClick={this.edit.bind(this,index,record)}>修改</span>
              <span style={{fontSize:'14px',fontFamily:'MicrosoftYaHei',fontWeight:'400',color:'#FE6060',margin:'0 40px 0 20px'}} onClick={this.delete.bind(this,index,record)}>删除</span>
            </div>
          </div>)
          }
      },
    }]
    const {one,two,tree,four,five,spin} =this.state
    return (
      <Spin spinning={spin}>
      <div className={styles.lyc_projectBox}>
        <Tabs animated={false} defaultActiveKey="1" activeKey={String(current)} onChange={this.callback.bind(this)}>
          <TabPane tab="施工项目到期" key="1" style={{paddingTop:'15px'}}>
          {((this.state.one||[]).length===0)?
          (<div
              className='animated bounceIn'
              style={{position:'realtive',height:'278px'}}
            >
              <img src={noneImg} className={styles.wyc_img}></img>
              <div className={styles.wyc_no_huifang}>暂无相关回访项</div>
              <Button type="primary" onClick={this.addProject.bind(this)} className={styles.wyc_huifang_btn}>添加回访项</Button>
          </div>)
           : <Table
            rowKey={(record,index)=>{
              return index+'one'
            }}
              pagination={false}
              columns={columns}
              dataSource={one}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow,
              })}
            />}
            </TabPane>
          <TabPane style={{paddingTop:'15px'}} tab="车辆保险到期" key="2">{(this.state.two.length===0)?
          (<div
              className='animated bounceIn'
              style={{position:'realtive',height:'278px'}}
            >
              <img src={noneImg} className={styles.wyc_img}></img>
              <div className={styles.wyc_no_huifang}>暂无相关回访项</div>
              <Button type="primary" onClick={this.addProject.bind(this)} className={styles.wyc_huifang_btn}>添加回访项</Button>
          </div>)
          :<Table
             rowKey={(record,index)=>{
              index+'one'
            }}
              pagination={false}
              columns={columns}
              dataSource={two}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow,
              })}
            />}</TabPane>
          <TabPane style={{paddingTop:'15px'}} tab="车检(年审)到期" key="3">{(this.state.tree.length===0)?
          (<div
              className='animated bounceIn'
              style={{position:'realtive',height:'278px'}}
            >
              <img src={noneImg} className={styles.wyc_img}></img>
              <div className={styles.wyc_no_huifang}>暂无相关回访项</div>
              <Button type="primary" onClick={this.addProject.bind(this)} className={styles.wyc_huifang_btn}>添加回访项</Button>
          </div>)
          :<Table
             rowKey={(record,index)=>{
              index+'tree'
            }}
              pagination={false}
              columns={columns}
              dataSource={tree}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow,
              })}
            />}</TabPane>
          <TabPane style={{paddingTop:'15px'}} tab="客户异常到店" key="4">{(this.state.four.length===0)?
          (<div
              className='animated bounceIn'
              style={{position:'realtive',height:'278px'}}
            >
              <img src={noneImg} className={styles.wyc_img}></img>
              <div className={styles.wyc_no_huifang}>暂无相关回访项</div>
              <Button type="primary" onClick={this.addProject.bind(this)} className={styles.wyc_huifang_btn}>添加回访项</Button>
          </div>)
          :<Table
              rowKey={(record,index)=>{
                index+'four'
              }}
              pagination={false}
              columns={columns}
              dataSource={four}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow,
              })}
            />}</TabPane>
          <TabPane style={{paddingTop:'15px'}} tab="会员卡到期" key="5">{(five.length===0)?
          (<div
              className='animated bounceIn'
              style={{position:'realtive',height:'278px'}}
            >
              <img src={noneImg} className={styles.wyc_img}></img>
              <div className={styles.wyc_no_huifang}>暂无相关回访项</div>
              <Button type="primary" onClick={this.addProject.bind(this)} className={styles.wyc_huifang_btn}>添加回访项</Button>
          </div>)
          :<Table
              rowKey={(record,index)=>{
                index+'five'
              }}
              pagination={false}
              columns={columns}
              dataSource={five}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow,
              })}
            />}

          </TabPane>
        </Tabs>
        {this.state.status&&<div>
          <Button onClick={this.addProject.bind(this)} type="dashed" block icon="plus" style={{height:'40px', color: '#4aacf7', borderColor: ' #78B6E8', margin: '20px 0 32px 0' }}>添加回访项</Button>
          <Button disabled={spin} onClick={this.onSave.bind(this)} type="primary" style={{ width: '120px' }}>保存</Button>
          </div>
        }
        <span className={styles.yc_seeExample} onClick={this.showMadal}>查看示例</span>
        {
          this.state.isShow&&
          <div>
            <Modal
              className={styles.yc_modaldiv}
              width="570px"
              centered
              title="回访项填写示例"
              visible={this.state.isShow}
              onCancel={this.hideMadal}
              footer
            >
              <div style={{marginBottom:'20px'}}><span className={styles.yc_dot}>1</span><span className={styles.yc_txt}>将回访过程中需要访问客户的内容条目，填入回访项中，参考内容如下图:</span></div>
              <div className={styles.yc_border}><p>1. 你对完美门店提供的服务总体满意度如何?</p><p>2. 维修后车辆的情况如何?</p></div>
              <div className={styles.yc_titdiv}><div className={styles.yc_tit1}></div><div className={styles.yc_tit2}></div></div>
              <div className={styles.yc_contentDiv}><div className={styles.yc_content}>输入回访内容</div></div>
              <div style={{marginBottom:'32px'}}><span className={styles.yc_dot}>2</span><span className={styles.yc_txt}>为每个回访项设置合格分，满分为5分。</span></div>
            </Modal>
          </div>
        }
      </div>
      </Spin>
    )
  }
}
const Demo = DragDropContext(HTML5Backend)(DragSortingTable)
export default Demo
