import axios, { AxiosError, AxiosResponse } from 'axios';

import { userSignoutSuccess } from 'store/auth/actions';

const failedAuthInterceptors = (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
        userSignoutSuccess();
        // localStorage.removeItem('user');
    }
    return Promise.reject(error);
};

const successAuthInterceptors = (response: AxiosResponse) => {
    return response;
};

export const cairote = axios.create({
    baseURL: process.env.CAIROTE_URL,
    withCredentials: true,
});
cairote.interceptors.response.use(successAuthInterceptors, failedAuthInterceptors);

export const sesterces = axios.create({
    baseURL: process.env.SESTERCES_URL,
    withCredentials: true,
});
sesterces.interceptors.response.use(successAuthInterceptors, failedAuthInterceptors);
