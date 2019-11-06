/**
 * 筛选组件
 * 2018-12-24
 * domen
 */
import React, { PureComponent } from 'react'
import { Tooltip, Input, Button, Form, Select, Checkbox, DatePicker, Cascader, Row, Col } from 'antd'
import style from './screen.less'
import { connect } from 'dva'

const moment = require('moment')

class Screen extends PureComponent {
  state = {
    showMore: false,
  };

  componentDidMount() {
    /**当存在筛选配置项时，立即请求表格数据 */
    if (this.props.config.query || this.props.config.rules) {
      this.props.dispatch({
        type: 'table/getTableConfig',
        payload: this.props.name,
      })

      let order = {}

      if (this.props.config.order) {
        for (let key in this.props.config.order) {
          order[key] = this.props.config.order[key] === 'ascend' ? 2 : 1
        }
      }

      this.props.dispatch({
        type: 'table/setPageData',
        payload: {
          page: 1,
          limit: 10,
          total: 0,
          order,
          where: this.props.config.query || {},
        },
      })
      this.handleSubmit()
    }
  }

  /**筛选条件重置时 */
  hanldeReset = async () => {
    const config = this.props.config
    this.props.form.resetFields()
    const fromData = this.props.form.getFieldsValue()
    const query = await this.props.onReSet()
    this.props.onSearch(fromData, config.rules, JSON.stringify(query) !== '{}' ? query : config.query)
  };

