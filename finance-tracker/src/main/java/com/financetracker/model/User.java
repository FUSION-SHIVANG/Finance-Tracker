package com.financetracker.model;

/**
 * Simple User model for authentication.
 * Stores username, password, and preferred currency.
 */
public class User {

    private String id;
    private String username;
    private String password;
    private String email;
    private String preferredCurrency;

    public User() {
        this.preferredCurrency = "USD";
    }

    public User(String id, String username, String password, String email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.preferredCurrency = "USD";
    }

    // --- Getters and Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPreferredCurrency() { return preferredCurrency; }
    public void setPreferredCurrency(String preferredCurrency) { this.preferredCurrency = preferredCurrency; }
}
