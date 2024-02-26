import {
    Select,
    SelectProps,
    SelectChangeEvent,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import InputFieldWrapper, { InputFieldWrapperProps } from "./InputFieldWrapper";
import { EventFor } from "@src/ts/types";

interface ListItem {
    label: string;
    id: number;
}

export type SelectBoxProps = InputFieldWrapperProps &
    SelectProps & {
        value?: number;
        list: ListItem[];
        handleOnChange: ({
            target: { name, value },
        }: EventFor<"input", "onChange">) => void;
    };

export default function SelectBox({
    label,
    name,
    value,
    list,
    size,
    orientation,
    required,
    helperText,
    fullWidth,
    handleOnChange,
}: SelectBoxProps) {
    function handleChange(e: SelectChangeEvent<number>) {
        handleOnChange(e as EventFor<"input", "onChange">);
    }

    return (
        <InputFieldWrapper
            label={label}
            size={size}
            required={required}
            orientation={orientation}
            fullWidth={fullWidth}
        >
            <Select
                name={name}
                value={value}
                size={size}
                onChange={handleChange}
            >
                {list.map(({ id, label }) => (
                    <MenuItem key={id} value={id}>
                        {label}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{helperText}</FormHelperText>
        </InputFieldWrapper>
    );
}
