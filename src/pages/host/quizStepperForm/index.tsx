import { useState } from "react";
import dayjs from "dayjs";

import StepperForm, { Steps } from "@src/components/stepperForm/StepperForm";
import { EventFor, ResponseType, StrapiSingleResponse } from "@src/ts/types";
import { axiosInstance } from "@src/utils/axiosInstance";
import { QUIZZESS_API } from "@src/constants/endpoints/host";
import { makeid } from "@src/utils/users";
import { extractStrapiResponseData } from "@src/utils";
import { Quiz } from "@src/ts/interfaces/host";

import Options from "./Options";
import Rules from "./Rules";
import Finish from "./Finish";

import SelectGroup, { Group } from "./SelectGroups";
import AddQuestions, { Question } from "./AddQuestions";

import Information, {
    categoryList,
    difficultyList,
    visibilityValues,
} from "./Information";

interface Props {
    handleClose: () => void;
}

interface QuizData {
    name: string;
    visibility: number;
    description: string;
    timeLimitType: number;
    skipQuestion: boolean;
    revealQuestionsAtEnd: boolean;
    canGoBack: boolean;
    randomizeQuestions: boolean;
    enableProctoredMode: boolean;
    timeLimit?: number | null;
    startDate?: Date;
    category?: number;
    difficulty?: number;
    endDate?: Date;
    reminder?: number;
}

export interface StepperPagesData {
    quizData: QuizData;
    handleOnChange: ({
        target: { name, value },
    }: EventFor<"input", "onChange">) => void;
    getHelperText: (name: string) => string;
}

interface Error {
    field: string;
    message: string;
}

