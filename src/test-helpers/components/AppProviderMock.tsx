import { AppContext, AppContextType } from "@context/AppProvider";
import { lightTheme } from "@src/themes/theme";
import { Role } from "@src/ts/enums";
import { PropsWithChildren } from "react";

type Props = {
    value?: Partial<AppContextType>;
};

const defaultValues: AppContextType = {
    userDetails: {
        id: 1,
        email: "",
        role: Role.Host,
    },
    currentTheme: lightTheme,
    updateUserDetails: jest.fn(),
    changeTheme: jest.fn(),
    refreshUserDetails: jest.fn(),
};

const AppProviderMock = ({
    children,
    value = {},
}: PropsWithChildren<Props>) => {
    return (
        <AppContext.Provider value={{ ...defaultValues, ...value }}>
            {children}
        </AppContext.Provider>
    );
};
export default AppProviderMock;
