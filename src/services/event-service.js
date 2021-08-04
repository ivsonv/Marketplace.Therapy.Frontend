import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null, projectId = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    if (projectId) {
      _parans += `&data.project_id=${projectId}`;
    }
    return _http.get(`/api/event${_parans}`)
  },
  showBackoffice: (page, search = null, projectId = null) => {
    let _parans = `?page=${page - 1}`;
    if (search) {
      _parans += `&search=${search}`;
    }
    if (projectId) {
      _parans += `&data.project_id=${projectId}`;
    }
    return _http.get(`/api/event/backoffice/${_parans}`)
  },
  autoComplete: (search) => {
    return _http.get(`/api/event/auto-complete?page=${0}&search=${search}&asc`)
  },
  find: (id) => {
    return _http.get(`/api/event/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/event', payload)
  },
  update: (payload) => {
    return _http.put('/api/event', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/event/${id}`)
  },
  cancel: (id) => {
    return _http.post(`/api/event/cancel/${id}`)
  },
  cancelWithReason: (payload) => {
    return _http.post(`/api/event/cancel-reason`, payload)
  },
  upsertBackoffice: (payload) => {
    return _http.put('/api/event/backoffice/upsert', payload)
  },
  upsertYoutube: (payload) => {
    return _http.put('/api/event/youtube/upsert', payload)
  },
}