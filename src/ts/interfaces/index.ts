import { FC } from "react";
import { SvgIconProps } from "@mui/material/SvgIcon";

export interface SideBarRoute {
    label: string;
    url: string;
    Icon: FC<SvgIconProps>;
}
