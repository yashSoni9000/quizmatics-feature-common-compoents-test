import { HOST_GROUPS_API } from "@src/constants/endpoints/host";
import { axiosInstance } from "./axiosInstance";
import { USER_API } from "@src/constants/endpoints";
import { ResponseType, StrapiMultiResponse } from "@src/ts/types";
import { Groups } from "@src/ts/interfaces/host";
import { extractStrapiTableData } from ".";

interface User {
    groups: { name: string }[];
}

export function checkIfGroupWithNameExist(name: string) {
    return new Promise<boolean>((resolve, reject) => {
        axiosInstance()
            .get(`${USER_API}?populate[0]=groups`)
            .then(({ data }: { data: User }) => {
                const names = data.groups.map((p) => p.name.toLowerCase());

                resolve(names.includes(name.toLowerCase()));
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function getGroupIdFromName(name: string) {
    return new Promise<number>((resolve, reject) => {
        axiosInstance()
            .get(`${HOST_GROUPS_API}?filters[name][$eqi]=${name}`)
            .then(({ data }: ResponseType<StrapiMultiResponse<Groups>>) => {
                if (!data.data.length) {
                    throw new Error("Group with name doesn't exist");
                }
                resolve(extractStrapiTableData(data)[0].id);
            })
            .catch((error) => reject(error));
    });
}
