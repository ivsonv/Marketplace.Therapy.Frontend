import HttpService from '../HttpService'
const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?size=200&page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/pabx/queues${_parans}`)
  },
  find: (id) => {
    return _http.get(`/api/pabx/queues/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/pabx/queues', payload)
  },
  update: (payload) => {
    return _http.put('/api/pabx/queues', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/pabx/queues/${id}`)
  }
}