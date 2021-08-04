import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (courseid) => {
    return _http.get(`/api/lesson?courseid=${courseid}`)
  },
  autoComplete: (search) => {
    return _http.get(`/api/lesson/auto-complete?page=${0}&search=${search}&asc`)
  },
  find: (id) => {
    return _http.get(`/api/lesson/${id}`)
  },
  update: (payload) => {
    return _http.put('/api/lesson', payload)
  },
  cancel: (id) => {
    return _http.post(`/api/lesson/cancel/${id}`)
  },
  cancelWithReason: (payload) => {
    return _http.post(`/api/lesson/cancel-reason`, payload)
  },
}