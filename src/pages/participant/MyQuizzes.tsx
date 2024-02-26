import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Typography, Button, Grid, SvgIconProps } from "@mui/material";

import CircularLoader from "@components/common/CircularLoader";
import Skeletons from "@components/common/Skeletons";
import useAlertHook from "@src/hooks/UseAlertHook";

import { Quiz } from "@interfaces/host";
import { AlertPopup } from "@components/AlertPopup";
import { QUIZZESS_API } from "@constants/endpoints/host";
import { axiosInstance } from "@src/utils/axiosInstance";
import { extractStrapiTableData } from "@src/utils";
import { ResponseType, StrapiMultiResponse } from "@src/ts/types";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ClockIcon from "@mui/icons-material/HourglassBottom";
import PointsIcon from "@mui/icons-material/EmojiEvents";
import TimerIcon from "@mui/icons-material/Timer";
import QuizIcon from "@mui/icons-material/Quiz";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

interface CardData {
    category: string;
    data: InfoProps[];
}

export default function MyQuizzes() {
    const alertModal = useAlertHook();

    const [activeQuizData, setActiveQuizData] = useState<CardData[]>();
    const [isActiveQuizLoading, setIsActiveQuizDataLoading] = useState(true);

    const [upcomingQuizData, setUpcomingQuizData] = useState<CardData[]>();
    const [isUpcomingQuizDataLoading, setIsUpcomingDataLoading] =
        useState(true);

    const [completedQuizData, setCompletedQuizData] = useState<CardData[]>();
    const [isCompletedQuizDataLoading, setIsCompletedQuizDataLoading] =
        useState(true);

    const filterStringLimitFive = "pagination[start]=0&pagination[limit]=5";

    useEffect(() => {
        axiosInstance()
            .get(
                `${QUIZZESS_API}?filters[status][$eq]=active&${filterStringLimitFive}`,
            )
            .then(({ data }: ResponseType<StrapiMultiResponse<Quiz>>) => {
                const quizData = extractStrapiTableData(data);

                const formattedActiveQuizData: CardData[] = quizData.map(
                    ({ category, questions, score, endDate, timeLimit }) => {
                        return {
                            category: category || "None",
                            data: [
                                {
                                    Icon: QuizIcon,
                                    value: questions?.length || 0,
                                    suffix: "Questions",
                                },
                                {
                                    Icon: PointsIcon,
                                    value: score,
                                    suffix: "Points",
                                },
                                {
                                    Icon: ClockIcon,
                                    value: timeLimit,
                                    suffix: "Minutes",
                                },
                                {
                                    Icon: TimerIcon,
                                    value: (endDate || new Date()).toString(),
                                    prefix: "Expires in",
                                },
                            ],
                        };
                    },
                );

                setActiveQuizData(formattedActiveQuizData);
            })
            .catch((error) => {
                alertModal.showMessage(error.message);
            })
            .finally(() => {
                setIsActiveQuizDataLoading(false);
            });

        axiosInstance()
            .get(
                `${QUIZZESS_API}?filters[status][$eq]=upcoming&${filterStringLimitFive}`,
            )
            .then(({ data }: ResponseType<StrapiMultiResponse<Quiz>>) => {
                const quizData = extractStrapiTableData(data);

                const formattedUpcomingQuizData: CardData[] = quizData.map(
                    ({ category, questions, score, timeLimit, startDate }) => {
                        return {
                            category: category || "None",
                            data: [
                                {
                                    Icon: QuizIcon,
                                    value: questions?.length || 0,
                                    suffix: "Questions",
                                },
                                {
                                    Icon: PointsIcon,
                                    value: score,
                                    suffix: "Points",
                                },
                                {
                                    Icon: ClockIcon,
                                    value: timeLimit,
                                    suffix: "Minutes",
                                },
                                {
                                    Icon: CalendarMonthIcon,
                                    value: (startDate || new Date()).toString(),
                                    prefix: "Starts in",
                                },
                            ],
                        };
                    },
                );
                setUpcomingQuizData(formattedUpcomingQuizData);
            })
            .catch((error) => {
                alertModal.showMessage(error.message);
            })
            .finally(() => {
                setIsUpcomingDataLoading(false);
            });

        axiosInstance()
            .get(
                `${QUIZZESS_API}?filters[status][$eq]=completed&${filterStringLimitFive}`,
            )
            .then(({ data }: ResponseType<StrapiMultiResponse<Quiz>>) => {
                const quizData = extractStrapiTableData(data);

                const formattedCompletedQuizData: CardData[] = quizData.map(
                    ({ category, score, points, rank, endDate }) => {
                        return {
                            category: category || "None",
                            data: [
                                {
                                    Icon: PointsIcon,
                                    value: `${points}/${score}`,
                                    suffix: "Points",
                                },
                                {
                                    Icon: LeaderboardIcon,
                                    value: rank || "-",
                                    suffix: "Rank",
                                },
                                {
                                    Icon: CalendarMonthIcon,
                                    prefix: "Completed",
                                    value: (endDate || new Date()).toString(),
                                    suffix: "ago",
                                    full: true,
                                },
                            ],
                        };
                    },
                );
                setCompletedQuizData(formattedCompletedQuizData);
            })
            .catch((error) => {
                alertModal.showMessage(error.message);
            })
            .finally(() => {
                setIsCompletedQuizDataLoading(false);
            });
    }, []);

    if (
        isActiveQuizLoading ||
        isUpcomingQuizDataLoading ||
        isCompletedQuizDataLoading
    ) {
        return <CircularLoader />;
    }

    return (
        <>
            <Box className="flex flex-col gap-2 md:gap-3">
                <QuizRow
                    isLoading={isActiveQuizLoading}
                    title="Active Quizzes"
                    data={activeQuizData || []}
                    button={{
                        label: "Join",
                        onClick: () => {
                            alertModal.showMessage("Coming soon", "info");
                        },
                    }}
                    status="active"
                />
                <QuizRow
                    isLoading={isUpcomingQuizDataLoading}
                    title="Upcoming Quizzes"
                    data={upcomingQuizData || []}
                    button={{
                        label: "Set Reminder",
                        onClick: () => {
                            alertModal.showMessage("Reminder set", "success");
                        },
                    }}
                    status="upcoming"
                />
                <QuizRow
                    title="Completed Quizzes"
                    data={completedQuizData || []}
                    isLoading={isCompletedQuizDataLoading}
                    status="completed"
                />
            </Box>
            {alertModal.isOpen && (
                <AlertPopup
                    severity={alertModal.severity}
                    message={alertModal.message}
                />
            )}
        </>
    );
}

