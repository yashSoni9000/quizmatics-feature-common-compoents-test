import { Skeleton } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import UseGenericStateHooks from "@src/hooks/UseGenericStateHook";
import GraphWrapper from "./GraphWrapper";

export interface BarGraphData {
    header: string[] | number[];
    data: number[];
}

type BarGraphProps = ReturnType<typeof UseGenericStateHooks<BarGraphData>> & {
    title?: string;
    updateData: () => void;
    className?: string;
};

export default function BarGraph({ data, ...props }: BarGraphProps) {
    return (
        <GraphWrapper {...props} LoadingSkeleton={LoadingSkeleton}>
            <BarChart
                className="flex mt-4"
                xAxis={[
                    {
                        scaleType: "band",
                        data: data.header,
                    },
                ]}
                series={[
                    {
                        data: data.data,
                    },
                ]}
            />
        </GraphWrapper>
    );
}

function LoadingSkeleton() {
    return <Skeleton className="w-full h-full m-auto scale-[90%]" />;
}
