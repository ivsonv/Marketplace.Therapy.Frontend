import HttpService from './HttpService'

const _http = new HttpService()
export default {
  create: (payload) => {
    return _http.post('/api/merchant', payload)
  }
}