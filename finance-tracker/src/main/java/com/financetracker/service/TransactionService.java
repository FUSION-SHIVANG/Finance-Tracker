package com.financetracker.service;

import com.financetracker.model.Transaction;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Handles all transaction operations.
 * Uses in-memory storage with HashMap for simplicity.
 */
@Service
public class TransactionService {

    // In-memory storage: userId -> list of transactions
    private final Map<String, List<Transaction>> transactions = new HashMap<>();

    /**
     * Add a new transaction for a user.
     */
    public Transaction addTransaction(Transaction transaction) {
        transaction.setId(UUID.randomUUID().toString().substring(0, 8));

        transactions.computeIfAbsent(transaction.getUserId(), k -> new ArrayList<>());
        transactions.get(transaction.getUserId()).add(transaction);

        return transaction;
    }

    /**
     * Get all transactions for a user.
     */
    public List<Transaction> getTransactions(String userId) {
        return transactions.getOrDefault(userId, new ArrayList<>());
    }

    /**
     * Delete a transaction by ID.
     */
    public boolean deleteTransaction(String userId, String transactionId) {
        List<Transaction> userTransactions = transactions.get(userId);
        if (userTransactions != null) {
            return userTransactions.removeIf(t -> t.getId().equals(transactionId));
        }
        return false;
    }

    /**
     * Get spending summary grouped by category.
     */
    public Map<String, Double> getCategorySummary(String userId) {
        List<Transaction> userTransactions = getTransactions(userId);

        return userTransactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.summingDouble(Transaction::getAmount)
                ));
    }

    /**
     * Get total income and expense for a user.
     */
    public Map<String, Double> getTotals(String userId) {
        List<Transaction> userTransactions = getTransactions(userId);
        Map<String, Double> totals = new HashMap<>();

        double totalIncome = userTransactions.stream()
                .filter(t -> "income".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalExpense = userTransactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        totals.put("income", totalIncome);
        totals.put("expense", totalExpense);
        totals.put("balance", totalIncome - totalExpense);

        return totals;
    }
}
