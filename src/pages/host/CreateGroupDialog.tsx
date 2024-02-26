import { useContext, useState } from "react";

import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import { HOST_GROUPS_API } from "@src/constants/endpoints/host";
import DialogModal from "@components/DialogBox";
import useAlertHook from "@src/hooks/UseAlertHook";
import { AppContext } from "@context/AppProvider";
import { axiosInstance } from "@src/utils/axiosInstance";
import { makeid } from "@src/utils/users";

import { Public, Security } from "@mui/icons-material";
import { EventFor } from "@src/ts/types";
import { checkIfGroupWithNameExist } from "@src/utils/groups";

const menuItems = [
    {
        icon: <Public className="w-5 h-5" />,
        label: "Public",
        description:
            "Participants can search and join the public group without any approval",
    },
    {
        icon: <Security className="w-5 h-5" />,
        label: "Private",
        description:
            "Private groups can only be joined with group code and approval",
    },
];

export default function CreateGroupDialog({
    showAddGroup,
    closeShowGroupDialog,
    alertModal,
}: {
    showAddGroup: boolean;
    closeShowGroupDialog: () => void;
    alertModal: ReturnType<typeof useAlertHook>;
}) {
    const [visibility, setVisibility] = useState(1);
    const [groupName, setGroupName] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [helperText, setHelperText] = useState<string>();

    const { id } = useContext(AppContext)!.userDetails!;

    function handleGroupNameChange({
        target: { value },
    }: EventFor<"input", "onChange">) {
        setGroupName(value);

        if (!value.length) {
            setDisabled(true);
            return;
        }

        checkIfGroupWithNameExist(value).then((data) => {
            if (data) setHelperText("Group with same name already exist");
            else setHelperText(undefined);

            setDisabled(data);
        });
    }

    function createGroup() {
        if (!visibility || !groupName) {
            return;
        }
        const groupCode = makeid(6).toUpperCase();

        axiosInstance()
            .post(HOST_GROUPS_API, {
                data: { name: groupName, user: id, Code: groupCode },
            })
            .then(() => {
                closeShowGroupDialog();
                alertModal.showMessage("Group Created Succefully", "success");
            })
            .catch((error) => {
                alertModal.showMessage(error.message);
            });
    }

    return (
        <DialogModal
            header="Create Group"
            buttons={[
                { label: "Cancel", onClick: closeShowGroupDialog },
                {
                    label: "Create Group",
                    onClick: createGroup,
                    variant: "contained",
                    disabled,
                },
            ]}
            handleClose={closeShowGroupDialog}
            open={showAddGroup}
            size="xs"
        >
            <Box className="flex flex-col pt-4 gap-4">
                <TextField
                    label="Group Name"
                    fullWidth
                    value={groupName}
                    onChange={handleGroupNameChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    helperText={helperText || " "}
                    error={!!helperText}
                    size="small"
                />
                <FormControl variant="outlined">
                    <InputLabel id="visibility-select">Visibility</InputLabel>
                    <Select
                        id="visibility-select"
                        size="small"
                        variant="outlined"
                        value={visibility}
                        onChange={({ target: { value } }) => {
                            setVisibility(value as number);
                        }}
                        label="Visibility"
                        renderValue={(p) => {
                            return menuItems[p - 1].label;
                        }}
                    >
                        {menuItems.map((item, index) => (
                            <MenuItem
                                key={index}
                                value={index + 1}
                                className="flex flex-col justify-start "
                            >
                                <Box className="flex ml-0 mr-auto items-center">
                                    {item.icon}
                                    <Typography className="ml-0 mr-auto">
                                        {item.label}
                                    </Typography>
                                </Box>
                                <Typography className="w-full inline-block wrap text-xs">
                                    {item.description}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </DialogModal>
    );
}
