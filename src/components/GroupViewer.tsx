import { FC } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    SvgIconProps,
} from "@mui/material";

import MenuButton from "./MenuButton";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LaunchIcon from "@mui/icons-material/Launch";

interface Props {
    title: string;
    header: string;
    HeaderIcon: FC<SvgIconProps>;
    imageUrl: string;
    list: {
        id: number;
        label: string;
        handleOnClick: (id: number, index: number) => void;
    }[];
    menuOptions?: {
        id: number;
        label: string;
        Icon: FC<SvgIconProps>;
        handleOnClick: (id: number) => void;
    }[];
    subHeader?: string;
}

export default function GroupViewer({
    title,
    header,
    HeaderIcon,
    imageUrl,
    list,
    menuOptions,
    subHeader,
}: Props) {
    return (
        <Box
            className="flex flex-col w-full min-h-[16rem] h-full rounded-lg shadow-md"
            sx={{ backgroundColor: "background.default" }}
        >
            <Box
                className="flex justify-between w-full h-fit min-h-[7rem] rounded-t-lg p-3 md:p-4 bg-cover bg-no-repeat bg-right-top"
                sx={{
                    backgroundImage: `url(${imageUrl})`,
                }}
            >
                <Box className="flex flex-col justify-between w-full">
                    <Box className="flex justify-between w-full">
                        <Typography className="text-white uppercase font-bold sm:text-md text-lg">
                            {title}
                        </Typography>
                        {menuOptions && (
                            <MenuButton
                                Icon={MoreVertIcon}
                                list={menuOptions}
                            />
                        )}
                    </Box>
                    <Box className="flex flex-col justify-between gap-2 mt-4 md:mt-6">
                        <Typography
                            variant="body1"
                            color="white"
                            className="text-sm"
                        >
                            <HeaderIcon fontSize="small" />
                            {header}
                        </Typography>
                        {subHeader && (
                            <Box className="flex">
                                <PersonAddIcon className="text-white text-xl" />
                                <Typography className="capitalize text-sm text-white ml-2">
                                    {subHeader}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            <Box className="min-h-[10rem] flex flex-col p-3 md:p-4 rounded-lg">
                <List className="rounded-lg py-1">
                    {list.map(({ id, label, handleOnClick }, index) => (
                        <Box
                            key={label}
                            onClick={() => handleOnClick(id, index)}
                        >
                            <ListItem
                                disablePadding
                                className="border-b border-b-gray-300 last:border-b-0"
                                sx={{ backgroundColor: "background.paper" }}
                            >
                                <ListItemButton className="flex justify-between">
                                    <Typography>{label}</Typography>
                                    <LaunchIcon className="mr-2 text-sm" />
                                </ListItemButton>
                            </ListItem>
                        </Box>
                    ))}
                </List>
            </Box>
        </Box>
    );
}
