import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/provider${_parans}`)
  },
  showSituations: () => {
    return _http.get(`/api/provider/situations`)
  },
  find: (id) => {
    return _http.get(`/api/provider/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/provider', payload)
  },
  update: (payload) => {
    return _http.put('/api/provider', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/provider/${id}`)
  }
}