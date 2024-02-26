export interface QuizTimelineApiData {
    quizTimeLineData: {
        label: string;
        value: number;
        id: number;
    }[];
}

export interface GroupTimelineApiData {
    hostGroupData: {
        id: number;
        label: string;
        value: number;
    }[];
}

export interface QuizParticipationGraphApiData {
    data: {
        id: number;
        name: string;
        ratio: {
            label: string;
            value: number;
        }[];
    }[];
}

export interface AvgScoreGraphApiData {
    avgScoreGraph: {
        label: string;
        value: number;
    }[];
}

export interface ParticipationGraphApiData {
    participationGraph: {
        label: string;
        value: number;
    }[];
}

export interface TopScorerListApiData {
    topScorerList: {
        id: number;
        name: string;
        scores: {
            name: string;
            score: number;
        }[];
    }[];
}

export interface GroupsApiData {
    groups: {
        title: string;
        members: number;
        image: string;
        pending: number;
    }[];
}
