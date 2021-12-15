import HttpService from './HttpService'

const _http = new HttpService()
export default {
  create: (payload) => {
    return _http.post('/api/faq/question', payload)
  },
  update: (payload) => {
    return _http.put('/api/faq/question', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/faq/question/${id}`)
  }
}