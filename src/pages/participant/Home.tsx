import { useEffect } from "react";
import { useNavigate } from "react-router";

import { Box, Grid } from "@mui/material";
import { Search } from "@mui/icons-material";

import CardContainer from "@components/common/CardContainer";
import LineGraph, { LineGraphData } from "@components/charts/LineGraph";
import BarGraph, { BarGraphData } from "@components/charts/BarGraph";
import PieGraph, { PieGraphSeriesData } from "@components/charts/PieGraph";

import UseGenericStateHooks from "@src/hooks/UseGenericStateHook";
import UseSearchButtonHooks from "@src/hooks/UseFilterOptionHooks";

import { ResponseType, StrapiSingleResponse } from "@src/ts/types";

import {
    AVERAGE_QUIZ_SCORE_GRAPH_API,
    CATEGORY_WISE_SCORES_API,
    GROUP_DATA_API,
    QUIZ_DATA_API,
    RANKING_GRAPH_API,
    SCORE_DISTRIBUTION_API,
} from "@src/constants/endpoints/participant";

import {
    GroupApiData,
    QuizDisplayApiData,
    AvgScoreGraphApiData,
    CategoryWiseScoreApiData,
    QuizRankGraphApiData,
    QuizWiseScoreDistributionApiData,
} from "@src/ts/interfaces/participant";

import DataDisplayCard, {
    DataDisplayCardData,
} from "@src/components/common/DataDisplayCard";

import { axiosInstance } from "@src/utils/axiosInstance";
import { extractStrapiResponseData } from "@src/utils";

