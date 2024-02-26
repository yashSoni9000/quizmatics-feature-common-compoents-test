import { useEffect } from "react";
import { Box, Grid } from "@mui/material";

import UseGenericStateHooks from "@src/hooks/UseGenericStateHook";
import UseFilterOptionHooks from "@src/hooks/UseFilterOptionHooks";
import CardContainer from "@src/components/common/CardContainer";
import LineGraph, { LineGraphData } from "@src/components/charts/LineGraph";
import PieGraph, { PieGraphSeriesData } from "@src/components/charts/PieGraph";

import { ResponseType, StrapiSingleResponse } from "@src/ts/types";
import { STRAPI_API } from "@src/constants/endpoints";

import {
    PERFORMANCE_FIFTEEN_DAYS,
    PERFORMANCE_SEVEN_DAYS,
} from "@src/constants/endpoints/participant";

import {
    PastRankingProgressApiData,
    ScoreDistributionProgressApiData,
} from "@src/ts/interfaces/participant";

import {
    RANK_FIFTEEN_DAYS,
    RANK_SEVEN_DAYS,
} from "@src/constants/endpoints/participant";

import BarGraph from "@src/components/charts/BarGraph";
import { axiosInstance } from "@src/utils/axiosInstance";
import { extractStrapiResponseData } from "@src/utils";

const selectDaysList = [
    { label: "7 Days", value: 1 },
    { label: "15 Days", value: 2 },
];

const quizScoreDistributionUrls = [
    PERFORMANCE_SEVEN_DAYS,
    PERFORMANCE_FIFTEEN_DAYS,
];

const pastRankingGraphUrls = [RANK_SEVEN_DAYS, RANK_FIFTEEN_DAYS];
interface CategoryData {
    header: string[];
    value: number[];
}

interface AverageScore {
    header: string[];
    value: number[];
}

