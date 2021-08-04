import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/project${_parans}`)
  },
  showAll: () => {
    return _http.get(`/api/project/auto-complete?size=99999&asc`)
  },
  autoComplete: (search) => {
    return _http.get(`/api/project/auto-complete?page=${0}&search=${search}&asc`)
  },
  find: (id) => {
    return _http.get(`/api/project/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/project', payload)
  },
  update: (payload) => {
    return _http.put('/api/project', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/project/${id}`)
  },
  showEvents: (id) => {
    return _http.get(`/api/project/${id}/events`)
  },
  showLessons: (id) => {
    return _http.get(`/api/project/${id}/lessons`)
  },
}