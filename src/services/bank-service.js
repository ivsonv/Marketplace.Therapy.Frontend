import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/banks${_parans}`)
  },
  find: (id) => {
    return _http.get(`/api/banks/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/banks', payload)
  },
  update: (payload) => {
    return _http.put('/api/banks', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/banks/${id}`)
  }
}