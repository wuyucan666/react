import { Component } from 'react'
import G2 from '@antv/g2'
var chart = null
class storepay extends Component {
  state = {
  }
  componentDidMount() {
    const e = document.createEvent('Event')
    e.initEvent('resize', true, true)
    window.dispatchEvent(e)

    const { data } = this.props
    chart = new G2.Chart({
      container: 'mountNodeLeft',
      height: 400,
      forceFit: true,
    })
    this.publicPicFunc(data)
  }
  publicPicFunc(data) {
    const sortdata = data.sort((a, b) => b.total - a.total)
    chart.clear()
    chart.source(sortdata, {
      value: {
        tickCount: 5,
      },
    })
    chart.axis('categoryName', {
      label: {
        textStyle: {
          fill: '#333',
        },
      },
      tickLine: {
        alignWithLabel: false,
        length: 0,
      },
    })
    chart.axis('total', {
      label: {
        textStyle: {
          fill: '#333',
        },
        formatter: function formatter(text) {
          return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        },
      },
      title: {
        offset: 70,
      },
    })
    chart.tooltip({
      share: true,
    })
    chart.scale('total', {
      alias: '库存金额',
    })
    chart.interval().position('categoryName*total').label('value', {
      useHtml: true,
      htmlTemplate: function htmlTemplate(text, item) {
        return `<div style="color:#999999;">${item.point.total}</div>`
      },
    })
    chart.render()
  }
  componentDidUpdate() {
    const { data } = this.props
    this.publicPicFunc(data)
  }
  render() {
    return (
      <div id='mountNodeLeft'></div>
    )
  }
}
export default storepay
