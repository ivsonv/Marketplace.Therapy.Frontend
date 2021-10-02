import HttpService from './HttpService'

const _http = new HttpService()
export default {
  loginAdmin: (payload) => {
    return _http.post('/api/auth/admin', payload)
  },
  loginCustomer: (payload) => {
    return _http.post('/api/auth/customer', payload)
  },
  resetLoginCustomer: (payload) => {
    return _http.post('/api/auth/customer/reset', payload)
  },
  updateLoginCustomer: (payload) => {
    return _http.put('/api/auth/customer/update-password', payload)
  },
  loginProvider: (payload) => {
    return _http.post('/api/auth/provider', payload)
  },
  resetLoginProvider: (payload) => {
    return _http.post('/api/auth/provider/reset', payload)
  },
  updateLoginProvider: (payload) => {
    return _http.put('/api/auth/provider/update-password', payload)
  }
}