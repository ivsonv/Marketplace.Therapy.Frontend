import HttpService from './HttpService'

const _http = new HttpService()
export default {
  show: (mes = 0) => {
    return _http.get(`/api/appointment?mes=${mes}`)
  },
  find: (id) => {
    return _http.get(`/api/appointment/${id}`)
  },
  findbyid: (id) => {
    return _http.get(`/api/appointment/findbyid/${id}`)
  },
  create: (payload) => {
    return _http.post('/api/appointment', payload)
  },
  update: (payload) => {
    return _http.put('/api/appointment', payload)
  },
  updateYoutubeUpsert: (payload) => {
    return _http.put('/api/appointment/youtube/upsert', payload)
  },
  updateAvailYoutube: (payload) => {
    return _http.put('/api/appointment/avail-youtube', payload)
  },
  delete: (id) => {
    return _http.delete(`/api/appointment/${id}`)
  },
  showProjects: (search, start) => {
    return _http.get(`/api/appointment/projects?search=${search}&data.start=${start}&size=30`)
  },
  showProjectsCheck: (projectid, start, duration) => {
    return _http.get(`/api/appointment/projects?data.start=${start}&data.id=${projectid}&data.duration=${duration}`)
  },
  showStudios: (search, start, size = 12) => {
    return _http.get(`/api/appointment/studios?search=${search}&size=${size}&data.start=${start}`)
  },
  showAllStudios: (search, start, duration, homeoffice = false, appointmentId = 0) => {
    return _http.get(`/api/appointment/studios?search=${search}
                                               &size=${99999}&data.start=${start}
                                               &data.duration=${duration}
                                               &data.homeoffice=${homeoffice}
                                               &data.appointmentId=${appointmentId}`)
  },
  showAllStudiosApoio: (search, start, event_id, subevent_id, appointmentId = 0) => {
    return _http.get(`/api/appointment/studios-apoio?search=${search}
                                               &size=${99999}&data.start=${start}
                                               &data.event_id=${event_id}
                                               &data.subevent_id=${subevent_id}
                                               &data.appointmentId=${appointmentId}`)
  },
  showLessons: (id) => {
    return _http.get(`/api/appointment/${id}/lessons`)
  },
  createOperator: (payload) => {
    return _http.post(`/api/appointment/operator`, payload)
  },
  updateWithOutTime: (payload) => {
    return _http.put('/api/appointment/cancel-out-time', payload)
  },
  updatePartial: (payload) => {
    return _http.put('/api/appointment/app-partial', payload)
  },

  /* CHATS */
  createChat: (payload) => {
    return _http.post(`/api/appointment/chat`, payload)
  },

  getChat: (appointment_id) => {
    return _http.get(`/api/appointment/${appointment_id}/chat`)
  },
  showScaleOperators: (page, params = null) => {
    let _parans = `?page=${page - 1}&asc`;
    if (params) {
      if (params.date)
        _parans += `&data.date=${params.date}`;
      if (params.company_id)
        _parans += `&data.company_id=${params.company_id}`;
      if (params.group_studio_id)
        _parans += `&data.group_studio_id=${params.group_studio_id}`;
      if (params.operator_id)
        _parans += `&data.operator_id=${params.operator_id}`;
      if (params.operator_backup_id)
        _parans += `&data.operator_backup_id=${params.operator_backup_id}`;
    }
    return _http.get(`/api/appointment/scale-operators${_parans}`)
  },

  upSertScaleOperators: (payload) => {
    return _http.put('/api/appointment/scale-operators/upsert', payload)
  },
}