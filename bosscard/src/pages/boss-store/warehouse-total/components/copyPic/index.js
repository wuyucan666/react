import { Component } from 'react'
import G2 from '@antv/g2'
var chart = null
class storepay extends Component {
  state = {
  }
  componentDidMount() {
    const { data } = this.props
    chart = new G2.Chart({
      container: 'mountNodeRight',
      height: 400,
      forceFit: true,
    })
    this.publicPicFunc(data)
  }
  publicPicFunc(data) {
    const sortdata = data.sort((a, b) => b.total - a.total)
    chart.clear()
    chart.source(sortdata)
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
      alias: '库存量',
    })
    chart.interval().position('categoryName*total').label('value', {
      useHtml: true,
      htmlTemplate: function htmlTemplate(text, item) {
        return `<div style="color:#999999">${item.point.total}</div>`
      },
    })
    chart.render()
  }
  componentDidUpdate() {
    const { data } = this.props
    console.log('datadaggggggggggggggggggggtadata', data)
    this.publicPicFunc(data)
  }
  render() {
    return (
      <div id='mountNodeRight'></div>
    )
  }
}

export default storepay
