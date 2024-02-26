import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { Box, Grid, CircularProgress, Typography, Button } from "@mui/material";

import GroupViewer from "@src/components/GroupViewer";
import SearchField from "@src/components/SearchField";
import Info from "@images/info.png";
import { HOST_GROUPS_API } from "@src/constants/endpoints/host";

import { ResponseType, StrapiMultiResponse } from "@src/ts/types";
import { extractStrapiTableData } from "@src/utils";
import { axiosInstance } from "@src/utils/axiosInstance";

import { DOMAIN } from "@src/constants/endpoints";
import CreateGroupDialog from "./CreateGroupDialog";
import useAlertHook from "@src/hooks/UseAlertHook";
import { AlertPopup } from "@components/AlertPopup";
import DialogModal from "@components/DialogBox";

import Honors from "@images/groups/Honors.jpg";
import School from "@images/groups/img_backtoschool.jpg";
import Book from "@images/groups/img_bookclub.jpg";
import BreakFast from "@images/groups/img_breakfast.jpg";
import Code from "@images/groups/img_code.jpg";
import Graduation from "@images/groups/img_graduation.jpg";
import Language from "@images/groups/img_learnlanguage.jpg";
import Reachout from "@images/groups/img_reachout.jpg";

import { Delete, Launch, PeopleAlt } from "@mui/icons-material";

interface GroupsData {
    groups: ({
        id: number;
    } & Group)[];
}
interface Group {
    name: string;
    members: number;
    image: string;
    pendingRequest: number;
    Code: string;
}

const images = [
    Honors,
    Reachout,
    BreakFast,
    Graduation,
    Code,
    Language,
    Book,
    School,
];

