import config from "./config"

export default function(id) {
  return (
    config.api.domain +
    config.api.img +
    id +
    "?token=" +
    sessionStorage.getItem("tk")
  )
}
