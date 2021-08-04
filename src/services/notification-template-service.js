import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    return _http.get(`/api/notification-template${_parans}`)
  },
  autoComplete: (search) => {
    return _http.get(`/api/notification-template/auto-complete?page=${0}&search=${search}&asc`)
  },
  find: (id) => {
    return _http.get(`/api/notification-template/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/notification-template', payload)
  },
  update: (payload) => {
    return _http.put('/api/notification-template', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/notification-template/${id}`)
  },
  notifyTeacher: (payload) => {
    return _http.post('/api/notification-template/notify-teacher', payload)
  },
  showTypes: () => {
    return _http.get(`/api/notification-template/types`)
  },
  showForType: (type) => {
    return _http.get(`/api/notification-template/get-for-type?data.type_template=${type}`)
  },
}