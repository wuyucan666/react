import ReactDom from 'react-dom'
import {Component} from 'react'

export default class Tabbar extends Component {

  componentDidMount () {
    this.wrap = document.createElement('div')
    document.getElementById('mainContainer').appendChild(this.wrap)
    this.renderTabbar()
  }

  componentDidUpdate () {
    this.renderTabbar()
  }

  componentWillUnmount () {
    ReactDom.unmountComponentAtNode(this.wrap)
    document.getElementById('mainContainer').removeChild(this.wrap)
  }

  render () {
    return null
  }

  renderTabbar () {
    ReactDom.render(this.props.children, this.wrap)
  }
}
