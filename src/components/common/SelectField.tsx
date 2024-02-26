import { Autocomplete, TextField } from "@mui/material";
import UseFilterOptionHooks, {
    FilterListData,
} from "@src/hooks/UseFilterOptionHooks";

export type SelectFieldProps = ReturnType<typeof UseFilterOptionHooks> & {
    label: string;
    defaultValue: FilterListData;
    size?: "small" | "medium";
    className?: string;
    readOnly?: boolean;
};

export default function SelectField({
    label,
    list,
    isLoading,
    defaultValue,
    handleOnChange,
    handleOnSearchChange,
    className,
    readOnly,
    size = "small",
}: SelectFieldProps) {
    return (
        <Autocomplete
            disablePortal
            autoComplete
            fullWidth
            className={className}
            size={size}
            options={list}
            getOptionLabel={(item) => item.label}
            value={defaultValue}
            disableClearable={readOnly}
            selectOnFocus={!readOnly}
            loading={isLoading}
            onInputChange={(_: unknown, newInputValue) =>
                handleOnSearchChange(newInputValue)
            }
            onChange={(_: unknown, newValue: FilterListData | null) =>
                handleOnChange(newValue?.value)
            }
            data-testid="autocomplete-select"
            renderInput={({ inputProps, ...rest }) => (
                <TextField
                    {...rest}
                    label={label}
                    className={`${readOnly && "!cursor-pointer"}`}
                    inputProps={{ ...inputProps, readOnly }}
                    sx={{ backgroundColor: "background.textBoxColor" }}
                />
            )}
        />
    );
}
