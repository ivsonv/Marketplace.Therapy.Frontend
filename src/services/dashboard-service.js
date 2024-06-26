import HttpService from './HttpService'

const _http = new HttpService()
export default {
  reports: (page, payload) => {
    return _http.get(`/api/dashboard/reports?page=${page - 1}
                                             &data.start=${payload.data.start}
                                             &data.end=${payload.data.end}
                                             &data.status=${payload.data.status}
                                             &data.payment_status=${payload.data.payment_status}
                                             &data.transaction_code=${payload.data.transaction_code}`)
  },
  findByAppointmentId: (id) => {
    return _http.get(`/api/dashboard/appointment/${id}`)
  },
  invoice: (id) => {
    return _http.get(`/api/dashboard/appointment/${id}/invoice`)
  },
  overview: () => {
    return _http.get(`/api/dashboard/overview`)
  },
  overviewPsiAndCustomer: () => {
    return _http.get(`/api/dashboard/overview-psi-customer`)
  },
  updateAppointment: (payload) => {
    return _http.put(`/api/dashboard/appointment`, payload)
  }
}