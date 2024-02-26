export interface AvgScoreGraphApiData {
    header: string[];
    values: number[];
}
export interface QuizDisplayApiData {
    quizTimeLineData: {
        label: string;
        value: number;
        id: number;
    }[];
}

export interface GroupApiData {
    participantGroupData: {
        label: string;
        value: number;
        id: number;
    }[];
}

export interface CategoryWiseScoreApiData {
    header: string[];
    values: number[];
}

export interface QuizWiseScoreDistributionApiData {
    quizWiseDistribution: {
        id: number;
        name: string;
        value: {
            label: string;
            value: number;
        }[];
    }[];
}

export interface QuizRankGraphApiData {
    header: string[];
    values: number[];
}

export interface ScoreDistributionProgressApiData {
    data: {
        label: string;
        value: number;
    }[];
}

export interface PastRankingProgressApiData {
    data: { header: string[]; value: number[] };
}

export interface ActiveQuizzesCardApiData {
    data: {
        id: number;
        category: string;
        questions: number;
        points: number;
        duration: number;
        endDate: string;
    }[];
}

export interface UpcomingQuizzesCardApiData {
    data: {
        id: number;
        category: string;
        questions: number;
        points: number;
        duration: number;
        startDate: string;
    }[];
}
export interface CompletedQuizCardApiData {
    data: {
        id: number;
        category: string;
        rank: number;
        score: number;
        totalScore: number;
        endDate: string;
    }[];
}
