import HttpService from '../HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/dialer/destinations${_parans}`)
  },
  find: (id) => {
    return _http.get(`/api/dialer/destinations/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/dialer/destinations', payload)
  },
  update: (payload) => {
    return _http.put('/api/dialer/destinations', payload)
  },  
  autoComplete: (search) => {
    return _http.get(`/api/dialer/destinations/auto-complete?page=${0}&search=${search}&asc`)
  },
}