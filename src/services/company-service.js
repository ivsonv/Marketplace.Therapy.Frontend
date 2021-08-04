import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/company${_parans}`)
  },
  showAll: () => {
    return _http.get(`/api/company/auto-complete?size=99999&asc`)
  },
  showUserAll: () => {
    return _http.get(`/api/company/user-all`)
  },
  autoComplete: (search) => {
    return _http.get(`/api/company/auto-complete?page=${0}&search=${search}&asc`)
  },
  find: (id) => {
    return _http.get(`/api/company/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/company', payload)
  },
  update: (payload) => {
    return _http.put('/api/company', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/company/${id}`)
  }
}