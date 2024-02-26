import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import { Box, TextField, InputAdornment } from "@mui/material";

import { EventFor } from "@src/ts/types";
import FilterButton from "@components/filterButton/FilterButton";

import {
    FilterList as FilterListIcon,
    Search as SearchIcon,
} from "@mui/icons-material";

export interface DataGridDataProps extends DataGridProps {
    isLoading: boolean;
    searchField?: {
        placeholder: string;
        searchText: string;
        handleOnChange: (e: EventFor<"input", "onChange">) => void;
    };
    filterButtons?: {
        title: string;
        data: { fields: { label: string; value: number }[] };
        showSearchField?: boolean;
        defaultSelected?: number;
        handleOnChange: (value: number, name?: string) => void;
    }[];
}

export default function Table({
    isLoading,
    rows = [],
    columns,
    rowSelectionModel,
    paginationModel,
    onPaginationModelChange,
    paginationMode = "server",
    pageSizeOptions,
    rowCount,
    disableColumnFilter = true,
    disableColumnMenu = true,
    disableColumnSelector = true,
    className,
    searchField,
    filterButtons,
}: DataGridDataProps) {
    return (
        <Box
            className="flex flex-col h-full rounded-lg"
            sx={{ backgroundColor: "background.default" }}
        >
            <Box className="flex justify-between p-2">
                {searchField && (
                    <TextField
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="w-fit" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ backgroundColor: "background.textBoxColor" }}
                        placeholder={searchField.placeholder}
                        value={searchField.searchText}
                        onChange={searchField.handleOnChange}
                    />
                )}
                <Box className="ml-auto my-auto">
                    {filterButtons?.map(
                        ({ title, data, showSearchField, handleOnChange }) =>
                            data && (
                                <FilterButton
                                    key={title}
                                    Icon={FilterListIcon}
                                    label={title}
                                    data={data.fields}
                                    showSearchField={showSearchField}
                                    handleOnChange={handleOnChange}
                                />
                            ),
                    )}
                </Box>
            </Box>
            <DataGrid
                loading={isLoading}
                className={className}
                rows={rows || []}
                columns={columns}
                paginationMode={paginationMode}
                rowSelectionModel={rowSelectionModel}
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}
                pageSizeOptions={pageSizeOptions}
                rowCount={rowCount}
                disableColumnFilter={disableColumnFilter}
                disableColumnMenu={disableColumnMenu}
                disableDensitySelector={disableColumnSelector}
                sx={{
                    backgroundColor: "background.default",
                    ".MuiDataGrid-columnHeaderTitle": {
                        fontWeight: "bold",
                    },
                    "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within,  \
                     &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus": {
                        outline: "none",
                    },
                }}
            />
        </Box>
    );
}
