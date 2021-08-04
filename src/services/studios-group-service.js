import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/studiosgroup${_parans}`)
  },
  find: (id) => {
    return _http.get(`/api/studiosgroup/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/studiosgroup', payload)
  },
  update: (payload) => {
    return _http.put('/api/studiosgroup', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/studiosgroup/${id}`)
  },
  showAll: () => {
    return _http.get(`/api/studiosgroup/show-all`)
  },
}