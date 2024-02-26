import CircularLoader from "@src/components/common/CircularLoader";
import { STRAPI_API } from "@src/constants/endpoints";
import { CssBaseline, Box } from "@mui/material";
import { Role } from "@src/ts/enums";

import { getToken, removeToken } from "@src/utils/token";
import axios from "axios";
import { PropsWithChildren, createContext, useEffect, useState } from "react";

import { darkTheme, lightTheme } from "../themes/theme";
import { ThemeProvider, Theme } from "@mui/material/styles";

interface UserInterface {
    id: number;
    email: string;
    role: Role;
}

export type AppContextType = {
    userDetails: UserInterface | null;
    currentTheme: Theme;
    updateUserDetails: (updatedUserDetails: UserInterface) => void;
    changeTheme: (theme: string) => void;
    refreshUserDetails: () => void;
} | null;

const roles: Role[] = [Role.Host, Role.Participant];

export const AppContext = createContext<AppContextType>(null);

export default function AppProvider({ children }: PropsWithChildren) {
    const [userDetails, setUserDetails] = useState<UserInterface | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    const [theme, setTheme] = useState(lightTheme);

    useEffect(() => {
        const token = getToken();
        if (token) {
            axios
                .get(`${STRAPI_API}/users/me?populate=*`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(({ data: { email, role, id } }) => {
                    setUserDetails({ email, role: roles[role.id - 5], id });
                })
                .catch((error) => {
                    setIsLoading(false);

                    if (error.response.status === 401) {
                        removeToken();
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [refresh]);

    function changeTheme(theme: string) {
        setTheme(theme === "light" ? lightTheme : darkTheme);
        localStorage.setItem("theme", theme);
    }

    function updateUserDetails(updatedUserDetails: UserInterface) {
        setUserDetails(updatedUserDetails);
    }

    function refreshUserDetails() {
        setRefresh((val) => !val);
    }

    if (isLoading)
        return (
            <Box className="w-screen h-screen">
                <CircularLoader />
            </Box>
        );

    return (
        <AppContext.Provider
            value={{
                userDetails,
                currentTheme: theme,
                updateUserDetails,
                changeTheme,
                refreshUserDetails,
            }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppContext.Provider>
    );
}
