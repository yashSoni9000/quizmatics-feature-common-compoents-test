import { ReactNode, forwardRef, useState } from "react";
import Box from "@mui/material/Box";
import { Typography, IconButton, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Stepper from "./Stepper";
import { ArrowBackIos, ArrowForwardIos, Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export interface Steps {
    label: string;
    element: ReactNode;
    states?: object;
}

interface StepperFormProps {
    steps: Steps[];
    currentStep: number;
    actionText: string | undefined;
    isLoading: boolean;
    handleClose: () => void;
    handlePrevious: () => void;
    handleNext: () => void;
    isButtonDisabled: () => boolean;
}

export default function StepperForm({
    steps,
    currentStep,
    actionText,
    isLoading,
    handleClose,
    handlePrevious,
    handleNext,
    isButtonDisabled,
}: StepperFormProps) {
    const [open, setOpen] = useState(true);

    const closeDialog = (
        _?: unknown,
        reason?: "backdropClick" | "escapeKeyDown",
    ) => {
        if (reason !== "backdropClick") {
            setOpen(false);
            handleClose();
        }
    };

    const Element = steps[currentStep].element;

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={closeDialog}
            maxWidth={"lg"}
            aria-describedby="alert-dialog-slide-description"
            className="rounded-xl"
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "1rem",
                },
            }}
        >
            <Box
                className="flex flex-row w-full min-h-[40rem] max-h-[40rem]"
                sx={{ backgroundColor: "background.default" }}
            >
                <Box
                    className="min-w-[15rem] flex-col py-6 px-6 gap-6 hidden md:flex"
                    sx={{ backgroundColor: "primary.main" }}
                >
                    <Typography
                        className="text-2xl font-semibold"
                        sx={{ color: "primary.contrastText" }}
                    >
                        Create Quiz
                    </Typography>
                    <Box className="flex flex-col mt-6 gap-6">
                        <Stepper steps={steps} currentStep={currentStep} />
                    </Box>
                </Box>

                <Box
                    className="flex flex-col w-[40rem] max-w-full p-3 md:p-4 min-h-full gap-2"
                    sx={{
                        backgroundColor: "background.paper",
                    }}
                >
                    <Box className="flex justify-between items-center mb-2">
                        <Typography
                            className="text-2xl border-l-2 pl-2"
                            sx={{
                                color: "background.contrastText",
                                borderColor: "background.contrastText",
                            }}
                        >
                            {steps[currentStep].label}
                        </Typography>

                        <IconButton onClick={closeDialog} className="p-0">
                            <Close sx={{ color: "background.contrastText" }} />
                        </IconButton>
                    </Box>

                    <Box className="flex-1 overflow-scroll">{Element}</Box>

                    <Box className="flex justify-between h-fit mt-auto items-center">
                        {!!currentStep && currentStep !== 5 && (
                            <Button
                                disabled={!currentStep}
                                onClick={handlePrevious}
                                variant="contained"
                                className={`capitalize w-fit flex justify-between gap-2 ${
                                    !currentStep && "hidden"
                                }`}
                            >
                                <ArrowBackIos fontSize="small" />
                                Previous
                            </Button>
                        )}

                        {currentStep === 3 && (
                            <Typography className="w-fit flex-1 justify-center flex mx-auto text-sm md:text-base">
                                {actionText}
                            </Typography>
                        )}

                        <LoadingButton
                            loading={isLoading}
                            onClick={handleNext}
                            variant="contained"
                            disabled={isButtonDisabled()}
                            className="capitalize flex w-fit ml-auto float-right"
                        >
                            {currentStep === steps.length - 1
                                ? "Finish"
                                : "Next"}
                            <ArrowForwardIos fontSize="small" />
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
}
