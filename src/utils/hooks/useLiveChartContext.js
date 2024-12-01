import React, { createContext, useCallback, useContext, useReducer, useRef, useState } from "react";
import { CHART_EVENTS } from "../../const";
import { createRandomEvent } from "../utils";

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

const addNewEvent = (state, payload) => ({
    events: [...state.events, payload],
});

const updateEvent = (state, payload) => {
    const updatedEvents = state.events.map((event) =>
        event.index === payload.index ? { ...event, ...payload } : event
    );
    console.log({ updatedEvents });
    return { events: updatedEvents };
};

const liveChartReducer = (state, action) => {
    switch (action.type) {
        case CHART_EVENTS.NEW_EVENT:
            return addNewEvent(state, action.payload);
        case CHART_EVENTS.UPDATE_EVENT:
            return updateEvent(state, action.payload);
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};

const LiveChartProvider = ({ children }) => {
    const [data, dispatchEvent] = useReducer(liveChartReducer, initialData);
    const [paused, setPaused] = useState(false);

    // Track the latest paused state
    const isPaused = useRef(paused);

    const togglePaused = useCallback(() => {
        setPaused((prev) => {
            isPaused.current = !prev;
            return !prev;
        });
    }, []);

    const sendEvent = useCallback(
        (event) => {
            if (!isPaused.current) {
                dispatchEvent(event);
            }
        },
        [dispatchEvent]
    );

    return (
        <LiveChartContext.Provider
            value={{
                data,
                dispatch: sendEvent,
                paused,
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
