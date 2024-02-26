import axios from "axios";
import { getToken } from "./token";

export function axiosInstance() {
    const instance = axios.create({
        baseURL: "http://localhost:1337/",
    });

    instance.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (!token) window.location.pathname = "login";
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response && error.response.status === 401) {
                window.location.pathname = "/signup";
            }
            return Promise.reject(error);
        },
    );

    return instance;
}
