import { GridRowProps } from "@mui/x-data-grid";

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

export interface QuizzesData extends GridRowProps {
    id: string;
    name: string;
    startDate: Date;
    group: {
        data: {
            id: number;
        };
    };
    endDate: Date;
    category: string;
    difficulty: string;
}

export interface Quizzes {
    quizzes: QuizzesData[];
}

export interface Groups {
    id: number;
    Code: string;
    joined: boolean;
    name: string;
    pendingRequest: number;
    members: number;
}

export enum Status {
    Active = "active",
    Upcoming = "upcoming",
    Completed = "completed",
}
export enum Visibility {
    Public = "public",
    Private = "private",
}

export interface Quiz {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    name?: string;
    startDate?: Date;
    endDate?: Date;
    category?: string;
    description?: string;
    timeLimit?: number;
    skipQuestion?: boolean;
    canGoBack?: boolean;
    randomizeQuestions?: boolean;
    revealQuestionsAtEnd?: boolean;
    enableProctoredMode?: boolean;
    questions?: object[];
    score?: number;
    difficulty?: string;
    scoreReleased?: boolean;
    status?: Status;
    visibility?: Visibility;
    group?: { data: Group };
    code?: string;
    groups?: { data: Group[] };
    rank?: number;
    points?: number;
}

export interface Group {
    id: number;
    attributes: {
        createdAt: Date;
        updatedAt: Date;
        publishedAt?: Date;
        name: string;
        pendingRequest?: number;
        members?: number;
        Code?: string;
        joined?: boolean;
        quizzes: { data: Quiz[] };
        quizzess?: { data: Quiz[] };
    };
}
