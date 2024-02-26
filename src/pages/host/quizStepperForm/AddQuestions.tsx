import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";

import {
    Box,
    Typography,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    TextField,
    InputAdornment,
} from "@mui/material";
import { Add, ExpandMore } from "@mui/icons-material";

import useAlertHook from "@src/hooks/UseAlertHook";
import CircularLoader from "@components/common/CircularLoader";
import CheckBoxField from "@components/common/InputFields/CheckBox";
import { AlertPopup } from "@components/AlertPopup";

import { extractStrapiResponseData } from "@src/utils";
import { axiosInstance } from "@src/utils/axiosInstance";
import { EventFor, ResponseType, StrapiSingleResponse } from "@src/ts/types";

import {
    QUESTIONS_FETCH_API,
    QUIZ_IO_QUESTION_API,
} from "@src/constants/endpoints/host";

export interface Question {
    id: number;
    question: string;
    description: string | null;
    answers: { [key: string]: string | null };
    multiple_correct_answers: boolean;
    correct_answers: { [key: string]: boolean };
    correct_answer: string | null;
    explanation: string | null;
    tip: string | null;
    difficulty: string;
    category: string;
}

interface QuestionData {
    question: Question[];
}

export default function AddQuestions({
    selectedQuestions,
    displayActionText,
    setSelectedQuestions,
}: {
    selectedQuestions: Question[];
    displayActionText: (text: string) => void;
    setSelectedQuestions: Dispatch<SetStateAction<Question[]>>;
}) {
    const alertModal = useAlertHook();
    const [selectedRandomValue, setSelectedRandomValue] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>();

    const [savedQuestionSelect, setSavedQuestionSelect] = useState(false);

    function getUniqueQuestions(question: Question[]) {
        const selectedID = selectedQuestions.map(({ id }) => id);
        return question.filter(({ id }) => !selectedID.includes(id));
    }

    useEffect(() => {
        setIsLoading(true);

        if (!savedQuestionSelect) {
            axios
                .get(QUIZ_IO_QUESTION_API)
                .then(({ data }) => {
                    setQuestions([
                        ...selectedQuestions,
                        ...getUniqueQuestions(data),
                    ]);
                    setIsLoading(false);
                })
                .catch(() => alertModal.showMessage("Unable to fetch data"))
                .finally(() => setIsLoading(false));
        } else {
            axiosInstance()
                .get(QUESTIONS_FETCH_API)
                .then(
                    ({
                        data,
                    }: ResponseType<StrapiSingleResponse<QuestionData>>) => {
                        const uniqueQuestions = getUniqueQuestions(
                            extractStrapiResponseData(data).question,
                        );
                        setQuestions([
                            ...selectedQuestions,
                            ...uniqueQuestions,
                        ]);
                    },
                )
                .catch(() => alertModal.showMessage("Unable to fetch data"))
                .finally(() => setIsLoading(false));
        }
    }, [savedQuestionSelect]);

    useEffect(() => {
        displayActionText(`${selectedQuestions.length} questions selected`);
    }, [selectedQuestions]);

    function addQuestionToList(newQuestion: Question) {
        if (selectedQuestions.find(({ id }) => id === newQuestion.id)) {
            return;
        }
        setSelectedQuestions((questions) => [...questions, newQuestion]);
    }

    function removeQuestionFromList(id: number) {
        const updatedSelectedQuestions = selectedQuestions.filter(
            (question) => question.id !== id,
        );

        setSelectedQuestions(updatedSelectedQuestions);
    }

    function selectRandomQuestions() {
        const randomSelectedQuestions = questions!
            .filter(
                (question) =>
                    selectedQuestions.filter(
                        (selectedQuestion) =>
                            selectedQuestion.id === question.id,
                    ).length === 0,
            )
            .slice(0, selectedRandomValue);

        randomSelectedQuestions.forEach((question) => {
            addQuestionToList(question);
        });
    }

    return (
        <>
            <Box className="flex flex-col gap-2 h-full">
                <Box className="flex flex-col justify-between mt-2 items-center">
                    <Box className="flex flex-col md:flex-row items-center capitalize justify-between w-full">
                        <CheckBoxField
                            className="text-sm"
                            label="Select from saved Questions"
                            value={savedQuestionSelect}
                            onChange={(e) =>
                                setSavedQuestionSelect(e.target.checked)
                            }
                        />

                        <Box className="flex flex-row items-center">
                            <TextField
                                label="Add random"
                                size="small"
                                type="number"
                                placeholder="No. of Questions"
                                className="w-48 placeholder:text-xs"
                                onChange={(e) =>
                                    setSelectedRandomValue(
                                        Number(e.target.value),
                                    )
                                }
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                className="min-w-0 rounded-none border-l-1"
                                                onClick={selectRandomQuestions}
                                            >
                                                <Add />
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{
                                    className: "text-xs",
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        paddingRight: 0,
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
                {!isLoading ? (
                    questions ? (
                        <Box className="overflow-y-scroll">
                            <Box
                                sx={{ backgroundColor: "background.paper" }}
                                className="p-1 rounded-lg mb-2 overflow-scroll h-full"
                            >
                                {questions!.map((question) => (
                                    <QuestionBlock
                                        key={question.id}
                                        question={question}
                                        selectedQuestions={selectedQuestions}
                                        addQuestionToList={addQuestionToList}
                                        removeQuestionFromList={
                                            removeQuestionFromList
                                        }
                                    />
                                ))}
                            </Box>
                        </Box>
                    ) : (
                        <Box className="flex-1 justify-between items-center h-32">
                            <Typography>Unable to load Data</Typography>
                        </Box>
                    )
                ) : (
                    <Box className="flex-1 justify-between items-center h-32">
                        <CircularLoader />
                    </Box>
                )}
            </Box>
            {alertModal.isOpen && <AlertPopup message={alertModal.message} />}
        </>
    );
}
interface QuestionBlockProps {
    question: Question;
    addQuestionToList: (newQuestion: Question) => void;
    removeQuestionFromList: (id: number) => void;
}

function QuestionBlock({
    question,
    addQuestionToList,
    selectedQuestions,
    removeQuestionFromList,
}: QuestionBlockProps & { selectedQuestions: Question[] }) {
    const answers = Object.values(question.answers).filter((val) => val);
    const [value, setValue] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    function onChange(
        { target }: EventFor<"input", "onChange">,
        question: Question,
    ) {
        setValue(target.checked);
        if (target.checked) {
            addQuestionToList(question);
        } else {
            removeQuestionFromList(question.id);
        }
    }

    return (
        <Accordion
            sx={{ backgroundColor: "background.default" }}
            className="border py-2"
            expanded={isExpanded}
            onChange={(_, value) => setIsExpanded(value)}
            disableGutters
        >
            <AccordionSummary expandIcon={<ExpandMore />} className="px-4 ">
                <Checkbox
                    size="small"
                    className="w-fit h-fit p-0 mr-2 my-auto"
                    value={value}
                    checked={
                        !!selectedQuestions.find(({ id }) => id === question.id)
                    }
                    onChange={(e) => onChange(e, question)}
                    onClick={(e) => e.stopPropagation()}
                />
                <Typography
                    className={`text-sm ${!isExpanded && "line-clamp-2"}`}
                >
                    {question.question}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {answers.map((answer, index) => (
                    <Typography
                        key={index}
                        fontSize="small"
                        className="ml-4"
                    >{`${toLetters(index + 1)}. ${answer}`}</Typography>
                ))}
            </AccordionDetails>
        </Accordion>
    );
}

function toLetters(num: number): string {
    const mod = num % 26;
    let pow = (num / 26) | 0;
    const out = mod ? String.fromCharCode(96 + mod) : (--pow, "z");
    return pow ? toLetters(pow) + out : out;
}
