import { TextField, TextFieldProps } from "@mui/material";

import InputFieldWrapper from "./InputFieldWrapper";

export type TextBoxProps = TextFieldProps & {
    label: string;
};

export default function TextBox({
    label,
    name,
    type,
    size,
    error,
    helperText,
    placeholder,
    rows,
    multiline,
    required,
    fullWidth,
    onChange,
}: TextBoxProps) {
    return (
        <InputFieldWrapper
            label={label}
            size={size}
            required={required}
            fullWidth={fullWidth}
        >
            <TextField
                size={size}
                type={type}
                name={name}
                error={error}
                rows={rows || 1}
                placeholder={placeholder}
                helperText={helperText}
                fullWidth={fullWidth}
                multiline={multiline}
                required={required}
                onChange={onChange}
            />
        </InputFieldWrapper>
    );
}
