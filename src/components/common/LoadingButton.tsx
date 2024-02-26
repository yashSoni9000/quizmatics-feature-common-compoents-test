import { Button, Typography } from "@mui/material";
import { Refresh } from "@mui/icons-material";

interface Props {
    isLoading: boolean;
    text: string;
    handleOnClick: () => void;
}

export default function LoadingButton({
    isLoading,
    text,
    handleOnClick,
}: Props) {
    return (
        <Button
            variant="contained"
            className="w-fit h-fit mx-auto rounded-lg mt-2"
            onClick={handleOnClick}
            disabled={isLoading}
        >
            <Refresh className={`${isLoading && "animate-spin"}`} />
            <Typography className="text-sm">{text}</Typography>
        </Button>
    );
}
