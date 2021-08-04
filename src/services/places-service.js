import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: () => {
    return _http.get(`/api/places`)
  },
  find: (id) => {
    return _http.get(`/api/places/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/places', payload)
  },
  update: (payload) => {
    return _http.put('/api/places', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/places/${id}`)
  }
}