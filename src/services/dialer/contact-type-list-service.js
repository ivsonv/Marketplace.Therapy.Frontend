import HttpService from '../HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/dialer/contact-type-list${_parans}`)
  },
  showAll: () => {
    return _http.get(`/api/dialer/contact-type-list/all`)
  },
  create: (payload) => {
    return _http.post('/api/dialer/contact-type-list', payload)
  },
  update: (payload) => {
    return _http.put('/api/dialer/contact-type-list', payload)
  }
}