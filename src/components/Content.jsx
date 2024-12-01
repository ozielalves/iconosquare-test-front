import React, { useMemo } from "react";

import { ArrowUturnDownIcon, ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";

import { useLiveChartContext } from "../utils/hooks/useLiveChartContext";
import Button from "./Button";
import LiveChart from "./LiveChart";
import LiveTable from "./LiveTable";

const Content = () => {
    const { data, paused, resetData, togglePaused, navigateBack, navigateForward } = useLiveChartContext();

    const showResetButton = useMemo(() => data?.events?.some(({ originalEvent }) => originalEvent), [data]);

    const handleResetData = () => {
        resetData();
    };

    const handlePlayPause = () => {
        togglePaused({ isInteraction: true });
    };

    return (
        <div className="mx-auto max-w-7xl px-8 pb-8">
            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    {showResetButton && (
                        <Button
                            className="bg-red-500"
                            icon={<ArrowUturnDownIcon className="w-5 h-5" />}
                            onClick={handleResetData}
                            text="Reset All Changes"
                        />
                    )}
                </div>

                <div className="flex gap-4">
                    <Button
                        className="bg-blue-500"
                        icon={<ChevronLeftIcon className="w-5 h-5" />}
                        onClick={navigateBack}
                        text="Previous"
                        disabled={data.eventRange.start === 0}
                    />

                    <Button
                        className="w-28 bg-blue-500"
                        icon={paused ? <PlayIcon className="w-5 h-5" /> : <PauseIcon className="w-5 h-5" />}
                        onClick={handlePlayPause}
                        text={paused ? "Play" : "Pause"}
                    />

                    <Button
                        className="bg-blue-500"
                        icon={<ChevronRightIcon className="w-5 h-5" />}
                        onClick={navigateForward}
                        text="Next"
                        disabled={data.eventRange.end >= data.events.length}
                    />
                </div>
            </div>

            <LiveChart />

            <LiveTable />
        </div>
    );
};

export default Content;
