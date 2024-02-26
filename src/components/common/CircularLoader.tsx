import { Box, CircularProgress } from "@mui/material";

export default function CircularLoader() {
    return (
        <Box className="flex justify-center items-center ">
            <CircularProgress />
        </Box>
    );
}
