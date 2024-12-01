import React, { useState } from "react";

import { useLiveChartContext } from "../utils/hooks/useLiveChartContext";
import { CHART_EVENTS } from "../const";

const LiveTable = () => {
    const { data, paused, dispatch, togglePaused } = useLiveChartContext();
    const nbTotalEvents = data?.events?.length;
    const eventsFiltered = data.events.slice(nbTotalEvents - 20, nbTotalEvents);

    const [editingEvent, setEditingEvent] = useState(null);

    const getCellClickHandler = (event, rowKey) => () => {
        setEditingEvent({ rowKey, ...event });

        if (!paused) {
            togglePaused();
        }
    };

    const handleBlur = () => {
        if (paused) {
            togglePaused();
        }

        if (editingEvent.index !== null) {
            const payload = { ...editingEvent };
            delete payload.rowKey;

            dispatch({
                type: CHART_EVENTS.UPDATE_EVENT,
                payload,
            });
        }

        setEditingEvent(null);
    };

    const getCellChangeHandler = (field) => (syntheticBaseEvent) => {
        const value = syntheticBaseEvent.target.value;

        if (/^\d*$/.test(value)) {
            setEditingEvent((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const renderCell = (event, rowKey) => {
        return (
            <div
                className="relative p-2 border-t border-gray-300 max-w-[70px]"
                onClick={getCellClickHandler(event, rowKey)}
            >
                {editingEvent?.index === event.index && editingEvent?.rowKey === rowKey && (
                    <input
                        type="text"
                        name={rowKey}
                        value={editingEvent[rowKey]}
                        onBlur={handleBlur}
                        onChange={getCellChangeHandler(rowKey)}
                        className="absolute max-w-[70px] p-2 top-0 z-10 right-1/2 translate-x-1/2 transform focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent text-center bg-white shadow-lg "
                        autoFocus
                    />
                )}

                <div className="max-w-[70px] overflow-hidden text-ellipsis whitespace-nowrap">{event[rowKey]}</div>
            </div>
        );
    };

    return (
        <div className="flex border border-gray-300 rounded">
            <div>
                <div className="p-2">Index</div>
                <div className="p-2 border-t border-gray-300">Value 1</div>
                <div className="p-2 border-t border-gray-300">Value 2</div>
            </div>
            {eventsFiltered.map((event) => (
                <div key={event.index} className="border-l border-gray-300 flex-1">
                    <div className="p-2">{event.index}</div>
                    {renderCell(event, "value1")}
                    {renderCell(event, "value2")}
                </div>
            ))}
        </div>
    );
};

export default LiveTable;
