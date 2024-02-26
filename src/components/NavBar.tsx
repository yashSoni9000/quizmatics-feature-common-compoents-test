import { useContext, useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import {
    Box,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Container,
    Avatar,
    Tooltip,
    Switch,
    styled,
} from "@mui/material/";

import { AppContext, AppContextType } from "@src/context/AppProvider";

import QuizLogo from "@images/favicon.png";
import ProfileImg from "@images/profile-img.svg";
import { removeToken } from "@src/utils/token";
import { useNavigate } from "react-router-dom";
import CircularLoader from "./common/CircularLoader";

interface Props {
    displaySideBar: (value: boolean) => void;
}

export default function NavBar({ displaySideBar }: Props) {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [showLogoutWindow, setShowLogoutWindow] = useState(false);

    const appContext = useContext<AppContextType>(AppContext)!;
    const navigate = useNavigate();

    const { changeTheme } = appContext;

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const settings = [
        {
            label: "Logout",
            onClick: () => {
                removeToken();
                setShowLogoutWindow(true);
                setTimeout(() => {
                    navigate("/login");
                }, 500);
            },
        },
    ];

    return (
        <>
            <Container
                className="flex w-full p-0 h-full items-center max-w-full"
                sx={{
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                }}
            >
                <Box className="pl-3 mr-2 hidden lg:flex">
                    <img src={QuizLogo} className="h-10" alt="" />
                </Box>
                <Typography
                    variant="h6"
                    noWrap
                    className="m-4 text-2xl hidden lg:flex"
                >
                    QuizMatics
                </Typography>

                <Box className="flex lg:none">
                    <IconButton
                        size="large"
                        aria-label="menu-appbar"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={() => {
                            displaySideBar(true);
                        }}
                        className="block lg:hidden"
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Typography
                    variant="h5"
                    noWrap
                    className="mr-4 font-bold flex lg:hidden"
                >
                    QuizMatics
                </Typography>
                <Box className="ml-auto flex mr-3">
                    <Box className="w-fit h-full mr-2">
                        <AppThemeSwitch
                            checked={localStorage.getItem("theme") !== "light"}
                            onChange={(e) =>
                                changeTheme(
                                    e.currentTarget.checked ? "dark" : "light",
                                )
                            }
                            data-testid={"theme-switch"}
                        />
                    </Box>

                    <Tooltip title="Open settings">
                        <IconButton
                            onClick={handleOpenUserMenu}
                            className="p-0"
                        >
                            <Avatar alt="Remy Sharp" src={ProfileImg} />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        className="mt-12"
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem
                                key={setting.label}
                                onClick={() => {
                                    handleCloseUserMenu();
                                    setting.onClick();
                                }}
                            >
                                <Typography textAlign="center">
                                    {setting.label}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Container>
            <Box
                className={`${
                    showLogoutWindow ? "flex flex-col " : "hidden"
                } absolute top-0 left-0 w-screen h-screen justify-center  items-center backdrop-blur-sm gap-2 z-30`}
                data-testid={"logoutScreen"}
            >
                <CircularLoader />
                <Typography
                    className="text-base z-40 opacity-100"
                    sx={{ color: "primary.main" }}
                >
                    Logging Out..
                </Typography>
            </Box>
        </>
    );
}

const AppThemeSwitch = styled(Switch)(({ theme }) => ({
    width: 48,
    height: 48,
    padding: 8,
    "& .MuiSwitch-switchBase": {
        margin: 0,
        padding: 7,
        transform: "translateX(0px)",
        "&.Mui-checked": {
            color: "#fff",
            transform: "translateX(0px)",
            "& .MuiSwitch-thumb:before": {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    "#fff",
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: "#fff",
            },
        },
    },
    "& .MuiSwitch-thumb": {
        backgroundColor: theme.palette.mode === "dark" ? "#1976d2" : "#161C34",

        width: 32,
        height: 32,
        "&:before": {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                "#fff",
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    "& .MuiSwitch-track": {
        opacity: 1,
        height: 32,
        backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
        borderRadius: 32,
        transform: "translate(-1px,-1px)",
    },
}));
