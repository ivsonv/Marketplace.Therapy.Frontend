import HttpService from './HttpService'

const _http = new HttpService()
export default {
  create: (payload) => {
    return _http.post(`/api/payment`, payload)
  },
  consult: (payload) => {
    return _http.post(`/api/payment/consult`, payload)
  },
  cancel: (payload) => {
    return _http.post(`/api/payment/cancel`, payload)
  }
}