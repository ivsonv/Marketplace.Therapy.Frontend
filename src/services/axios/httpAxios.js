import axios from 'axios'

const middleware = axios.create({
    baseURL: ''
})
middleware.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    return config
})
export default middleware