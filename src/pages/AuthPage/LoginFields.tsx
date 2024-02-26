import {
    Box,
    Button,
    ButtonProps,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    SelectProps,
    TextField,
    TextFieldProps,
    Typography,
} from "@mui/material";
import { EventFor } from "@src/ts/types";

interface FieldProps {
    getHelperText: (name: string) => string;
}

export function TextBlock({
    getHelperText,
    ...props
}: TextFieldProps & FieldProps) {
    const { fullWidth, required, ...rest } = props;
    const helperText = getHelperText(rest.name || " ");

    return (
        <TextField
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth={fullWidth || true}
            required={required !== undefined ? required : true}
            helperText={helperText}
            className="placeholder:text-xs"
            error={helperText.length > 1}
            {...rest}
        />
    );
}

export function SelectField<Type>({
    list,
    getHelperText,
    handleOnChange,
    ...props
}: SelectProps &
    FieldProps & {
        list: { label: string; id: number }[];
        value: Type;
        handleOnChange: (e: EventFor<"input", "onChange">) => void;
    }) {
    const { label, ...rest } = props;

    function onChange(e: SelectChangeEvent<unknown>) {
        handleOnChange(e as EventFor<"input", "onChange">);
    }

    return (
        <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel shrink htmlFor="name">
                {label}
            </InputLabel>
            <Select
                {...rest}
                size="small"
                name={props.name}
                labelId="name"
                variant="outlined"
                label={label}
                onChange={onChange}
                fullWidth
            >
                {list.map(({ id, label }) => (
                    <MenuItem key={id} value={id}>
                        {label}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{getHelperText(props.name || "")}</FormHelperText>
        </FormControl>
    );
}

type LoadingProps = ButtonProps & {
    isLoading: boolean;
    text: string;
};

export function LoadingButton({
    isLoading,
    variant,
    className,
    disabled,
    text,
    onClick,
}: LoadingProps) {
    return (
        <Button
            variant={variant}
            className={className}
            onClick={onClick}
            disabled={isLoading || disabled}
        >
            <Box className="relative flex flex-row mx-2 " color="inherit">
                <Box
                    className={`absolute top-0 left-1/2  block mx-auto -translate-x-1/2 max-h-[1.15rem] max-w-[1.15rem] ${
                        isLoading ? "visible" : "invisible"
                    }`}
                >
                    <CircularProgress
                        color="inherit"
                        className="max-w-[1.15rem] max-h-[1.15rem]"
                    />
                </Box>
                <Typography
                    className={`text-sm ${
                        !isLoading ? "visible" : "invisible"
                    }`}
                >
                    {text}
                </Typography>
            </Box>
        </Button>
    );
}
