package com.example.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class Device {
    private String deviceId;
    private String userId;
    private String name;
    private String type; // "Phone", "Web", "Speaker"
    private String status; // "Active", "Idle"

    public Device() {}

    public Device(String deviceId, String userId, String name, String type, String status) {
        this.deviceId = deviceId;
        this.userId = userId;
        this.name = name;
        this.type = type;
        this.status = status;
    }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
