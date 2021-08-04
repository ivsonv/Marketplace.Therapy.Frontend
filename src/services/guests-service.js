import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/guest${_parans}`)
  },
  autoComplete: (search) => {
    return _http.get(`/api/guest/auto-complete?page=${0}&search=${search}&asc`)
  },
  find: (id) => {
    return _http.get(`/api/guest/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/guest', payload)
  },
  update: (payload) => {
    return _http.put('/api/guest', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/guest/${id}`)
  }
}