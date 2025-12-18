package com.example.controller;

import com.example.handler.DeviceWebSocketHandler;
import com.example.model.Device;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    private DeviceWebSocketHandler deviceWebSocketHandler;

    @GetMapping
    public List<Device> getDevices(@RequestParam(required = false) String userId) {
        // In a real app, filter by userId
        return deviceWebSocketHandler.getConnectedDevices();
    }

    @PostMapping("/{deviceId}/transfer")
    public ResponseEntity<?> transferPlayback(@PathVariable String deviceId, @RequestBody Map<String, Object> payload) {
        try {
            // Construct the transfer message
            Map<String, Object> transferMessage = Map.of(
                "type", "transfer",
                "trackUri", payload.get("trackUri"),
                "metadata", payload.getOrDefault("metadata", Map.of())
            );
            
            deviceWebSocketHandler.sendTransfer(deviceId, transferMessage);
            return ResponseEntity.ok(Map.of("message", "Transfer initiated"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
