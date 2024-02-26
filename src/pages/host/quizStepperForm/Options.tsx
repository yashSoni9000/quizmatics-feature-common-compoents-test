import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { Box, Grid, InputAdornment, TextField } from "@mui/material";

import DateField from "@components/common/InputFields/DatePicker";
import SelectBox from "@components/common/InputFields/SelectBox";

import { StepperPagesData } from ".";
import { EventFor } from "@src/ts/types";

export const timeLimitTypeValues = [
    { id: 1, label: "Overall" },
    { id: 2, label: "Per Question" },
];

const invalidChars = ["-", "+", "e", "."];

export default function Options({
    quizData,
    getHelperText,
    handleOnChange,
}: StepperPagesData) {
    const { startDate, endDate, timeLimitType, timeLimit } = quizData;

    const [startDateField, setStartDate] = useState<Dayjs | undefined>(
        startDate && dayjs(startDate),
    );
    const [endDateField, setEndDate] = useState<Dayjs | undefined>(
        endDate && dayjs(endDate),
    );

    function onStartChange(value: dayjs.Dayjs | null) {
        if (value) {
            setStartDate(value);

            handleOnChange({
                target: {
                    value: value.toDate().toISOString(),
                    name: "startDate",
                },
            } as EventFor<"input", "onChange">);
        }
    }
    function onEndChange(value: dayjs.Dayjs | null) {
        if (value) {
            setEndDate(value);

            handleOnChange({
                target: {
                    value: value.toDate().toISOString(),
                    name: "endDate",
                },
            } as EventFor<"input", "onChange">);
        }
    }

    return (
        <Box className="w-full h-full">
            <Grid container rowSpacing={4} columnSpacing={2} className="py-4">
                <Grid item xs={12} sm={6}>
                    <DateField
                        label="Select Start Date and Time"
                        value={startDateField}
                        name="startDate"
                        size="small"
                        onChange={onStartChange}
                        helperText={getHelperText("startDate")}
                        maxDate={dayjs(new Date()).add(30, "day")}
                        fullWidth
                        disablePast
                        required
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <DateField
                        label="Select Expiry Date and Time"
                        value={endDateField}
                        name="endDate"
                        size="small"
                        onChange={onEndChange}
                        helperText={getHelperText("endDate")}
                        minDate={dayjs(startDateField).add(30, "minute")}
                        fullWidth
                        disablePast
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SelectBox
                        value={timeLimitType}
                        label="Time Limit Type"
                        name="timeLimitType"
                        size="small"
                        handleOnChange={handleOnChange}
                        helperText={getHelperText("timeLimitType")}
                        list={timeLimitTypeValues}
                        fullWidth
                        required
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box>
                        <TextField
                            label="Time Limit"
                            defaultValue={timeLimit}
                            name="timeLimit"
                            type="number"
                            size="small"
                            className="p-0 required"
                            error={getHelperText("timeLimit").length > 2}
                            onChange={handleOnChange}
                            helperText={getHelperText("timeLimit")}
                            inputProps={{ shrink: true }}
                            InputProps={{
                                sx: { color: "background.contrastText" },
                                endAdornment: (
                                    <InputAdornment
                                        position="end"
                                        className=" h-full px-2 m-0"
                                        sx={{ borderLeft: "solid 1px gray" }}
                                    >
                                        {timeLimitType === 1
                                            ? "Minutes"
                                            : "Seconds"}
                                    </InputAdornment>
                                ),
                            }}
                            onKeyDown={(e) => {
                                if (invalidChars.includes(e.key))
                                    e.preventDefault();
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    paddingRight: 0,
                                },
                            }}
                            fullWidth
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
