import { ChangeEvent, useEffect, useState } from "react";

import { ChartEvent, RowKey } from "../types";
import { useLiveChartContext } from "../utils/hooks/useLiveChartContext";

const LiveTable = () => {
    const { data, eventToEdit, editEvent, openEventEditor } = useLiveChartContext();

    const eventsFiltered = data.events.slice(data.eventRange.start, data.eventRange.end);

    const [eventValue, setEventValue] = useState(0);

    useEffect(() => {
        if (eventToEdit?.rowKey) {
            setEventValue(eventToEdit[eventToEdit.rowKey as keyof ChartEvent] as number);
        } else {
            setEventValue(0);
        }
    }, [eventToEdit]);

    const getCellClickHandler = (event: ChartEvent, rowKey: RowKey) => () => {
        openEventEditor({ ...event, rowKey });
    };

    const handleBlur = () => {
        if (eventToEdit?.rowKey) {
            const payload = { ...eventToEdit, [eventToEdit.rowKey]: eventValue };
            delete payload.rowKey;

            editEvent(payload);
        }
    };

    const handleCellChange = (syntheticBaseEvent: ChangeEvent<HTMLInputElement>) => {
        const value = syntheticBaseEvent.target.value;

        if (/^\d*$/.test(value)) {
            setEventValue(+value || 0);
        }
    };

    const renderCell = (event: ChartEvent, rowKey: RowKey) => {
        return (
            <button
                className="all-[unset] relative p-2 border-t border-gray-300 max-w-[70px]"
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

                <div className="max-w-[70px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {event[rowKey as keyof ChartEvent] as number}
                </div>
            </button>
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
