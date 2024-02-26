import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

import pageNotFoundImg from "@images/page-not-found.png";

export default function PageNotFound() {
    const navigate = useNavigate();

    return (
        <Box className="w-screen h-screen flex">
            <Box className="flex flex-col m-auto">
                <Box
                    className="w-full max-w-[48rem] mx-auto"
                    component="img"
                    src={pageNotFoundImg}
                />
                <Box className="flex flex-row gap-2 justify-center mx-auto">
                    <Button
                        variant="contained"
                        className="w-fit h-fit"
                        onClick={() => navigate("/dashboard")}
                    >
                        Go to Dashboard
                    </Button>
                    <Button
                        variant="contained"
                        className="w-fit h-fit"
                        onClick={() => history.back()}
                    >
                        Go Back
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
