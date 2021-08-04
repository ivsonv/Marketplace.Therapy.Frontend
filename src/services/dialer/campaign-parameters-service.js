import HttpService from '../HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/dialer/campaign-parameters${_parans}`)
  },
  find: (id) => {
    return _http.get(`/api/dialer/campaign-parameters/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/dialer/campaign-parameters', payload)
  },
  update: (payload) => {
    return _http.put('/api/dialer/campaign-parameters', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/dialer/campaign-parameters/${id}`)
  },
  showTypes: () => {
    return _http.get(`/api/dialer/campaign-parameters/types`)
  },
  autoComplete: (search) => {
    return _http.get(`/api/dialer/campaign-parameters/auto-complete?page=${0}&search=${search}&asc`)
  },
}