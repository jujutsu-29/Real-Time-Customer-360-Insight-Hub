import { useEffect, useState } from 'react';

export interface CustomerAction {
    eventId: string;
    customerId: number;
    actionType: string;
    timestamp: string;
    metadata: Record<string, any>;
}

/**
 * Custom hook that listens to the live server-sent events stream.
 * Automatically manages list of events in reactive state.
 */
export const useLiveEvents = () => {
    const [events, setEvents] = useState<CustomerAction[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        logMessage("Attempting to connect to SSE stream: /api/stream");
        const eventSource = new EventSource('/api/stream');

        eventSource.onopen = () => {
            logMessage("SSE stream connection successfully opened.");
            setIsConnected(true);
        };

        eventSource.onerror = (err) => {
            logError("SSE stream error occurred. Attempting reconnection...", err);
            setIsConnected(false);
        };

        // Custom event handler for "CUSTOMER_EVENT" dispatched by backend
        const handleCustomerEvent = (event: MessageEvent) => {
            try {
                const action: CustomerAction = JSON.parse(event.data);
                logMessage(`Received live event: ID=${action.eventId}, Type=${action.actionType}`);
                setEvents((prev) => [action, ...prev].slice(0, 100)); // Maintain latest 100 logs
            } catch (err) {
                logError("Failed to parse incoming SSE message data", err);
            }
        };

        eventSource.addEventListener('CUSTOMER_EVENT', handleCustomerEvent);

        return () => {
            logMessage("Closing SSE stream connection.");
            eventSource.removeEventListener('CUSTOMER_EVENT', handleCustomerEvent);
            eventSource.close();
        };
    }, []);

    return { events, isConnected };
};

// Internal debug log helpers
function logMessage(msg: string) {
    console.log(`[useLiveEvents] ${msg}`);
}

function logError(msg: string, err: any) {
    console.error(`[useLiveEvents] ${msg}`, err);
}
