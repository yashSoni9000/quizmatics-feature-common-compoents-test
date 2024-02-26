import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";

export default function SearchField({
    searchText,
    onChange,
    className,
}: {
    searchText: string;
} & TextFieldProps) {
    return (
        <TextField
            className={className}
            size="small"
            InputProps={{
                startAdornment: (
                    <InputAdornment className="bg-white" position="start">
                        <GridSearchIcon className="w-fit" />
                    </InputAdornment>
                ),
            }}
            inputProps={{
                sx: { backgroundColor: "background.textBoxColor" },
            }}
            placeholder={"Search Groups"}
            value={searchText}
            onChange={onChange}
        />
    );
}
