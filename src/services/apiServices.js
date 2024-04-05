import axios from "axios"
import { createUrl } from "../utils/helpers"


export const getRequest = (url) => {
    return axios.get(createUrl(url))
}

export const postRequest = (url, body) => {
    return axios.post(createUrl(url), body)
}

export const putRequest = (url, body) => {
    return axios.put(createUrl(url), body)
}