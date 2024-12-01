import LiveChartService from "./LiveChartService";

describe("LiveChartService", () => {
    let liveChartService;

    beforeAll(() => {
        liveChartService = new LiveChartService();
    });

    describe("addNewEvent", () => {
        it("should add a new event to the state", () => {
            const initialState = { events: [] };
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
            };

            const result = liveChartService.resetEventValues(initialState);

            expect(result.events[0].comment).toBe("Event 1");
            expect(result.events[1].comment).toBe("Event 2");
        });
    });
});
