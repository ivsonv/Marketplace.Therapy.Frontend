import HttpService from './HttpService'

const _http = new HttpService()
export default {
  create: (payload) => {
    return _http.post('/api/account-customer', payload)
  },
  appointments: (page) => {
    return _http.get(`/api/account-customer/appointments?page=${page - 1}`)
  },
  appointmentById: (id) => {
    return _http.get(`/api/account-customer/appointment/${id}`)
  },
  invoice: (id) => {
    return _http.get(`/api/account-customer/appointment/${id}/invoice`)
  },
  find: () => {
    return _http.get(`/api/account-customer`)
  }
}