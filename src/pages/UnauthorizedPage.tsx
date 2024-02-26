import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import unAuthorizedImg from "@images/accesss-denied.png";

export default function UnauthorizedPage() {
    const navigate = useNavigate();

    return (
        <Box className="w-screen h-screen flex">
            <Box className="flex flex-col m-auto">
                <Box className="w-full max-w-[48rem] mx-auto flex  flex-col justify-center text-gray-700 items-center mb-12">
                    <Box
                        className="w-full max-w-[16rem] mb-4 mx-auto"
                        component="img"
                        src={unAuthorizedImg}
                    />
                    <Typography className="text-[3.5rem] mx-auto font-semibold">
                        Access Denied
                    </Typography>
                    <Typography className="text-lg mx-auto text-gray-600">
                        You do not have access to this Page. Please contact
                        Administrator
                    </Typography>
                </Box>
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
