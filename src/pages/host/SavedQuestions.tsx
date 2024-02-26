import { useEffect, useState } from "react";

import { Box, Typography, Button } from "@mui/material";
import { GridPaginationModel, GridRowProps } from "@mui/x-data-grid";
import { FileDownload, FileUpload } from "@mui/icons-material";

import Table from "@src/components/table";
import useDataGridHooks from "@src/hooks/UseDatagridHooks";
import AddQuestionModal from "./AddQuestionsDialog";
import useAlertHook from "@src/hooks/UseAlertHook";

import { SAVED_QUESTIONS_API } from "@constants/endpoints/host";
import { axiosInstance } from "@utils/axiosInstance";
import { ResponseType, StrapiMultiResponse } from "@src/ts/types";
import { AlertPopup } from "@components/AlertPopup";

import {
    downloadFile,
    extractStrapiTableData,
    formatDateReadable,
} from "@src/utils";

interface Question extends GridRowProps {
    id: string;
    question: string;
    date: Date;
    difficulty: string;
    category: string;
}

export default function SavedQuestions() {
    const alertModal = useAlertHook();
    const savedQuestions = useDataGridHooks<Question[]>([]);

    const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
        {
            page: 0,
            pageSize: 8,
        },
    );

    useEffect(getSavedQuestionsData, [
        savedQuestions.searchText,
        paginationModel,
    ]);

    function getSavedQuestionsData() {
        savedQuestions.updateIsLoading(true);
        let filterString = `pagination[page]=${
            paginationModel.page + 1
        }&pagination[pageSize]=${paginationModel.pageSize}`;

        if (savedQuestions.searchText)
            filterString = `${filterString}&filters[question][$contains]=${savedQuestions.searchText}`;

        axiosInstance()
            .get(`${SAVED_QUESTIONS_API}?${filterString}`)
            .then(({ data }: ResponseType<StrapiMultiResponse<Question>>) => {
                const savedQuestionData = extractStrapiTableData(data);

                savedQuestions.updateState(
                    savedQuestionData,
                    false,
                    undefined,
                    false,
                    data.meta.pagination.total,
                );
            })
            .catch((error) => {
                alertModal.showMessage(error.message);
                savedQuestions.updateState([], true, error, false, 0);
            });
    }

    function displayAddQuestionDialog(value: boolean) {
        setShowAddQuestionDialog(value);
    }

    const headers = [
        {
            field: "question",
            headerName: "Question",
            minWidth: 300,
            sortable: false,
            flex: 4,
        },
        {
            field: "date",
            headerName: "Date Added",
            minWidth: 150,
            sortable: false,
            flex: 2,
            valueFormatter: (params: { value: Date }) =>
                formatDateReadable(new Date(params.value)),
        },
        {
            field: "category",
            headerName: "Category",
            minWidth: 150,
            sortable: false,
            flex: 2,
        },
        {
            field: "difficulty",
            headerName: "Difficulty",
            minWidth: 150,
            sortable: false,
            flex: 2,
        },
    ];

    return (
        <>
            <Box className="flex flex-col h-full gap-3 md:gap-4">
                <Box className="flex flex-col sm:flex-row items-center justify-start sm:justify-between gap-2">
                    <Typography className="text-lg xs:text-2xl ml-0 mr-auto">
                        Saved Questions
                    </Typography>
                    <Box className="flex gap-2 justify-start sm:justify-end flex-1 w-full">
                        <Button
                            variant="contained"
                            className="capitalize px-2 text-xs xs:text-base p-1"
                            onClick={() => {
                                downloadFile("Saved Questions");
                            }}
                        >
                            <FileDownload className="mr-2" />
                            Export Questions
                        </Button>
                        <Button
                            variant="contained"
                            className="capitalize px-2 text-xs xs:text-base p-1"
                            onClick={() => setShowAddQuestionDialog(true)}
                        >
                            <FileUpload className="mr-2" />
                            Import Questions
                        </Button>
                    </Box>
                </Box>
                <Box className="h-full overflow-y-scroll">
                    <Table
                        isLoading={savedQuestions.isLoading}
                        columns={headers}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        rows={savedQuestions.data}
                        rowCount={savedQuestions.count}
                        pageSizeOptions={[5, 8, 10, 20, 50]}
                        searchField={{
                            searchText: savedQuestions.searchText,
                            handleOnChange: savedQuestions.updateSearchText,
                            placeholder: "Search Questions",
                        }}
                    />
                </Box>
            </Box>

            {showAddQuestionDialog && (
                <AddQuestionModal
                    addQuestionDialog={showAddQuestionDialog}
                    alertModal={alertModal}
                    displayAddQuestionDialog={displayAddQuestionDialog}
                />
            )}

            {alertModal.isOpen && (
                <AlertPopup
                    severity={alertModal.severity}
                    message={alertModal.message}
                />
            )}
        </>
    );
}
