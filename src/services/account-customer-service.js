import HttpService from './HttpService'

const _http = new HttpService()
export default {
  find: () => {
    return _http.get(`/api/account-customer`)
  },
  create: (payload) => {
    return _http.post('/api/account-customer', payload)
  },
  update: (payload) => {
    return _http.put('/api/account-customer', payload)
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
  conference: (id) => {
    return _http.get(`/api/account-customer/appointment/${id}/conference`)
  },
  finish: (id) => {
    return _http.get(`/api/account-customer/appointment/${id}/conference/finish`)
  },
  find: () => {
    return _http.get(`/api/account-customer`)
  },
  reeschedule: (payload) => {
    return _http.put('/api/account-customer/appointment/reeschedule', payload)
  },
  
}