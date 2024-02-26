import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import { AppContext } from "@src/context/AppProvider";
import LoginBlock from "./LoginPage";
import SignUpPage from "./SignupPage";

import AppLogo from "@images/favicon.png";
import BackgroundImg from "@images/AdobeStock-BYnaA5DmPM.jpg";

enum Page {
    Signup = "signup",
    Login = "login",
}

export default function AuthPage() {
    const page = window.location.pathname.includes(Page.Signup)
        ? Page.Signup
        : Page.Login;

    const { userDetails } = useContext(AppContext) || {};
    const navigate = useNavigate();

    useEffect(() => {
        if (userDetails) {
            const code = sessionStorage.getItem("groupCode");
            if (code) {
                navigate(`/dashboard/groups?join=${code}`);
            } else {
                navigate("/dashboard");
            }
        }
    }, []);

    return (
        <Box
            sx={{
                backgroundImage: `url(${BackgroundImg})`,
            }}
            className="w-screen h-screen flex flex-col bg-cover bg-no-repeat bg-right-bottom"
        >
            <Box className="flex gap-2 items-center p-4">
                <Box component="img" src={AppLogo} className="w-12 h-12" />
                <Typography className="text-white text-3xl">
                    QuizMatics
                </Typography>
            </Box>
            <Box className="w-full flex-1 flex justify-center items-center">
                <Box className="w-[440px] max-w-[95%]  shadow-xl rounded-xl">
                    {page === Page.Signup ? <SignUpPage /> : <LoginBlock />}
                </Box>
            </Box>
        </Box>
    );
}
