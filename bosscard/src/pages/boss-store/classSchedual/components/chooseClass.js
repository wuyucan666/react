import React  from 'react' 
import style from '../style.less'

const  CC = function(prop){
    const { 
        classList,
        handleBackdata,
        list,
      } = prop
    let newList=[...list]  
    newList.push({
      name:'清除',
      id:null,
    })
    let newClassList=[...classList]
    newClassList.push('清除')
    console.log(classList)
    return <div className={ style.zl_cc_content } >
     {
       newList.map((item,i)=>
       (<div
         key={i} 
         onClick={ ()=> handleBackdata({ type:1 ,value: item.name , id:item.id  })  }//type用于判断返回的对数据的处理方式 } 
         style={{ marginRight:(i+1)%4===0 ? 0 : '22px'  }}
         >
         { item.name }
       </div>))
     }
    </div>
}

export default CC