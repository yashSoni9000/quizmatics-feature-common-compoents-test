import { useState } from "react";
import { Button, Box, Typography, Popover } from "@mui/material";

import {
    GridColDef,
    GridMoreVertIcon,
    GridPaginationModel,
} from "@mui/x-data-grid";

import useAlertHook from "@src/hooks/UseAlertHook";
import MenuButton from "@components/MenuButton";
import AddQuizStepperForm from "./quizStepperForm";

import QuizzesTable, { Status } from "@components/QuizzesTable";
import { AlertPopup } from "@components/AlertPopup";
import { formatDateReadable } from "@src/utils";

import { CopyAll } from "@mui/icons-material";

export default function MyQuizzes() {
    const alertModal = useAlertHook();

    const [showStepperForm, setShowStepperForm] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

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

    function copyCodeToClipboard(code: string) {
        navigator.clipboard.writeText(code);
        alertModal.showMessage("Code copied to clipboard", "success");
    }

    const activeQuizTableHeaders: GridColDef[] = [
        {
            field: "name",
            headerName: "Name",
            minWidth: 250,
            sortable: false,
            flex: 2,
            renderCell: (params) => {
                const { code, name } = params.row;
                return (
                    <TableNameColumnCell
                        name={name}
                        code={code}
                        copyCodeToClipboard={copyCodeToClipboard}
                    />
                );
            },
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
            field: "difficulty",
            headerName: "Difficulty",
            minWidth: 100,
            sortable: false,
            flex: 1,
        },
        {
            field: "category",
            headerName: "Category",
            minWidth: 100,
            sortable: false,
            flex: 1,
        },
        {
            field: "action",
            headerName: "Actions",
            minWidth: 100,
            align: "center",
            headerAlign: "center",
            flex: 1,
            renderCell: (params) => {
                const { code } = params.row;
                return (
                    <TableActionColumnCell
                        code={code}
                        copyCodeToClipboard={copyCodeToClipboard}
                    />
                );
            },
        },
    ];

    const upcomingQuizTableHeaders: GridColDef[] = [
        {
            field: "name",
            headerName: "Name",
            minWidth: 250,
            sortable: false,
            flex: 2,
            renderCell: (params) => {
                const { code, name } = params.row;
                return (
                    <TableNameColumnCell
                        name={name}
                        code={code}
                        copyCodeToClipboard={copyCodeToClipboard}
                    />
                );
            },
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
            field: "difficulty",
            headerName: "Difficulty",
            minWidth: 100,
            sortable: false,
            flex: 1,
        },
        {
            field: "category",
            headerName: "Category",
            minWidth: 100,
            sortable: false,
            flex: 1,
        },
        {
            field: "action",
            headerName: "Actions",
            minWidth: 100,
            align: "center",
            headerAlign: "center",
            flex: 1,
            renderCell: (params) => {
                const { code } = params.row;
                return (
                    <TableActionColumnCell
                        code={code}
                        copyCodeToClipboard={copyCodeToClipboard}
                    />
                );
            },
        },
    ];

    const completedQuizTableHeaders: GridColDef[] = [
        {
            field: "name",
            headerName: "Name",
            minWidth: 300,
            sortable: false,
            flex: 2,
            renderCell: (params) => {
                const { code, name } = params.row;
                return (
                    <TableNameColumnCell
                        name={name}
                        code={code}
                        copyCodeToClipboard={copyCodeToClipboard}
                    />
                );
            },
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
            field: "difficulty",
            headerName: "Difficulty",
            minWidth: 150,
            sortable: false,
            flex: 1,
        },
        {
            field: "category",
            headerName: "Category",
            minWidth: 150,
            sortable: false,
            flex: 1,
        },
        {
            field: "action",
            headerName: "Actions",
            minWidth: 100,
            align: "center",
            headerAlign: "center",
            flex: 1,
            renderCell: (params) => {
                const { code } = params.row;
                return (
                    <TableActionColumnCell
                        code={code}
                        copyCodeToClipboard={copyCodeToClipboard}
                    />
                );
            },
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
            <Box className="flex justify-between">
                <Typography className="text-xl sm:text-2xl" variant="h5">
                    My Quizzes
                </Typography>
                <Button
                    color="primary"
                    variant="contained"
                    className="text-xs sm:text-base p-1 px-2 capitalize"
                    onClick={() => setShowStepperForm(true)}
                >
                    Add a Quiz
                </Button>
            </Box>
            <Box className="flex-1">
                <QuizzesTable
                    tableHeaders={tableHeaders}
                    refreshData={refreshData}
                    getFilterString={getFilterString}
                />
            </Box>

            {showStepperForm && (
                <AddQuizStepperForm
                    handleClose={() => {
                        setShowStepperForm(false);
                        setRefreshData((val) => !val);
                    }}
                />
            )}

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

function TableNameColumnCell({
    name,
    code,
    copyCodeToClipboard,
}: {
    name: string;
    code: string;
    copyCodeToClipboard: (code: string) => void;
}) {
    return (
        <Box className="flex gap-2">
            <Typography className="text-sm">{name}</Typography>
            <Typography
                className="text-xs align-bottom cursor-pointer"
                component="sub"
                onClick={() => copyCodeToClipboard(code)}
            >
                #{code}
            </Typography>
        </Box>
    );
}

function TableActionColumnCell({
    code,
    copyCodeToClipboard,
}: {
    code: string;
    copyCodeToClipboard: (code: string) => void;
}) {
    return (
        <MenuButton
            Icon={GridMoreVertIcon}
            list={[
                {
                    id: 1,
                    label: "Copy join link",
                    Icon: CopyAll,
                    handleOnClick: () => copyCodeToClipboard(code),
                },
            ]}
        />
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
