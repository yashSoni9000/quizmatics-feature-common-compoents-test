import { Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import { Steps } from "./StepperForm";

interface StepperProps {
    steps: Steps[];
    currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
    function isActiveStep(step: number) {
        return currentStep === step;
    }

    function isPendingStep(step: number) {
        return currentStep < step;
    }

    return (
        <>
            {steps.map((step, index) => (
                <Box
                    className="flex flex-row items-center gap-2"
                    key={step.label}
                >
                    <Button
                        className={`max-w-[2rem] max-h-[2rem] min-w-[2rem] min-h-[2rem] rounded-full p-1 ${
                            isPendingStep(index) ? "bg-gray-300 " : "bg-white"
                        }`}
                    >
                        {isActiveStep(index) || isPendingStep(index) ? (
                            <Typography className="font-bold">
                                {index + 1}
                            </Typography>
                        ) : (
                            <CheckIcon />
                        )}
                    </Button>
                    <Typography className="text-white">{step.label}</Typography>
                </Box>
            ))}
        </>
    );
}
