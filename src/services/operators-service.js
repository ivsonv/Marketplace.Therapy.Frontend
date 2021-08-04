import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/operators${_parans}`)
  },
  find: (id) => {
    return _http.get(`/api/operators/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/operators', payload)
  },
  update: (payload) => {
    return _http.put('/api/operators', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/operators/${id}`)
  },
  showOperatorsAll: () => {
    return _http.get(`/api/operators/operators-all`)
  },
}