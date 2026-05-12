package com.financetracker.controller;

import com.financetracker.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for currency operations.
 * All endpoints start with /api/currency
 */
@RestController
@RequestMapping("/api/currency")
public class CurrencyController {

    @Autowired
    private CurrencyService currencyService;

    /**
     * GET /api/currency/list
     * Get all supported currencies with rates and names.
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getCurrencies() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("currencies", currencyService.getAllCurrencies());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/currency/convert?amount=100&from=USD&to=EUR
     * Convert an amount between currencies.
     */
    @GetMapping("/convert")
    public ResponseEntity<Map<String, Object>> convert(
            @RequestParam double amount,
            @RequestParam String from,
            @RequestParam String to) {

        Map<String, Object> response = new HashMap<>();

        try {
            double converted = currencyService.convert(amount, from, to);
            response.put("success", true);
            response.put("originalAmount", amount);
            response.put("fromCurrency", from);
            response.put("toCurrency", to);
            response.put("convertedAmount", converted);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }
}
