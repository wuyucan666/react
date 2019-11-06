/**
 * Created by kikazheng on 2018/12/5
 */
import React,{Component} from 'react'
import {Table} from 'antd'
import moment from 'moment'

const { Column } = Table

class Package extends Component{
  render(){
    const {data} = this.props
    return(
      <div >
        <Table
          dataSource={data}
          rowKey={record => record.id}
          pagination={false}
        >
          <Column
            title="项目/产品名称"
            dataIndex="name"
            key="name"
            align='left'
          />
          <Column
            title="卡名称"
            dataIndex="packageName"
            key="packageName"
            align='left'
          />
          <Column
            title="消费"
            dataIndex="consume"
            key="consume"
            align='left'
          />
          <Column
            title="剩余"
            dataIndex="residue"
            key="residue"
            align='left'
            render={(text) => text > -1 ? text : '无限'}
          />
          <Column
            title="有效期"
            dataIndex="expireTime"
            key="expireTime"
            align='left'
            render={(text) => text > 0 ? moment(text * 1000).format('YYYY-MM-DD') : '无期限'}
          />
        </Table>
      </div>
    )
  }
}

export default Package
