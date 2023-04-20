import React from 'react';
import Logo from './Logo';

const Header = () => {
    return (
        <div className="bg-white py-12">
            <div className="mx-auto max-w-7xl px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center space-x-4"><Logo size="40" /> <span>Iconosquare frontend test</span></h1>
                    <div className="text-gray-600 text-lg leading-8">
                        <p className="my-6 ">
                            The following graph is a simulation of a live stream of events which refresh every 2s. 
                            The events are stored in a context. We want to be able to edit some events.
                        </p>
                        <h2 className="underline">Please add the following features:</h2>
                        <ul className="list-decimal list-inside mb-3">
                            <li>Clicking on a cell makes it editable and allows to edit its value.</li>
                            <li>The chart must show the correct value.</li>
                        </ul>
                        <h2 className="underline">Optional:</h2>
                        <ul className="list-decimal list-inside mb-3">
                            <li>Clicking on the chart may open the cell `value1` of the corresponding event</li>
                            <li>A button may be added to reset all the updated values</li>
                            <li>Add some components in the UI that allow to navigate in time.</li>
                            <li>Migrate the project in Typescript</li>
                        </ul>
                        <h2 className="underline">Additional information:</h2>
                        <ul className="list-disc list-inside">
                            <li>The `container` file must not be edited. Consider that this is the only constraint.</li>
                            <li>Use the ui/ux you consider working well for the use case.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;