interface QuizRowProps {
    title: string;
    data: CardData[];
    isLoading: boolean;
    button?: {
        label: string;
        onClick?: () => void;
    };
    status: string;
}

function QuizRow({ title, isLoading, data, button, status }: QuizRowProps) {
    const navigate = useNavigate();
    return (
        <Box
            className="rounded-lg gap-1 md:gap-2 flex flex-col py-2"
            sx={{ backgroundColor: "background.default" }}
        >
            <Box className="flex justify-between px-3 md:px-4">
                <Typography className="text-base sm:text-lg md:text-xl font-semibold">
                    {title}
                </Typography>
                <Button
                    variant="contained"
                    className="rounded-lg flex items-center py-1 px-2"
                    size="small"
                    onClick={() =>
                        navigate(`/dashboard/quizzes/all?tabIndex=${status}`)
                    }
                >
                    <Typography className="align-middle text-xs p-0 font-semibold capitalize text-white">
                        View All
                    </Typography>
                    <ArrowForwardIosIcon className="scale-[60%] align-middle" />
                </Button>
            </Box>
            <Box
                className="overflow-x-scroll p-1 md:p-2 mx-2 md:mx-3 rounded-xl "
                sx={{
                    backgroundColor: "background.backgroundLght",
                }}
            >
                {!isLoading ? (
                    <Box className="flex overflow-x-scroll gap-1 md:gap-2">
                        {data.map((item, index) => (
                            <QuizCard
                                key={index}
                                category={item.category}
                                button={button}
                                data={item.data}
                                status={status}
                            />
                        ))}
                    </Box>
                ) : (
                    <Box className="flex flex-row gap-2">
                        <Skeletons
                            count={2}
                            className={`flex flex-col rounded-lg shadow-md min-w-[18rem]  max-w-[18rem] p-3 md:p-4 h-36 scale-100`}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}

interface QuizCardProps {
    category: string;
    button?: {
        label: string;
        onClick?: () => void;
    };
    data: InfoProps[];
    status: string;
}

const colors: { [key: string]: string } = {
    active: "bg-blue-600",
    upcoming: "bg-amber-500",
    completed: "bg-slate-400",
};

function QuizCard({ category, button, data, status }: QuizCardProps) {
    return (
        <Box
            className={`flex flex-col rounded-lg shadow-md min-w-[18rem]  max-w-[18rem] p-3 md:p-4  text-white gap-2 ${colors[status]}`}
            sx={{ backgroundColor: "background.default" }}
        >
            <Box className="flex justify-between items-center mb-2">
                <Typography className="text-lg font-bold" noWrap>
                    {category}
                </Typography>
                {button && (
                    <Button
                        variant="contained"
                        size="small"
                        className="bg-white text-blue-500 py-1 px-2 rounded-lg capitalize h-fit "
                        onClick={button.onClick}
                    >
                        {button.label}
                    </Button>
                )}
            </Box>

            <Grid container rowSpacing={1} margin={0} width={"16rem"}>
                {data.map((info, index) => (
                    <Grid
                        key={index}
                        item
                        xs={info.full ? 12 : 6}
                        sx={{
                            paddingX: 0,
                        }}
                    >
                        <InfoElement
                            Icon={info.Icon}
                            value={info.value}
                            prefix={info.prefix}
                            suffix={info.suffix}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

interface InfoProps {
    Icon: FC<SvgIconProps>;
    value: string | number;
    prefix?: string;
    suffix?: string;
    full?: boolean;
}

function InfoElement({ Icon, value, prefix, suffix }: InfoProps) {
    return (
        <Box className="w-fit flex">
            <Icon
                fontSize="small"
                className="inline-block align-middle my-[0.15rem]"
            />

            {prefix && (
                <Typography className="self-baseline inline-block pl-[0.125rem] text-xs">
                    {prefix}
                </Typography>
            )}

            <Typography className="text-base font-bold self-baseline inline-block pl-1 ">
                {value}
            </Typography>

            {suffix && (
                <Typography className="self-baseline inline-block pl-[0.125rem]  text-xs">
                    {suffix}
                </Typography>
            )}
        </Box>
    );
}
