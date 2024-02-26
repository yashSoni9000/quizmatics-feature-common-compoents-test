import { SideBarRoute } from "@src/ts/interfaces";

import {
    Event as EventIcon,
    SpaceDashboard as SpaceDashboardIcon,
    Group as GroupIcon,
    Bookmark as BookmarkIcon,
    Assessment as AssessmentIcon,
} from "@mui/icons-material";

export const HOST_SIDEBAR_PATHS: SideBarRoute[] = [
    {
        label: "Dashboard",
        url: "",
        Icon: SpaceDashboardIcon,
    },
    {
        label: "My Groups",
        url: "groups",
        Icon: GroupIcon,
    },
    {
        label: "My Quizzes",
        url: "quizzes",
        Icon: EventIcon,
    },
    {
        label: "Saved Questions",
        url: "questions",
        Icon: BookmarkIcon,
    },
];

export const PARTICIPANT_SIDEBAR_PATHS: SideBarRoute[] = [
    {
        label: "Dashboard",
        url: "",
        Icon: SpaceDashboardIcon,
    },
    {
        label: "My Groups",
        url: "groups",
        Icon: BookmarkIcon,
    },
    {
        label: "My Quizzes",
        url: "quizzes",
        Icon: EventIcon,
    },
    {
        label: "Progress Tracking",
        url: "progress",
        Icon: AssessmentIcon,
    },
];
