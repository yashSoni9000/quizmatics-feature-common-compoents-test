import { useEffect } from "react";
import { useNavigate } from "react-router";

import { Box, Grid } from "@mui/material";
import { Search } from "@mui/icons-material";

import UseGenericStateHooks from "@src/hooks/UseGenericStateHook";
import UseFilterOptionHooks from "@src/hooks/UseFilterOptionHooks";

import CardContainer from "@src/components/common/CardContainer";
import { ResponseType, StrapiSingleResponse } from "@src/ts/types";

import LineGraph, { LineGraphData } from "@src/components/charts/LineGraph";
import PieGraph, { PieGraphSeriesData } from "@src/components/charts/PieGraph";

import {
    AVERAGE_SCORE_GRAPH_API,
    PARTICIPATION_GRAPH_API,
    QUIZ_PARTICIPATION_RATIO,
    TOP_SCORER_API,
} from "@src/constants/endpoints/host";

import {
    AvgScoreGraphApiData,
    ParticipationGraphApiData,
    QuizParticipationGraphApiData,
    TopScorerListApiData,
} from "@src/ts/interfaces/host/home";

import DataDisplayCard, {
    DataDisplayCardData,
} from "@src/components/common/DataDisplayCard";

import {
    GroupTimelineApiData,
    QuizTimelineApiData,
} from "@src/ts/interfaces/host";

import { axiosInstance } from "@src/utils/axiosInstance";
import { extractStrapiResponseData } from "@src/utils";

import ListDisplay, {
    ListDisplayData,
} from "@src/components/common/ListDisplay";

const status = ["active", "upcoming", "completed"];

