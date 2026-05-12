package com.financetracker.service;

import com.financetracker.model.User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Handles user registration and login.
 * Uses in-memory HashMap for simplicity (no database needed).
 */
@Service
public class UserService {

    // In-memory storage: username -> User
    private final Map<String, User> users = new HashMap<>();

    /**
     * Register a new user.
     * Returns the created User, or null if username already exists.
     */
    public User register(String username, String password, String email) {
        if (users.containsKey(username)) {
            return null; // Username taken
        }

        String id = UUID.randomUUID().toString().substring(0, 8);
        User user = new User(id, username, password, email);
        users.put(username, user);
        return user;
    }

    /**
     * Login with username and password.
     * Returns the User if credentials match, null otherwise.
     */
    public User login(String username, String password) {
        User user = users.get(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    /**
     * Get user by ID.
     */
    public User getUserById(String userId) {
        return users.values().stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst()
                .orElse(null);
    }
}
