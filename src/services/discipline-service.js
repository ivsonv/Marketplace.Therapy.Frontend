import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/discipline${_parans}`)
  },
  autoComplete: (search) => {
    return _http.get(`/api/discipline/auto-complete?page=${0}&search=${search}&asc`)
  },
  find: (id) => {
    return _http.get(`/api/discipline/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/discipline', payload)
  },
  update: (payload) => {
    return _http.put('/api/discipline', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/discipline/${id}`)
  }
}