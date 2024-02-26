import { useState } from "react";
import { Box, TextField, List, ListItem, ListItemButton } from "@mui/material";

import { EventFor } from "@src/ts/types";

interface DropdownData {
    label: string;
    value: number;
}

interface Props {
    data: DropdownData[];
    showSearchField?: boolean;
    handleClose: (value: number, label: string) => void;
    placeholder?: string;
}

export default function FilterDropdown({
    data,
    showSearchField,
    handleClose,
    placeholder = "Type to search...",
}: Props) {
    const [list, setList] = useState<DropdownData[]>(data);

    function handleOnChange(event: EventFor<"input", "onChange">) {
        const value = event.target.value.toLowerCase();

        const filteredList = data.filter((list: DropdownData) =>
            list.label
                .toLowerCase()
                .trim()
                .includes(value.toLowerCase().trim()),
        );

        setList(filteredList);
    }

    function handleOnClose(value: number, label: string) {
        handleClose(value, label);
    }

    return (
        <Box
            className="overflow-y-scroll max-h-[28rem] h-fit w-60 p-2 flex flex-col"
            sx={{
                backgroundColor: "background.default",
            }}
        >
            {showSearchField && (
                <TextField
                    placeholder={placeholder}
                    size="small"
                    onChange={handleOnChange}
                    autoFocus={true}
                    className="w-full"
                    fullWidth
                    sx={{
                        backgroundColor: "background.paper",
                    }}
                />
            )}

            <List className="h-fit w-60 overflow-y-scroll mt-2">
                {list.map(({ value, label }) => (
                    <ListItem
                        key={value}
                        onClick={() => handleOnClose(value, label)}
                        value={value}
                        className="w-full p-0"
                    >
                        <ListItemButton>{label}</ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
