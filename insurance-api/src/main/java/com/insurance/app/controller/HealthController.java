package com.insurance.app.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "insurance-api");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/details")
    public ResponseEntity<Map<String, Object>> healthDetails() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "insurance-api");
        response.put("version", "1.0.0");
        response.put("jvm", System.getProperty("java.version"));
        
        // Add memory information
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory() / (1024 * 1024);
        long freeMemory = runtime.freeMemory() / (1024 * 1024);
        long maxMemory = runtime.maxMemory() / (1024 * 1024);
        
        Map<String, Object> memory = new HashMap<>();
        memory.put("total", totalMemory + " MB");
        memory.put("free", freeMemory + " MB");
        memory.put("max", maxMemory + " MB");
        memory.put("used", (totalMemory - freeMemory) + " MB");
        
        response.put("memory", memory);
        
        return ResponseEntity.ok(response);
    }
} 