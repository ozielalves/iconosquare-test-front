import React, { useEffect, useRef } from "react";

import { ChartEvents } from "../types";
import { LiveChartProvider, useLiveChartContext } from "../utils/hooks/useLiveChartContext";
import { createRandomEvent } from "../utils/utils";

import Content from "./Content";

const ContainerContent: React.FC = () => {
    const currentIndex = useRef<number>(50); // O valor inicial de currentIndex é 50
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
    }, [dispatch]); // Add dispatch as a dependency (though dispatch is stable in context)

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
