import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, company_id, search = null) => {
    let _parans = `?size=20&page=${page - 1}&asc`;
    _parans += `&data.company_uptos3_id=${company_id}`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/uptos3${_parans}`)
  },
  getQuestions: (id) => {
    return _http.get(`/api/uptos3/${id}`)
  },
  update: (payload) => {
    return _http.put('/api/uptos3', payload)
  },
  getEditionError: () => {
    return _http.get(`/api/uptos3/show-edition-error`)
  },
  updateByEditionError: (payload) => {
    return _http.put('/api/uptos3/update-by-edition-error', payload)
  },
  getTabCompany: () => {
    return _http.get(`/api/uptos3/get-tab-company`)
  },
  showRepeated: (page, company_id, search = null, size = 12) => {
    let _parans = `?size=${size}&page=${page - 1}&asc`;
    _parans += `&data.company_uptos3_id=${company_id}`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/uptos3/show-repeated${_parans}`)
  },
  getVideosQuestions: (correct) => {
    return _http.get(`/api/uptos3/get-videos-options/${correct}`)
  },
  updateByRepeat: (payload) => {
    return _http.put('/api/uptos3/update-by-repeat', payload)
  },
}