import React, { createContext, useCallback, useContext, useReducer, useRef, useState } from "react";

import { CHART_EVENTS } from "../../const";
import { createRandomEvent } from "../utils";
import LiveChartService from "../../services/LiveChartService";

const LiveChartContext = createContext({
    data: { events: [] },
    dispatch: () => {},
    paused: false,
    togglePaused: () => {},
});

const initialEvents = Array.from(Array(50)).map((_, ix) => createRandomEvent(ix));

const initialData = Object.freeze({
    events: initialEvents,
});

const LiveChartProvider = ({ children }) => {
    const liveChartService = useRef(new LiveChartService());

    const [data, dispatchEvent] = useReducer(liveChartService.current.liveChartReducer, initialData);

    const [paused, setPaused] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);

    const isPaused = useRef(paused);
    const wasPausedByInteraction = useRef(false);

    const togglePaused = useCallback((isInteraction = false) => {
        wasPausedByInteraction.current = isInteraction;

        setPaused((prev) => {
            isPaused.current = !prev;
            return !prev;
        });
    }, []);

    const handleDispatch = useCallback(
        (event) => {
            if (!isPaused.current) {
                dispatchEvent(event);
            }
        },
        [dispatchEvent]
    );

    const handleOpenEventEditor = useCallback(
        (event) => {
            if (!isPaused.current) {
                togglePaused();
            }

            setEventToEdit({ rowKey: "value1", ...event });
        },
        [togglePaused, setEventToEdit]
    );

    const handleEditEvent = useCallback(
        (payload) => {
            if (payload.index !== null && payload[eventToEdit?.rowKey] !== eventToEdit[eventToEdit?.rowKey]) {
                delete eventToEdit.rowKey;

                dispatchEvent({
                    type: CHART_EVENTS.UPDATE_EVENT,
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
        dispatchEvent({ type: CHART_EVENTS.RESET_EVENTS });
    }, [dispatchEvent]);

    return (
        <LiveChartContext.Provider
            value={{
                data,
                dispatch: handleDispatch,
                editEvent: handleEditEvent,
                eventToEdit,
                openEventEditor: handleOpenEventEditor,
                paused,
                resetData,
                togglePaused,
            }}
        >
            {children}
        </LiveChartContext.Provider>
    );
};

const useLiveChartContext = () => {
    const context = useContext(LiveChartContext);
    if (!context) {
        throw new Error("useLiveChartContext should be used within an LiveChartProvider");
    }

    return context;
};

export { LiveChartProvider, useLiveChartContext };
