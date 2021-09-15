import HttpService from './HttpService'

const _http = new HttpService()
export default {
  create: (payload) => {
    return _http.post('/api/account-customer', payload)
  },
  update: (payload) => {
    return _http.put('/api/account-customer', payload)
  },
  find: () => {
    return _http.get(`/api/account-customer`)
  }
}