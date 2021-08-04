import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/permission-group${_parans}`)
  },
  showAll: () => {
    return _http.get(`/api/permission-group/all`)
  },
  showPermissions: () => {
    return _http.get(`/api/permission-group/permissions`)
  },
  find: (id) => {
    return _http.get(`/api/permission-group/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/permission-group', payload)
  },
  update: (payload) => {
    return _http.put('/api/permission-group', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/permission-group/${id}`)
  }
}