export default function ProgressTracking() {
    const quizScoreDistributionGraph = UseGenericStateHooks<
        PieGraphSeriesData[]
    >([]);

    const quizScoreDistributionSelect = UseFilterOptionHooks(
        selectDaysList,
        getQuizScoreDistributionGraphData,
        undefined,
        1,
    );

    const pastQuizzesRankingGraph = UseGenericStateHooks<LineGraphData>({
        header: [],
        data: [],
    });

    const pastQuizzesRankingSelect = UseFilterOptionHooks(
        selectDaysList,
        getPastQuizzesRankingGraphData,
        undefined,
        1,
    );

    const categoryWiseScores = UseGenericStateHooks<LineGraphData>({
        header: [],
        data: [],
    });

    const categoryWiseScoresSelect = UseFilterOptionHooks(
        selectDaysList,
        getCategoryWiseScores,
        undefined,
        1,
    );

    const averageScores = UseGenericStateHooks<LineGraphData>({
        header: [],
        data: [],
    });

    const averageScoresSelect = UseFilterOptionHooks(
        selectDaysList,
        getCategoryWiseScores,
        undefined,
        1,
    );

    useEffect(getQuizScoreDistributionGraphData, [
        quizScoreDistributionSelect.selectedValue,
    ]);

    useEffect(getPastQuizzesRankingGraphData, [
        pastQuizzesRankingSelect.selectedValue,
    ]);

    useEffect(getCategoryWiseScores, [categoryWiseScoresSelect.selectedValue]);

    useEffect(getAverageScores, [averageScoresSelect.selectedValue]);

    function getQuizScoreDistributionGraphData() {
        const selectedValue = quizScoreDistributionSelect.selectedValue || 1;
        const url = quizScoreDistributionUrls[(selectedValue || 1) - 1];

        quizScoreDistributionGraph.updateIsLoading(true);
        axiosInstance()
            .get(`${STRAPI_API}/${url}`)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<ScoreDistributionProgressApiData>
                >) => {
                    const extractedData = extractStrapiResponseData(data).data;
                    quizScoreDistributionGraph.updateState(extractedData);
                },
            )
            .catch((error) =>
                quizScoreDistributionGraph.updateState([], true, error),
            );
    }

    function getPastQuizzesRankingGraphData() {
        const selectedValue = pastQuizzesRankingSelect.selectedValue || 1;
        const url = pastRankingGraphUrls[(selectedValue || 1) - 1];

        pastQuizzesRankingGraph.updateIsLoading(true);
        axiosInstance()
            .get(`${STRAPI_API}/${url}`)
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<PastRankingProgressApiData>
                >) => {
                    const extractedData = extractStrapiResponseData(data);
                    pastQuizzesRankingGraph.updateState({
                        header: extractedData.data.header,
                        data: extractedData.data.value,
                    });
                },
            )
            .catch((error) => {
                pastQuizzesRankingGraph.updateState(
                    { header: [], data: [] },
                    true,
                    error,
                );
            });
    }

    function getCategoryWiseScores() {
        categoryWiseScores.updateIsLoading(true);
        axiosInstance()
            .get("/api/category-wise-score")
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<{ categoryWiseScore: CategoryData[] }>
                >) => {
                    const obj =
                        extractStrapiResponseData(data).categoryWiseScore;

                    if (categoryWiseScoresSelect.selectedValue === 1) {
                        categoryWiseScores.updateState({
                            header: obj[0].header,
                            data: obj[0].value,
                        });
                    } else {
                        categoryWiseScores.updateState({
                            header: obj[1].header,
                            data: obj[1].value,
                        });
                    }
                },
            )
            .catch((error) => {
                categoryWiseScores.updateState(
                    { header: [], data: [] },
                    true,
                    error,
                );
            });
    }

    function getAverageScores() {
        averageScores.updateIsLoading(true);
        axiosInstance()
            .get("/api/average-score")
            .then(
                ({
                    data,
                }: ResponseType<
                    StrapiSingleResponse<{ averageScores: AverageScore[] }>
                >) => {
                    const obj = extractStrapiResponseData(data).averageScores;
                    if (averageScoresSelect.selectedValue === 1) {
                        averageScores.updateState({
                            header: obj[0].header,
                            data: obj[0].value,
                        });
                    } else {
                        averageScores.updateState({
                            header: obj[1].header,
                            data: obj[1].value,
                        });
                    }
                },
            )
            .catch((error) => {
                averageScores.updateState(
                    { header: [], data: [] },
                    true,
                    error,
                );
            });
    }

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <CardContainer
                        title="Quiz Performance Distribution"
                        selectField={{
                            label: "Select Days",
                            readOnly: true,
                            defaultValue: selectDaysList.find(
                                (p) =>
                                    quizScoreDistributionSelect.selectedValue ===
                                    p.value,
                            ) || { label: "7 days", value: 1 },
                            ...quizScoreDistributionSelect,
                        }}
                    >
                        <PieGraph
                            key={quizScoreDistributionSelect.selectedValue}
                            updateData={getQuizScoreDistributionGraphData}
                            className="h-72 flex justify-center w-full"
                            {...quizScoreDistributionGraph}
                        />
                    </CardContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <CardContainer
                        title="Past Quizzess Ranking Graph"
                        selectField={{
                            label: "Select Days",
                            readOnly: true,
                            defaultValue: selectDaysList.find(
                                (p) =>
                                    pastQuizzesRankingSelect.selectedValue ===
                                    p.value,
                            ) || { label: "7 days", value: 1 },
                            ...pastQuizzesRankingSelect,
                        }}
                    >
                        <LineGraph
                            key={pastQuizzesRankingSelect.selectedValue}
                            updateData={getPastQuizzesRankingGraphData}
                            className="h-72 flex justify-center w-full"
                            {...pastQuizzesRankingGraph}
                        />
                    </CardContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <CardContainer
                        title="Category Wise Average Scores"
                        selectField={{
                            label: "Select Days",
                            readOnly: true,
                            defaultValue: selectDaysList.find(
                                (p) =>
                                    categoryWiseScoresSelect.selectedValue ===
                                    p.value,
                            ) || { label: "7 days", value: 1 },
                            ...categoryWiseScoresSelect,
                        }}
                    >
                        <BarGraph
                            key={categoryWiseScoresSelect.selectedValue}
                            updateData={getCategoryWiseScores}
                            className="h-72 flex justify-center w-full"
                            {...categoryWiseScores}
                        />
                    </CardContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <CardContainer
                        title="Average Score in Past Quizzes"
                        selectField={{
                            label: "Select Days",
                            readOnly: true,
                            defaultValue: selectDaysList.find(
                                (p) =>
                                    averageScoresSelect.selectedValue ===
                                    p.value,
                            ) || { label: "7 days", value: 1 },
                            ...averageScoresSelect,
                        }}
                    >
                        <LineGraph
                            key={averageScoresSelect.selectedValue}
                            updateData={getAverageScores}
                            className="h-72 flex justify-center w-full"
                            {...averageScores}
                        />
                    </CardContainer>
                </Grid>
            </Grid>
        </Box>
    );
}
