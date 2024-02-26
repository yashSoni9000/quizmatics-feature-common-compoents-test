import { useEffect, useState } from "react";
import { TextField, Typography, Grid } from "@mui/material";

import { axiosInstance } from "@src/utils/axiosInstance";
import { STRAPI_API, USER_API_POPULATE } from "@src/constants/endpoints";
import useAlertHook from "@src/hooks/UseAlertHook";
import DialogModal from "@components/DialogBox";
import { Groups } from "@src/ts/interfaces/host";
import { extractStrapiTableData, getGroups } from "@src/utils";
import { EventFor, ResponseType, StrapiMultiResponse } from "@src/ts/types";

export default function JoinGroupDialog({
    open,
    handleClose,
    alertModal,
    setRefresh,
}: {
    open: boolean;
    handleClose: () => void;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    alertModal: ReturnType<typeof useAlertHook>;
}) {
    const [code, setCode] = useState<string>("");
    const [groupName, setGroupName] = useState<string>("");
    const [groups, setGroups] = useState<Groups[]>([]);
    const [allGroups, setAllGroups] = useState<Groups[]>([]);

    useEffect(() => {
        axiosInstance()
            .get(USER_API_POPULATE)
            .then(({ data }: { data: { groups: Groups[] } }) => {
                const obj = data.groups;
                setGroups(obj);
            })
            .finally(() => {});

        getGroups().then(
            ({ data }: ResponseType<StrapiMultiResponse<Groups>>) => {
                setAllGroups(extractStrapiTableData(data));
            },
        );
    }, []);

    useEffect(() => {
        getGroupWithCode();
    }, [code]);

    function handleOnChange({
        target: { value },
    }: EventFor<"input", "onChange">) {
        setCode(value);
    }

    function getGroupWithCode() {
        axiosInstance()
            .get(`${STRAPI_API}/groups?filters[Code][$eqi]=${code}`)
            .then(({ data }) => {
                if (!data.data.length) {
                    setGroupName("");
                    return;
                }
                const name = data.data.find(
                    (p: { attributes: { name: string; Code: string } }) =>
                        p.attributes.Code,
                ).attributes.name;

                setGroupName(name);
            });
    }

    function getHelperText() {
        const group = groups.find((p) => p.Code === code);
        if (!group) return "";

        return "Group already Joined";
    }

    function isDisabled() {
        if (code?.length !== 6) {
            return true;
        }
        if (getHelperText().length >= 2) {
            return true;
        }
        return false;
    }

    function addGroup() {
        if (isDisabled()) return;
        const group = allGroups.find((p) => p.Code === code);
        if (!group) return;

        getGroups()
            .then(({ data }: ResponseType<StrapiMultiResponse<Groups>>) => {
                const groupss = extractStrapiTableData(data);

                const selectedGroup = groupss.find(
                    (p) =>
                        p.Code.toLowerCase().trim() ===
                        code?.toLowerCase().trim(),
                );
                if (selectedGroup) {
                    axiosInstance()
                        .get("/api/users/me")
                        .then(({ data }) => {
                            const ids = groups.map((p) => p.id);
                            const id = data.id;
                            return axiosInstance().put(`api/users/${id}`, {
                                groups: [...ids, selectedGroup.id],
                            });
                        })
                        .then(() => {
                            alertModal.showMessage(
                                "Group Joined successfully",
                                "success",
                            );
                            setRefresh((v) => !v);
                        });
                } else {
                    throw new Error("Invalid Group Code");
                }
            })
            .then(() => {
                alertModal.showMessage("Group Joined Successfully", "success");
                handleClose();
            })
            .catch((error) => {
                alertModal.showMessage(error.message);
            });
    }

    return (
        <DialogModal
            header="Join a Group"
            buttons={[
                { label: "Cancel", onClick: handleClose },
                {
                    label: "Join Group",
                    onClick: addGroup,
                    disabled: isDisabled(),
                },
            ]}
            handleClose={handleClose}
            open={open}
        >
            <Grid container rowSpacing={2} className="items-center w-fit">
                <Grid item xs={3}>
                    <Typography>Enter Code</Typography>
                </Grid>
                <Grid item xs={9}>
                    <TextField
                        value={code}
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        onChange={handleOnChange}
                    />
                </Grid>
                <Grid item xs={3} className="items-center flex pt-0">
                    <Typography>Group Name</Typography>
                </Grid>
                <Grid item xs={9}>
                    <TextField
                        value={groupName}
                        size="small"
                        fullWidth
                        helperText={getHelperText() || " "}
                        disabled
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
            </Grid>
        </DialogModal>
    );
}
