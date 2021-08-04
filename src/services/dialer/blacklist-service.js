import HttpService from '../HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/dialer/blacklist${_parans}`)
  },
  find: (id) => {
    return _http.get(`/api/dialer/blacklist/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/dialer/blacklist', payload)
  },
  update: (payload) => {
    debugger;
    return _http.put('/api/dialer/blacklist', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/dialer/blacklist/${id}`)
  }
}