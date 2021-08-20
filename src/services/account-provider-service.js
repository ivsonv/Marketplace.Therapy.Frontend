import HttpService from './HttpService'

const _http = new HttpService()
export default {
  find: () => {
    return _http.get(`/api/account-provider`)
  },
  update: (payload) => {
    return _http.put('/api/account-provider', payload)
  },
  create: (payload) => {
    return _http.post('/api/account-provider', payload)
  },
}