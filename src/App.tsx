import { Navigate, useRoutes } from "react-router-dom";

import AuthPage from "./pages/AuthPage/AuthPage";
import Dashboard from "@layout/Dashboard";

import GoogleAuthInterceptor from "./pages/AuthPage/GoogleAuthInterceptor";
import ProtectedRoute from "./routes/ProtectedRoutes";
import RoleBasedRoutes from "@src/routes/RouteWrapper";
import PublicRoutes from "@routes/PublicRoutes";

import HostHome from "@pages/host/Home";
import HostGroups from "@pages/host/Groups";
import HostQuizzes from "@pages/host/MyQuizzes";
import SavedQuestions from "@pages/host/SavedQuestions";

import AllQuizzes from "@pages/participant/AllQuizzes";
import ParticipantHome from "@pages/participant/Home";
import ParticpantGroups from "@pages/participant/Groups";
import ProgressTracking from "@pages/participant/ProgressTracking";
import ParticipantQuizzes from "@pages/participant/MyQuizzes";
import PendingRequestPage from "./pages/host/PendingRequestPage";

import UnauthorizedPage from "@pages/UnauthorizedPage";
import PageNotFound from "@pages/PageNotFound";
import { Role } from "@src/ts/enums";

import "@styles/App.css";

function App() {
    const authPages = ["login", "signup"].map((path) => {
        return {
            path,
            element: (
                <PublicRoutes redirect="/dashboard">
                    <AuthPage />
                </PublicRoutes>
            ),
        };
    });

    const routes = useRoutes([
        {
            path: "/",
            element: <Navigate to="/dashboard" />,
        },
        {
            path: "/dashboard",
            element: (
                <ProtectedRoute
                    allowedRoles={[Role.Host, Role.Participant]}
                    redirect="/signup"
                >
                    <Dashboard />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "quizzes/all",
                    index: true,
                    element: (
                        <RoleBasedRoutes
                            component={[
                                {
                                    role: Role.Participant,
                                    page: AllQuizzes,
                                },
                            ]}
                        />
                    ),
                },
                {
                    path: "quizzes",
                    element: (
                        <RoleBasedRoutes
                            component={[
                                {
                                    role: Role.Host,
                                    page: HostQuizzes,
                                },
                                {
                                    role: Role.Participant,
                                    page: ParticipantQuizzes,
                                },
                            ]}
                        />
                    ),
                },
                {
                    path: "groups/pendingrequest",
                    element: (
                        <RoleBasedRoutes
                            component={[
                                {
                                    role: Role.Host,
                                    page: PendingRequestPage,
                                },
                            ]}
                        />
                    ),
                },
                {
                    path: "groups",
                    element: (
                        <RoleBasedRoutes
                            component={[
                                {
                                    role: Role.Host,
                                    page: HostGroups,
                                },
                                {
                                    role: Role.Participant,
                                    page: ParticpantGroups,
                                },
                            ]}
                        />
                    ),
                },
                {
                    path: "questions",
                    element: (
                        <RoleBasedRoutes
                            component={[
                                {
                                    role: Role.Host,
                                    page: SavedQuestions,
                                },
                            ]}
                        />
                    ),
                },
                {
                    path: "progress",
                    element: (
                        <RoleBasedRoutes
                            component={[
                                {
                                    role: Role.Participant,
                                    page: ProgressTracking,
                                },
                            ]}
                        />
                    ),
                },
                {
                    path: "",
                    element: (
                        <RoleBasedRoutes
                            component={[
                                {
                                    role: Role.Host,
                                    page: HostHome,
                                },
                                {
                                    role: Role.Participant,
                                    page: ParticipantHome,
                                },
                            ]}
                        />
                    ),
                },
            ],
        },
        {
            path: "signup/google",
            element: <GoogleAuthInterceptor />,
        },
        {
            path: "/signup/host",
            element: <AuthPage />,
        },
        ...authPages,
        {
            path: "unauthorized",
            element: <UnauthorizedPage />,
        },
        {
            path: "*",
            element: <PageNotFound />,
        },
    ]);

    return routes;
}

export default App;
