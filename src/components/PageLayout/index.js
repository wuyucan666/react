import { Component } from "react"
import item from "./item"
import style from "./style.less"
import PropType from "prop-types"
import { Icon } from "antd"
import React from "react"
import Tabbar from "components/Tabbar"
class PageLayout extends Component {
  constructor(props) {
    super(props)
    this.state.current = props.active || 0
    this.state.showCustomContent = props.active === -1
  }

  setCurrent(current) {
    this.setState({
      current,
      showCustomContent: current < 0,
    })
  }
  /**
   * 当进入当前组件时，清空路由父级视图样式
   */
  contentNode = null
  componentDidMount() {
    this.contentNode = document.querySelector(".contentData")
    this.contentNode.className = ""
    // window.addEventListener("resize", this.onWindowResize.bind(this))
    this.onWindowResize()
  }
  componentWillUnmount() {
    this.contentNode.className = "contentData"
    window.removeEventListener("resize", this.onWindowResize.bind(this))
  }
  onWindowResize() {
    const { extra = 0 } = this.props
    const content = document.querySelector(".ant-layout-content")
    if (content) {
      this.setState({
        rightHeight: content.clientHeight - 24 - 45 - 32 - extra,
      })
    }
  }
  menuClick = (current) => {
    const { menuClick } = this.props
    if (menuClick) {
      menuClick(current)
    } else {
      this.setState({ current, showCustomContent: false })
    }
  }
  state = {
    current: 0,
    rightHeight: 0,
    showCustomContent: false,
  }

  render() {
    const {
      content,
      head,
      bottom,
      tabbar,
      customContent,
      customLeft,
    } = this.props
    return (
      <div className={style.layout + " layout-page"}>
        <div
          className="leftitem"
          style={{ height: this.state.rightHeight, overflowY: "scroll" }}
        >
          {head ? <div className="member">{head}</div> : ''}
          <div>{customLeft}</div>
          <div className="content">
            {content.map((_, index) => (
              <div
                onClick={() => this.menuClick(index)}
                key={index}
                className={
                  "item " +
                  (index === this.state.current
                    ? "current"
                    : index === this.state.current - 1
                    ? "current-last"
                    : "")
                }
                style={{
                  display: _.hidden ? "none" : "flex",
                  marginBottom: _.marginBottom ? _.marginBottom : "",
                }}
              >
                {index === this.state.current && (
                  <i
                    className="iconfont icon-caozuotaizhankai"
                    style={{
                      position: "absolute",
                      fontSize: "18px",
                      right: "-14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#4AACF7",
                    }}
                  />
                )}
                {_.custom ? ( // 自定义侧边栏
                  <div style={{ flex: 1 }}>{_.custom}</div>
                ) : (
                  <div className="item-content">
                    <h3
                    style={{
                      fontWeight: _.type === 'dark' ? 'normal': 'bold',
                      color: _.type === 'dark' ? '#999999' : '#333',
                    }}
                    >{_.title}</h3>
                    <div className="item-value" >
                      {_.node
                        ? _.value
                        : _.value.length > 15
                        ? _.value.slice(0, 15) + "..."
                        : _.value || <span>&nbsp;</span>}
                    </div>
                    <div
                      style={{
                        visibility:
                          index === this.state.current ? "hidden" : "visible",
                      }}
                    >
                      <Icon type="right" style={{color: '#999999'}} theme="outlined" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/*<div className="content">*/}
          {/*{content.map((_, index) => (*/}
          {/*<div*/}
          {/*onClick={() => this.menuClick(index)}*/}
          {/*key={index}*/}
          {/*className={*/}
          {/*"item " +*/}
          {/*(index === this.state.current*/}
          {/*? "current"*/}
          {/*: index === this.state.current - 1*/}
          {/*? "current-last"*/}
          {/*: "")*/}
          {/*}*/}
          {/*style={{ display: _.hidden ? "none" : "flex" }}*/}
          {/*>*/}
          {/*<h3>{_.title}</h3>*/}
          {/*{index === this.state.current && (*/}
          {/*<i*/}
          {/*className="iconfont icon-caozuotaizhankai"*/}
          {/*style={{*/}
          {/*position: "absolute",*/}
          {/*fontSize: "18px",*/}
          {/*right: "-14px",*/}
          {/*top: "20px",*/}
          {/*color: "#4AACF7",*/}
          {/*}}*/}
          {/*/>*/}
          {/*)}*/}
          {/*<div className="item-value">*/}
          {/*{*/}
          {/*_.node ?*/}
          {/*_.value*/}
          {/*:*/}
          {/*(_.value.length > 15*/}
          {/*? _.value.slice(0, 15) + "..."*/}
          {/*: _.value || <span>&nbsp;</span>)}*/}
          {/*</div>*/}
          {/*<div*/}
          {/*style={{*/}
          {/*visibility:*/}
          {/*index === this.state.current ? "hidden" : "visible",*/}
          {/*}}*/}
          {/*>*/}
          {/*<Icon type="right" theme="outlined" />*/}
          {/*</div>*/}
          {/*</div>*/}
          {/*))}*/}
          {/*</div>*/}
          {bottom && <div className="after">{bottom}</div>}
        </div>
        <div
          className="rightitem"
          style={{
            height: this.state.rightHeight,
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          {this.state.showCustomContent
            ? customContent
            : content[this.state.current]
            ? content[this.state.current].main
            : ""}
        </div>
        {tabbar && <Tabbar>{tabbar}</Tabbar>}
      </div>
    )
  }
}

PageLayout.propType = {
  content: PropType.arrayOf(
    PropType.objectOf({
      title: PropType.string,
      value: PropType.string,
      main: PropType.node,
    })
  ),
  active: PropType.number,
  member: PropType.node,
  bottom: PropType.node,
  customContent: PropType.node || PropType.bool,
  customLeft: PropType.node || PropType.bool,
}

PageLayout.Item = item

export default PageLayout
