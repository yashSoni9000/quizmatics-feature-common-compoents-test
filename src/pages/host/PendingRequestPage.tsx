import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Box, Typography, Button } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";

import useAlertHook from "@src/hooks/UseAlertHook";
import useDataGridHooks from "@src/hooks/UseDatagridHooks";
import Table from "@components/table";

import { axiosInstance } from "@src/utils/axiosInstance";
import { AlertPopup } from "@components/AlertPopup";
import { Groups } from "@interfaces/host";
import { getGroupIdFromName } from "@src/utils/groups";

import {
    HOST_GROUPS_API,
    PENDING_REQUEST_API,
} from "@constants/endpoints/host";

import {
    ResponseType,
    StrapiMultiResponse,
    StrapiSingleResponse,
} from "@src/ts/types";

import {
    extractStrapiResponseData,
    extractStrapiTableData,
    formatDateReadable,
} from "@src/utils";

interface GroupListData {
    label: string;
    fields: {
        label: string;
        value: number;
    }[];
}

interface PendingRequest {
    id: string;
    name: string;
    Date: string;
    group: string;
}

interface PendingRequestApiData {
    id: string;
    name: string;
    Date: string;
    group: StrapiSingleResponse<Groups>;
}

export default function PendingRequestPage() {
    const alertModal = useAlertHook();

    const pendingRequestData = useDataGridHooks<PendingRequest[]>([]);
    const [refresh, setRefresh] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const groupParam = searchParams.get("group");

    const [selectedGroup, setSelectedGroup] = useState({
        name: groupParam || "Select Group",
        id: 0,
    });

    const [groupList, setGroupList] = useState<GroupListData>({
        label: selectedGroup.name,
        fields: [],
    });

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
        {
            page: 0,
            pageSize: 8,
        },
    );

    useEffect(() => {
        if (groupParam) {
            getGroupIdFromName(groupParam)
                .then((groupId) => {
                    setSelectedGroup((group) => {
                        return {
                            ...group,
                            id: groupId,
                        };
                    });
                    getGroupList();
                })
                .catch(() => {
                    setSelectedGroup({ name: "Select Group", id: 0 });
                    alertModal.showMessage(
                        "Unable to set default filter. Please select manually",
                    );
                });
        } else {
            getGroupList();
        }
    }, []);

    useEffect(getPendingRequests, [
        selectedGroup.id,
        refresh,
        pendingRequestData.searchText,
        paginationModel,
    ]);

    function getGroupList() {
        axiosInstance()
            .get(HOST_GROUPS_API)
            .then(({ data }: ResponseType<StrapiMultiResponse<Groups>>) => {
                const extractedData = extractStrapiTableData(data);

                const formattedGroupListData = extractedData.map(
                    ({ name, id }) => {
                        return {
                            label: name,
                            value: id,
                        };
                    },
                );

                setGroupList({
                    label: selectedGroup.name,
                    fields: formattedGroupListData,
                });
            })
            .catch((error) => {
                alertModal.showMessage(error.message);
            });
    }

    function managePendingRequest(id: number, method: "accept" | "reject") {
        axiosInstance()
            .delete(`${PENDING_REQUEST_API}/${id}`)
            .then(() => {
                if (method === "accept") {
                    alertModal.showMessage("Request Accepted", "success");
                } else {
                    alertModal.showMessage("Request Rejected", "success");
                }
                setRefresh((value) => !value);
            })
            .catch(() => {
                alertModal.showMessage(
                    "Unable to perform operation, Please try again.",
                );
            });
    }

    function getGroupDetailsFromValue(value: number | undefined) {
        if (!value) return undefined;

        const group = groupList.fields.find((group) => group.value === value);
        return group;
    }

    function handleGroupFilterChange(value: number) {
        const group = getGroupDetailsFromValue(value);
        if (!group) return;

        setSelectedGroup({ name: group.label, id: group.value });
        setSearchParams({ group: group.label });
    }

    function getPendingRequests() {
        pendingRequestData.updateIsLoading(true);

        let filterString = `pagination[page]=${
            paginationModel.page + 1
        }&pagination[pageSize]=${paginationModel.pageSize}`;

        if (selectedGroup.id) {
            filterString = `${filterString}&filters[group][id][$eq]=${selectedGroup.id}`;
        }

        axiosInstance()
            .get(`${PENDING_REQUEST_API}?populate[0]=group&${filterString}`)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiMultiResponse<PendingRequestApiData>
                >) => {
                    const formattedPendingRequestData: PendingRequest[] =
                        extractStrapiTableData(data).map((pendingRequest) => {
                            return {
                                ...pendingRequest,
                                group: getNameFromGroupData(
                                    pendingRequest.group,
                                ),
                            };
                        });

                    pendingRequestData.updateState(
                        formattedPendingRequestData,
                        false,
                        undefined,
                        false,
                        data.meta.pagination.total,
                    );
                },
            )
            .catch((error) => {
                alertModal.showMessage(error.message);
            });
    }

    function getNameFromGroupData(group: StrapiSingleResponse<Groups>) {
        return extractStrapiResponseData(group).name;
    }

    const headers: GridColDef[] = [
        {
            field: "name",
            headerName: "User",
            minWidth: 300,
            sortable: false,
            flex: 4,
        },
        {
            field: "date",
            headerName: "Date Sent",
            minWidth: 150,
            sortable: false,
            flex: 2,
            valueFormatter: (params: { value: Date }) =>
                formatDateReadable(new Date(params.value)),
        },

        {
            field: "group",
            headerName: "Group",
            minWidth: 150,
            sortable: false,
            flex: 2,
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 300,
            sortable: false,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => {
                return (
                    <Box className="flex gap-2">
                        <Button
                            variant="contained"
                            className=" capitalize"
                            sx={{ backgroundColor: "background.focusColor" }}
                            size="small"
                            onClick={() => {
                                managePendingRequest(params.row.id, "accept");
                            }}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="text"
                            className="capitalize shadow-none hover:bg-none"
                            sx={{
                                color: "background.contrastText",
                            }}
                            size="small"
                            onClick={() => {
                                managePendingRequest(params.row.id, "reject");
                            }}
                        >
                            Reject
                        </Button>
                    </Box>
                );
            },
        },
    ];

    return (
        <>
            <Box className="flex flex-col gap-3 md:gap-4 h-full">
                <Box>
                    <Typography variant="h5">Pending Requests</Typography>
                </Box>
                <Box className="h-full">
                    <Table
                        isLoading={pendingRequestData.isLoading}
                        columns={headers}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        rows={pendingRequestData.data}
                        rowCount={pendingRequestData.count}
                        pageSizeOptions={[5, 8, 20, 50]}
                        searchField={{
                            searchText: pendingRequestData.searchText,
                            handleOnChange: pendingRequestData.updateSearchText,
                            placeholder: "Search Users",
                        }}
                        filterButtons={[
                            {
                                title: groupList!.label,
                                data: groupList!,
                                showSearchField: true,
                                handleOnChange: handleGroupFilterChange,
                            },
                        ]}
                    />
                </Box>
            </Box>
            {alertModal.isOpen && (
                <AlertPopup
                    message={alertModal.message}
                    severity={alertModal.severity}
                />
            )}
        </>
    );
}
