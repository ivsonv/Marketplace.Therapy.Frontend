import HttpService from './HttpService'

const _http = new HttpService()
export default {
  loginAdmin: (payload) => {
    return _http.post('/api/auth/admin', payload)
  },
  loginProvider: (payload) => {
    return _http.post('/api/auth/provider', payload)
  },
  // login: (payload) => {
  //   return _http.post('/api/auth', payload)
  // },
  // userResetPassword: (payload) => {
  //   return _http.post('/api/auth/reset', payload)
  // },
  // updatePassword: (payload) => {
  //   return _http.put('/api/auth/update-password', payload)
  // },
  // validateToken: (payload) => {
  //   return _http.post('/api/auth/valid-token', payload)
  // },
}