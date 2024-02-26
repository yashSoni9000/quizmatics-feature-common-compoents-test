import { Typography, Box } from "@mui/material";

import ErrorComponent from "@src/components/ErrorComponent";
import UseGenericStateHooks from "@src/hooks/UseGenericStateHook";
import Skeletons from "./Skeletons";

export interface DataDisplayCardData {
    label: string;
    value: number;
    id: number;
}

export type DataDisplayCardProps = ReturnType<
    typeof UseGenericStateHooks<DataDisplayCardData[]>
> & {
    title: string;
    fieldsCount: number;
    handleOnClick: (id: number) => void;
    updateData: () => void;
    className?: string;
};

export default function DataDisplayCard({
    title,
    data,
    error,
    isLoading,
    fieldsCount,
    className,
    updateData,
    refreshData,
    handleOnClick,
}: DataDisplayCardProps) {
    return (
        <Box
            className={`${className} flex flex-col p-4 gap-4 w-full h-full rounded-lg`}
            sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
            }}
        >
            <Typography
                className="mx-auto text-lg md:text-3xl text-center"
                sx={{
                    color: "primary.contrastText",
                }}
            >
                {title}
            </Typography>

            <ErrorComponent
                isLoading={isLoading}
                error={error}
                refreshComponent={() => refreshData(updateData)}
                className="rounded-lg"
                sx={{ backgroundColor: "primary.light" }}
            >
                <Box className="gap-4 flex flex-1 w-full">
                    {isLoading ? (
                        <Skeletons
                            count={fieldsCount}
                            className="min-h-[5.5rem] scale-100 flex-1"
                        />
                    ) : (
                        data.map((item) => {
                            const { id, label, value } = item;
                            return (
                                <Box
                                    key={id}
                                    className={`flex flex-col flex-1 justify-between mx-auto p-2 min-h-[5.5rem] scale-100 
                                                    rounded-lg transition-colors duration-300 hover:cursor-pointer`}
                                    onClick={() => handleOnClick(id)}
                                    sx={{
                                        backgroundColor: "primary.light",
                                        "> p": {
                                            color: "primary.contrastText",
                                        },
                                        ":hover": {
                                            backgroundColor: "primary.dark",
                                        },
                                    }}
                                >
                                    <Typography className="text-center">
                                        {label}
                                    </Typography>
                                    <Typography className="text-xl mt-2 text-center font-bold">
                                        {value}
                                    </Typography>
                                </Box>
                            );
                        })
                    )}
                </Box>
            </ErrorComponent>
        </Box>
    );
}
