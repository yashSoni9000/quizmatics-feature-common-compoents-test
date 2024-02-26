import { useState } from "react";
import { Box, Typography, Popover } from "@mui/material";

import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";

import useAlertHook from "@src/hooks/UseAlertHook";
import QuizzesTable, { Status } from "@components/QuizzesTable";

import { AlertPopup } from "@components/AlertPopup";
import { formatDateReadable } from "@src/utils";

export default function MyQuizzes() {
    const alertModal = useAlertHook();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [popOverState, setPopOverState] = useState({
        open: false,
        content: "",
    });

    const handlePopoverOpen = (
        event: React.MouseEvent<HTMLElement>,
        groupNames: string,
    ) => {
        setPopOverState({ open: true, content: groupNames });
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setPopOverState((currentState) => {
            return { ...currentState, open: false };
        });

        setAnchorEl(null);
    };

    const activeQuizTableHeaders: GridColDef[] = [
        {
            field: "name",
            headerName: "Name",
            minWidth: 250,
            sortable: false,
            flex: 2,
        },
        {
            field: "groups",
            headerName: "Group",
            minWidth: 200,
            sortable: false,
            flex: 2,
            renderCell: (params) => {
                const groupNames = params.formattedValue.join(", ");

                return (
                    <TableGroupColumnCell
                        groupNames={groupNames}
                        handlePopoverOpen={handlePopoverOpen}
                        handlePopoverClose={handlePopoverClose}
                    />
                );
            },
        },
        {
            field: "endDate",
            headerName: "Ends On",
            minWidth: 200,
            sortable: false,
            flex: 2,
            valueFormatter: (params: { value: Date }) =>
                formatDateReadable(new Date(params.value)),
        },
        {
            field: "category",
            headerName: "Category",
            minWidth: 100,
            sortable: false,
            flex: 1,
        },
    ];

    const upcomingQuizTableHeaders: GridColDef[] = [
        {
            field: "name",
            headerName: "Name",
            minWidth: 250,
            sortable: false,
            flex: 2,
        },
        {
            field: "groups",
            headerName: "Group",
            minWidth: 200,
            sortable: false,
            flex: 2,
            renderCell: (params) => {
                const groupNames = params.formattedValue.join(", ");

                return (
                    <TableGroupColumnCell
                        groupNames={groupNames}
                        handlePopoverOpen={handlePopoverOpen}
                        handlePopoverClose={handlePopoverClose}
                    />
                );
            },
        },
        {
            field: "startDate",
            headerName: "Starts On",
            minWidth: 200,
            sortable: false,
            flex: 1,
            valueFormatter: (params: { value: Date }) =>
                formatDateReadable(new Date(params.value)),
        },
        {
            field: "endDate",
            headerName: "End Date",
            minWidth: 200,
            sortable: false,
            flex: 1,
            valueFormatter: (params: { value: Date }) =>
                formatDateReadable(new Date(params.value)),
        },
        {
            field: "category",
            headerName: "Category",
            minWidth: 100,
            sortable: false,
            flex: 1,
        },
    ];

    const completedQuizTableHeaders: GridColDef[] = [
        {
            field: "name",
            headerName: "Name",
            minWidth: 300,
            sortable: false,
            flex: 2,
        },
        {
            field: "groups",
            headerName: "Group",
            minWidth: 200,
            sortable: false,
            flex: 2,
            renderCell: (params) => {
                const groupNames = params.formattedValue.join(", ");

                return (
                    <TableGroupColumnCell
                        groupNames={groupNames}
                        handlePopoverOpen={handlePopoverOpen}
                        handlePopoverClose={handlePopoverClose}
                    />
                );
            },
        },
        {
            field: "endDate",
            headerName: "Completed On",
            minWidth: 200,
            sortable: false,
            flex: 1,
            valueFormatter: (params: { value: Date }) =>
                formatDateReadable(new Date(params.value)),
        },
        {
            field: "score",
            headerName: "Average Score",
            minWidth: 150,
            sortable: false,
            align: "center",
            headerAlign: "center",
            flex: 1.15,
        },
        {
            field: "category",
            headerName: "Category",
            minWidth: 150,
            sortable: false,
            flex: 1,
        },
    ];

    const tableHeaders = [
        activeQuizTableHeaders,
        upcomingQuizTableHeaders,
        completedQuizTableHeaders,
    ];

    function getFilterString(
        paginationModel: GridPaginationModel,
        currentTab: Status,
        searchText?: string,
        selectedGroup?: number,
    ) {
        let filterString = `filters[status][$eq]=${currentTab}`;

        filterString = `${filterString}&pagination[page]=${
            paginationModel.page + 1
        }&pagination[pageSize]=${paginationModel.pageSize}`;

        if (searchText) {
            const nameFilter = `filters[$or][0][name][$contains]=${searchText}`;
            const categoryFilter = `filters[$or][1][category][$contains]=${searchText}`;
            const difficultyFilter = `filters[$or][2][difficulty][$contains]=${searchText}`;

            filterString = `${filterString}&${nameFilter}&${categoryFilter}&${difficultyFilter}`;
        }

        if (selectedGroup) {
            filterString = `${filterString}&filters[groups][id][$eq]=${selectedGroup}`;
        }

        return filterString;
    }

    return (
        <Box className="h-full flex flex-col">
            <Typography className="text-xl sm:text-2xl" variant="h5">
                My Quizzes
            </Typography>

            <Box className="flex-1">
                <QuizzesTable
                    tableHeaders={tableHeaders}
                    getFilterString={getFilterString}
                />
            </Box>

            {alertModal.isOpen && (
                <AlertPopup
                    isOpen={alertModal.isOpen}
                    severity={alertModal.severity}
                    message={alertModal.message}
                />
            )}
            {
                <Popover
                    open={popOverState.open}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    className="ellipsiss w-full pointer-events-none"
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    <Typography className="p-2">
                        {popOverState.content}
                    </Typography>
                </Popover>
            }
        </Box>
    );
}

function TableGroupColumnCell({
    groupNames,
    handlePopoverOpen,
    handlePopoverClose,
}: {
    groupNames: string;
    handlePopoverOpen: (
        event: React.MouseEvent<HTMLElement>,
        groupNames: string,
    ) => void;
    handlePopoverClose: () => void;
}) {
    return (
        <Typography
            className="text-sm ellipsiss w-full max-w-full text-start"
            onMouseEnter={(e) => {
                handlePopoverOpen(e, groupNames);
            }}
            onMouseLeave={handlePopoverClose}
        >
            {groupNames}
        </Typography>
    );
}
