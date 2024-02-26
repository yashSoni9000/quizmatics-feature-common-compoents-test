import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Box, Tab } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import Table from "@src/components/table";
import useDataGridHooks from "@src/hooks/UseDatagridHooks";
import useAlertHook from "@src/hooks/UseAlertHook";

import { axiosInstance } from "@src/utils/axiosInstance";
import { AlertPopup } from "@components/AlertPopup";
import { EventFor, ResponseType, StrapiMultiResponse } from "@src/ts/types";
import { HOST_GROUPS_API, QUIZZESS_API } from "@constants/endpoints/host";
import { Groups, Quiz } from "@interfaces/host";
import { extractStrapiTableData } from "@src/utils";

interface Props {
    tableHeaders: GridColDef[][];
    refreshData?: boolean;
    getFilterString: (
        paginationModel: GridPaginationModel,
        currentTab: Status,
        searchText: string,
        selectedGroup: number,
    ) => string;
}

interface GroupListData {
    label: string;
    fields: {
        label: string;
        value: number;
    }[];
}

export enum Status {
    Active = "active",
    Upcoming = "upcoming",
    Completed = "completed",
}

type QuizData = Omit<Quiz, "groups"> & {
    groups: string[];
};

export default function QuizzesTable({
    tableHeaders,
    refreshData,
    getFilterString,
}: Props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const alertModal = useAlertHook();

    const tabParams = searchParams.get("tabIndex");
    const groupParam = searchParams.get("group");

    const [currentTab, setCurrentTab] = useState(getCurrentTabInitialValue);
    const quizTableData = useDataGridHooks<QuizData[]>([]);

    const [selectedGroup, setSelectedGroup] = useState({
        id: Number(groupParam?.split("-")[0]),
        name: "Select Group",
    });

    const [groupList, setGroupList] = useState<GroupListData>({
        label: "Select Group",
        fields: [],
    });

    const [searchText, setSearchText] = useState("");

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
        {
            page: 0,
            pageSize: 8,
        },
    );

    const tabPanels = [
        { label: "Active", value: Status.Active },
        { label: "Upcoming", value: Status.Upcoming },
        { label: "Completed", value: Status.Completed },
    ];

    useEffect(() => {
        if (groupParam) {
            const splitGroupParam = groupParam.split("-");
            const id = Number(splitGroupParam[0]);

            let name = splitGroupParam.slice(1).join(" ").replace("+", " ");
            if (!name.length) name = "Select Group";

            setSelectedGroup({ id, name });
        }
    }, []);

    function getCurrentTabInitialValue() {
        //eslint-disable-next-line
        if (tabParams && Object.values(Status).includes(tabParams as any)) {
            return tabParams as Status;
        } else {
            return Status.Active;
        }
    }

    useEffect(() => {
        quizTableData.updateIsLoading(true);

        const filterString = getFilterString(
            paginationModel,
            currentTab,
            searchText,
            selectedGroup.id,
        );

        axiosInstance()
            .get(`${QUIZZESS_API}?populate[0]=groups&${filterString}`)
            .then(({ data }: ResponseType<StrapiMultiResponse<Quiz>>) => {
                const quizData = extractStrapiTableData(data);

                const formattedQuizData = quizData.map((quiz) => {
                    const groupNames = quiz.groups
                        ? quiz.groups.data.map((group) => group.attributes.name)
                        : [];

                    return {
                        ...quiz,
                        groups: groupNames,
                    };
                });

                quizTableData.updateState(
                    formattedQuizData,
                    false,
                    undefined,
                    false,
                    data.meta.pagination.total,
                );
            })
            .catch((error) => {
                quizTableData.updateState([], true, error, false, 0);
                alertModal.showMessage(error.message);
            });
    }, [paginationModel, currentTab, searchText, selectedGroup, refreshData]);

    useEffect(() => {
        axiosInstance()
            .get(HOST_GROUPS_API)
            .then(({ data }: ResponseType<StrapiMultiResponse<Groups>>) => {
                const groups = extractStrapiTableData(data).map(
                    ({ name, id }) => {
                        return {
                            label: name,
                            value: id,
                        };
                    },
                );
                setGroupList({ label: "Select Group", fields: groups });
            })
            .catch((error) => alertModal.showMessage(error.message));
    }, []);

    useEffect(() => {
        searchParams.set("tabIndex", currentTab);
        setSearchParams(searchParams);
    }, [currentTab]);

    function handleTabChange(_: unknown, value: Status) {
        setCurrentTab(value);
    }

    function updateSearchText({
        target: { value },
    }: EventFor<"input", "onChange">) {
        setSearchText(value);
    }

    function handleGroupChange(value: number, name?: string) {
        setSelectedGroup({ id: value, name: name || "Select Group" });
        if (name) {
            searchParams.set("group", `${value}-${name}`);
            setSearchParams(searchParams);
        }
    }

    return (
        <Box className="w-full flex-1 h-full flex flex-col">
            <TabContext value={currentTab || "1"}>
                <Box className="border-b mb-3" sx={{ borderColor: "divider" }}>
                    <TabList
                        onChange={handleTabChange}
                        aria-label="lab API tabs example"
                    >
                        {tabPanels.map(({ label, value }) => (
                            <Tab
                                key={value}
                                value={value}
                                label={label}
                                className="text-xs sm:text-base"
                            />
                        ))}
                    </TabList>
                </Box>

                {tabPanels.map((tabPanel, index) => {
                    const { isLoading, data, count } = quizTableData;
                    const header = tableHeaders[index],
                        { value } = tabPanel;

                    return (
                        <TabPanel
                            value={value}
                            className={`flex flex-col p-0 overflow-y-scroll ${
                                currentTab === value ? "flex-1" : ""
                            }`}
                            key={value}
                        >
                            <Table
                                isLoading={isLoading}
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                columns={header}
                                rows={data}
                                rowCount={count}
                                pageSizeOptions={[6, 8, 10, 20, 50]}
                                searchField={{
                                    searchText: searchText,
                                    handleOnChange: updateSearchText,
                                    placeholder: "Search",
                                }}
                                filterButtons={[
                                    {
                                        title: selectedGroup.name,
                                        data: groupList!,
                                        showSearchField: true,
                                        handleOnChange: handleGroupChange,
                                    },
                                ]}
                            />
                        </TabPanel>
                    );
                })}
            </TabContext>

            {alertModal.isOpen && (
                <AlertPopup
                    message={alertModal.message}
                    severity={alertModal.severity}
                />
            )}
        </Box>
    );
}
