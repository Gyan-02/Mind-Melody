import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import config from '../config';

export interface Device {
    deviceId: string;
    name: string;
    type: string;
    status: string;
}

export const useDevices = (userId: string) => {
    const [devices, setDevices] = useState<Device[]>([]);

    const handleMessage = useCallback((data: any) => {
        if (data.type === 'device_list') {
            setDevices(data.devices);
        }
    }, []);

    const { sendMessage, isConnected } = useWebSocket(`${config.WS_URL}/ws`, handleMessage);

    // Initial fetch (optional if WS sends immediate update, but good for fallback)
    useEffect(() => {
        fetch(`${config.API_URL}/api/devices?userId=${userId}`)
            .then(res => res.json())
            .then(data => setDevices(data))
            .catch(err => console.error("Error fetching devices:", err));
    }, [userId]);

    const registerDevice = (device: Partial<Device>) => {
        if (isConnected) {
            sendMessage({
                type: 'register',
                userId,
                ...device
            });
        }
    };

    return { devices, registerDevice, isConnected };
};
