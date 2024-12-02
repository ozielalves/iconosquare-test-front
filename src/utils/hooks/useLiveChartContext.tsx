import React, { createContext, ReactNode, useCallback, useContext, useReducer, useRef, useState } from "react";

import { CHART_NAVIGATION_STEP } from "../../const";
import LiveChartService from "../../services/LiveChartService";
import { ChartEvent, ChartEvents, LiveChartState } from "../../types";
import { createRandomEvent } from "../utils";

const initialEvents: ChartEvent[] = Array.from(Array(50)).map((_, ix) => createRandomEvent(ix));

const initialData: LiveChartState = {
    events: initialEvents,
    eventRange: { start: 0, end: CHART_NAVIGATION_STEP },
};

interface LiveChartContextType {
    data: LiveChartState;
    paused: boolean;
    eventToEdit: ChartEvent | null;
    dispatch: React.Dispatch<{ type: ChartEvents; payload: ChartEvent }>;
    togglePaused: (options?: { isInteraction?: boolean }) => void;
    editEvent: (payload: any) => void;
    openEventEditor: (event: ChartEvent) => void;
    resetData: () => void;
    navigateBack: () => void;
    navigateForward: () => void;
}

const LiveChartContext = createContext<LiveChartContextType | null>(null);

interface LiveChartProviderProps {
    children: ReactNode;
}

const LiveChartProvider: React.FC<LiveChartProviderProps> = ({ children }) => {
    const liveChartService = useRef(new LiveChartService());

    const [data, dispatchEvent] = useReducer(liveChartService.current.liveChartReducer, initialData);

    const [paused, setPaused] = useState<boolean>(false);
    const [eventToEdit, setEventToEdit] = useState<ChartEvent | null>(null);

    const isPaused = useRef<boolean>(paused);
    const wasPausedByInteraction = useRef<boolean>(false);

    const togglePaused = useCallback(({ isInteraction = false }: { isInteraction?: boolean } = {}) => {
        wasPausedByInteraction.current = isInteraction;

        setPaused((prev) => {
            isPaused.current = !prev;
            return !prev;
        });
    }, []);

    const handleDispatch = useCallback(
        (event: any) => {
            if (!isPaused.current) {
                dispatchEvent(event);
            }
        },
        [dispatchEvent]
    );

    const handleOpenEventEditor = useCallback(
        (event: ChartEvent) => {
            if (!isPaused.current) {
                togglePaused();
            }

            setEventToEdit({ rowKey: "value1", ...event });
        },
        [togglePaused, setEventToEdit]
    );

    const handleEditEvent = useCallback(
        (payload: any) => {
            if (
                payload.index !== null &&
                eventToEdit?.rowKey &&
                payload[eventToEdit.rowKey] !== eventToEdit[eventToEdit.rowKey]
            ) {
                delete eventToEdit.rowKey;

                dispatchEvent({
                    type: ChartEvents.UPDATE_EVENT,
                    payload: { originalEvent: { ...eventToEdit }, ...payload },
                });
            }

            if (isPaused.current && !wasPausedByInteraction.current) {
                togglePaused();
            }

            setEventToEdit(null);
        },
        [eventToEdit, togglePaused]
    );

    const resetData = useCallback(() => {
        dispatchEvent({ type: ChartEvents.RESET_EVENTS });
    }, [dispatchEvent]);

    const navigateBack = useCallback(() => {
        dispatchEvent({ type: ChartEvents.NAVIGATE_BACK });
    }, [dispatchEvent]);

    const navigateForward = useCallback(() => {
        dispatchEvent({ type: ChartEvents.NAVIGATE_FORWARD });
    }, [dispatchEvent]);


    return (
        <LiveChartContext.Provider
            value={{
                data,
                paused,
                eventToEdit,
                dispatch: handleDispatch,
                togglePaused,
                editEvent: handleEditEvent,
                openEventEditor: handleOpenEventEditor,
                resetData,
                navigateBack,
                navigateForward,
            }}
        >
            {children}
        </LiveChartContext.Provider>
    );
};

const useLiveChartContext = (): LiveChartContextType => {
    const context = useContext(LiveChartContext);

    if (!context) {
        throw new Error("useLiveChartContext should be used within an LiveChartProvider");
    }

    return context;
};

export { LiveChartProvider, useLiveChartContext };
