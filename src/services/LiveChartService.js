import { CHART_EVENTS } from "../const";

export default class LiveChartService {
    addNewEvent = (state, payload) => ({
        events: [...state.events, payload],
    });

    updateEvent = (state, payload) => {
        const updatedEvents = state.events.map((event) =>
            event.index === payload.index ? { ...event, ...payload } : event
        );

        return { events: updatedEvents };
    };

    resetEventValues = (state) => {
        const events = state.events.map((event) => {
            if (event.originalEvent) {
                return { ...event.originalEvent };
            }

            return event;
        });

        return { events };
    };

    liveChartReducer = (state, action) => {
        switch (action.type) {
            case CHART_EVENTS.NEW_EVENT:
                return this.addNewEvent(state, action.payload);
            case CHART_EVENTS.UPDATE_EVENT:
                return this.updateEvent(state, action.payload);
            case CHART_EVENTS.RESET_EVENTS:
                return this.resetEventValues(state);
            default: {
                throw new Error(`Unhandled action type: ${action.type}`);
            }
        }
    };
}
