import axios from "axios";

import { HOST_GROUPS_API } from "@src/constants/endpoints/host";
import { STRAPI_API } from "@src/constants/endpoints";
import { getToken, setToken } from "./token";
import { axiosInstance } from "./axiosInstance";
import { User } from "../ts/interfaces/host";

export function registerAccount(data: User) {
    return axios.post(`${STRAPI_API}/users`, data);
}

export function loginAccount(data: { identifier: string; password: string }) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${STRAPI_API}/auth/local`, data)
            .then(({ data }) => {
                setToken(data.jwt);
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export async function checkEmailExists(email: string): Promise<boolean> {
    const url = `${STRAPI_API}/users/?filters[email][$eq]=${email}`;
    return new Promise((resolve, reject) => {
        axios
            .get(url)
            .then((res) => {
                if (res.data.length) {
                    resolve(true);
                }

                resolve(false);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function getCurrentUser(token?: string | null) {
    return axios.get(`${STRAPI_API}/users/me?populate=*`, {
        headers: { Authorization: `Bearer ${token || getToken()}` },
    });
}

export function getGroups() {
    return axiosInstance().get(HOST_GROUPS_API);
}

export function makeid(length = 6) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
        counter += 1;
    }
    return result;
}
