import HttpService from '../HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/dialer/campaign${_parans}`)
  },
  find: (id) => {
    return _http.get(`/api/dialer/campaign/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/dialer/campaign', payload)
  },
  update: (payload) => {
    return _http.put('/api/dialer/campaign', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/dialer/campaign/${id}`)
  },
  showTypes: () => {
    return _http.get(`/api/dialer/campaign/types`)
  },
}