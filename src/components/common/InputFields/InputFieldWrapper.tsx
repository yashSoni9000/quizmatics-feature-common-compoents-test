import { Box, Typography, TextFieldProps } from "@mui/material";
import { PropsWithChildren } from "react";

export type InputFieldWrapperProps = TextFieldProps & {
    orientation?: "row" | "col";
};

export default function InputFieldWrapper({
    size,
    label,
    required,
    fullWidth,
    orientation,
    children,
}: PropsWithChildren<InputFieldWrapperProps>) {
    return (
        <Box
            className={`flex ${
                orientation === "row" ? "flex-row" : "flex-col"
            } gap-1 ${fullWidth && "w-full"}`}
        >
            <Typography
                fontSize={orientation === "row" ? "medium" : size}
                className={`ml-1 my-auto h-fit mr-6 ${required && "required"}`}
            >
                {label}
            </Typography>
            {children}
        </Box>
    );
}
