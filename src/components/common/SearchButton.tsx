import { FC, useState } from "react";
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    TextField,
    Popover,
    SvgIconProps,
} from "@mui/material";

import ErrorComponent from "@src/components/ErrorComponent";
import CircularLoader from "./CircularLoader";
import { EventFor } from "@src/ts/types";
import UseFilterOptionHooks from "@src/hooks/UseFilterOptionHooks";

export type SearchButtonProps = ReturnType<typeof UseFilterOptionHooks> & {
    Icon: FC<SvgIconProps>;
    placeholder?: string;
    updateData: () => void;
    size?: "small" | "medium";
};

export default function SearchButton({
    Icon,
    list,
    isLoading,
    error,
    handleOnChange,
    handleOnSearchChange,
    refreshData,
    getSearchList,
    placeholder,
    size = "small",
}: SearchButtonProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [searchText, setSearchText] = useState<string>("");

    const isDropdownOpen = Boolean(anchorEl);

    function setAnchorElement({
        currentTarget,
    }: EventFor<"button", "onClick">) {
        setAnchorEl(currentTarget);
        getSearchList && getSearchList();
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function handleDropDownOnClick(value: number) {
        handleOnChange(value);
        handleClose();
    }

    function handleSearchFieldChange({
        currentTarget,
    }: EventFor<"input", "onChange">) {
        setSearchText(currentTarget.value);
        handleOnSearchChange(currentTarget.value);
    }

    return (
        <Box>
            <IconButton onClick={setAnchorElement} aria-label="Search Button">
                <Icon />
            </IconButton>
            <Popover
                className="rounded-lg"
                aria-label="Search Menu"
                open={isDropdownOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {isDropdownOpen && (
                    <Box
                        className="flex flex-col gap-2 min-w-[15rem] min-h-[15rem] h-fit max-h-[24rem] p-2"
                        sx={{ backgroundColor: "background.default" }}
                    >
                        <TextField
                            placeholder={placeholder}
                            value={searchText}
                            size={size}
                            onChange={handleSearchFieldChange}
                            autoFocus={true}
                            fullWidth
                            sx={{
                                backgroundColor: "background.textBoxColor",
                            }}
                        />
                        <ErrorComponent
                            error={error}
                            isLoading={isLoading}
                            refreshComponent={refreshData}
                        >
                            {isLoading ? (
                                <CircularLoader />
                            ) : (
                                <>
                                    {list.length !== 0 ? (
                                        <List>
                                            {list.map((item, index) => {
                                                const { value, label } = item;

                                                return (
                                                    <ListItem
                                                        key={index}
                                                        onClick={() =>
                                                            handleDropDownOnClick(
                                                                value,
                                                            )
                                                        }
                                                        value={value}
                                                        className="w-full p-0"
                                                    >
                                                        <ListItemButton>
                                                            {label}
                                                        </ListItemButton>
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                    ) : (
                                        <Box className="mt-2 p-2">
                                            No results found
                                        </Box>
                                    )}
                                </>
                            )}
                        </ErrorComponent>
                    </Box>
                )}
            </Popover>
        </Box>
    );
}
