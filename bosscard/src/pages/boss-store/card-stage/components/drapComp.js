

import { Component } from 'react'

// 拖拽组件

class dropComponent extends Component{
   constructor(props){
       super(props)
        this.state={
            moveStatus:false,
            top:0,
            left:0,
            isBackAnimation:true,
        }
        this.drop = null
        this.changeIndex = -1 //挂载索引
        this.init = false
        this.moveStrack = [] // 保存运动轨迹
   }
   clickMove=(e)=>{
    e.preventDefault()
    const { drop } = this
    let X = e.clientX - drop.offsetLeft
    let Y = e.clientY  - drop.offsetTop + drop.parentNode.scrollTop
    this.moveStrack = []
    document.onmousemove=(e)=>{
        this.mouseMove(X,Y,e)
    }
   }
   mouseMove=(X,Y,event)=>{  
    let x = event.clientX - X
    let y = event.clientY - Y
    //保存运动轨迹记录
    const { isBackAnimation } = this.state
    if(isBackAnimation){
        let { moveStrack } = this
        moveStrack.unshift({ x , y  }) 
        this.moveStrack = moveStrack
    }
    this.setState({
        left:x,
        top:y,
        moveStatus:true,
    },()=>{
       const { drop } = this
       const { parent } = this.state
       let left = drop.offsetLeft
       if(!this.init){ //初始化宽度
          this.init = true
          this.getInitWidth()
       }
       const indexWidthRange = left + drop.offsetWidth/2
       let changeIndex = Math.floor(indexWidthRange/(parent.offsetWidth / 4))
       changeIndex >=4 ? changeIndex =3 :null
       if(this.changeIndex===changeIndex) return
       else{
            this.changeIndex=changeIndex
        if([0,1,2,3].indexOf(changeIndex)>=0){
            for(let i = 0 ; i < parent.children.length ; i++ ){
                if( i === changeIndex ){
                    parent.children[i].style.backgroundColor = '#FAFAFA'
                }else{
                    parent.children[i].style.backgroundColor = '#fff'
                }
            }
        }
       }
      
    })
   }
   componentDidMount(){
    const { parent , item , index  , i , handCallBack } = this.props
     this.setState({
         parent,item,index,i,handCallBack,
     })
   }
   UNSAFE_componentWillReceiveProps(nextProps){
    
    const { parent , item , index  , i , handCallBack } = nextProps
    this.setState({
        parent,item,index,i,handCallBack,moveStatus:false,left:parent.offsetWidth*index/4+20,
    }) 
   }
   getInitWidth=()=>{
    const { drop } = this
    const { parent } = this.state
    let width = parent.offsetWidth/4-60
    drop.children[0].style.width = width + 'px'
   }
   mouseStop=()=>{
       document.onmousemove = null
       this.init = false
       const { parent ,item ,index,i,handCallBack , isBackAnimation } = this.state
       const { drop } = this
       const {  top  } = this.state
       let left = drop.offsetLeft
       const indexWidthRange = left + drop.offsetWidth/2
       if(!parent) return
       const maxRange = (parent.offsetWidth / 4)*( index + 1 )
       const minPange = (parent.offsetWidth / 4)*( index )
       Array.from(parent.children).forEach(item=>{
        item.style.backgroundColor='#fff'
       })
       if( left < 0 || left > parent.offsetWidth || top < 0 || top > parent.offsetHeight  ){
            isBackAnimation ? 
            this.removeBack()
            :
            this.setState({
                moveStatus:false,
            })
       }else{
          if((indexWidthRange < maxRange && indexWidthRange > minPange) ){
            isBackAnimation ? 
            this.removeBack()
            :
            this.setState({
                moveStatus:false,
            })
          }
          else{  
              const {  everyStage } = this.props
              let changeIndex = Math.floor(indexWidthRange/(parent.offsetWidth / 4))
              changeIndex >=4 ? changeIndex =3 :null
              handCallBack(item,index,changeIndex,i)
              everyStage(-1)
              this.setState({
                moveStatus:false,
              })
          }
       }   
   }
   removeBack = () =>{
    const { moveStrack } = this
    this.timer = setInterval(()=>{
    if(moveStrack.length === 0  ){
        clearInterval(this.timer)
        this.setState({
            moveStatus:false,
        })
        return
    }
        let position = moveStrack.shift()
        this.setState({
            left:position.x,
            top:position.y,
        })
    },10)
   }
   render(){
       const { moveStatus ,left , top } = this.state
       let styleObject = {} 
       if(moveStatus){
           styleObject.position = 'absolute'
           styleObject.left = left + 'px'
           styleObject.top = top + 'px'
           styleObject.height = '56px'
           styleObject.boxShadow = '0px 4px 8px 0px rgba(0, 0, 0, 0.05)'
       }
       return <div  ref={(drop)=>this.drop = drop}   onMouseUp={this.mouseStop}   onMouseDown={ this.clickMove } style={{ ...styleObject  }} >
                 { this.props.children }
             </div>
   }
}

export default dropComponent