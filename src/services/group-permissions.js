import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/group-permission${_parans}`)
  },
  showAll: () => {
    return _http.get(`/api/group-permission?size=9999`)
  },
  showPermissions: () => {
    return _http.get(`/api/group-permission/permissions`)
  },
  find: (id) => {
    return _http.get(`/api/group-permission/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/group-permission', payload)
  },
  update: (payload) => {
    return _http.put('/api/group-permission', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/group-permission/${id}`)
  }
}