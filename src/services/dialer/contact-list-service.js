import HttpService from '../HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/dialer/contact-list${_parans}`)
  },
  create: (payload) => {
    return _http.post('/api/dialer/contact-list', payload)
  },
  update: (payload) => {
    return _http.put('/api/dialer/contact-list', payload)
  },
  autoComplete: (search) => {
    return _http.get(`/api/dialer/contact-list/auto-complete?page=${0}&search=${search}&asc`)
  },
  find: (id) => {
    return _http.get(`/api/dialer/contact-list/${id}`)
  },
  createImport: (payload) => {
    return _http.post('/api/dialer/contact-list/import-contacts', payload)
  },
  findContacts: (id) => {
    return _http.get(`/api/dialer/contact-list/contacts/${id}`)
  },

}