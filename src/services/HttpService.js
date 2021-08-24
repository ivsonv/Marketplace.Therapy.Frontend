import axios from './axios/index.js'

export default class HttpService {
    constructor(_apiurl = process.env.VUE_APP_API) {
        this.urlapi = _apiurl
    }

    post(path, payload) {
        return axios
            .post(`${this.urlapi}${path}`, payload)
            .then((res) => {
                if (res.data.error) {
                    this.errorapi(res.data.error)
                }
                return res.data
            }).catch((error) => {
                this.errorpost(error)
            })
    }


    get(path, params = null, redirect = null) {
        return axios
            .get(`${this.urlapi}${path}`, {
                ...params
            })
            .then((res) => {
                if (res.data.error) {
                    this.errorapi(res.data.error)
                }
                return res.data
            }).catch((error) => {
                this.errorpost(error, redirect)
            })
    }

    put(path, payload) {
        return axios
            .put(`${this.urlapi}${path}`, payload)
            .then((res) => {
                if (res.data.error) {
                    this.errorapi(res.data.error)
                }
                return res.data
            }).catch((error) => {
                this.errorpost(error)
            })
    }

    delete(path) {
        return axios
            .delete(`${this.urlapi}${path}`)
            .then((res) => {
                if (res.data.error) {
                    this.errorapi(res.data.error)
                }
                return res.data
            }).catch((error) => {
                this.errorpost(error)
            })
    }

    errorapi(_error) {
        let msg = _error.message
        if (_error.description) {
            msg += "( " + _error.description + " )"
        }
        console.log(msg)
        throw msg
    }

    errorpost(err, redirect) {
        if (err && err.response && err.response.status) {
            switch (err.response.status) {
                case 500:
                    localStorage.clear();
                    //window.location = redirect || "/login"
                    break
                case 401:
                case 403:
                    localStorage.clear();
                    window.location = "/"
                    throw "Você não tem permissão para acessar...";
            }
        }

        console.log(JSON.stringify(err))
        if (err.message == "Network Error") {
            throw "comunicação/rede falhou..."
        }
        else {
            throw err
        }

    }
}