import HttpService from './HttpService'

const _http = new HttpService()
export default {
  showProviders: (payload) => {
    return _http.post('/api/marketplace/providers', payload)
  },
  findByProvider: (link) => {
    return _http.get(`/api/marketplace/provider/${link}`)
  },
  showTopics: () => {
    return _http.get('/api/marketplace/topics')
  },
  showProviderHours: (link) => {
    return _http.get(`/api/marketplace/provider/${link}/hours`)
  },
}