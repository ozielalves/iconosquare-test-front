import LiveChartService from "./LiveChartService";
import { CHART_NAVIGATION_STEP, ChartEvents } from "../const";

describe("LiveChartService", () => {
    let liveChartService: LiveChartService;

    beforeAll(() => {
        liveChartService = new LiveChartService();
    });

    describe("addNewEvent", () => {
        it("should add a new event to the state", () => {
            const initialState = { events: [], eventRange: { start: 0, end: 20 } };
            const payload = { index: 1, comment: "New Event" };

            const result = liveChartService.addNewEvent(initialState, payload);

            expect(result.events).toHaveLength(1);
            expect(result.events[0]).toEqual(payload);
        });
    });

    describe("updateEvent", () => {
        it("should update the event if the index matches", () => {
            const initialState = {
                events: [
                    { index: 1, comment: "Event 1" },
                    { index: 2, comment: "Event 2" },
                ],
                eventRange: { start: 0, end: 20 },
            };
            const payload = { index: 1, comment: "Updated Event 1" };

            const result = liveChartService.updateEvent(initialState, payload);

            expect(result.events[0].comment).toBe("Updated Event 1");
            expect(result.events[1].comment).toBe("Event 2");
        });

        it("should not update events if the index does not match", () => {
            const initialState = {
                events: [
                    { index: 1, comment: "Event 1" },
                    { index: 2, comment: "Event 2" },
                ],
                eventRange: { start: 0, end: 20 },
            };
            const payload = { index: 3, comment: "Updated Event 3" };

            const result = liveChartService.updateEvent(initialState, payload);

            expect(result.events).toEqual(initialState.events);
        });
    });

    describe("resetEventValues", () => {
        it("should reset event values to originalEvent if available", () => {
            const initialState = {
                events: [
                    { index: 1, comment: "Event 1", originalEvent: { index: 1, comment: "Original Event 1" } },
                    { index: 2, comment: "Event 2" },
                ],
                eventRange: { start: 0, end: 20 },
            };

            const result = liveChartService.resetEventValues(initialState);

            expect(result.events[0].comment).toBe("Original Event 1");
            expect(result.events[0].originalEvent).toBe(undefined);
            expect(result.events[1].comment).toBe("Event 2");
        });

        it("should not reset event values if originalEvent is not available", () => {
            const initialState = {
                events: [
                    { index: 1, comment: "Event 1" },
                    { index: 2, comment: "Event 2" },
                ],
                eventRange: { start: 0, end: 20 },
            };

            const result = liveChartService.resetEventValues(initialState);

            expect(result.events[0].comment).toBe("Event 1");
            expect(result.events[1].comment).toBe("Event 2");
        });
    });

    describe("updateEventRange", () => {
        it("should update the event range based on total events", () => {
            const initialState = {
                events: Array.from({ length: 10 }, (_, index) => ({ index, comment: `Event ${index}` })),
                eventRange: { start: 0, end: 5 },
            };

            const result = liveChartService.updateEventRange(initialState);

            expect(result.start).toBe(0);
            expect(result.end).toBe(10);
        });
    });

    describe("navigateBack", () => {
        it("should decrease the event range by step", () => {
            const initialState = { events: [], eventRange: { start: 20, end: 40 } };

            const result = liveChartService.navigateBack(initialState);

            expect(result.eventRange.start).toBe(20 - CHART_NAVIGATION_STEP);
            expect(result.eventRange.end).toBe(40 - CHART_NAVIGATION_STEP);
        });

        it("should not go below 0", () => {
            const initialState = { events: [], eventRange: { start: 0, end: 20 } };

            const result = liveChartService.navigateBack(initialState);

            expect(result.eventRange.start).toBe(0);
            expect(result.eventRange.end).toBe(20);
        });
    });

    describe("navigateForward", () => {
        it("should increase the event range by step", () => {
            const initialState = {
                events: Array.from({ length: 50 }, (_, index) => ({ index, comment: `Event ${index}` })),
                eventRange: { start: 20, end: 40 },
            };

            const result = liveChartService.navigateForward(initialState);

            expect(result.eventRange.start).toBe(30);
            expect(result.eventRange.end).toBe(50);
        });

        it("should not exceed the total number of events", () => {
            const initialState = {
                events: Array.from({ length: 30 }, (_, index) => ({ index, comment: `Event ${index}` })),
                eventRange: { start: 20, end: 30 },
            };

            const result = liveChartService.navigateForward(initialState);

            expect(result.eventRange.start).toBe(20);
            expect(result.eventRange.end).toBe(30);
        });
    });

    describe("liveChartReducer", () => {
        it("should handle NEW_EVENT action", () => {
            const initialState = { events: [], eventRange: { start: 0, end: 20 } };
            const action = { type: ChartEvents.NEW_EVENT, payload: { index: 1, comment: "New Event" } };

            const result = liveChartService.liveChartReducer(initialState, action);

            expect(result.events).toHaveLength(1);
            expect(result.events[0]).toEqual(action.payload);
        });

        it("should throw an error for unhandled action types", () => {
            const initialState = { events: [], eventRange: { start: 0, end: 20 } };
            const action = { type: "UNKNOWN_ACTION" as ChartEvents };

            expect(() => liveChartService.liveChartReducer(initialState, action)).toThrow(
                `Unhandled action type: ${action.type}`
            );
        });
    });
});
