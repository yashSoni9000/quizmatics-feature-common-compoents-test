import { Box, Grid } from "@mui/material";
import SelectBox from "@src/components/common/InputFields/SelectBox";
import TextBox from "@src/components/common/InputFields/TextBox";
import { StepperPagesData } from ".";

export const visibilityValues = [
    { id: 1, label: "Public" },
    { id: 2, label: "Private" },
];

export const categoryList = [
    { id: 1, label: "Linux" },
    { id: 2, label: "DevOps" },
    { id: 3, label: "Programming" },
    { id: 4, label: "Windows" },
];

export const difficultyList = [
    { id: 1, label: "Easy" },
    { id: 2, label: "Medium" },
    { id: 3, label: "Hard" },
];

export default function Information({
    quizData,
    getHelperText,
    handleOnChange,
}: StepperPagesData) {
    const { name, visibility, category, difficulty, description } = quizData;

    return (
        <Box className="w-full h-full">
            <Grid container rowSpacing={1} columnSpacing={2} className="py-4">
                <Grid item xs={12} sm={6}>
                    <TextBox
                        label="Quiz Name"
                        name="name"
                        value={name}
                        placeholder="Quiz Name"
                        size="small"
                        onChange={handleOnChange}
                        helperText={getHelperText("name")}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SelectBox
                        label="Select Visibility"
                        name="visibility"
                        value={visibility}
                        list={visibilityValues}
                        helperText={getHelperText("visibility")}
                        size="small"
                        handleOnChange={handleOnChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SelectBox
                        label="Category"
                        required
                        name="category"
                        value={category || 0}
                        list={categoryList}
                        helperText={getHelperText("category")}
                        placeholder="Category"
                        size="small"
                        handleOnChange={handleOnChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SelectBox
                        value={difficulty || 0}
                        name="difficulty"
                        handleOnChange={handleOnChange}
                        helperText={getHelperText("difficulty")}
                        list={difficultyList}
                        label="Difficulty"
                        size="small"
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextBox
                        label="Description"
                        name="description"
                        value={description}
                        placeholder="Description"
                        size="small"
                        onChange={handleOnChange}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
