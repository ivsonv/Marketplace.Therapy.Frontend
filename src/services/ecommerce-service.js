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
  showProviderHours: (link, dt_start = null) => {
    if (dt_start) {
      return _http.get(`/api/marketplace/provider/${link}/hours?dt_start=${dt_start}`)
    }
    else
      return _http.get(`/api/marketplace/provider/${link}/hours`)
  },
  showFaq: () => {
    return _http.get('/api/marketplace/faq')
  },
  showBanners: () => {
    return _http.get('/api/marketplace/banners')
  },
}