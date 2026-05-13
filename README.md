# 💰 Finance Tracker

A Java Spring Boot finance tracker with multi-currency support, beautiful dark UI, and TensorFlow.js AI spending predictions.

## Features

- **🔐 Login & Register** — Simple authentication system
- **💳 Transaction Management** — Add, view, and delete income/expense entries
- **💱 12+ Currencies** — USD, EUR, GBP, INR, JPY, CAD, AUD, CNY, BRL, KRW, SGD
- **📊 Visual Charts** — Category breakdown (doughnut) and income vs expense (bar)
- **🤖 AI Predictions** — TensorFlow.js neural network predicts future spending
- **🌙 Dark Theme** — Premium glassmorphism UI with smooth animations

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Java 17, Spring Boot 3.2            |
| Frontend  | HTML5, CSS3, JavaScript             |
| Charts    | Chart.js 4                          |
| AI/ML     | TensorFlow.js 4.15                  |
| Build     | Maven                               |

## How to Run

### Prerequisites
- Java 17+ installed (`java -version` to check)
- Maven installed (`mvn -version` to check)

### Steps

1. **Navigate to the project folder:**
   ```bash
   cd finance-tracker
   ```

2. **Build and run:**
   ```bash
   mvn spring-boot:run
   ```

3. **Open in browser:**
   ```
   http://localhost:8080
   ```

4. **Register** a new account and start tracking!

## Project Structure

```
finance-tracker/
├── pom.xml                              # Maven config
├── src/main/java/com/financetracker/
│   ├── FinanceTrackerApplication.java   # Main app entry point
│   ├── model/
│   │   ├── User.java                    # User model
│   │   └── Transaction.java            # Transaction model
│   ├── controller/
│   │   ├── AuthController.java          # Login/Register API
│   │   ├── TransactionController.java   # Transaction CRUD API
│   │   └── CurrencyController.java      # Currency conversion API
│   └── service/
│       ├── UserService.java             # User management
│       ├── TransactionService.java      # Transaction logic
│       └── CurrencyService.java         # Currency conversion
├── src/main/resources/
│   ├── application.properties           # Server config
│   └── static/
│       ├── index.html                   # Login page
│       ├── dashboard.html               # Main dashboard
│       ├── css/style.css                # All styles
│       └── js/
│           ├── auth.js                  # Login logic
│           ├── dashboard.js             # Dashboard logic
│           └── tf-predictor.js          # TensorFlow predictions
```

## API Endpoints

| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| POST   | `/api/auth/register`                  | Register new user        |
| POST   | `/api/auth/login`                     | Login                    |
| POST   | `/api/transactions`                   | Add transaction          |
| GET    | `/api/transactions/{userId}`          | Get all transactions     |
| DELETE | `/api/transactions/{userId}/{txnId}`  | Delete transaction       |
| GET    | `/api/transactions/{userId}/summary`  | Get spending summary     |
| GET    | `/api/currency/list`                  | List all currencies      |
| GET    | `/api/currency/convert`               | Convert currency         |
