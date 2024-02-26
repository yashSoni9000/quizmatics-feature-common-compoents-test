import { Skeleton } from "@mui/material";
import { SxProps } from "@mui/system";

export interface SkeletonsProp {
    count: number;
    className?: string;
    sx?: SxProps;
}

export default function Skeletons({ count, className, sx }: SkeletonsProp) {
    const obj = [];
    for (let i = 0; i < count; i++) {
        obj.push(<Skeleton key={i} className={className} sx={sx} />);
    }
    return obj;
}
