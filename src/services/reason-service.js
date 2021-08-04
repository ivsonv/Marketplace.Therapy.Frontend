import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: () => {
    return _http.get(`/api/reason-canceled`)
  }
}