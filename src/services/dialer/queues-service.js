import HttpService from '../HttpService'

const _http = new HttpService()
export default {
  autoComplete: (search) => {
    return _http.get(`/api/dialer/queues/auto-complete?page=${0}&search=${search}&asc`)
  },
}