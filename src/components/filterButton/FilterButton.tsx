import { useState, FC } from "react";

import {
    Popover,
    IconButton,
    Typography,
    Box,
    SvgIconProps,
} from "@mui/material";

import FilterDropdown from "./FilterDropdown";

interface Props {
    Icon: FC<SvgIconProps>;
    label?: string;
    data: { label: string; value: number }[];
    showSearchField?: boolean;
    handleOnChange: (value: number, name?: string) => void;
}

export default function FilterButton({
    Icon,
    label,
    data,
    showSearchField,
    handleOnChange,
}: Props) {
    const [name, setName] = useState(label);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const dropDownValueChange = (value: number, name: string) => {
        handleOnChange(value, name);
        setName(name);
        handleClose();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <Box className="max-w-[10rem]">
            <IconButton
                className="w-full h-8 rounded-md my-auto flex gap-2"
                aria-describedby={id}
                onClick={handleClick}
            >
                <Icon />
                {name && (
                    <Typography className="capitalize truncate w-full">
                        {name}
                    </Typography>
                )}
            </IconButton>
            <Popover
                className="m-4 min-h-full rounded-lg"
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <FilterDropdown
                    data={data}
                    showSearchField={showSearchField}
                    handleClose={dropDownValueChange}
                />
            </Popover>
        </Box>
    );
}
