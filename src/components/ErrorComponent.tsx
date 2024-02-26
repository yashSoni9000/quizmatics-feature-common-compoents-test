import { PropsWithChildren } from "react";
import { Box, Typography } from "@mui/material";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";

import LoadingButton from "./common/LoadingButton";

interface Props {
    error: boolean;
    isLoading: boolean;
    refreshComponent: () => void;
    errorMessage?: string;
    className?: string;
    sx?: SxProps;
}

export default function ErrorComponent({
    error,
    errorMessage = "Unable to load data",
    isLoading,
    sx,
    className,
    children,
    refreshComponent,
}: PropsWithChildren<Props>) {
    return error ? (
        <Box
            sx={sx}
            className={`w-full h-full flex flex-col justify-center align-middle my-auto ${className}`}
        >
            <Typography className="text-center text-inherit">
                {errorMessage}
            </Typography>

            <LoadingButton
                handleOnClick={refreshComponent}
                text="Retry"
                isLoading={isLoading}
            />
        </Box>
    ) : (
        children
    );
}
