import { Box, IconButton, Tooltip } from "@mui/material";
import { Info } from "@mui/icons-material";

import CheckBoxField from "@components/common/InputFields/CheckBox";
import { StepperPagesData } from ".";

export default function Rules({
    quizData,
    handleOnChange,
}: Omit<StepperPagesData, "getHelperText">) {
    const {
        skipQuestion,
        canGoBack,
        randomizeQuestions,
        revealQuestionsAtEnd,
        enableProctoredMode,
    } = quizData;

    return (
        <Box className="mt-2">
            <CheckBoxField
                name="skipQuestion"
                label={"Allow skipping Questions"}
                value={skipQuestion}
                onChange={handleOnChange}
            />
            <CheckBoxField
                name="canGoBack"
                label={"Allow going back to previous questions"}
                value={canGoBack}
                onChange={handleOnChange}
            />
            <CheckBoxField
                name="randomizeQuestions"
                label={"Randomize Questions"}
                value={randomizeQuestions}
                onChange={handleOnChange}
            />
            <CheckBoxField
                name="revealQuestionsAtEnd"
                label={"Reveal Score at end of quiz"}
                value={revealQuestionsAtEnd}
                onChange={handleOnChange}
            />
            <Box className="flex">
                <CheckBoxField
                    name="enableProctoredMode"
                    label={"Enable Proctored Mode"}
                    value={enableProctoredMode}
                    onChange={handleOnChange}
                />
                <Tooltip title="When Enabled, Quiz will end if tab is switched or connection is lost during quiz">
                    <IconButton>
                        <Info className="w-5 h-5" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}
