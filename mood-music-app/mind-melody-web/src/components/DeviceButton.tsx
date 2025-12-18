import React, { useState } from 'react';
import { MonitorSpeaker } from 'lucide-react';
import DeviceModal from './DeviceModal';
import { useDevices } from '../hooks/useDevices';
import { usePlayer } from '../context/PlayerContext';
import config from '../config';

const DeviceButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Use a static ID for this client for now, or generate one
    const [myDeviceId] = useState(() => 'web-' + Math.random().toString(36).substr(2, 9));
    const { devices, registerDevice, isConnected } = useDevices('user-1'); // Demo userId
    const { currentSong } = usePlayer();

    // Register this device on mount
    React.useEffect(() => {
        if (isConnected) {
            registerDevice({
                deviceId: myDeviceId,
                name: 'Web Player',
                type: 'Web'
            });
        }
    }, [registerDevice, myDeviceId, isConnected]);

    const handleTransfer = (targetDeviceId: string) => {
        if (!currentSong) return;

        fetch(`${config.API_URL}/api/devices/${targetDeviceId}/transfer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                trackUri: currentSong.previewUrl,
                metadata: currentSong
            })
        })
            .then(() => {
                console.log("Transfer initiated");
                setIsModalOpen(false);
            })
            .catch(err => console.error("Transfer failed", err));
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-text-secondary hover:text-white transition-colors relative group"
                title="Connect to a device"
            >
                <MonitorSpeaker className="w-4 h-4" />
                {/* Optional: Add badge if connected to remote */}
            </button>

            <DeviceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                devices={devices}
                currentDeviceId={myDeviceId}
                onTransfer={handleTransfer}
            />
        </>
    );
};

export default DeviceButton;
