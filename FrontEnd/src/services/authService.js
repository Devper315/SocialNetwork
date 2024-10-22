import { API } from "../configs/config"
import httpClient from "../configs/httpClient"

export const login = async (form) => {
    return await httpClient.post(API.LOGIN, form)
}

export const register = async (form) => {
    return await httpClient.post(API.REGISTER, form)
}


