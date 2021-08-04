import HttpService from './HttpService'
const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/pabx/agents${_parans}`)
  },
  find: (id) => {
    return _http.get(`/api/pabx/agents/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/pabx/agents', payload)
  },
  update: (payload) => {
    return _http.put('/api/pabx/agents', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/pabx/agents/${id}`)
  }
}