import { PropsWithChildren } from "react";
import { Box, Typography } from "@mui/material";
import SearchButton, { SearchButtonProps } from "./SearchButton";
import SelectField, { SelectFieldProps } from "./SelectField";

export interface CardContainerProps {
    title: string;
    searchButton?: SearchButtonProps;
    selectField?: SelectFieldProps;
}

export default function CardContainer({
    title,
    searchButton,
    selectField,
    children,
}: PropsWithChildren<CardContainerProps>) {
    return (
        <Box
            className="rounded-lg shadow-md h-full p-2 md:p-3 align-middle"
            sx={{ backgroundColor: "background.default" }}
        >
            <Box className="flex flex-col xs:flex-row gap-2 justify-between">
                <Box className="flex gap-2 justify-between w-full">
                    <Typography className="text-lg md:text-xl !line-clamp-2 overflow-hidden">
                        {title}
                    </Typography>
                    {searchButton && <SearchButton {...searchButton} />}
                </Box>
                <Box className="ml-auto flex gap-2 w-fit">
                    {selectField && (
                        <SelectField className="w-36" {...selectField} />
                    )}
                </Box>
            </Box>
            <Box>{children}</Box>
        </Box>
    );
}