export default function MyGroups() {
    const [data, setData] = useState<GroupsData | null>(null);
    const [showAddGroup, setShowGroup] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState<string>();
    const alertModal = useAlertHook();
    const [groupId, setGroupId] = useState<number>();

    const [searchParams, setSearchParams] = useSearchParams();
    const groupCode = searchParams.get("join");

    const [searchText, setSearchText] = useState("");

    const navigate = useNavigate();

    if (groupCode) {
        searchParams.delete("join");
        setSearchParams(searchParams);
        sessionStorage.removeItem("groupCode");
        alertModal.showMessage(
            "Groups can only be joined by participants",
            "warning",
        );
    }

    useEffect(() => {
        axiosInstance()
            .get(`${HOST_GROUPS_API}?filters[name][$contains]=${searchText}`)
            .then(({ data }: ResponseType<StrapiMultiResponse<Group>>) => {
                setData({ groups: extractStrapiTableData(data).reverse() });
            })
            .catch((error) => {
                alertModal.showMessage("Unable to fetch data");
                setError(error);
            });
    }, [alertModal.message, searchText]);

    function handleOnClick(id: number, index: number) {
        if (index === 0) {
            navigate({
                pathname: `/dashboard/quizzes`,
                search: `?group=${id}`,
            });
        } else {
            navigate({
                pathname: "/dashboard/pendingRequest",
                search: `?group=${id}`,
            });
        }
    }

    function closeShowGroupDialog() {
        setShowGroup(false);
    }

    function deleteGroup(id: number) {
        const groupId = data!.groups.find((p) => p.id === id)?.id;
        axiosInstance()
            .delete(`${HOST_GROUPS_API}/${groupId}`)
            .then(() => {
                alertModal.showMessage("Group Deleted successfully", "success");
            })
            .catch((error) => {
                alertModal.showMessage(error.message);
            })
            .finally(() => {
                setConfirmDelete(false);
                setGroupId(undefined);
            });
    }

    const menuOptions = [
        {
            id: 1,
            label: "Copy Link",
            Icon: Launch,
            handleOnClick: (id: number) => {
                if (!data) return;

                const code = data.groups.find((p) => p.id === id)?.Code;
                navigator.clipboard.writeText(
                    `${DOMAIN}/dashboard/groups?join=${code}`,
                );
                alertModal.showMessage("Link Copied to Clipboard", "success");
            },
        },
        {
            id: 2,
            label: "Delete",
            Icon: Delete,
            handleOnClick: (id: number) => {
                setGroupId(id);
                setConfirmDelete(true);
            },
        },
    ];

    const list = [
        {
            id: 1,
            label: "View Quizzes",
            handleOnClick: handleOnClick,
        },
        {
            id: 2,
            label: "Show Pending Requests",
            handleOnClick: handleOnClick,
        },
    ];

    if (error) {
        return (
            <Box className="flex justify-center items-center w-full h-full">
                <Typography variant="body1" color="initial">
                    Unable to fetch data
                </Typography>
                {alertModal.isOpen && (
                    <AlertPopup
                        severity={alertModal.severity}
                        message={alertModal.message}
                    />
                )}
            </Box>
        );
    }

    if (data === null) {
        return (
            <Box className="flex justify-center items-center w-full h-full">
                <CircularProgress />
            </Box>
        );
    }

    if (data.groups.length === 0) {
        <Box className="flex flex-col justify-center items-center w-full h-full">
            <Box
                component="img"
                src={Info}
                className="justify-center flex h-36 w-36"
            />
            <Typography
                variant="body1"
                sx={{
                    color: "background.contrastText",
                }}
                className="text-2xl"
            >
                {searchText.length === 0
                    ? "Please Join a group first"
                    : "No Groups found"}
            </Typography>
        </Box>;
    }

    return (
        <Box className="w-full h-full gap-4 flex flex-col">
            <Box className="flex flex-col md:flex-row w-full gap-4">
                <Box className="flex-row flex items-center gap-4 flex-1 justify-between">
                    <Typography className="text-xl xs:text-2xl shrink-0">
                        My Groups
                    </Typography>
                    <SearchField
                        searchText={searchText}
                        className=""
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                </Box>
                <Box className="flex gap-2 w-fit">
                    <Button
                        variant="contained"
                        className="capitalize"
                        size="small"
                    >
                        <Link to="/dashboard/groups/pendingRequest">
                            Pending Requests
                        </Link>
                    </Button>

                    <Button
                        variant="contained"
                        className="capitalize"
                        size="small"
                        onClick={() => setShowGroup(true)}
                    >
                        Create Group
                    </Button>
                </Box>
            </Box>
            <Box>
                {data.groups.length !== 0 ? (
                    <>
                        <Grid container spacing={2}>
                            {data.groups.map(
                                (
                                    { id, name, members, pendingRequest },
                                    index,
                                ) => (
                                    <Grid key={id} item xs={12} sm={6} lg={4}>
                                        <GroupViewer
                                            title={name}
                                            header={`${members} members`}
                                            HeaderIcon={PeopleAlt}
                                            imageUrl={
                                                images[index % images.length]
                                            }
                                            menuOptions={menuOptions}
                                            list={list}
                                            subHeader={`${
                                                pendingRequest || 0
                                            } Pending`}
                                        />
                                    </Grid>
                                ),
                            )}
                        </Grid>
                    </>
                ) : (
                    <>
                        <Box className="flex flex-col justify-center items-center w-full h-full">
                            <Box
                                component="img"
                                src={Info}
                                className="justify-center flex h-36 w-36"
                            />
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "background.contrastText",
                                }}
                                className="text-2xl"
                            >
                                {searchText.length === 0
                                    ? "Please Join a group first"
                                    : "No Groups found"}
                            </Typography>
                        </Box>
                        ;
                    </>
                )}
            </Box>

            {showAddGroup && (
                <CreateGroupDialog
                    showAddGroup={showAddGroup}
                    closeShowGroupDialog={closeShowGroupDialog}
                    alertModal={alertModal}
                />
            )}

            {alertModal.isOpen && (
                <AlertPopup
                    severity={alertModal.severity}
                    message={alertModal.message}
                />
            )}
            {confirmDelete && (
                <ConfirmDelete
                    id={groupId}
                    deleteGroup={deleteGroup}
                    handleClose={() => setConfirmDelete(false)}
                />
            )}
        </Box>
    );
}

function ConfirmDelete({
    id,
    handleClose,
    deleteGroup,
}: {
    id: number | undefined;
    handleClose: () => void;
    deleteGroup: (id: number) => void;
}) {
    return (
        <DialogModal
            open={true}
            buttons={[
                { label: "Cancel", onClick: handleClose },
                {
                    label: "Confirm",
                    onClick: () => {
                        id && deleteGroup(id);
                    },
                    className: "bg-red-500 capitalize",
                    variant: "contained",
                },
            ]}
            header={`Delete Group`}
            handleClose={handleClose}
        >
            <Box className="flex flex-col gap-2 text-gray-700">
                <Typography className="flex gap-1">
                    Are you sure you want to delete group?
                </Typography>
                <Typography>
                    This action cannot be undone, and all members will be
                    permanently removed.
                </Typography>
            </Box>
        </DialogModal>
    );
}
