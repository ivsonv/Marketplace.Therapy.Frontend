import HttpService from './HttpService'

const _http = new HttpService()
export default {
  update: (payload) => {
    return _http.put('/api/account-provider', payload)
  },
  create: (payload) => {
    return _http.post('/api/account-provider', payload)
  },
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
  fetchSchedules: () => {
    return _http.get('/api/account-provider/schedules')
  },
  fetchAccountTypes: () => {
    return _http.get(`/api/account-provider/account-types`)
  },
  saveSchedules: (payload) => {
    return _http.post('/api/account-provider/schedules', payload)
  },
  removeSchedules: (id) => {
    return _http.delete(`/api/account-provider/schedules/${id}`)
  },
  fetchCalendar: (month = -1) => {
    return _http.get(`/api/account-provider/calendar?month=${month}`)
  }
}