import React, { useEffect, useState } from "react";

import { useLiveChartContext } from "../utils/hooks/useLiveChartContext";

const LiveTable = () => {
    const { data, eventToEdit, editEvent, openEventEditor } = useLiveChartContext();

    const eventsFiltered = data.events.slice(data.eventRange.start, data.eventRange.end);

    const [eventValue, setEventValue] = useState(0);

    useEffect(() => {
        setEventValue(eventToEdit?.[eventToEdit?.rowKey] || 0);
    }, [eventToEdit]);

    const getCellClickHandler = (event, rowKey) => () => {
        openEventEditor({ ...event, rowKey });
    };

    const handleBlur = () => {
        const payload = { ...eventToEdit, [eventToEdit.rowKey]: eventValue };
        delete payload.rowKey;

        editEvent(payload);
    };

    const handleCellChange = (syntheticBaseEvent) => {
        const value = syntheticBaseEvent.target.value;

        if (/^\d*$/.test(value)) {
            setEventValue(+value || 0);
        }
    };

    const renderCell = (event, rowKey) => {
        return (
            <div
                className="relative p-2 border-t border-gray-300 max-w-[70px]"
                onClick={getCellClickHandler(event, rowKey)}
            >
                {eventToEdit?.index === event.index && eventToEdit?.rowKey === rowKey && (
                    <input
                        type="text"
                        name={rowKey}
                        value={eventValue}
                        onBlur={handleBlur}
                        onChange={handleCellChange}
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
