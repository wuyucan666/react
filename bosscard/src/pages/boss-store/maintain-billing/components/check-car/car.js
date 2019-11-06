/**
 * Created by kikazheng on 2018/11/29
 */
import React, { Component } from "react"
import clonedeep from 'lodash.clonedeep'
import styles from "./style.less"
import {Modal, Input, Upload, Icon, message, Button} from "antd"
import cheyou from "../images/cheyou.png"
import chezuo from "../images/chezuo.png"
import chetou from "../images/chetou.png"
import chewei from "../images/chewei.png"
import cheding from "../images/cheding.png"
import Sign from "./sign"
import {feature as cacheFeature, goods as cacheGoods} from "../../cacheData"
import nUploadImg from '../../../../../utils/nUploadImg'


class Car extends Component {
  state = {
    type: "feature",
    value: "",
    visible: false,
    previewVisible: false,
    previewImage: "",
    featureSource: [], //功能确认
    goodsSource: [], //物品确认
    car: [],
    fileList: [],
    remark: '',
  }

  componentDidMount() {
    document.addEventListener("click", this.watchClick)
    this.initData()
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.watchClick)
  }

  initData = () => {
    const {feature, goods, car, fileList, remark} = this.props.checkCar
    const featureSource = cacheFeature.map(item => ({...item}))
    const goodsSource = cacheGoods.map(item => ({ ...item }))
    feature.forEach(item => {
      const index = featureSource.findIndex(item2 => item2.index === item.index)
      if (index > -1) {
        featureSource[index] = {
          ...featureSource[index],
          checked: true,
        }
      } else {
        featureSource.push({
          index: featureSource.length + 1,
          text: item.text,
          checked: true,
          defined: true,
        })
      }
    })
    goods.forEach(item => {
      const index = goodsSource.findIndex(item2 => item2.index === item.index)
      if (index > -1) {
        goodsSource[index] = {
          ...goodsSource[index],
          checked: true,
        }
      } else {
        goodsSource.push({
          index: goodsSource.length + 1,
          text: item.text,
          checked: true,
          defined: true,
        })
      }
    })
    const car2 = clonedeep(car)
    car2.forEach(item => {
      this.calculate(item)
    })
    this.setState({
      featureSource,
      goodsSource,
      car: car2,
      fileList: clonedeep(fileList),
      remark,
    })
  }

  watchClick = e => {
    if ((typeof e.target.className !== 'string') || ( typeof e.target.className === 'string' && e.target.className.indexOf("car") === -1)) {
      // const {dispatch, checkCar} = this.props
      const car = [...this.state.car]
      if (car.length) {
        car.forEach((item, index) => {
          if (!item.value.length) {
            car.splice(index, 1)
          }
        })
        this.setState({car})
        // dispatch({
        //   type: "maintainBilling/setCheckCar",
        //   payload: {
        //     car,
        //   },
        // })
      }
    }
  }
  setCheckCar = (property, source) => {
    const {dispatch} = this.props
    switch (property) {
      case "featureSource":
        dispatch({
          type: "maintainBilling/setCheckCar",
          payload: {
            feature: source
              .filter(item => item.checked)
              .map(item => ({
                index: item.index,
                text: item.text,
                defined: item.defined,
              })),
          },
        })
        break
      case "goodsSource":
        dispatch({
          type: "maintainBilling/setCheckCar",
          payload: {
            goods: source
              .filter(item => item.checked)
              .map(item => ({
                index: item.index,
                text: item.text,
                defined: item.defined,
              })),
          },
        })
        break
      default:
        console.log(property)
    }
  }
  changeSource = (property, index, defined) => {
    if (!defined) {
      const source = this.state[property]
      const dIndex = source.findIndex(item => item.index === index)
      const checked = source[dIndex].checked
      source[dIndex].checked = !checked
      this.setState({[property]: source})
      // this.setCheckCar(property, source)
    }
  }
  delSource = (property, index) => {
    const source = this.state[property]
    const dIndex = source.findIndex(item => item.index === index)
    source.splice(dIndex, 1)
    this.setState({[property]: source})
    // this.setCheckCar(property, source)
  }
  showModal = type => {
    this.setState({
      type,
      visible: true,
    })
  }
  hideModal = () => {
    this.setState({
      value: "",
      visible: false,
    })
  }
  handleOk = () => {
    // const {dispatch} = this.props
    const {featureSource, goodsSource} = this.state
    const {type, value} = this.state
    if (!value || (value && !value.trim().length)) {
      this.setState({
        visible: false,
      })
      return false
    }
    if (type === "feature") {
      const obj = {
        index: featureSource.length + 1,
        icon: "",
        text: value,
        checked: true,
        defined: true,
      }
      featureSource.push(obj)
      // dispatch({
      //   type: "maintainBilling/setCheckCar",
      //   payload: {
      //     feature: featureSource
      //       .filter(item => item.checked)
      //       .map(item => ({
      //         index: item.index,
      //         text: item.text,
      //         defined: item.defined,
      //       })),
      //   },
      // })
      this.setState({
        visible: false,
        value: "",
        featureSource,
      })
    } else {
      const obj = {
        index: goodsSource.length + 1,
        text: value,
        checked: true,
        defined: true,
      }
      goodsSource.push(obj)
      // dispatch({
      //   type: "maintainBilling/setCheckCar",
      //   payload: {
          // goods: goodsSource
          //   .filter(item => item.checked)
          //   .map(item => ({
          //     index: item.index,
          //     text: item.text,
          //     defined: item.defined,
          //   })),
      //   },
      // })
      this.setState({
        visible: false,
        value: "",
        goodsSource,
      })
    }
  }
  handleCancel = () => this.setState({previewVisible: false})
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }
  getPositionTop = ele => {
    let top = ele.offsetTop
    let parent = ele.offsetParent
    while (parent != null) {
      top += parent.offsetTop + parent.clientTop
      parent = parent.offsetParent
    }
    return top
  }
  getPositionLeft = ele => {
    let left = ele.offsetLeft
    let parent = ele.offsetParent
    while (parent != null) {
      left += parent.offsetLeft + parent.clientLeft
      parent = parent.offsetParent
    }
    return left
  }
  addSign = (position, e) => {
    let width = 0
    switch (position) {
      case 1:
        width = 437
        break
      case 2:
        width = 437
        break
      case 3:
        width = 184
        break
      case 4:
        width = 189
        break
      case 5:
        width = 189
        break
      default:
        console.log(position)
    }
    // 计算相对位置
    const x =
      e.clientX +
      document.body.scrollLeft -
      (this.getPositionLeft(e.target) -
        document.querySelector("#car-model").scrollLeft)
    const y =
      e.clientY +
      document.body.scrollTop -
      (this.getPositionTop(e.target) -
        document.querySelector(".car-wrapper").scrollTop)
    const obj = {
      position, //1车右 2车左 3车顶 4车头 5车尾
      x, //坐标x
      y, //坐标y
      value: [], //字母
      width,
    }
    // let data = []
    // const {dispatch, checkCar} = this.props
    const car = [...this.state.car]
    if (!car.length) {
      car.push({
        ...obj,
        id: 1,
      })
    } else {
      const last = car[car.length - 1].value.length
      if (last) {
        car.push({
          ...obj,
          id: car.length + 1,
        })
      } else {
        car.splice(car.length - 1, 1, {...obj, id: car.length})
      }
    }
    this.setState({car})
    // dispatch({
    //   type: "maintainBilling/setCheckCar",
    //   payload: {
    //     car,
    //   },
    // })
  }
  calculate = (item) => {
    let width = 0
    switch (item.position) {
      case 1:
        width = 437
        break
      case 2:
        width = 437
        break
      case 3:
        width = 184
        break
      case 4:
        width = 189
        break
      case 5:
        width = 189
        break
      default:
        console.log(item.position)
    }
    if(width !== item.width){
      const scale = width/item.width
      item.x = item.x * scale
      item.y = item.y * scale
      // const { car } = this.props.checkCar
      // const index = car.findIndex(carItem => carItem.id === item.id )
      // car[index] = item
      // this.props.dispatch({
      //   type: "maintainBilling/setCheckCar",
      //   payload: {
      //     car,
      //   },
      // })
      // this.setState((preState) => {
      //   return {
      //     car: [...preState.car, item],
      //   }
      // })
    }
  }

  //打印
  printCarInspection=()=> {
    this.props.onPrintCarInspection()
  }

  valChange = (id, values) => {
    // const {dispatch, checkCar} = this.props
    const { car } = this.state
    const index = car.findIndex(item => item.id === id)
    car[index].value = [...values]
    this.setState({car})
    // dispatch({
    //   type: "maintainBilling/setCheckCar",
    //   payload: {
    //     car,
    //   },
    // })
  }
  onOk = () => {
    const { featureSource, goodsSource, fileList, car, remark } = this.state
    this.props.dispatch({
        type: "maintainBilling/setCheckCar",
        payload: {
          feature: clonedeep(featureSource)
            .filter(item => item.checked)
            .map(item => ({
              index: item.index,
              text: item.text,
              defined: item.defined,
            })),
          goods: clonedeep(goodsSource)
            .filter(item => item.checked)
            .map(item => ({
              index: item.index,
              text: item.text,
              defined: item.defined,
            })),
          fileList: clonedeep(fileList),
          car: clonedeep(car),
          remark,
        },
      })
    this.props.onOk()
  }
  onCancel = () => {
    this.initData()
    this.props.onCancel()
  }
  render() {
    const {
      type,
      visible,
      value,
      previewVisible,
      previewImage,
      featureSource,
      goodsSource,
    } = this.state
    const { visible: showModal} = this.props
    const uploadButton = (
      <div>
        <Icon type="plus"/>
      </div>
    )
    return (
      <Modal
        title='常规车检'
        visible={showModal}
        width={1110}
        destroyOnClose
        maskClosable={false}
        onOk={this.onOk}
        onCancel={this.onCancel}
        footer={null}
      >
        <div className='car-wrapper' style={{height: 570, overflowY: 'scroll'}}>
          <div className={styles.isCheck}>
            <div>
              通过车辆自检，物品确认，外观检查等常规方法确认车辆基本情况和确认车辆进店前的状态。
            </div>
          </div>
          <div>
              <div className={styles.checkItem}>
                <div className={styles.itemTitle}>
                  <span>功能确认：</span>
                  <span className={styles.feature}>正常</span>
                  <span className={styles.feature}>故障</span>
                </div>
                <div className={styles.featureBox}>
                  {featureSource.map((item, index) => (
                    <div
                      className={styles.featureItem}
                      key={index}
                      onClick={() =>
                        this.changeSource(
                          "featureSource",
                          item.index,
                          item.defined
                        )
                      }
                    >
                    <span
                      id={
                        item.defined
                          ? styles.featureActive
                          : item.checked
                          ? styles.featureActive
                          : ""
                      }
                      className={`iconfont ${item.icon}`}
                      style={item.defined ? {fontSize: 22} : {}}
                    >
                      {item.icon ? "" : item.text.slice(0, 1)}
                    </span>
                      <span>{item.text}</span>
                      {item.defined && (
                        <span
                          className={styles.close}
                          onClick={() =>
                            this.delSource("featureSource", item.index)
                          }
                        >
                        x
                      </span>
                      )}
                    </div>
                  ))}
                  <div
                    className={styles.featureItem}
                    onClick={() => this.showModal("feature")}
                  >
                    <span className="iconfont icon-tianjia"/>
                    <span>&nbsp;</span>
                  </div>
                </div>
              </div>
              <div className={styles.checkItem}>
                <div className={styles.itemTitle}>
                  <span>物品确认：</span>
                  <span className={styles.goods}>有</span>
                  <span className={styles.goods}>无</span>
                </div>
                <div className={styles.goodsBox}>
                  {goodsSource.map((item, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        this.changeSource("goodsSource", item.index, item.defined)
                      }
                      className={
                        item.defined
                          ? `${styles.goodsItem} ${styles.goodsActive}`
                          : item.checked
                          ? `${styles.goodsItem} ${styles.goodsActive}`
                          : styles.goodsItem
                      }
                    >
                      {item.text}
                      {item.defined && (
                        <span
                          className={styles.close}
                          onClick={() =>
                            this.delSource("goodsSource", item.index)
                          }
                        >
                        x
                      </span>
                      )}
                    </div>
                  ))}
                  <div
                    className={styles.add}
                    onClick={() => this.showModal("goods")}
                  >
                    <span className="iconfont icon-tianjia"/>
                  </div>
                </div>
              </div>
              <div className={styles.checkItem}>
                <div className={styles.itemTitle}>
                  <span>外观确认：</span>
                  <span className={styles.other}>点击图片上有外观问题的地方进行标注</span>
                  {/*<span className={styles.appearance}>划痕</span>*/}
                  {/*<span className={styles.appearance}>破裂</span>*/}
                  {/*<span className={styles.appearance}>掉漆</span>*/}
                  {/*<span className={styles.appearance}>凹陷</span>*/}
                  {/*<span className={styles.appearance}>裂纹</span>*/}
                  {/*<span className={styles.appearance}>其他</span>*/}
                </div>
                <div
                  id="car-model"
                >
                  <div className={styles.carModel}>
                    <div className={styles.modelLeft}>
                      <div>
                        <div className={styles.modelTip}>车身右侧</div>
                        <div
                          style={{width: 437, position: "relative"}}
                          onClick={e => this.addSign(1, e)}
                        >
                          <img src={cheyou} alt="车身右侧" className="car"/>
                          {this.state.car
                            .filter(item => item.position === 1)
                            .map((item, index) => (
                              <Sign
                                key={index}
                                {...item}
                                onChange={values =>
                                  this.valChange(item.id, values)
                                }
                              />
                            ))}
                        </div>
                      </div>
                      <div style={{marginTop: 110}}>
                        <div className={styles.modelTip}>车身左侧</div>
                        <div
                          style={{width: 437, position: "relative"}}
                          onClick={e => this.addSign(2, e)}
                        >
                          <img src={chezuo} alt="车身左侧" className="car"/>
                          {this.state.car
                            .filter(item => item.position === 2)
                            .map((item, index) => (
                              <Sign
                                key={index}
                                {...item}
                                onChange={values =>
                                  this.valChange(item.id, values)
                                }
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                    <div className={styles.modelMiddle}>
                      <div className={styles.modelTip}>车顶</div>
                      <div
                        style={{width: 184, position: "relative"}}
                        onClick={e => this.addSign(3, e)}
                      >
                        <img src={cheding} alt="车顶" className="car"/>
                        {this.state.car
                          .filter(item => item.position === 3)
                          .map((item, index) => (
                            <Sign
                              key={index}
                              {...item}
                              onChange={values => this.valChange(item.id, values)}
                            />
                          ))}
                      </div>
                    </div>
                    <div className={styles.modelRight}>
                      <div>
                        <div className={styles.modelTip}>车头</div>
                        <div
                          style={{width: 189, position: "relative"}}
                          onClick={e => this.addSign(4, e)}
                        >
                          <img src={chetou} alt="车头" className="car"/>
                          {this.state.car
                            .filter(item => item.position === 4)
                            .map((item, index) => (
                              <Sign
                                key={index}
                                {...item}
                                onChange={values =>
                                  this.valChange(item.id, values)
                                }
                              />
                            ))}
                        </div>
                      </div>
                      <div style={{marginTop: 110}}>
                        <div className={styles.modelTip}>车尾</div>
                        <div
                          style={{width: 189, position: "relative"}}
                          onClick={e => this.addSign(5, e)}
                        >
                          <img src={chewei} alt="车尾" className="car"/>
                          {this.state.car
                            .filter(item => item.position === 5)
                            .map((item, index) => (
                              <Sign
                                key={index}
                                {...item}
                                onChange={values =>
                                  this.valChange(item.id, values)
                                }
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.checkItem}>
                <div className={styles.itemTitle}>
                  <span>上传其他图片：</span>
                  <span className={styles.other}>最多可上传10张</span>
                </div>
                <Upload
                  className={styles.carUpload}
                  multiple
                  fileList={this.state.fileList}
                  listType="picture-card"
                  onSuccess={async (res,file) => {
                    file.url = res.requestAddress
                    file.imgId = res.id
                    const fileList = this.state.fileList
                    fileList.push(file)
                    await this.setState({fileList})
                    // await dispatch({
                    //   type: "maintainBilling/setCheckCar",
                    //   payload: {
                    //     fileList,
                    //   },
                    // })
                  }}
                  onRemove={file => {
                    const fileList = this.state.fileList
                    const index = fileList.findIndex(item => item.imgId === file.imgId)
                    fileList.splice(index, 1)
                    this.setState({fileList})
                    // dispatch({
                    //   type: "maintainBilling/setCheckCar",
                    //   payload: {
                    //     fileList,
                    //   },
                    // })
                  }}
                  onPreview={this.handlePreview}
                  customRequest={nUploadImg('orderMaintainInspect')}
                  beforeUpload={(file, fileList) => {
                    const imgType = ['image/jpeg', 'image/jpg', 'image/png']
                    const isJpg = imgType.includes(file.type)
                    const maxLength = fileList.length + this.state.fileList.length
                    if(maxLength > 10){
                      message.error('最多可上传10张')
                    }
                    if(!isJpg){
                      message.error('仅允许上传jpg、jpeg、png格式的图片')
                    }
                    return isJpg && maxLength <= 10
                  }}
                >
                  {this.state.fileList.length === 10 ? null : uploadButton}
                </Upload>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt="example"
                    style={{width: "100%"}}
                    src={previewImage}
                  />
                </Modal>
                <div>
                  <div className={styles.remark}>备注</div>
                  <div>
                    <Input
                      size="large"
                      value={this.state.remark}
                      onChange={e => {
                        if(e.target.value.length > 200){
                          message.error('最多输入200字')
                          return false
                        }
                        // dispatch({
                        //   type: "maintainBilling/setCheckCar",
                        //   payload: {
                        //     remark: e.target.value,
                        //   },
                        // })
                        this.setState({remark: e.target.value})
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          <Modal
            title={type === "feature" ? "添加车检项目" : "添加物品"}
            width={570}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.hideModal}
          >
            <div className="flex center">
              <Input
                size="large"
                value={value}
                onChange={e => this.setState({value: e.target.value})}
              />
            </div>
          </Modal>
        </div>
        <div style={{padding: '32px 0', textAlign: 'right'}}>
          <Button style={{width:'88px', marginLeft:'24px'}} onClick={this.onCancel} size='large'>取消</Button>
          <Button style={{width:'88px', marginLeft:'24px'}} onClick={this.printCarInspection} size='large'>打印</Button>
          <Button style={{width:'88px', marginLeft:'24px'}} onClick={this.onOk} type='primary' size='large'>确定</Button>
        </div>
      </Modal>
    )
  }
}

export default Car
