import HttpService from './HttpService'

const _http = new HttpService()
export default {
  autoComplete: (search) => {
    return _http.get(`/api/external-database/auto-complete?size=20&page=${0}&search=${search}&asc`)
  }  
}