export default function Home() {
    const quizDisplayCard = UseGenericStateHooks<DataDisplayCardData[]>([]);
    const groupDisplayCard = UseGenericStateHooks<DataDisplayCardData[]>([]);

    const averageScoreGraph = UseGenericStateHooks<LineGraphData>({
        header: [],
        data: [],
    });

    const categoryWiseScoreGraph = UseGenericStateHooks<BarGraphData>({
        header: [],
        data: [],
    });
    const navigate = useNavigate();
    const scoreDistributionGraphData = UseGenericStateHooks<
        PieGraphSeriesData[]
    >([]);

    const scoreDistributionSearch = UseSearchButtonHooks(
        [],
        getScoreDistributionGraphData,
        getScoreDistributionSearchList,
    );

    const quizzesRankingGraphData = UseGenericStateHooks<LineGraphData>({
        header: [],
        data: [],
    });

    useEffect(() => {
        getQuizDisplayCardData();
        getGroupDisplayCardData();
        getAverageScoreGraphData();
        getCategoryWiseScoresData();
        getQuizzesRankingGraphData();
    }, []);

    useEffect(getScoreDistributionGraphData, [
        scoreDistributionSearch.selectedValue,
    ]);

    function getLabelFromValue(
        searchButton: ReturnType<typeof UseSearchButtonHooks>,
    ) {
        return searchButton.list.find(
            (obj) => obj.value === searchButton.selectedValue,
        )?.label;
    }

    function handleQuizDisplayDataOnClick(id?: number) {
        if (id) {
            navigate({
                pathname: "/dashboard/quizzes/all",
                search: `?tabIndex=${
                    ["active", "upcoming", "completed"][id - 1]
                }`,
            });
        }
    }

    function handleGroupDisplayDataOnClick(id?: number) {
        if (id) {
            navigate({
                pathname: "/dashboard/groups",
            });
        }
    }

    function getQuizDisplayCardData() {
        quizDisplayCard.updateIsLoading(true);

        axiosInstance()
            .get(QUIZ_DATA_API)
            .then(
                ({
                    data,
                }: ResponseType<StrapiSingleResponse<QuizDisplayApiData>>) => {
                    quizDisplayCard.updateState(
                        extractStrapiResponseData(data).quizTimeLineData,
                    );
                },
            )
            .catch(() => {
                quizDisplayCard.updateState([], true);
            });
    }

    function getGroupDisplayCardData() {
        groupDisplayCard.updateIsLoading(true);

        axiosInstance()
            .get(GROUP_DATA_API)
            .then(
                ({
                    data,
                }: ResponseType<StrapiSingleResponse<GroupApiData>>) => {
                    groupDisplayCard.updateState(
                        extractStrapiResponseData(data).participantGroupData,
                    );
                },
            )
            .catch((error) => {
                groupDisplayCard.updateState([], true, error);
            });
    }

    function getAverageScoreGraphData() {
        averageScoreGraph.updateIsLoading(true);

        axiosInstance()
            .get(AVERAGE_QUIZ_SCORE_GRAPH_API)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<AvgScoreGraphApiData>
                >) => {
                    const extractedData = extractStrapiResponseData(data);
                    averageScoreGraph.updateState({
                        header: extractedData.header,
                        data: extractedData.values,
                    });
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

    function getCategoryWiseScoresData() {
        categoryWiseScoreGraph.updateIsLoading(true);

        axiosInstance()
            .get(CATEGORY_WISE_SCORES_API)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<CategoryWiseScoreApiData>
                >) => {
                    const extractedData = extractStrapiResponseData(data);
                    categoryWiseScoreGraph.updateState({
                        header: extractedData.header,
                        data: extractedData.values,
                    });
                },
            )
            .catch((error) => {
                categoryWiseScoreGraph.updateState(
                    { header: [], data: [] },
                    true,
                    error,
                );
            });
    }

    function getQuizzesRankingGraphData() {
        quizzesRankingGraphData.updateIsLoading(true);

        axiosInstance()
            .get(RANKING_GRAPH_API)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<QuizRankGraphApiData>
                >) => {
                    const extractedData = extractStrapiResponseData(data);
                    quizzesRankingGraphData.updateState({
                        header: extractedData.header,
                        data: extractedData.values,
                    });
                },
            )
            .catch((error) => {
                quizzesRankingGraphData.updateState(
                    { header: [], data: [] },
                    true,
                    error,
                );
            });
    }

    function getScoreDistributionGraphData() {
        scoreDistributionGraphData.updateIsLoading(true);

        axiosInstance()
            .get(SCORE_DISTRIBUTION_API)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<QuizWiseScoreDistributionApiData>
                >) => {
                    const obj = extractStrapiResponseData(
                        data,
                    ).quizWiseDistribution.find(
                        (obj) =>
                            obj.id === scoreDistributionSearch.selectedValue,
                    );

                    if (!obj) {
                        const { value, id } =
                            extractStrapiResponseData(data)
                                .quizWiseDistribution[0];
                        scoreDistributionGraphData.updateState(value);
                        scoreDistributionSearch.updateSelectedValue(id);
                    } else {
                        scoreDistributionGraphData.updateState(obj.value);
                    }
                },
            )
            .catch((error) => {
                scoreDistributionGraphData.updateState([], true, error);
            });
    }

    function getScoreDistributionSearchList(search?: string) {
        scoreDistributionSearch.updateIsLoading(true);

        axiosInstance()
            .get(SCORE_DISTRIBUTION_API)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<QuizWiseScoreDistributionApiData>
                >) => {
                    let list = extractStrapiResponseData(
                        data,
                    ).quizWiseDistribution.map((obj) => {
                        return { label: obj.name, value: obj.id };
                    });
                    if (search) {
                        list = list.filter((obj) =>
                            obj.label
                                .toLowerCase()
                                .trim()
                                .includes(search.trim().toLowerCase()),
                        );
                    }
                    scoreDistributionSearch.updateList(list);
                },
            )
            .catch((error) => {
                scoreDistributionSearch.updateList([], true, error);
            });
    }

    return (
        <Box className="w-full h-fit">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                    <DataDisplayCard
                        title="Quizzes"
                        fieldsCount={3}
                        handleOnClick={handleQuizDisplayDataOnClick}
                        updateData={getGroupDisplayCardData}
                        {...quizDisplayCard}
                    />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <DataDisplayCard
                        title="Groups"
                        fieldsCount={2}
                        handleOnClick={handleGroupDisplayDataOnClick}
                        updateData={getGroupDisplayCardData}
                        {...groupDisplayCard}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CardContainer title="Average Score in Past Quizzes">
                        <LineGraph
                            className="h-80 flex justify-center w-full"
                            updateData={getAverageScoreGraphData}
                            {...averageScoreGraph}
                        />
                    </CardContainer>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CardContainer title="Categories Wise Average Scores">
                        <BarGraph
                            className="h-80 flex justify-center w-full"
                            updateData={getCategoryWiseScoresData}
                            {...categoryWiseScoreGraph}
                        />
                    </CardContainer>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CardContainer
                        title="Per Quiz Performance Distribution"
                        searchButton={{
                            Icon: Search,
                            updateData: getScoreDistributionGraphData,
                            placeholder: "Search Quizzes",
                            ...scoreDistributionSearch,
                        }}
                    >
                        <PieGraph
                            key={scoreDistributionSearch.selectedValue}
                            title={`Quiz Name: ${
                                getLabelFromValue(scoreDistributionSearch) || ""
                            }`}
                            updateData={getScoreDistributionGraphData}
                            className="h-80 flex justify-center w-full"
                            {...scoreDistributionGraphData}
                        />
                    </CardContainer>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CardContainer title="Past Ranking in Quizzes">
                        <LineGraph
                            className="h-80 flex justify-center w-full"
                            updateData={getQuizzesRankingGraphData}
                            {...quizzesRankingGraphData}
                        />
                    </CardContainer>
                </Grid>
            </Grid>
        </Box>
    );
}
