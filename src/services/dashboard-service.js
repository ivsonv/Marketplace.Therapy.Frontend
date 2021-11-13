import HttpService from './HttpService'

const _http = new HttpService()
export default {
  reports: (page, payload) => {
    return _http.get(`/api/dashboard/reports?page=${page - 1}
                                             &data.start=${payload.data.start}
                                             &data.end=${payload.data.end}`)
  },
  findByAppointmentId: (id) => {
    return _http.get(`/api/dashboard/appointment/${id}`)
  },
  invoice: (id) => {
    return _http.get(`/api/dashboard/appointment/${id}/invoice`)
  }
}