import HttpService from './HttpService'

const _http = new HttpService()
export default {
  save: (payload) => {
    return _http.post('/api/account/provider/schedules', payload)
  },
  // update: (payload) => {
  //   return _http.put('/api/account/provider/schedules', payload)
  // },
  // delete: (id) => {
  //   return _http.delete(`/api/account/provider/schedules/${id}`)
  // }
}