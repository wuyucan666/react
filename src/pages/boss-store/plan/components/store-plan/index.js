import { Component } from "react"
import { G2, Chart, Geom, Tooltip, Coord } from "bizcharts"


class StorePlan extends Component {
  state = {
    noActual: [],
  }
  componentDidMount() {
  }
  render() {
    const { noActual } = this.props
    const sliceNumber = 0.01

    // 自定义 other 的图形，增加两条线
    G2.Shape.registerShape("interval", "sliceShape", {
      draw(cfg, container) {
        const points = cfg.points
        let path = []
        path.push(["M", points[0].x, points[0].y])
        path.push(["L", points[1].x, points[1].y - sliceNumber])
        path.push(["L", points[2].x, points[2].y - sliceNumber])
        path.push(["L", points[3].x, points[3].y])
        path.push("Z")
        path = this.parsePath(path)
        return container.addShape("path", {
          attrs: {
            fill: cfg.color,
            path: path,
          },
        })
      },
    })
    return (
      <div>
        <Chart
          height={236}
          data={noActual}
          forceFit
          padding={{ top: 0, bottom: 16 }}
        >
          <Coord type="theta" innerRadius={0.75} />
          <Tooltip showTitle={false} />
          <Geom
            type="intervalStack"
            position="value"
            color="type"
            shape="sliceShape"
          />
        </Chart>
      </div>
    )
  }
}

export default StorePlan
