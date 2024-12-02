import { CHART_NAVIGATION_STEP } from "../const";
import { ChartEvents, ChartEvent, LiveChartState } from "../types";

export default class LiveChartService {
    step = CHART_NAVIGATION_STEP;

    addNewEvent = (state: LiveChartState, payload: ChartEvent) => {
        const events = [...state.events, payload];
        const newEventRange = { start: state.eventRange.start + 1, end: state.eventRange.end + 1 };

        return {
            events,
            eventRange: newEventRange,
        };
    };

    updateEvent = (state: LiveChartState, payload: ChartEvent) => {
        const updatedEvents = state.events.map((event) =>
            event.index === payload.index ? { ...event, ...payload } : event
        );

        return { ...state, events: updatedEvents };
    };

    resetEventValues = (state: LiveChartState) => {
        const events = state.events.map((event) => {
            if (event.originalEvent) {
                return { ...event.originalEvent };
            }

            return event;
        });

        return { ...state, events };
    };

    updateEventRange = (state: LiveChartState) => {
        const totalEvents = state.events.length;

        const newEnd = Math.max(totalEvents, state.eventRange.end);
        const newStart = Math.max(0, newEnd - this.step);

        return { start: newStart, end: newEnd };
    };

    navigateBack = (state: LiveChartState) => {
        let newRange = state.eventRange;

        if (state.eventRange.start > 0) {
            const newStart = Math.max(0, state.eventRange.start - this.step);
            const newEnd = Math.max(this.step, state.eventRange.end - this.step);
            newRange = { start: newStart, end: newEnd };
        }

        return { ...state, eventRange: newRange };
    };

    navigateForward = (state: LiveChartState) => {
        const totalEvents = state.events.length;
        let newRange = state.eventRange;

        if (state.eventRange.end < totalEvents) {
            const newStart = Math.min(totalEvents - this.step, state.eventRange.start + this.step);
            const newEnd = Math.min(totalEvents, state.eventRange.end + this.step);
            newRange = { start: newStart, end: newEnd };
        }

        return { ...state, eventRange: newRange };
    };

    liveChartReducer = (state: LiveChartState, action: { type: ChartEvents; payload?: ChartEvent }) => {
        switch (action.type) {
            case ChartEvents.NEW_EVENT:
                if (action.payload) {
                    return this.addNewEvent(state, action.payload);
                } else {
                    throw new Error(`Missing payload for action type: ${action.type}`);
                }
            case ChartEvents.UPDATE_EVENT:
                if (action.payload) {
                    return this.updateEvent(state, action.payload);
                } else {
                    throw new Error(`Missing payload for action type: ${action.type}`);
                }
            case ChartEvents.RESET_EVENTS:
                return this.resetEventValues(state);
            case ChartEvents.NAVIGATE_BACK:
                return this.navigateBack(state);
            case ChartEvents.NAVIGATE_FORWARD:
                return this.navigateForward(state);
            default: {
                throw new Error(`Unhandled action type: ${action.type}`);
            }
        }
    };
}
