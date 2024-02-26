import { Box, Skeleton } from "@mui/material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

import UseGenericStateHooks from "@src/hooks/UseGenericStateHook";
import Skeletons from "../common/Skeletons";
import GraphWrapper from "./GraphWrapper";

export interface PieGraphSeriesData {
    label: string;
    value: number;
}

type PieGraphProps = ReturnType<
    typeof UseGenericStateHooks<PieGraphSeriesData[]>
> & {
    title?: string;
    updateData: () => void;
    className?: string;
};

export default function PieGraph({ data, ...props }: PieGraphProps) {
    return (
        <GraphWrapper {...props} LoadingSkeleton={LoadingSkeleton}>
            <PieChart
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fill: "white",
                        fontWeight: "bold",
                    },
                }}
                margin={{
                    bottom: 60,
                    left: 10,
                    right: 10,
                    top: 10,
                }}
                series={[
                    {
                        arcLabel: (item) => `${item.value}`,
                        data: data,
                    },
                ]}
                slotProps={{
                    legend: {
                        direction: "row",
                        position: {
                            vertical: "bottom",
                            horizontal: "middle",
                        },
                        labelStyle: {
                            fontSize: 12,
                        },
                    },
                }}
            />
        </GraphWrapper>
    );
}

function LoadingSkeleton() {
    return (
        <>
            <Skeleton className="w-32 mt-2 scale-100" />
            <Skeleton
                className="aspect-square h-full m-auto scale-[90%] rounded-full"
                variant="circular"
            />
            <Box className="flex justify-center gap-4">
                <Skeletons count={2} className="w-32 h-6 scale-100" />
            </Box>
        </>
    );
}
