import { Box, Typography, IconButton, Button } from "@mui/material";

import CheckIcon from "@images/check-blue.png";
import ErrorIcon from "@images/errorImg.png";

export default function Finish({
    error,
    code,
    postQuiz,
}: {
    error: boolean;
    code: string | undefined;
    postQuiz: () => void;
}) {
    if (!error) {
        return (
            <Box>
                <Box className="flex flex-col align-middle h-full justify-between items-center gap-2">
                    <Box
                        component="img"
                        src={CheckIcon}
                        className="w-20 h-20"
                    ></Box>
                    <Typography className="text-base text-blue-500 md:text-2xl">
                        The Quiz is Created Successfully
                    </Typography>
                    <Box className="flex justify-center items-center mt-6 gap-1">
                        <Typography className="text-base md:text-xl font-semibold text-gray-600 mr-4 ">
                            Quiz Code:
                        </Typography>
                        <Typography className="bg-slate-200 px-4 py-2 text-xl font-semibold text-gray-600 rounded-md uppercase">
                            {code}
                        </Typography>
                        <CopyToClipboardButton text="#3edred" />
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <Box className="flex flex-col align-middle h-full justify-between items-center gap-2">
                <Box component="img" src={ErrorIcon} className=" h-20"></Box>
                <Typography className="text-base text-blue-500 md:text-2xl">
                    Unable to create Quiz
                </Typography>
                <Button
                    variant="contained"
                    onClick={postQuiz}
                    className="py-1 px-3 mt-3"
                >
                    Reload
                </Button>
            </Box>
        </Box>
    );
}

import { CopyAll } from "@mui/icons-material";

const CopyToClipboardButton = ({ text }: { text: string }) => {
    const handleClick = () => navigator.clipboard.writeText(text);

    return (
        <IconButton onClick={handleClick}>
            <CopyAll />
        </IconButton>
    );
};
