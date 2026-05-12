package com.financetracker.model;

import java.time.LocalDateTime;

/**
 * Transaction model representing income or expense entries.
 * Each transaction has a currency, amount, category, and type.
 */
public class Transaction {

    private String id;
    private String userId;
    private String type;          // "income" or "expense"
    private double amount;
    private String currency;      // e.g., "USD", "EUR", "INR"
    private String category;      // e.g., "Food", "Salary", "Transport"
    private String description;
    private String date;          // ISO date string

    public Transaction() {}

    public Transaction(String id, String userId, String type, double amount,
                       String currency, String category, String description, String date) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.amount = amount;
        this.currency = currency;
        this.category = category;
        this.description = description;
        this.date = date;
    }

    // --- Getters and Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