  /**筛选表单开始查询 */
  handleSubmit = () => {
    const config = this.props.config
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSearch(values, config.rules, config.query)
      }
    })
  };

  render() {
    const { moreBtn = [], rules = [] } = this.props.config
    const { getFieldDecorator } = this.props.form
    let showRules = [...rules] // 用来显示的规则数组

    // 每一个查询node栅格宽度
    let colSpan = 8

    const FormItem = Form.Item
    const Option = Select.Option
    const { RangePicker, MonthPicker } = DatePicker

    const btns = moreBtn.map(_ => {
      if (_.hasOwnProperty('show')) {
        if (_.show()) {
          return (
            <Tooltip key={_.type} overlayClassName={style.tooltip} placement="topRight" title={_.tooltip ? _.tooltip : undefined}>
              <Button
                size="large"
                key={_.type}
                onClick={() => this.props.tableChange(_.type)}
                className="screen-more-top-btn"
                type="primary"
              >
                {_.btnName ? _.btnName : _.name}
              </Button>
            </Tooltip>
          )
        } else {
          return null
        }
      } else {
        return (
          <Tooltip key={_.type} overlayClassName={style.tooltip} placement="topRight" title={_.tooltip ? _.tooltip : undefined}>
            <Button
              size="large"
              key={_.type}
              onClick={() => this.props.tableChange(_.type)}
              className="screen-more-top-btn"
              type="primary"
            >
              {_.btnName ? _.btnName : _.name}
            </Button>
          </Tooltip>
        )
      }
    })

    let colShowNum = 0
    showRules.forEach(_ => {
      colShowNum += _.type === 'date<>' || _.converWidth === 2 ? 2 : 1
      _.colShowNum = colShowNum
    })

    /**当筛选项少于3个，加入提交按钮组 */
    if (colShowNum < 24 / colSpan && colShowNum > 0) {
      showRules.push({
        type: 'submit-btn',
        colShowNum: 3,
      })
    }

    return (
      <div className={style.wrap + ' flex'}>
        {!!showRules.length ? (
          <div className="flex item">
            <Form className="screen-container">
              <Row gutter={24}>
                {showRules.map(
                  (_, index) =>
                    (
                      <Col
                        key={index}
                        style={{ display: this.state.showMore || _.colShowNum <= 24 / colSpan ? 'block' : 'none' }}
                        span={
                          _.type === 'date<>' || _.converWidth === 2 ? colSpan * 2 : colSpan
                        }
                      >
                        <FormItem
                          className={'item ' + (_.type === 'date<>' ? 'date-wrap' : _.type)}
                          key={index}
                        >
                          {_.type === 'text' && (
                            <div className="flex center">
                              {_.label && (
                                <span className="label">{_.label}</span>
                              )}
                              {getFieldDecorator("text", {
                                initialValue: _.defaultValue || _.value,
                              })(
                                <Input
                                  prefix={
                                    !_.label && (
                                      <i className="iconfont icon-chazhao" />
                                    )
                                  }
                                  type="search"
                                  size="large"
                                  placeholder={_.placeholder}
                                />
                              )}
                            </div>
                          )}
                          {_.type === 'text-cell' && (
                            <div className="flex center">
                              {_.label && <span className="label">{_.label}</span>}
                              {getFieldDecorator(_.prop, {
                                initialValue: _.defaultValue || _.value,
                              })(
                                <Input
                                  prefix={
                                    !_.label && (
                                      <i className="iconfont icon-chazhao" />
                                    )
                                  }
                                  type="search"
                                  size="large"
                                  placeholder={_.placeholder}
                                />
                              )}
                            </div>
                          )}

                          {_.type === 'list' && (
                            <div className="flex center">
                              <span className="label">{_.label}</span>
                              {getFieldDecorator(_.prop, {
                                initialValue: _.defaultValue || _.value,
                              })(
                                <Select
                                  size="large"
                                  placeholder={_.placeholder || "请选择"}
                                  mode={_.mode || ''}
                                  onChange={(val) => _.onChange && _.onChange(val, this.props.form.setFieldsValue)}
                                >
                                  {_.list.map((_) => (
                                    <Option key={_.value} value={_.value}>
                                      {_.name}
                                    </Option>
                                  ))}
                                </Select>
                              )}
                            </div>
                          )}
                          {_.type === 'check' &&
                            getFieldDecorator(_.prop, {
                              initialValue: _.defaultValue,
                              valuePropName: 'checked',
                            })(<Checkbox>{_.label}</Checkbox>)}
                          {_.type === 'date<>' && (
                            <div className="flex center">
                              {_.label && <span className="label">{_.label}</span>}
                              {getFieldDecorator(_.prop, {
                                initialValue: _.defaultValue,
                              })(
                                <RangePicker
                                  size="large"
                                  ranges={{
                                    本月: [
                                      moment().startOf('month'),
                                      moment().endOf('month'),
                                    ],
                                    上月: [
                                      moment()
                                        .subtract(1, 'month')
                                        .startOf('month'),
                                      moment()
                                        .subtract(1, 'month')
                                        .endOf('month'),
                                    ],
                                  }}
                                >
                                  {_.label}
                                </RangePicker>
                              )}
                            </div>
                          )}
                          {_.type === 'date' && (
                            <div className="flex center">
                              <span className="label">{_.label}</span>
                              {getFieldDecorator(_.prop, {
                                initialValue: _.defaultValue || _.value,
                              })(
                                <DatePicker size="large" disabledDate={_.disabledDate}>{_.label}</DatePicker>
                              )}
                            </div>
                          )}
                          {_.type === 'month' && (
                            <div className="flex center">
                              <span className="label">{_.label}</span>
                              {getFieldDecorator(_.prop, {
                                initialValue: _.defaultValue || _.value,
                              })(
                                <MonthPicker size="large" disabledDate={_.disabledDate}>
                                  {_.label}
                                </MonthPicker>
                              )}
                            </div>
                          )}
                          {_.type === 'component' && _.component}
                          {_.type === 'tree' && (
                            <div className="flex center">
                              <span className="label">{_.label}</span>
                              {getFieldDecorator(_.prop, {
                                initialValue: _.defaultValue || _.value,
                              })(
                                <Cascader
                                  size="large"
                                  allowClear={true}
                                  placeholder="请选择分类"
                                  options={_.list}
                                  expandTrigger="hover"
                                />
                              )}
                            </div>
                          )}
                          {_.type === 'block' && <div />}
                          {_.type === 'submit-btn' && (
                            <div className="submit-btns">
                              <Button
                                size="large"
                                type="primary"
                                onClick={this.handleSubmit}
                              >
                                查询
															</Button>
                              <Button size="large" onClick={this.hanldeReset}>
                                重置
															</Button>
                            </div>
                          )}
                        </FormItem>
                      </Col>
                    )
                )}
              </Row>
            </Form>
            <div
              className="submit-btns"
              style={{ visibility: colShowNum > 24 / colSpan - 1 ? 'visible' : 'hidden' }}
            >
              <Button size="large" type="primary" onClick={this.handleSubmit}>
                查询
							</Button>
              <Button size="large" onClick={this.hanldeReset}>
                重置
							</Button>
            </div>
            {colShowNum > 24 / colSpan && (
              <div
                className="show-more"
                onClick={() => this.setState({ showMore: !this.state.showMore })}
              >
                <div>{this.state.showMore ? '精简' : '更多'}筛选条件</div>
                {this.state.showMore ? (
                  <i className="iconfont icon-shouqi" />
                ) : (
                    <i className="iconfont icon-zhankai" />
                  )}
              </div>
            )}
          </div>
        ) : (
            <div className="item">&nbsp;</div>
          )}
        {!!btns.length && <div className="btns">{btns}</div>}
        <div className="more-content">{this.props.config.moreContent}</div>
      </div>
    )
  }
}

export default connect()(Form.create()(Screen))
