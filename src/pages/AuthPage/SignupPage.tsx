import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Divider,
    TextField,
    Typography,
} from "@mui/material";

import { AppContext } from "@src/context/AppProvider";
import useAlertHook from "@src/hooks/UseAlertHook";
import { LoadingButton, SelectField, TextBlock } from "./LoginFields";
import { AlertPopup } from "@src/components/AlertPopup";
import { Role, RoleId } from "@src/ts/enums";
import { EventFor } from "@src/ts/types";

import {
    checkEmailExists,
    loginAccount,
    registerAccount,
} from "@src/utils/users";

import {
    validateEmail,
    validatePassword,
    validatePhoneNumber,
} from "@src/utils/validations";

import GoogleIcon from "@images/google.svg";

const organizationList = [
    { id: 1, label: "GKMIT" },
    { id: 2, label: "GITS" },
    { id: 3, label: "Tecno" },
];

const locationList = [
    { label: "China", id: 1 },
    { label: "England", id: 2 },
    { label: "Finland", id: 3 },
    { label: "France", id: 4 },
    { label: "Germany", id: 5 },
    { label: "India", id: 6 },
    { label: "UK", id: 7 },
    { label: "USA", id: 8 },
];

const genderList = [
    { label: "Male", id: 1 },
    { label: "Female", id: 2 },
    { label: "Other", id: 3 },
];

interface User {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
    phoneNo: string;
    role: number;
    location: number;
    gender: number;
    organization: number;
    groupCode: string;
}

interface PageProps {
    role: RoleId;
    user: User;
    disabled: boolean;
    isLoading: boolean;
    handleOnChange: (e: EventFor<"input", "onChange">) => void;
    getHelperText: (name: string) => string;
    handleNext: () => void;
}

interface Error {
    field: string;
    message: string;
}

function addGenericErrorMessage(error: Error[], name: string) {
    error.push({
        field: name,
        message: "Field can't be empty",
    });
}

