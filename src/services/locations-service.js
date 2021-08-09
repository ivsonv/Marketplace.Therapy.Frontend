import HttpService from './HttpService'

const _http = new HttpService()
export default {
  findZipCode: (zipcode) => {
    return _http.get(`/api/locations/${zipcode}`)
  }
}