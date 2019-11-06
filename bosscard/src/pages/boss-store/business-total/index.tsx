import React, { Component } from 'react'
import { Button } from 'antd';
import Total from './components/total';
import request from 'utils/request';

const styles = require('./index.less')
const moment = require('moment');
const year = moment().get('year')

export default class BusinessTotal extends Component {
  state = {
    years: [year],
    key: year,
  }

  componentDidMount() {
    this.getYears()
  }

  handleTabChange = (key) => {
    this.setState({ key })
  }

  getYears = async () => {
    const res = await request({ url: 'wide-business/marketing/overview/year/list' })
    if (res.code === '0') {
      this.setState({ years: res.data })
    }
  }

  render() {
    return (
      <div className={styles.page}>
        {this.state.years.map(_ => <Button size="large" type={_ === this.state.key ? 'primary' : "default"} key={String(_)} onClick={() => this.handleTabChange(_)} >{_}</Button>)}
        <Total year={this.state.key}></Total>
      </div>
    )
  }
}
