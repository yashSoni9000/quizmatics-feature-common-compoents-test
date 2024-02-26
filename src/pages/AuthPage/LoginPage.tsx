import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Divider } from "@mui/material";

import { AppContext } from "@src/context/AppProvider";
import { EventFor } from "@src/ts/types";
import { checkEmailExists, loginAccount } from "@src/utils/users";
import { validateEmail, validatePassword } from "@src/utils/validations";

import { LoadingButton } from "./LoginFields";
import { TextBlock } from "./LoginFields";
import GoogleIcon from "@images/google.svg";

interface LoginData {
    email: string;
    password: string;
}

export default function LoginBlock() {
    const { refreshUserDetails } = useContext(AppContext) || {};
    const [loginData, setLoginData] = useState<LoginData>({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [emailError, setEmailError] = useState<string>();
    const [passwordError, setPasswordError] = useState<string>();
    const [validEmpty, setValidEmpty] = useState(true);

    const navigate = useNavigate();

    function login() {
        setDisabled(true);
        setIsLoading(true);
        const email = loginData.email.trim(),
            password = loginData.password;

        if (!email || password.length < 8) {
            setIsLoading(false);
            setValidEmpty(false);
            return;
        }

        checkEmailExists(email)
            .then((data) => {
                if (!data) throw "EmailError";
                return loginAccount({ identifier: email, password });
            })
            .then(() => {
                const code = sessionStorage.getItem("groupCode");
                refreshUserDetails?.();

                if (code) {
                    navigate(`/dashboard/groups?join=${code}`);
                } else navigate("/dashboard");
            })
            .catch((error) => {
                if (error === "EmailError") {
                    setEmailError("Email doesn't exist");
                } else if (
                    error.response.data.error.name === "ValidationError"
                ) {
                    setPasswordError("Incorrect Password");
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function handleOnChange({
        target: { name, value },
    }: EventFor<"input", "onChange">) {
        setLoginData((obj) => {
            return { ...obj, [name]: value };
        });

        setDisabled(false);
        setEmailError(undefined);
        setPasswordError(undefined);
        setValidEmpty(true);
    }

    function getHelperText(name: string) {
        switch (name) {
            case "email":
                if (emailError) return emailError;
                if (!validate(name, validEmpty)) {
                    return "Email is invalid";
                }
                return " ";

            case "password":
                if (passwordError) return passwordError;
                if (!validate(name, validEmpty)) {
                    return "Password should contain 8 letters";
                }
                return " ";

            default:
                return " ";
        }
    }

    function validate(name: string, validateEmpty = true) {
        const { email, password } = loginData;

        function checkIfEmpty(value: string) {
            if (validateEmpty) {
                if (value.length === 0) return true;
            }
            return false;
        }

        switch (name) {
            case "email":
                return checkIfEmpty(email) || validateEmail(email);

            case "password":
                return checkIfEmpty(password) || validatePassword(password);

            default:
                break;
        }
    }

    return (
        <Box className="w-full flex flex-col justify-center p-6 md:p-8 gap-6 h-fit my-auto bg-white rounded-2xl transition-all">
            <Box className="mb-2">
                <Typography className="text-3xl">Welcome Back,</Typography>
                <Typography className="text-sm text-gray-500 pr-6">
                    To keep connected with us, login with your personal
                    information by email address and password
                </Typography>
            </Box>
            <Box className="">
                <Button
                    variant="outlined"
                    className="rounded-full w-full text-gray-700 border-gray-500 capitalize"
                    href="http://localhost:1337/api/connect/google"
                >
                    <Box
                        component="img"
                        src={GoogleIcon}
                        className="w-5 h-5 mx-2"
                    />
                    Sign in With Google
                </Button>
            </Box>

            <Divider className="">OR</Divider>

            <Box className="flex flex-col gap-3 ">
                <TextBlock
                    name="email"
                    label="Email Address"
                    value={loginData.email}
                    onChange={handleOnChange}
                    getHelperText={getHelperText}
                    type="email"
                    placeholder="Enter Email Address"
                />

                <TextBlock
                    type="password"
                    name="password"
                    onChange={handleOnChange}
                    value={loginData.password}
                    getHelperText={getHelperText}
                    label="Password"
                    placeholder="Enter Password "
                />

                <Box className="flex flex-col gap-3 justify-between items-center">
                    <LoadingButton
                        variant="contained"
                        className="w-full rounded-full py-2"
                        disabled={disabled}
                        isLoading={isLoading}
                        onClick={login}
                        text="Login"
                    />

                    <Typography className="flex flex-row text-base text-gray-500 pr-6 gap-1">
                        or Sign Up as a
                        <Box
                            className="cursor-pointer"
                            component="a"
                            sx={{ color: "primary.main" }}
                            href="/signup/host"
                        >
                            Host
                        </Box>
                        or
                        <Box
                            className="cursor-pointer"
                            component={"a"}
                            sx={{ color: "primary.main" }}
                            href="/signup"
                        >
                            Participant
                        </Box>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
