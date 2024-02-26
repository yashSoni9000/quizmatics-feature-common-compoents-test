import { InputFieldWrapperProps } from "./InputFieldWrapper";
import { Checkbox, CheckboxProps, Box, FormControlLabel } from "@mui/material";

type CheckBoxFieldProps = Omit<InputFieldWrapperProps, "onChange"> &
    CheckboxProps;

export default function CheckBoxField({
    label,
    name,
    value,
    size,
    onChange,
}: CheckBoxFieldProps) {
    return (
        <Box className="flex gap-2 align-middle">
            <FormControlLabel
                control={
                    <Checkbox
                        size={size}
                        value={value}
                        name={name}
                        onChange={onChange}
                    />
                }
                label={label}
            />
        </Box>
    );
}
