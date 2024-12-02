import React, { useEffect, useRef } from "react";

import { ChartEvents } from "../types";
import { LiveChartProvider, useLiveChartContext } from "../utils/hooks/useLiveChartContext";
import { createRandomEvent } from "../utils/utils";

import Content from "./Content";

const ContainerContent: React.FC = () => {
    const currentIndex = useRef<number>(50);
    const { dispatch } = useLiveChartContext();

    useEffect(() => {
        const intervalId = setInterval(() => {
            dispatch({
                type: ChartEvents.NEW_EVENT,
                payload: createRandomEvent(++currentIndex.current),
            });
        }, 2000);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Content />;
};

const Container: React.FC = () => {
    return (
        <LiveChartProvider>
            <ContainerContent />
        </LiveChartProvider>
    );
};

export default Container;
