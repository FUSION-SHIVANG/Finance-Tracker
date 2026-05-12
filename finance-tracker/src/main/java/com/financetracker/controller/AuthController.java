package com.financetracker.controller;

import com.financetracker.model.User;
import com.financetracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for user authentication (login & register).
 * All endpoints start with /api/auth
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * POST /api/auth/register
     * Body: { "username": "...", "password": "...", "email": "..." }
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String email = body.get("email");

        Map<String, Object> response = new HashMap<>();

        if (username == null || password == null || email == null) {
            response.put("success", false);
            response.put("message", "All fields are required");
            return ResponseEntity.badRequest().body(response);
        }

        User user = userService.register(username, password, email);

        if (user == null) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }

        response.put("success", true);
        response.put("message", "Registration successful!");
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/login
     * Body: { "username": "...", "password": "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        Map<String, Object> response = new HashMap<>();

        User user = userService.login(username, password);

        if (user == null) {
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(response);
        }

        response.put("success", true);
        response.put("message", "Login successful!");
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        return ResponseEntity.ok(response);
    }
}
