package com.example.handler;

import com.example.model.Device;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class DeviceWebSocketHandler extends TextWebSocketHandler {

    // Map<DeviceId, Session>
    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    // Map<DeviceId, DeviceInfo>
    private static final Map<String, Device> devices = new ConcurrentHashMap<>();
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Connected: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        Map<String, Object> data = objectMapper.readValue(payload, Map.class);
        String type = (String) data.get("type");

        if ("register".equals(type)) {
            String deviceId = (String) data.get("deviceId");
            String userId = (String) data.get("userId");
            String name = (String) data.get("name");
            String deviceType = (String) data.get("deviceType");

            Device device = new Device(deviceId, userId, name, deviceType, "Active");
            
            sessions.put(deviceId, session);
            devices.put(deviceId, device);
            
            System.out.println("Registered device: " + name + " (" + deviceId + ")");
            broadcastDeviceList();
        } else if ("state".equals(type)) {
            // Update device status if needed, or just broadcast
        } else if ("control".equals(type)) {
             // Handle control messages if routed through server
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String deviceIdToRemove = null;
        for (Map.Entry<String, WebSocketSession> entry : sessions.entrySet()) {
            if (entry.getValue().getId().equals(session.getId())) {
                deviceIdToRemove = entry.getKey();
                break;
            }
        }
        
        if (deviceIdToRemove != null) {
            sessions.remove(deviceIdToRemove);
            devices.remove(deviceIdToRemove);
            System.out.println("Disconnected device: " + deviceIdToRemove);
            broadcastDeviceList();
        }
    }

    public List<Device> getConnectedDevices() {
        return new ArrayList<>(devices.values());
    }

    public void sendTransfer(String targetDeviceId, Map<String, Object> transferData) throws IOException {
        WebSocketSession session = sessions.get(targetDeviceId);
        if (session != null && session.isOpen()) {
            String payload = objectMapper.writeValueAsString(transferData);
            session.sendMessage(new TextMessage(payload));
        } else {
            throw new IOException("Device not connected: " + targetDeviceId);
        }
    }

    private void broadcastDeviceList() {
        // In a real app, we'd filter by userId. For demo, broadcast to all.
        // But wait, clients poll for devices or we push updates?
        // Let's push updates to all connected clients so the UI refreshes.
        try {
            List<Device> deviceList = getConnectedDevices();
            String json = objectMapper.writeValueAsString(Map.of("type", "device_list", "devices", deviceList));
            TextMessage message = new TextMessage(json);
            
            for (WebSocketSession session : sessions.values()) {
                if (session.isOpen()) {
                    session.sendMessage(message);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
