import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (page, search = null, eventId = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (search) {
      _parans += `&search=${search}`;
    }
    if(eventId){
      _parans += `&data.event_id=${eventId}`;
    }
    return _http.get(`/api/sub-events${_parans}`)
  },
  find: (id) => {
    return _http.get(`/api/sub-events/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/sub-events', payload)
  },
  update: (payload) => {
    return _http.put('/api/sub-events', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/sub-events/${id}`)
  }
}