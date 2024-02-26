import { Skeleton } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import UseGenericStateHooks from "@src/hooks/UseGenericStateHook";
import GraphWrapper from "./GraphWrapper";

export interface LineGraphData {
    header: string[] | number[];
    data: number[];
}

type LineGraphProps = ReturnType<typeof UseGenericStateHooks<LineGraphData>> & {
    title?: string;
    updateData: () => void;
    className?: string;
};

export default function LineGraph({ data, ...props }: LineGraphProps) {
    return (
        <GraphWrapper {...props} LoadingSkeleton={LoadingSkeleton}>
            <LineChart
                className="flex mt-4"
                xAxis={[
                    {
                        scaleType: "point",
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
