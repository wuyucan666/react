/**
 * Created by kikazheng on 2018/11/30
 */
import React,{Component} from 'react'
import styles from './style.less'
import {Popover,Form,Checkbox} from 'antd'

const FormItem = Form.Item

class Sign extends Component{
  state = {
    data:[
      {
      name:'划痕',
      val:'划痕',
    },{
      name:'破裂',
      val:'破裂',
    },{
      name:'掉漆',
      val:'掉漆',
    },{
      name:'凹陷',
      val:'凹陷',
    },{
      name:'裂纹',
      val:'裂纹',
    },{
      name:'其他',
      val:'其他',
    }],
  }
  render(){
    const {x,y,value} = this.props
    const {data} = this.state
    const { getFieldDecorator } = this.props.form
    const form = (
      <Form>
        {data.map((item,index) => (
          <FormItem key={index} style={{marginBottom:0}}>
            {getFieldDecorator(item.val,{valuePropName: 'checked'})(
              <Checkbox >
                <span>{item.name}</span>
                {/*<span className={styles.letter}>{item.val}</span>*/}
              </Checkbox>
            )}
          </FormItem>
        ))}
      </Form>
    )
    let visibleProp = {}
    if(!value.length){
      visibleProp = {
        visible:true,
      }
    }
    return(
      <div  onClick={e => e.stopPropagation()}>
        <Popover
          {...visibleProp}
          placement="rightTop"
          content={form}
          trigger="click"
          // getPopupContainer={()=>document.querySelector('#car-model')}
        >
         <span
           className={value.length > 0 ? styles.signActive : styles.sign}
           style={{cursor:'pointer',position:'absolute',whiteSpace: 'nowrap',zIndex:1,top:`${y-10}px`,left:`${x-10}px`}}
         >
           {value.length > 0 ? value.join('/') :''}
         </span>
        </Popover>
      </div>
    )
  }
}

export default Form.create({
  onValuesChange:(props, changedValues, allValues) => {
    const arr = []
    for(const i in allValues){
      if(allValues[i]){
        arr.push(i)
      }
    }
    props.onChange(arr)
  },
  mapPropsToFields(props) {
    let obj = {}
    props.value.forEach(item => {
      obj[item] =  Form.createFormField({
        value: true,
      })
    })
    return obj
  },
})(Sign)
