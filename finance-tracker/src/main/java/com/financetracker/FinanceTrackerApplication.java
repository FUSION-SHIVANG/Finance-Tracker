package com.financetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Finance Tracker application.
 * Run this class to start the Spring Boot server on port 8080.
 */
@SpringBootApplication
public class FinanceTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinanceTrackerApplication.class, args);
        System.out.println("===========================================");
        System.out.println("  Finance Tracker is running!");
        System.out.println("  Open: http://localhost:8080");
        System.out.println("===========================================");
    }
}
