import { useState } from "react";

import { Box, Button, Typography } from "@mui/material";
import DialogModal from "@src/components/DialogBox";
import { Add } from "@mui/icons-material";

import useAlertHook from "@src/hooks/UseAlertHook";
import { downloadFile } from "@src/utils";
import { axiosInstance } from "@src/utils/axiosInstance";

import ExcelGreenImg from "@images/excel-green.svg";
import ExcelImg from "@images/excel.svg";
import { EventFor } from "@src/ts/types";

export default function AddQuestionModal({
    alertModal,
    addQuestionDialog,
    displayAddQuestionDialog,
}: {
    alertModal: ReturnType<typeof useAlertHook>;
    addQuestionDialog: boolean;
    displayAddQuestionDialog: (value: boolean) => void;
}) {
    const [file, setFile] = useState<EventFor<"input", "onChange">>();

    function download() {
        downloadFile("Reference Sheet").catch((error) =>
            alertModal.showMessage(error.message),
        );
    }

    function uploadFile() {
        if (!file) return;

        const formData = new FormData();
        formData.append("files", file.target.files?.[0] as Blob);

        axiosInstance()
            .post("api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                alertModal.showMessage("File uploaded successfully", "success");
                displayAddQuestionDialog(false);
            })
            .catch((error) => {
                alertModal.showMessage(error.message);
            });
    }

    return (
        <DialogModal
            header="Add Questions"
            buttons={[
                {
                    label: "Cancel",
                    onClick: () => {
                        displayAddQuestionDialog(false);
                    },
                    variant: "text",
                },
                {
                    label: "Upload",
                    onClick: uploadFile,
                    variant: "contained",
                },
            ]}
            handleClose={() => displayAddQuestionDialog(false)}
            open={addQuestionDialog}
            className="flex flex-col gap-2"
        >
            <Button
                onClick={download}
                variant="contained"
                className="w-fit capitalize px-2 ml-auto"
            >
                <Box component="img" src={ExcelImg} className="w-5 h-5 mr-2" />
                Reference Sheet
            </Button>

            <Button
                variant="outlined"
                color="primary"
                component="span"
                className="w-full h-32 bg-gray-100 !border-dashed border-2 border-gray-400 hover:bg-gray-200"
                sx={{
                    backgroundColor: "background.paper",
                    border: "dashed 2px gray",
                }}
            >
                <Typography
                    component="input"
                    id="contained-button-file"
                    className="hidden"
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => setFile(e)}
                />
                <Typography
                    component="label"
                    htmlFor="contained-button-file"
                    className="flex flex-col gap-2 w-full h-full justify-center items-center"
                >
                    {!file ? (
                        <Add className="text-gray-500 w-16 h-16 " />
                    ) : (
                        <>
                            <Box
                                component="img"
                                src={ExcelGreenImg}
                                className="w-16 h-16 text-green-500"
                                sx={{ color: "green" }}
                            />
                            <Typography className="capitalize text-gray-700">
                                {file.target.value}
                            </Typography>
                        </>
                    )}
                </Typography>
            </Button>
        </DialogModal>
    );
}
