import { useState } from "react";

import { Box, Alert, Stack, Collapse, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export function AlertPopup({
    message,
    severity = "error",
    isOpen = true,
}: {
    message: string;
    severity?: "error" | "success" | "warning" | "info";
    isOpen?: boolean;
}) {
    const [open, setOpen] = useState(isOpen);

    return (
        <Box className="absolute top-5 right-5 animate-slideLeft z-[10000]">
            <Stack spacing={2}>
                <Collapse in={open}>
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <Close fontSize="inherit" />
                            </IconButton>
                        }
                        variant="filled"
                        severity={severity}
                    >
                        {message}
                    </Alert>
                </Collapse>
            </Stack>
        </Box>
    );
}
