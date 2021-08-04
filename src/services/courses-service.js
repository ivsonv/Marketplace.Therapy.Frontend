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
    return _http.get(`/api/course${_parans}`)
  },
  showBackoffice: (page, search = null, project = null) => {
    let _parans = `?page=${page - 1}`;
    if (search) {
      _parans += `&search=${search}`;
    }
    if (project) {
      _parans += `&data.project_id=${project}`
    }
    return _http.get(`/api/course/backoffice${_parans}`)
  },
  find: (id) => {
    return _http.get(`/api/course/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/course', payload)
  },
  update: (payload) => {
    return _http.put('/api/course', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/course/${id}`)
  },
  upsertBackoffice: (payload) => {
    return _http.put('/api/course/backoffice/upsert', payload)
  },
  upsertYoutube: (payload) => {
    return _http.put('/api/course/youtube/upsert', payload)
  },
  duration: (id) => {
    return _http.get(`/api/course/duration/${id}`)
  },
}