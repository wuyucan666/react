import service from '../services'

export default function (event) {
  return service.INSERT({
    keys: {name: 'statistics/collect/event'},
    data: { event },
    // proxy: true,
  })
}
