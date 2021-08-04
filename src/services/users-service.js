import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/user${_parans}`)
  },
  showRoles: () => {
    return _http.get(`/api/user/roles`)
  },
  find: (id) => {
    return _http.get(`/api/user/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/user', payload)
  },
  update: (payload) => {
    return _http.put('/api/user', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/user/${id}`)
  }
}