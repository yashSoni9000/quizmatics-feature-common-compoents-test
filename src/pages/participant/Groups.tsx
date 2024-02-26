import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    Box,
    Grid,
    CircularProgress,
    Typography,
    Button,
    TextField,
    InputAdornment,
} from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";

import GroupViewer from "@src/components/GroupViewer";
import { axiosInstance } from "@src/utils/axiosInstance";
import { extractStrapiTableData, getGroups } from "@src/utils";
import { ResponseType, StrapiMultiResponse } from "@src/ts/types";
import { Groups } from "@src/ts/interfaces/host";
import useAlertHook from "@src/hooks/UseAlertHook";
import { AlertPopup } from "@src/components/AlertPopup";
import JoinGroupDialog from "./JoinGroupDialog";
import { USER_API_POPULATE } from "@src/constants/endpoints";

import Info from "@images/info.png";
import Honors from "@images/groups/Honors.jpg";
import School from "@images/groups/img_backtoschool.jpg";
import Book from "@images/groups/img_bookclub.jpg";
import BreakFast from "@images/groups/img_breakfast.jpg";
import Code from "@images/groups/img_code.jpg";
import Graduation from "@images/groups/img_graduation.jpg";
import Language from "@images/groups/img_learnlanguage.jpg";
import Reachout from "@images/groups/img_reachout.jpg";
import { PeopleAlt } from "@mui/icons-material";

interface GroupsData {
    groups: {
        id: number;
        title: string;
        members: number;
        image: string;
    }[];
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

const status = ["active", "upcoming", "completed"];

export default function MyGroups() {
    const [data, setData] = useState<GroupsData | null>(null);
    const [openGroup, setOpenGroup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const alertModal = useAlertHook();
    const [searchParams, setSearchParams] = useSearchParams();

    const groupCode = searchParams.get("join");
    const [searchText, setSearchText] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (groupCode) {
            getGroups()
                .then(({ data }: ResponseType<StrapiMultiResponse<Groups>>) => {
                    const groups = extractStrapiTableData(data);

                    const selectedGroup = groups.find(
                        (p) => p.Code.toLowerCase() === groupCode.toLowerCase(),
                    );
                    if (selectedGroup) {
                        axiosInstance()
                            .get("/api/users/me?populate=*")
                            .then(({ data }) => {
                                const id = data.id;
                                const ids = data.groups.map(
                                    (p: { id: number }) => p.id,
                                );
                                return axiosInstance().put(`api/users/${id}`, {
                                    groups: [...ids, selectedGroup.id],
                                });
                            });
                    } else {
                        sessionStorage.removeItem("groupCode");
                        throw new Error("Invalid Group Code");
                    }
                })
                .then(() => {
                    setTimeout(() => setRefresh((val) => !val));
                    alertModal.showMessage(
                        "Group Joined Successfully",
                        "success",
                    );
                    searchParams.delete("join");
                    setRefresh((val) => !val);
                    setSearchParams(searchParams);

                    sessionStorage.removeItem("groupCode");
                })
                .catch((e) => alertModal.showMessage(e.message));
        }
    }, []);

    useEffect(() => {
        axiosInstance()
            .get(USER_API_POPULATE)
            .then(({ data }: { data: { groups: Groups[] } }) => {
                const obj = data.groups
                    .map(({ id, name, members }, index) => {
                        return {
                            id,
                            title: name,
                            members,
                            image: images[index % 8],
                        };
                    })
                    .reverse();

                const newData = obj.filter((p) =>
                    p.title
                        .toLowerCase()
                        .trim()
                        .includes(searchText.trim().toLowerCase()),
                );

                setData({ groups: newData });
            })
            .catch((error) => {
                setError(true);
                alertModal.showMessage(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [refresh, searchText, alertModal.message]);

    function getImage(name: string): string {
        return name;
    }

    function handleOnClick(id: number, index: number) {
        navigate({
            pathname: "/dashboard/quizzes/all",
            search: `tabIndex=${status[index]}&group=${id}`,
        });
    }

    const list = [
        {
            id: 1,
            label: "View Active Quizzes",
            handleOnClick: handleOnClick,
        },
        {
            id: 2,
            label: "View Upcoming Quizzes",
            handleOnClick: handleOnClick,
        },
        {
            id: 3,
            label: "View Completed Quizzes",
            handleOnClick: handleOnClick,
        },
    ];

    return (
        <Box className="w-full h-full flex flex-col gap-2">
            <Box className="flex flex-col sm:flex-row justify-around items-center gap-2">
                <Typography className="text-2xl flex-1 mr-auto gap-2">
                    My Groups
                </Typography>
                <Box className="flex gap-2 w-fit ml-auto justify-end sm:w-auto flex-1">
                    <TextField
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <GridSearchIcon className="w-fit" />
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            sx: { backgroundColor: "background.textBoxColor" },
                        }}
                        placeholder={"Search Groups"}
                        value={searchText}
                        className="flex-1"
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                    <Button
                        variant="contained"
                        className="text-xs sm:text-base capitalize"
                        onClick={() => setOpenGroup(true)}
                    >
                        Join Group
                    </Button>
                </Box>
            </Box>
            {!error ? (
                <>
                    {!isLoading ? (
                        <>
                            {data!.groups.length !== 0 ? (
                                <Grid container spacing={2}>
                                    {data?.groups.map(
                                        ({ id, title, members, image }) => (
                                            <Grid
                                                key={title}
                                                item
                                                xs={12}
                                                sm={6}
                                                lg={4}
                                            >
                                                <GroupViewer
                                                    title={title}
                                                    header={`${members} members`}
                                                    HeaderIcon={PeopleAlt}
                                                    imageUrl={getImage(image)}
                                                    list={list.map((item) => {
                                                        return {
                                                            ...item,
                                                            id: id,
                                                        };
                                                    })}
                                                />
                                            </Grid>
                                        ),
                                    )}
                                </Grid>
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
                                </>
                            )}
                        </>
                    ) : (
                        <Box className="flex justify-center items-center w-full h-full">
                            <CircularProgress />
                        </Box>
                    )}
                    {openGroup && (
                        <JoinGroupDialog
                            open={openGroup}
                            setRefresh={setRefresh}
                            handleClose={() => {
                                setOpenGroup(false);
                            }}
                            alertModal={alertModal}
                        />
                    )}
                </>
            ) : (
                <Box className="flex justify-center items-center w-full h-full">
                    <Typography variant="body1" color="initial">
                        Unable to fetch Data
                    </Typography>
                </Box>
            )}
            {error && (
                <Box className="flex justify-center items-center w-full h-full">
                    <Typography variant="body1" color="initial">
                        Unable To Load Groups
                    </Typography>
                </Box>
            )}
            {alertModal.isOpen && (
                <AlertPopup
                    severity={alertModal.severity}
                    message={alertModal.message}
                />
            )}
        </Box>
    );
}
