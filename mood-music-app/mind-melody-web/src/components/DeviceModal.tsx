import React from 'react';
import { X, Smartphone, Monitor, Speaker, Check } from 'lucide-react';
import { Device } from '../hooks/useDevices';

interface DeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
    devices: Device[];
    currentDeviceId: string;
    onTransfer: (deviceId: string) => void;
}

const DeviceModal: React.FC<DeviceModalProps> = ({ isOpen, onClose, devices, currentDeviceId, onTransfer }) => {
    if (!isOpen) return null;

    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'phone': return <Smartphone className="w-5 h-5" />;
            case 'speaker': return <Speaker className="w-5 h-5" />;
            default: return <Monitor className="w-5 h-5" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-surface border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Connect to a device</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-2">
                    {devices.length === 0 ? (
                        <p className="text-text-secondary text-center py-4">No other devices found.</p>
                    ) : (
                        devices.map(device => (
                            <div key={device.deviceId} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`text-text-secondary group-hover:text-white ${device.deviceId === currentDeviceId ? 'text-primary' : ''}`}>
                                        {getIcon(device.type)}
                                    </div>
                                    <div>
                                        <p className={`font-medium ${device.deviceId === currentDeviceId ? 'text-primary' : 'text-white'}`}>
                                            {device.name}
                                        </p>
                                        <p className="text-xs text-text-secondary capitalize">{device.type} • {device.status}</p>
                                    </div>
                                </div>

                                {device.deviceId === currentDeviceId ? (
                                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Active
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => onTransfer(device.deviceId)}
                                        className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                                    >
                                        Transfer
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeviceModal;
