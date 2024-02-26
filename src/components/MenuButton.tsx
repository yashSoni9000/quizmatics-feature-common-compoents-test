import { FC, useState } from "react";
import { IconButton, Menu, MenuItem, SvgIconProps } from "@mui/material";

interface Props {
    Icon: FC<SvgIconProps>;
    list: {
        id: number;
        label: string;
        Icon?: React.FC<SvgIconProps>;
        handleOnClick: (id: number) => void;
    }[];
}

export default function MenuButton({ Icon, list }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                onClick={handleClick}
                className="pr-0 mr-0 w-fit min-w-fit"
                color="inherit"
                sx={{ color: "background.contrastText" }}
            >
                <Icon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                {list.map(({ id, Icon, label, handleOnClick }) => (
                    <MenuItem
                        key={label}
                        onClick={() => {
                            handleOnClick(id);
                            handleClose();
                        }}
                    >
                        {Icon && (
                            <Icon
                                sx={{
                                    marginRight: "0.5rem",
                                    transform: "scale(0.85)",
                                }}
                            />
                        )}
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