export default function AddQuizStepperForm({ handleClose }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
    const [checkEmptyFields, setCheckEmptyFields] = useState(false);
    const [dialogActionText, setDialogActionText] = useState<string>();
    const [quizCode, setQuizCode] = useState<string>();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState<QuizData>({
        name: "",
        description: "",
        visibility: 1,
        timeLimitType: 1,
        skipQuestion: false,
        revealQuestionsAtEnd: false,
        canGoBack: false,
        randomizeQuestions: false,
        enableProctoredMode: true,
    });

    function handleOnChange({
        target: { name, value },
    }: EventFor<"input", "onChange">) {
        setData((obj) => {
            return {
                ...obj,
                [name]: value,
            };
        });
        setCheckEmptyFields(false);
    }

    function displayActionText(text: string) {
        setDialogActionText(text);
    }

    function validate(checkNullCondition = false) {
        switch (currentStep) {
            case 0:
                return !validateStepOne(checkNullCondition).length;

            case 1:
                return !validateStepTwo(checkNullCondition).length;

            case 3:
                return validateStepFour();

            case 4:
                return validateStepFive();
        }

        return true;
    }

    function addGenericErrorMessage(error: Error[], name: string) {
        error.push({
            field: name,
            message: "Please select a value",
        });
    }

    function validateStepOne(checkNullCondition: boolean) {
        const { name, category, difficulty, visibility } = data;
        const errors: Error[] = [];

        if (name.length > 25) {
            errors.push({
                field: "name",
                message: "Maximum 25 characters allowed",
            });
        }

        if (checkNullCondition) {
            if (!name.length) {
                errors.push({
                    field: "name",
                    message: "Name can't be empty",
                });
            }

            !visibility && addGenericErrorMessage(errors, "visibility");
            !category && addGenericErrorMessage(errors, "category");
            !difficulty && addGenericErrorMessage(errors, "difficulty");
        }

        return errors;
    }

    function validateStepTwo(checkNullCondition: boolean) {
        const { startDate, endDate, timeLimitType, timeLimit } = data;
        const errors: Error[] = [];

        if (startDate && dayjs(startDate).isBefore(dayjs()))
            errors.push({
                field: "startDate",
                message: "Start Date can't be in past",
            });

        if (endDate && dayjs(endDate).isBefore(dayjs(startDate)))
            errors.push({
                field: "endDate",
                message: "End Date can't be before start date",
            });

        if (checkNullCondition) {
            if (!timeLimitType)
                errors.push({
                    field: "timeLimitType",
                    message: "Please select a value",
                });

            !timeLimit && addGenericErrorMessage(errors, "timeLimit");
            !startDate && addGenericErrorMessage(errors, "startDate");
            !endDate && addGenericErrorMessage(errors, "endDate");
        }

        return errors;
    }

    function validateStepFour() {
        return !!selectedQuestions.length;
    }

    function validateStepFive() {
        return !!selectedGroups.length;
    }

    function postQuizToDatabase() {
        if (!validateStepOne(true) || !validateStepTwo(true)) {
            setCheckEmptyFields(true);
            return Promise.reject();
        }

        setIsLoading(true);
        const code = makeid(6).toUpperCase();

        return new Promise<void>((resolve, reject) => {
            axiosInstance()
                .post(QUIZZESS_API, {
                    data: {
                        ...data,
                        category: categoryList[data.category! - 1].label,
                        visibility:
                            visibilityValues[
                                data.visibility! - 1
                            ].label.toLowerCase(),
                        difficulty: difficultyList[data.difficulty! - 1].label,
                        group: selectedGroups[0].id,
                        questions: [...selectedQuestions],
                        code,
                    },
                })
                .then(({ data }: ResponseType<StrapiSingleResponse<Quiz>>) => {
                    setQuizCode(extractStrapiResponseData(data).code);
                    setError(false);
                    resolve();
                })
                .catch((error) => reject(error))
                .finally(() => {
                    setIsLoading(false);
                });
        });
    }

    function handleNext() {
        setCheckEmptyFields(true);
        if (!validate(true)) return;

        if (currentStep < 4) {
            setCurrentStep((step) => step + 1);
        } else if (currentStep === 4) {
            postQuizToDatabase()
                .catch(() => setError(true))
                .finally(() => {
                    setCurrentStep((val) => val + 1);
                });
        } else {
            handleClose();
        }
        setCheckEmptyFields(false);
    }

    const steps: Steps[] = [
        {
            label: "Information",
            element: (
                <Information
                    getHelperText={getHelperText}
                    quizData={data}
                    handleOnChange={handleOnChange}
                />
            ),
        },
        {
            label: "Time Limits",
            element: (
                <Options
                    quizData={data}
                    getHelperText={getHelperText}
                    handleOnChange={handleOnChange}
                />
            ),
        },
        {
            label: "Rules",
            element: <Rules quizData={data} handleOnChange={handleOnChange} />,
        },
        {
            label: "Add Questions",
            element: (
                <AddQuestions
                    setSelectedQuestions={setSelectedQuestions}
                    displayActionText={displayActionText}
                    selectedQuestions={selectedQuestions}
                />
            ),
        },
        {
            label: "Groups",
            element: (
                <SelectGroup
                    quizData={data}
                    getHelperText={getHelperText}
                    handleOnChange={handleOnChange}
                    selectedGroups={selectedGroups}
                    setSelectedGroups={setSelectedGroups}
                />
            ),
        },
        {
            label: "Finish",
            element: (
                <Finish
                    postQuiz={postQuizToDatabase}
                    code={quizCode}
                    error={error}
                />
            ),
        },
    ];

    function getHelperText(name: string) {
        let errors: Error[] = [];
        switch (name) {
            case "name":
            case "visibility":
            case "category":
            case "difficulty":
                errors = validateStepOne(checkEmptyFields);
                return (
                    errors.find((error) => error.field === name)?.message || " "
                );

            case "startDate":
            case "endDate":
            case "timeLimitType":
            case "timeLimit":
                errors = validateStepTwo(checkEmptyFields);
                return (
                    errors.find((error) => error.field === name)?.message || " "
                );
        }
        return " ";
    }

    return (
        <StepperForm
            steps={steps}
            isLoading={isLoading}
            currentStep={currentStep}
            actionText={dialogActionText}
            handleClose={handleClose}
            handlePrevious={() => {
                setCurrentStep((val) => val - 1);
            }}
            handleNext={handleNext}
            isButtonDisabled={() => !validate(true)}
        />
    );
}
