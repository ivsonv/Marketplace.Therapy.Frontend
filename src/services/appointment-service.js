import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (mes = 0) => {
    return _http.get(`/api/appointment?mes=${mes}`)
  },
  create: (payload) => {
    return _http.post('/api/appointment', payload)
  }
}