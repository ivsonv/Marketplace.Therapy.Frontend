import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/topics${_parans}`)
  },
  showAll: () => {
    return _http.get(`/api/topics?size=999`)
  },
  find: (id) => {
    return _http.get(`/api/topics/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/topics', payload)
  },
  update: (payload) => {
    return _http.put('/api/topics', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/topics/${id}`)
  }
}