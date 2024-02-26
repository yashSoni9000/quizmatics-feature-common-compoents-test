import { List, ListItem, Typography, Box, Skeleton } from "@mui/material";
import ErrorComponent from "@src/components/ErrorComponent";
import { SxProps } from "@mui/system";
import UseGenericStateHooks from "@src/hooks/UseGenericStateHook";

export interface ListDisplayData {
    id: number;
    label: string;
    value: number;
}

export type ListDisplayProps = ReturnType<
    typeof UseGenericStateHooks<ListDisplayData[]>
> & {
    title?: string;
    updateData: () => void;
    className?: string;
    listSx?: SxProps;
};

export default function ListDisplay({
    title,
    data,
    isLoading,
    error,
    refreshData,
    updateData,
    className,
    listSx,
}: ListDisplayProps) {
    return (
        <Box className={`${className} flex flex-col gap-2`}>
            <ErrorComponent
                error={error}
                isLoading={isLoading}
                refreshComponent={() => refreshData(updateData)}
            >
                {!isLoading ? (
                    <>
                        <Box>
                            <Typography fontSize="medium">{title}</Typography>
                        </Box>
                        <List
                            sx={listSx}
                            className="p-0 rounded-lg flex-1 overflow-y-scroll"
                        >
                            {data.map((item) => {
                                const { id, label, value } = item;
                                return (
                                    <ListItem
                                        key={id}
                                        className="flex justify-between border-b border-b-gray-300"
                                    >
                                        <Typography>{label}</Typography>
                                        <Typography
                                            className=" rounded-md p-1.5"
                                            sx={{
                                                backgroundColor: "primary.main",
                                                color: "primary.contrastText",
                                            }}
                                        >
                                            {value}
                                        </Typography>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </>
                ) : (
                    <>
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="w-full h-full m-auto scale-[100%]" />
                    </>
                )}
            </ErrorComponent>
        </Box>
    );
}
