import { CHART_EVENTS, CHART_NAVIGATION_STEP } from "../const";

export default class LiveChartService {
    step = CHART_NAVIGATION_STEP;

    addNewEvent = (state, payload) => {
        const events = [...state.events, payload];
        const newEventRange = { start: state.eventRange.start + 1, end: state.eventRange.end + 1 };

        return {
            events,
            eventRange: newEventRange,
        };
    };

    updateEvent = (state, payload) => {
        const updatedEvents = state.events.map((event) =>
            event.index === payload.index ? { ...event, ...payload } : event
        );

        return { ...state, events: updatedEvents };
    };

    resetEventValues = (state) => {
        const events = state.events.map((event) => {
            if (event.originalEvent) {
                return { ...event.originalEvent };
            }

            return event;
        });

        return { ...state, events };
    };

    updateEventRange = (state) => {
        const totalEvents = state.events.length;

        const newEnd = Math.max(totalEvents, state.eventRange.end);
        const newStart = Math.max(0, newEnd - this.step);

        return { start: newStart, end: newEnd };
    };

    navigateBack = (state) => {
        let newRange = state.eventRange;

        if (state.eventRange.start > 0) {
            const newStart = Math.max(0, state.eventRange.start - this.step);
            const newEnd = Math.max(this.step, state.eventRange.end - this.step);
            newRange = { start: newStart, end: newEnd };
        }

        return { ...state, eventRange: newRange };
    };

    navigateForward = (state) => {
        const totalEvents = state.events.length;
        let newRange = state.eventRange;

        if (state.eventRange.end < totalEvents) {
            const newStart = Math.min(totalEvents - this.step, state.eventRange.start + this.step);
            const newEnd = Math.min(totalEvents, state.eventRange.end + this.step);
            newRange = { start: newStart, end: newEnd };
        }

        return { ...state, eventRange: newRange };
    };

    liveChartReducer = (state, action) => {
        switch (action.type) {
            case CHART_EVENTS.NEW_EVENT:
                return this.addNewEvent(state, action.payload);
            case CHART_EVENTS.UPDATE_EVENT:
                return this.updateEvent(state, action.payload);
            case CHART_EVENTS.RESET_EVENTS:
                return this.resetEventValues(state);
            case CHART_EVENTS.NAVIGATE_BACK:
                return this.navigateBack(state);
            case CHART_EVENTS.NAVIGATE_FORWARD:
                return this.navigateForward(state);
            default: {
                throw new Error(`Unhandled action type: ${action.type}`);
            }
        }
    };
}
