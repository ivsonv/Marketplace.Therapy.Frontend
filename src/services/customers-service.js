import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/customers${_parans}`)
  },
  showAppointments: (id) => {
    return _http.get(`/api/customers/${id}/appointments`)
  },
  find: (id) => {
    return _http.get(`/api/customers/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/customers', payload)
  },
  update: (payload) => {
    return _http.put('/api/customers', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/customers/${id}`)
  }
}