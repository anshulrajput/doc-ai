import {AUTH_API_URL} from '../utils/Constants'
import axios from 'axios'

export const getAuthenticatedUserApi = async () => {
    try {
        const url = `${AUTH_API_URL}/user/authentication`
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            'access-token': localStorage.getItem('authToken'),
        }
        const res = await axios(url,{method: 'GET', headers: headers})

        console.log(res)

        if (res.status === 200 && res.data.status === true) {
            return {
                loading: false,
                code: res.status !== undefined ? res.status : null,
                status: res.data.status !== undefined ? res.data.status : null,
                message: res.data.message !== undefined ? res.data.message : null,
                data: res.data.data !== undefined ? res.data.data : null,
                error: null
            }
        } else {
            return Promise.reject({
                loading: false,
                code: res.status !== undefined ? res.status : null,
                status: res.data.status !== undefined ? res.data.status : null,
                message: null,
                data: res.data.data !== undefined ? res.data.data : null,
                error: res.data.message !== undefined ? res.data.message : null
            })
        }
    } catch (err) {
        console.log(err)
        let errResponse = {
            loading: false,
            code: err.response.status !== undefined ? err.response.status : null,
            status: err.response.status !== undefined ? err.response.status : null,
            message: null,
            data: err.response.data !== undefined ? err.response.data : null,
            error: err.response.message !== undefined ? err.response.message : 'Something Went Wrong!'
        }

        // TODO, navigate to login page

        return Promise.reject(errResponse)
    }
}