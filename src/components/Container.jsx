import React, { useEffect, useRef } from 'react';
import { LiveChartProvider, useLiveChartContext } from '../utils/hooks/useLiveChartContext';
import { createRandomEvent } from '../utils/utils';
import LiveTable from './LiveTable';
import LiveChart from './LiveChart';


const Content = () => {
    const currentIndex = useRef(50);
    const { dispatch } = useLiveChartContext()

    useEffect(() => {
		const intervalId = setInterval(() => {
			dispatch({
				type: 'new_event',
				payload: createRandomEvent(++currentIndex.current),
			})
		}, 2000)
		return () => clearInterval(intervalId)
	    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

    return (
        <div className="mx-auto max-w-7xl px-8">
            <LiveChart />
            <LiveTable />
        </div>
    )
}

const Container = () => {
    return (
        <LiveChartProvider>
            <Content />
        </LiveChartProvider>
    );
};

export default Container;