export default function Home() {
    const quizDisplayCard = UseGenericStateHooks<DataDisplayCardData[]>([]);
    const groupDisplayCard = UseGenericStateHooks<DataDisplayCardData[]>([]);

    const participationDistributionGraph = UseGenericStateHooks<
        PieGraphSeriesData[]
    >([]);

    const participationDistributionSearch = UseFilterOptionHooks(
        undefined,
        getQuizParticipationGraphData,
        getQuizParticipationSearchList,
        1,
    );

    const averageScoreGraph = UseGenericStateHooks<LineGraphData>({
        header: [],
        data: [],
    });

    const quizParticipationGraph = UseGenericStateHooks<LineGraphData>({
        header: [],
        data: [],
    });
    const navigate = useNavigate();

    const topScorerListDisplay = UseGenericStateHooks<ListDisplayData[]>([]);

    const topScorerListSearch = UseFilterOptionHooks(
        undefined,
        getTopScorerListData,
        getTopScorerSearchList,
        1,
    );

    useEffect(() => {
        getQuizDisplayCardData();
        getGroupDisplayCardData();
        getAverageScoreGraphData();
        getParticipationGraphData();
    }, []);

    useEffect(getQuizParticipationGraphData, [
        participationDistributionSearch.selectedValue,
    ]);

    useEffect(getTopScorerListData, [topScorerListSearch.selectedValue]);

    function getLabelFromValue(
        searchButton: ReturnType<typeof UseFilterOptionHooks>,
    ) {
        return searchButton.unfilteredList.find(
            (obj) => obj.value === searchButton.selectedValue,
        )?.label;
    }
    function handleQuizDisplayDataOnClick(id?: number) {
        if (id) {
            navigate({
                pathname: "/dashboard/quizzes",
                search: `?tabIndex=${status[id - 1]}`,
            });
        }
    }

    function handleGroupDisplayDataOnClick(id?: number) {
        if (id === 1) {
            navigate({
                pathname: "/dashboard/groups",
            });
        } else {
            navigate("/dashboard/groups/pendingRequest");
        }
    }

    function getQuizDisplayCardData() {
        quizDisplayCard.updateIsLoading(true);

        axiosInstance()
            .get(`api/host-quiz-multi-display-card`)
            .then(
                ({
                    data,
                }: ResponseType<StrapiSingleResponse<QuizTimelineApiData>>) => {
                    quizDisplayCard.updateState(
                        extractStrapiResponseData(data).quizTimeLineData,
                    );
                },
            )
            .catch((error) => {
                quizDisplayCard.updateState([], true, error);
            });
    }

    function getGroupDisplayCardData() {
        groupDisplayCard.updateIsLoading(true);

        axiosInstance()
            .get(`api/host-group`)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<GroupTimelineApiData>
                >) => {
                    groupDisplayCard.updateState(
                        extractStrapiResponseData(data).hostGroupData,
                    );
                },
            )
            .catch((error) => {
                groupDisplayCard.updateState([], true, error);
            });
    }

    function getQuizParticipationSearchList(search?: string) {
        participationDistributionSearch.updateIsLoading(true);

        axiosInstance()
            .get(QUIZ_PARTICIPATION_RATIO)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<QuizParticipationGraphApiData>
                >) => {
                    let list = extractStrapiResponseData(data).data.map(
                        (obj) => {
                            return { label: obj.name, value: obj.id };
                        },
                    );
                    participationDistributionSearch.updateUnFilteredList(list);
                    if (search) {
                        list = list.filter((obj) =>
                            obj.label
                                .toLowerCase()
                                .trim()
                                .includes(search.trim().toLowerCase()),
                        );
                    }
                    participationDistributionSearch.updateList(list);
                },
            )
            .catch((error) => {
                participationDistributionSearch.updateList([], true, error);
            });
    }

    function getQuizParticipationGraphData() {
        participationDistributionGraph.updateIsLoading(true);

        axiosInstance()
            .get(QUIZ_PARTICIPATION_RATIO)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<QuizParticipationGraphApiData>
                >) => {
                    const obj2 =
                        extractStrapiResponseData<QuizParticipationGraphApiData>(
                            data,
                        );
                    const obj = obj2.data.find(
                        (obj) =>
                            obj.id ===
                            participationDistributionSearch.selectedValue,
                    );

                    if (!obj) {
                        const { ratio, id } = obj2.data[0];
                        participationDistributionGraph.updateState(ratio);
                        participationDistributionSearch.updateSelectedValue(id);
                    } else {
                        participationDistributionGraph.updateState(obj.ratio);
                    }
                },
            )
            .catch((error) => {
                participationDistributionGraph.updateState([], true, error);
            });
    }

    function getParticipationGraphData() {
        quizParticipationGraph.updateIsLoading(true);

        axiosInstance()
            .get(PARTICIPATION_GRAPH_API)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<ParticipationGraphApiData>
                >) => {
                    const header: string[] = [];
                    const values: number[] = [];

                    extractStrapiResponseData(data).participationGraph.forEach(
                        (participation) => {
                            header.push(participation.label);
                            values.push(participation.value);
                        },
                    );

                    quizParticipationGraph.updateState({
                        header,
                        data: values,
                    });
                },
            )
            .catch((error) => {
                quizParticipationGraph.updateState(
                    { header: [], data: [] },
                    true,
                    error,
                );
            });
    }

    function getAverageScoreGraphData() {
        averageScoreGraph.updateIsLoading(true);

        axiosInstance()
            .get(AVERAGE_SCORE_GRAPH_API)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<AvgScoreGraphApiData>
                >) => {
                    const header: string[] = [];
                    const values: number[] = [];

                    extractStrapiResponseData(data).avgScoreGraph.forEach(
                        (score) => {
                            header.push(score.label);
                            values.push(score.value);
                        },
                    );

                    averageScoreGraph.updateState({ header, data: values });
                },
            )
            .catch((error) => {
                averageScoreGraph.updateState(
                    { header: [], data: [] },
                    true,
                    error,
                );
            });
    }
    function getTopScorerListData(search?: string) {
        topScorerListDisplay.updateIsLoading(true);

        axiosInstance()
            .get(TOP_SCORER_API)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<TopScorerListApiData>
                >) => {
                    const obj = extractStrapiResponseData(
                        data,
                    ).topScorerList.find(
                        (obj) => obj.id === topScorerListSearch.selectedValue,
                    );

                    if (!obj) {
                        const { id, scores } =
                            extractStrapiResponseData(data).topScorerList[0];
                        topScorerListDisplay.updateState(
                            scores.map((score, index) => {
                                return {
                                    id: index,
                                    label: score.name,
                                    value: score.score,
                                };
                            }),
                        );
                        topScorerListSearch.updateSelectedValue(id);
                    } else {
                        let list = obj.scores.map((item, index) => {
                            return {
                                id: index,
                                label: item.name,
                                value: item.score,
                            };
                        });
                        if (search) {
                            list = list.filter((obj) =>
                                obj.label
                                    .toLowerCase()
                                    .trim()
                                    .includes(search.trim().toLowerCase()),
                            );
                        }
                        topScorerListDisplay.updateState(list);
                    }
                },
            )
            .catch(() => {
                topScorerListDisplay.updateState([], true);
            });
    }

    function getTopScorerSearchList() {
        topScorerListSearch.updateIsLoading(true);
        axiosInstance()
            .get(TOP_SCORER_API)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<TopScorerListApiData>
                >) => {
                    let list = extractStrapiResponseData(
                        data,
                    ).topScorerList.map((item) => {
                        return {
                            label: item.name,
                            value: item.id,
                        };
                    });
                    topScorerListSearch.updateUnFilteredList(list);

                    if (topScorerListSearch.searchText) {
                        list = list.filter((p) =>
                            p.label
                                .toLowerCase()
                                .trim()
                                .includes(
                                    topScorerListSearch.searchText
                                        .trim()
                                        .toLowerCase(),
                                ),
                        );
                    }
                    topScorerListSearch.updateList(list);
                },
            )
            .catch(() => {
                topScorerListSearch.updateList([], true);
            });
    }

    return (
        <Box className="w-full h-fit">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                    <DataDisplayCard
                        title="Quizzes"
                        fieldsCount={3}
                        updateData={getGroupDisplayCardData}
                        handleOnClick={handleQuizDisplayDataOnClick}
                        {...quizDisplayCard}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <DataDisplayCard
                        title="Groups"
                        fieldsCount={3}
                        updateData={getGroupDisplayCardData}
                        handleOnClick={handleGroupDisplayDataOnClick}
                        {...groupDisplayCard}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CardContainer
                        title="Per Quiz Participation Distribution"
                        searchButton={{
                            Icon: Search,
                            updateData: getQuizParticipationGraphData,
                            placeholder: "Search Quizzes",
                            ...participationDistributionSearch,
                        }}
                    >
                        <PieGraph
                            key={participationDistributionSearch.selectedValue}
                            title={`Quiz Name: ${
                                getLabelFromValue(
                                    participationDistributionSearch,
                                ) || ""
                            }`}
                            updateData={getQuizParticipationGraphData}
                            className="h-96 flex justify-center w-full"
                            {...participationDistributionGraph}
                        />
                    </CardContainer>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CardContainer title="Average Score in Past Quizzes">
                        <LineGraph
                            className="h-96 flex justify-center w-full"
                            updateData={getAverageScoreGraphData}
                            {...averageScoreGraph}
                        />
                    </CardContainer>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CardContainer title="Past Quizzes Participation Chart">
                        <LineGraph
                            className="h-96 flex justify-center w-full"
                            updateData={getParticipationGraphData}
                            {...quizParticipationGraph}
                        />
                    </CardContainer>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CardContainer
                        title="Top Participants in Quiz"
                        searchButton={{
                            Icon: Search,
                            placeholder: "Search Quizzes",
                            updateData: getTopScorerListData,
                            ...topScorerListSearch,
                        }}
                    >
                        <ListDisplay
                            key={topScorerListSearch.selectedValue}
                            title={`Quiz Name: ${getLabelFromValue(
                                topScorerListSearch,
                            )}`}
                            className="h-96 flex w-full"
                            listSx={{ backgroundColor: "background.paper" }}
                            updateData={getTopScorerListData}
                            {...topScorerListDisplay}
                        />
                    </CardContainer>
                </Grid>
            </Grid>
        </Box>
    );
}
