import { StrapiMultiResponse, StrapiSingleResponse } from "@src/ts/types";
import { axiosInstance } from "./axiosInstance";
import { HOST_GROUPS_API } from "@src/constants/endpoints/host";
import axios from "axios";
import fileDownload  from "js-file-download";
// import fileDownload from "js-file-download";

export function formatDateReadable(date: Date) {
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    } as const;

    const formattedDate = new Date(date).toLocaleDateString(undefined, options);
    return formattedDate;
}

export function extractStrapiResponseData<Type>(
    data: StrapiSingleResponse<Type>,
) {
    return { ...data.data.attributes, id: data.data.id };
}

export function extractStrapiTableData<Type>(
    data: StrapiMultiResponse<Type>,
): ({ id: number } & Type)[] {
    return data.data.map((obj) => {
        return { id: obj.id, ...obj.attributes };
    });
}

export function getGroups() {
    return axiosInstance().get(HOST_GROUPS_API);
}

export function downloadFile(name: string) {
    return axios
        .get(
            "https://docs.google.com/spreadsheets/d/1F6_nDPSdRHQwLwOZEkTUmKqJ7q5hHYAz/export?gid=227267533&format=xlsx",
            {
                responseType: "blob",
            },
        )
        .then((data) => {
            fileDownload(
                data.data,
                `${name}-${new Date().toLocaleDateString()}.xlsx`,
            );
        });
}

export function extractDataFromResponse(data: {
    data: { attributes: object };
}) {
    return data.data.attributes;
}
