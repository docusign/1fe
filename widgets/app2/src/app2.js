import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { Button } from 'antd';
export default function Root(props) {
    useEffect(() => {
        props.platform.utils.appLoadTime.end();
    }, []);
    const [eventBusResult, setEventBusResult] = useState('unchanged');
    const [unsubscribeFn, setUnsubscribeFn] = useState(() => () => { });
    const listener = useCallback((event) => {
        setEventBusResult(JSON.stringify(event));
    }, [setEventBusResult]);
    return (_jsxs(_Fragment, { children: [_jsx("p", { children: "My component from app2 is mounted!" }), _jsx(Button, { "data-qa": "eventBus.subscribe.btn", onClick: () => {
                    // @ts-ignore
                    const unsubFn = props.platform.utils.eventBus.subscribe({
                        eventName: 'event1',
                        listener,
                    });
                    setEventBusResult('subscribed');
                    setUnsubscribeFn(() => unsubFn);
                }, children: "utils.eventBus.subscribe" }), _jsx(Button, { "data-qa": "eventBus.unsubscribe.btn", onClick: () => {
                    setEventBusResult('unsubscribed');
                    unsubscribeFn();
                }, children: "utils.eventBus.unsubscribe" }), _jsx("div", { "data-qa": "eventBus.result.container", children: eventBusResult })] }));
}
