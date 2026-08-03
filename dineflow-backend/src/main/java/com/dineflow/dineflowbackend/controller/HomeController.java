package com.dineflow.dineflowbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("application", "DineFlow Backend API");
        body.put("status", "running");
        body.put("version", "1.0.0");
        body.put("frontend", "http://localhost:3000");
        body.put("docs", Map.of(
                "register", "POST /api/auth/register",
                "login", "POST /api/auth/login",
                "restaurants", "GET /api/restaurants",
                "health", "GET /api/health"
        ));
        return ResponseEntity.ok(body);
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
