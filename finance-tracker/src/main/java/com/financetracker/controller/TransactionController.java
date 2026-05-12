package com.financetracker.controller;

import com.financetracker.model.Transaction;
import com.financetracker.service.TransactionService;
import com.financetracker.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * REST Controller for transaction CRUD operations.
 * All endpoints start with /api/transactions
 */
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CurrencyService currencyService;

    /**
     * POST /api/transactions
     * Add a new transaction.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addTransaction(@RequestBody Transaction transaction) {
        Map<String, Object> response = new HashMap<>();

        if (transaction.getUserId() == null || transaction.getAmount() <= 0) {
            response.put("success", false);
            response.put("message", "Invalid transaction data");
            return ResponseEntity.badRequest().body(response);
        }

        Transaction saved = transactionService.addTransaction(transaction);
        response.put("success", true);
        response.put("transaction", saved);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/transactions/{userId}
     * Get all transactions for a user.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getTransactions(
            @PathVariable String userId,
            @RequestParam(required = false) String convertTo) {

        Map<String, Object> response = new HashMap<>();
        List<Transaction> transactions = transactionService.getTransactions(userId);

        // If convertTo is specified, convert all amounts to that currency
        if (convertTo != null && !convertTo.isEmpty()) {
            List<Map<String, Object>> converted = new ArrayList<>();
            for (Transaction t : transactions) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", t.getId());
                item.put("type", t.getType());
                item.put("originalAmount", t.getAmount());
                item.put("originalCurrency", t.getCurrency());
                item.put("convertedAmount", currencyService.convert(t.getAmount(), t.getCurrency(), convertTo));
                item.put("convertedCurrency", convertTo);
                item.put("category", t.getCategory());
                item.put("description", t.getDescription());
                item.put("date", t.getDate());
                converted.add(item);
            }
            response.put("transactions", converted);
        } else {
            response.put("transactions", transactions);
        }

        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/transactions/{userId}/{transactionId}
     * Delete a specific transaction.
     */
    @DeleteMapping("/{userId}/{transactionId}")
    public ResponseEntity<Map<String, Object>> deleteTransaction(
            @PathVariable String userId,
            @PathVariable String transactionId) {

        Map<String, Object> response = new HashMap<>();
        boolean deleted = transactionService.deleteTransaction(userId, transactionId);

        response.put("success", deleted);
        response.put("message", deleted ? "Transaction deleted" : "Transaction not found");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/transactions/{userId}/summary
     * Get spending summary by category.
     */
    @GetMapping("/{userId}/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("categories", transactionService.getCategorySummary(userId));
        response.put("totals", transactionService.getTotals(userId));

        return ResponseEntity.ok(response);
    }
}
