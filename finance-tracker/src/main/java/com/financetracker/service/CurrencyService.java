package com.financetracker.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Currency conversion service.
 * Uses hardcoded exchange rates (base: USD) for simplicity.
 * In production, you would call a live API like exchangerate-api.com
 */
@Service
public class CurrencyService {

    // Exchange rates relative to 1 USD
    private final Map<String, Double> rates = new HashMap<>();

    // Currency names for display
    private final Map<String, String> currencyNames = new HashMap<>();

    public CurrencyService() {
        // Rates as of 2024 (approximate)
        rates.put("USD", 1.0);
        rates.put("EUR", 0.92);
        rates.put("GBP", 0.79);
        rates.put("INR", 83.12);
        rates.put("JPY", 149.50);
        rates.put("CAD", 1.36);
        rates.put("AUD", 1.53);
        rates.put("CNY", 7.24);
        rates.put("BRL", 4.97);
        rates.put("MXN", 17.15);
        rates.put("KRW", 1320.0);
        rates.put("SGD", 1.34);

        currencyNames.put("USD", "US Dollar");
        currencyNames.put("EUR", "Euro");
        currencyNames.put("GBP", "British Pound");
        currencyNames.put("INR", "Indian Rupee");
        currencyNames.put("JPY", "Japanese Yen");
        currencyNames.put("CAD", "Canadian Dollar");
        currencyNames.put("AUD", "Australian Dollar");
        currencyNames.put("CNY", "Chinese Yuan");
        currencyNames.put("BRL", "Brazilian Real");
        currencyNames.put("MXN", "Mexican Peso");
        currencyNames.put("KRW", "South Korean Won");
        currencyNames.put("SGD", "Singapore Dollar");
    }

    /**
     * Convert amount from one currency to another.
     */
    public double convert(double amount, String fromCurrency, String toCurrency) {
        Double fromRate = rates.get(fromCurrency);
        Double toRate = rates.get(toCurrency);

        if (fromRate == null || toRate == null) {
            throw new IllegalArgumentException("Unsupported currency");
        }

        // Convert: from -> USD -> to
        double usdAmount = amount / fromRate;
        return Math.round(usdAmount * toRate * 100.0) / 100.0;
    }

    /**
     * Get all supported currencies with their rates.
     */
    public Map<String, Object> getAllCurrencies() {
        Map<String, Object> result = new HashMap<>();
        for (String code : rates.keySet()) {
            Map<String, Object> info = new HashMap<>();
            info.put("rate", rates.get(code));
            info.put("name", currencyNames.getOrDefault(code, code));
            result.put(code, info);
        }
        return result;
    }

    /**
     * Get available currency codes.
     */
    public Set<String> getCurrencyCodes() {
        return rates.keySet();
    }
}