export default function SignUpPage() {
    const role = window.location.pathname.includes(Role.Host)
        ? RoleId.Host
        : RoleId.Participant;

    const [currentStep, setCurrentStep] = useState<0 | 1>(0);

    const [user, setUser] = useState<User>({
        name: "",
        email: "",
        password: "",
        terms: false,
        confirmPassword: "",
        phoneNo: "",
        role,
        location: 6,
        gender: 1,
        organization: 1,
        groupCode: sessionStorage.getItem("groupCode") || "",
    });

    const { refreshUserDetails } = useContext(AppContext) || {};

    const navigate = useNavigate();
    const alertModal = useAlertHook();

    const [disabled, setDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [checkEmptyFields, setCheckEmptyFields] = useState(false);
    const [emailExistError, setEmailExistError] = useState(false);

    const CurrentPage = [CredentialsPage, PersonalInfoPage][currentStep];

    function handleOnChange({
        target: { name, value, checked },
    }: EventFor<"input", "onChange">) {
        if (name === "terms") {
            setUser((obj) => {
                return {
                    ...obj,
                    [name]: checked,
                };
            });
        }

        setUser((obj) => {
            return {
                ...obj,
                [name]: value,
            };
        });

        resetErrors();
    }

    function resetErrors() {
        setCheckEmptyFields(false);
        setDisabled(false);
        setEmailExistError(false);
    }

    function createUser() {
        const { name, gender, organization, location } = user;

        const data = {
            ...user,
            username: name,
            organization:
                (organization && organizationList[organization - 1].label) || 1,
            location: locationList[location - 1].label,
            gender: genderList[gender - 1].label,
        };

        if (user.groupCode) {
            sessionStorage.setItem("groupCode", user.groupCode);
        }
        setIsLoading(true);

        return new Promise((resolve, reject) => {
            registerAccount(data)
                .then(({ data }) => {
                    return loginAccount({
                        identifier: data.email,
                        password: user.password,
                    });
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => reject(error));
        });
    }

    function handleNext() {
        setCheckEmptyFields(true);
        if (!validate(true) || !user.terms) {
            setDisabled(true);
            return;
        }

        if (currentStep === 0) {
            checkEmailExists(user.email).then((data) => {
                if (data) {
                    setDisabled(true);
                    setEmailExistError(true);
                } else {
                    setCurrentStep(1);
                    setCheckEmptyFields(false);
                }
            });
        } else {
            if (!validateStepOne(true) || !validateStepTwo(true)) {
                setDisabled(true);
                return;
            }
            createUser()
                .then(() => {
                    const groupCode = user.groupCode;
                    refreshUserDetails?.();

                    if (groupCode) {
                        navigate(`/dashboard/groups?join=${groupCode}`);
                    } else navigate("/dashboard");
                })
                .catch(() => {
                    alertModal.showMessage("Unable to create Account");
                });
        }
    }

    function validate(checkNullCondition = false) {
        switch (currentStep) {
            case 0:
                return !validateStepOne(checkNullCondition).length;

            case 1:
                return !validateStepTwo(checkNullCondition).length;

            default:
                return false;
        }
    }

    function validateStepOne(checkNullCondition: boolean) {
        const errors: Error[] = [];
        const { name, email, password, confirmPassword } = user;

        if (name.length > 25) {
            errors.push({
                field: "name",
                message: "Maximum 25 characters allowed",
            });
        }
        if (emailExistError) {
            errors.push({
                field: "email",
                message: "Email already exist. Please login.",
            });
        }

        if (email.length && !validateEmail(email)) {
            errors.push({
                field: "email",
                message: "Email is invalid",
            });
        }
        if (password.length && !validatePassword(password)) {
            errors.push({
                field: "password",
                message: "Minimum 8 characters required",
            });
        }
        if (
            password.length &&
            validatePassword(password) &&
            password !== confirmPassword
        ) {
            errors.push({
                field: "confirmPassword",
                message: "Password doesn't match",
            });
        }
        if (checkNullCondition) {
            !name && addGenericErrorMessage(errors, "name");
            !password && addGenericErrorMessage(errors, "password");
            !email && addGenericErrorMessage(errors, "email");
            password &&
                !confirmPassword &&
                addGenericErrorMessage(errors, "confirmPassword");
        }
        return errors;
    }

    function validateStepTwo(checkNullCondition: boolean) {
        const errors: Error[] = [];
        const { phoneNo, gender, location } = user;
        if (phoneNo && !validatePhoneNumber(user.phoneNo)) {
            errors.push({
                field: "phoneNo",
                message: "Phone No. is invalid",
            });
        }

        if (checkNullCondition) {
            !phoneNo && addGenericErrorMessage(errors, "phoneNo");
            !location && addGenericErrorMessage(errors, "location");
            !gender && addGenericErrorMessage(errors, "gender");
        }

        return errors;
    }

    function getHelperText(name: string) {
        let errors: Error[] = [];
        switch (name) {
            case "name":
            case "email":
            case "password":
            case "confirmPassword":
                errors = validateStepOne(checkEmptyFields);
                return (
                    errors.find((error) => error.field === name)?.message || " "
                );

            case "gender":
            case "location":
            case "phoneNo":
                errors = validateStepTwo(checkEmptyFields);
                return (
                    errors.find((error) => error.field === name)?.message || " "
                );
        }
        return " ";
    }

    return (
        <>
            <Box className="w-full flex flex-col justify-center p-6 md:p-8 gap-6 h-fit my-auto bg-white rounded-2xl transition-all">
                <CurrentPage
                    role={role}
                    user={user}
                    disabled={disabled}
                    isLoading={isLoading}
                    handleOnChange={handleOnChange}
                    getHelperText={getHelperText}
                    handleNext={handleNext}
                />
            </Box>
            {alertModal.isOpen && <AlertPopup message={alertModal.message} />}
        </>
    );
}

function CredentialsPage({
    role,
    user,
    disabled,
    isLoading,
    handleOnChange,
    handleNext,
    getHelperText,
}: PageProps) {
    const { name, email, password, confirmPassword, terms } = user;
    const navigate = useNavigate();

    return (
        <>
            <Box className="mb-2">
                <Typography className="text-3xl mb-2">
                    {`Join as a 
                    ${role === RoleId.Host ? "Host" : "Participant"}`}
                </Typography>
                <Typography className="text-sm text-gray-500 pr-6">
                    Join us for knowledge! Sign up and start quizzing today
                </Typography>
            </Box>

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
                Sign up With Google
            </Button>

            <Divider>OR</Divider>

            <Box className="flex flex-col gap-4">
                <TextBlock
                    label="Name"
                    name="name"
                    value={name}
                    getHelperText={getHelperText}
                    onChange={handleOnChange}
                />

                <TextBlock
                    label="Email Address"
                    name="email"
                    type="email"
                    value={email}
                    getHelperText={getHelperText}
                    onChange={handleOnChange}
                />
                <Box className={`flex flex-col  sm:flex-row gap-2`}>
                    <TextBlock
                        label="Password"
                        name="password"
                        value={password}
                        type="password"
                        getHelperText={getHelperText}
                        onChange={handleOnChange}
                    />
                    <TextBlock
                        label="Confirm Password"
                        value={confirmPassword}
                        name="confirmPassword"
                        type="password"
                        onChange={handleOnChange}
                        getHelperText={getHelperText}
                    />
                </Box>

                <Box className="flex justify-start items-center ml-1 mb-2 gap-2">
                    <Checkbox
                        id="terms"
                        checked={terms}
                        name="terms"
                        onChange={handleOnChange}
                    />
                    <Typography component="label" htmlFor="terms">
                        I agree with terms and Conditions
                    </Typography>
                </Box>

                <Box className="flex flex-col gap-3 justify-between items-center">
                    <LoadingButton
                        variant="contained"
                        className="w-full rounded-full py-2"
                        disabled={disabled}
                        isLoading={isLoading}
                        onClick={handleNext}
                        text="Continue"
                    />

                    <Typography className="flex flex-row text-base text-gray-500 pr-6 gap-1">
                        Already have Account?
                        <Box
                            component="a"
                            className="inline capitalize cursor-pointer"
                            sx={{ color: "primary.main" }}
                            onClick={() => navigate("/login")}
                        >
                            Login Now
                        </Box>
                    </Typography>
                </Box>
            </Box>
        </>
    );
}

function PersonalInfoPage({
    role,
    user,
    disabled,
    isLoading,
    handleOnChange,
    handleNext,
    getHelperText,
}: PageProps) {
    const { organization, gender, groupCode, location, phoneNo } = user;
    return (
        <>
            <Box className="mb-2">
                <Typography className="text-3xl mb-2">Personal Info</Typography>
                <Typography className="text-base text-gray-500 pr-6">
                    Enhance your experience! Help us personalize by sharing a
                    bit more about yourself
                </Typography>
            </Box>
            <Box className="flex flex-col w-full gap-4">
                {role === RoleId.Host ? (
                    <Autocomplete
                        size="small"
                        options={organizationList}
                        getOptionLabel={(item) =>
                            typeof item === "string" ? item : item.label
                        }
                        freeSolo
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                name="organization"
                                value={organization}
                                label="Organization Name"
                                variant="outlined"
                                helperText={getHelperText("organization")}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        )}
                    />
                ) : (
                    <TextBlock
                        label="Group Code"
                        name="groupCode"
                        value={groupCode}
                        placeholder="Enter Group Code "
                        getHelperText={getHelperText}
                        onChange={handleOnChange}
                        required={false}
                    />
                )}
                <TextBlock
                    label="Mobile No."
                    type="number"
                    name="phoneNo"
                    value={phoneNo}
                    placeholder="Enter Mobile No "
                    getHelperText={getHelperText}
                    onChange={handleOnChange}
                />

                <SelectField
                    label="Location"
                    name="location"
                    size="small"
                    list={locationList}
                    getHelperText={getHelperText}
                    value={location}
                    handleOnChange={handleOnChange}
                />
                <SelectField
                    label="Gender"
                    name="gender"
                    value={gender}
                    getHelperText={getHelperText}
                    list={genderList}
                    size="small"
                    handleOnChange={handleOnChange}
                />
            </Box>
            <Box className="flex flex-col gap-3 justify-between items-center">
                <LoadingButton
                    variant="contained"
                    className="w-full rounded-full py-2"
                    disabled={disabled}
                    isLoading={isLoading}
                    onClick={handleNext}
                    text="Create Account"
                />
            </Box>
        </>
    );
}
