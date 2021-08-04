import HttpService from '../HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/dialer/opening-hours${_parans}`)
  },
  find: (id) => {
    return _http.get(`/api/dialer/opening-hours/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/dialer/opening-hours', payload)
  },
  update: (payload) => {
    debugger;
    return _http.put('/api/dialer/opening-hours', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/dialer/opening-hours/${id}`)
  },
  autoComplete: (search) => {
    return _http.get(`/api/dialer/opening-hours/auto-complete?page=${0}&search=${search}&asc`)
  },
}