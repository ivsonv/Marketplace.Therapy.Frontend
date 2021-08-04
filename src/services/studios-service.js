import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (groupStudioId) => {
    return _http.get(`/api/studios?groupStudioId=${groupStudioId}`)
  },
  showAll: () => {
    return _http.get(`/api/studios/auto-complete?size=9999&asc`)
  },
  autoComplete: (search) => {
    return _http.get(`/api/studios/auto-complete?page=${0}&search=${search}&asc`)
  },
  find: (id) => {
    return _http.get(`/api/studios/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/studios', payload)
  },
  update: (payload) => {
    return _http.put('/api/studios', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/studios/${id}`)
  }
}