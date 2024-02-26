import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";

import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Button,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { AppContext } from "@src/context/AppProvider";
import { Role } from "@src/ts/enums";
import {
    HOST_SIDEBAR_PATHS,
    PARTICIPANT_SIDEBAR_PATHS,
} from "@src/constants/routes";

interface Props {
    sideBarIsOpened: boolean;
    displaySideBar: (value: boolean) => void;
}

export default function SideBar({ sideBarIsOpened, displaySideBar }: Props) {
    const { role } = useContext(AppContext)?.userDetails || {};
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const routes =
        role === Role.Host ? HOST_SIDEBAR_PATHS : PARTICIPANT_SIDEBAR_PATHS;

    function handleOnClick() {
        displaySideBar(false);
    }

    function toggleSideBar() {
        setIsSidebarCollapsed((value) => !value);
    }

    return (
        <Box
            className={`h-full flex-col z-20 top-0 justify-between transition-all animate-slideIn lg:flex fixed lg:static w-60 ${
                isSidebarCollapsed && "lg:w-16"
            } ${sideBarIsOpened ? "flex" : "hidden"}`}
            sx={{
                backgroundColor: "background.default",
                "& .active > * > div": {
                    backgroundColor: "background.focusColor",
                    color: "primary.contrastText",
                },
            }}
            data-testid="sidebar"
        >
            <List>
                {routes.map(({ label, url, Icon }) => (
                    <NavLink key={url} end={url === ""} to={url}>
                        <ListItem disablePadding>
                            <ListItemButton
                                className="m-1 rounded-lg gap-4 h-12"
                                onClick={handleOnClick}
                            >
                                <Icon />
                                <ListItemText
                                    primary={label}
                                    className={`flex text-inherit pr-2 truncate ${
                                        isSidebarCollapsed && "lg:hidden"
                                    }`}
                                />
                            </ListItemButton>
                        </ListItem>
                    </NavLink>
                ))}
            </List>

            <Button
                className="ml-auto p-4 border-t border-gray-300 rounded-none border-solid w-full h-16 hidden lg:block"
                onClick={toggleSideBar}
                data-testid="collapse-button"
            >
                <ArrowBackIosNewIcon
                    className={`${
                        isSidebarCollapsed && "rotate-180"
                    } transition-all duration-300`}
                    sx={{ color: "background.contrastText" }}
                />
            </Button>
        </Box>
    );
}
