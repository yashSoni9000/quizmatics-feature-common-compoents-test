import dayjs, { Dayjs } from "dayjs";
import {
    DateTimePicker,
    DateTimePickerProps,
    LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormHelperText, FormControl } from "@mui/material";

import InputFieldWrapper, { InputFieldWrapperProps } from "./InputFieldWrapper";

type DateFieldProps = Omit<InputFieldWrapperProps, "onChange"> &
    DateTimePickerProps<Dayjs> & { helperText: string };

export default function DateField({
    label,
    value,
    size,
    disableFuture,
    minDate,
    onChange,
    required,
    disablePast,
    maxDate,
    helperText,
    fullWidth,
}: DateFieldProps) {
    return (
        <InputFieldWrapper
            label={label}
            size={size}
            required={required}
            fullWidth={fullWidth}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormControl error={helperText.length >= 1} size="small">
                    <DateTimePicker
                        slotProps={{ textField: { size, required: true } }}
                        onChange={onChange}
                        minDate={minDate && dayjs(minDate)}
                        maxDate={maxDate && dayjs(maxDate)}
                        disableFuture={disableFuture}
                        disablePast={disablePast}
                        defaultValue={value}
                    />
                    <FormHelperText className="m-0">
                        {helperText}
                    </FormHelperText>
                </FormControl>
            </LocalizationProvider>
        </InputFieldWrapper>
    );
}
