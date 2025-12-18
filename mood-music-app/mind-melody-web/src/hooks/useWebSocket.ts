import { useEffect, useRef, useState, useCallback } from 'react';

export const useWebSocket = (url: string, onMessage: (data: any) => void) => {
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = new WebSocket(url);
        ws.current = socket;

        socket.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (e) {
                console.error("Error parsing WS message", e);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
        };

        return () => {
            socket.close();
        };
    }, [url, onMessage]);

    const sendMessage = useCallback((data: any) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
        }
    }, []);

    return { isConnected, sendMessage };
};
