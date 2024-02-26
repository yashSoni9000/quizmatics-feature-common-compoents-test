import ErrorComponent from "../ErrorComponent";
import { Box, Typography } from "@mui/material";
import { FC, PropsWithChildren } from "react";

export type GraphWrapperProps = {
    title?: string;
    error: boolean;
    isLoading: boolean;
    refreshData: (callBackFunction: () => void) => void;
    updateData: () => void;
    className?: string;
    LoadingSkeleton: FC;
};

export default function GraphWrapper({
    title,
    error,
    isLoading,
    LoadingSkeleton,
    className,
    refreshData,
    updateData,
    children,
}: PropsWithChildren<GraphWrapperProps>) {
    return (
        <Box className={`${className} flex flex-col gap-2`}>
            <ErrorComponent
                error={error}
                isLoading={isLoading}
                refreshComponent={() => refreshData(updateData)}
            >
                {!isLoading ? (
                    <>
                        {title && (
                            <Typography fontSize="medium">{title}</Typography>
                        )}
                        {children}
                    </>
                ) : (
                    <LoadingSkeleton />
                )}
            </ErrorComponent>
        </Box>
    );
}
