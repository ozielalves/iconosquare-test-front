export type RowKey = "value1" | "value2";

export type ChartEvent = {
    index: number;
    comment: string;
    originalEvent?: ChartEvent;
    value1?: number;
    value2?: number;
    rowKey?: RowKey;
};

export type ChartEventRange = {
    start: number;
    end: number;
};

export type LiveChartState = {
    events: ChartEvent[];
    eventRange: ChartEventRange;
};
