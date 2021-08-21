import HttpService from './HttpService'

const _http = new HttpService()
export default {
  find: () => {
    return _http.get(`/api/account-provider`)
  },
  fetchBanks: (_term) => {
    return _http.get(`/api/account-provider/banks?term=${_term}`)
  },
  fetchTopics: () => {
    return _http.get(`/api/account-provider/topics`)
  },
  fetchLanguages: () => {
    return _http.get(`/api/account-provider/languages`)
  },
  update: (payload) => {
    return _http.put('/api/account-provider', payload)
  },
  // create: (payload) => {
  //   return _http.post('/api/account-provider', payload)
  // },
}