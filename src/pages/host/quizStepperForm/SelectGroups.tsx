import { MouseEvent, useEffect, useState } from "react";
import {
    Box,
    IconButton,
    Typography,
    Popover,
    Button,
    TextField,
    InputAdornment,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";

import FilterDropdown from "@components/common/filterButton/FilterDropdown";
import { Groups } from "@interfaces/host";
import { ResponseType, StrapiMultiResponse } from "@src/ts/types";
import { extractStrapiTableData, getGroups } from "@src/utils";

import { StepperPagesData } from ".";
import { AlertPopup } from "@components/AlertPopup";
import useAlertHook from "@src/hooks/UseAlertHook";

export interface Group {
    id: number;
    name: string;
}

export default function SelectGroup({
    quizData,
    handleOnChange,
    selectedGroups,
    setSelectedGroups,
}: {
    selectedGroups: Group[];
    setSelectedGroups: React.Dispatch<React.SetStateAction<Group[]>>;
} & StepperPagesData) {
    const alertModal = useAlertHook();
    const [disabled, setDisabled] = useState(false);
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        getGroups()
            .then(({ data }: ResponseType<StrapiMultiResponse<Groups>>) => {
                setGroups(extractStrapiTableData(data));
                setDisabled(false);
            })
            .catch((error) => alertModal.showMessage(error.message));

        if (selectedGroups.length === groups.length) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, []);

    function addGroupToList(group: Group) {
        setSelectedGroups((groups) => {
            return [...groups, group];
        });
    }

    function removeGroupFromList(id: number) {
        const newList = selectedGroups.filter((obj) => obj.id !== id);
        setSelectedGroups(newList);
    }

    function getUnselectedGroups() {
        const list = groups.filter(
            (group) =>
                !selectedGroups.find(
                    (selectedGroup) => selectedGroup.id === group.id,
                ),
        );

        return list.map(({ id, name }) => {
            return { label: name, value: id };
        });
    }

    return (
        <>
            <Box className="flex flex-col gap-4">
                <Box className="flex justify-between items-center">
                    <Typography>
                        Remind Participants before Quiz Start:{" "}
                    </Typography>
                    <TextField
                        size="small"
                        type="number"
                        onKeyDown={(e) => {
                            if (["+", "-", ".", "e"].includes(e.key))
                                e.preventDefault();
                        }}
                        className="p-0 w-36 bg-white"
                        defaultValue={quizData.reminder}
                        name="reminder"
                        onChange={handleOnChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment
                                    position="end"
                                    className="bg-gray-200 h-full px-2 m-0"
                                >
                                    Minutes
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                paddingRight: 0,
                                height: "2rem",
                            },
                        }}
                    />
                </Box>
                <Box className="flex flex-col gap-2">
                    <Box className="flex justify-between items-center">
                        <Typography className="text-md">
                            Select Groups
                        </Typography>
                        <Box className="flex gap-2 items-center">
                            <AddButton
                                disabled={disabled}
                                list={getUnselectedGroups()}
                                addGroupToList={addGroupToList}
                            />
                            <Button
                                disabled={!selectedGroups.length}
                                onClick={() => setSelectedGroups([])}
                                className="capitalize text-gray-700 disabled:text-gray-400"
                            >
                                Clear All
                            </Button>
                        </Box>
                    </Box>

                    <Box className="flex flex-row flex-wrap gap-2">
                        {selectedGroups.map((group) => (
                            <GroupButton
                                key={group.id}
                                group={group}
                                removeGroupFromList={removeGroupFromList}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
            {alertModal.isOpen && <AlertPopup message={alertModal.message} />}
        </>
    );
}

interface AddButtonProps {
    list: { label: string; value: number }[];
    addGroupToList: (group: Group) => void;
    disabled: boolean;
}

function AddButton({ list, addGroupToList, disabled }: AddButtonProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    function buttonOnClick(event: MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleOnChange(value: number, label: string) {
        addGroupToList({ id: value, name: label });
        handleClose();
    }

    const open = Boolean(anchorEl);

    return (
        <>
            <Box
                className={`border ${
                    disabled ? "border-gray-300" : "border-gray-500"
                } w-fit h-fit rounded-lg p-0`}
            >
                <IconButton
                    className="rounded-none py-0 px-2 h-fit"
                    size="small"
                    onClick={buttonOnClick}
                    disabled={disabled}
                >
                    <Add className="scale-75" />
                    <Typography className="text-sm">Add Group</Typography>
                </IconButton>
            </Box>
            <Popover
                className="m-4 min-h-full rounded-lg"
                id="add-button"
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <FilterDropdown data={list} handleClose={handleOnChange} />
            </Popover>
        </>
    );
}

interface GroupButtonProps {
    group: Group;
    removeGroupFromList: (id: number) => void;
}

function GroupButton({ group, removeGroupFromList }: GroupButtonProps) {
    return (
        <Box className="border border-gray-500 w-fit rounded-lg px-1">
            <IconButton
                className="rounded-none px-1 py-0"
                size="small"
                onClick={() => removeGroupFromList(group.id)}
            >
                <Close className="scale-75" />
                <Typography>{group.name}</Typography>
            </IconButton>
        </Box>
    );
}
