import { Close } from "@mui/icons-material";
import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Slide,
    Typography,
} from "@mui/material";

import { TransitionProps } from "@mui/material/transitions";
import { EventFor } from "@src/ts/types";
import { PropsWithChildren, ReactElement, forwardRef } from "react";

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export interface DialogModalProps {
    open: boolean;
    header: string;
    handleClose: (e: EventFor<"button", "onClick">) => void;
    buttons: ({
        label: string;
        onClick: (e: EventFor<"button", "onClick">) => void;
    } & ButtonProps)[];
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    backDropClick?: boolean;
    className?: string;
}

export default function DialogModal({
    open,
    header,
    buttons,
    handleClose,
    backDropClick = true,
    size = "sm",
    className,
    children,
}: PropsWithChildren<DialogModalProps>) {
    function onClose(
        e: EventFor<"button", "onClick">,
        reason: "backdropClick" | "escapeKeyDown",
    ) {
        if (!backDropClick || reason !== "backdropClick") handleClose(e);
    }

    return (
        <>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                onClose={onClose}
                maxWidth={size}
                fullWidth
                keepMounted={false}
            >
                <DialogTitle className="flex justify-between items-center">
                    <Typography className="text-xl">{header}</Typography>

                    <IconButton
                        className="w-fit h-fit p-1 m-0 min-w-0"
                        onClick={handleClose}
                    >
                        <Close
                            className="mr-0"
                            sx={{ color: "background.contrastText" }}
                        />
                    </IconButton>
                </DialogTitle>

                <DialogContent className={className}>{children}</DialogContent>

                <DialogActions className="mr-4 mb-2">
                    {buttons.map(({ label, ...rest }) => (
                        <Button
                            key={label}
                            className="capitalize px-3 py-1"
                            {...rest}
                        >
                            {label}
                        </Button>
                    ))}
                </DialogActions>
            </Dialog>
        </>
    );
}
