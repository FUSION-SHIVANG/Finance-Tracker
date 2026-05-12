/**
 * tf-predictor.js — TensorFlow.js Spending Prediction.
 * Trains a simple model on user's expense data to predict next month's spending.
 * Uses a linear regression approach with TensorFlow.js.
 */

let predictionChartInstance = null;

async function runPrediction() {
    const resultDiv = document.getElementById('predictionResult');
    const canvas = document.getElementById('predictionChart');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<p>⏳ Loading your transaction data...</p>';

    try {
        // Fetch user transactions
        const userId = sessionStorage.getItem('userId');
        const res = await fetch(`/api/transactions/${userId}`);
        const data = await res.json();

        if (!data.success || data.transactions.length < 3) {
            resultDiv.innerHTML = `<h4>🤖 AI Spending Prediction</h4>
                <p>Need at least <strong>3 transactions</strong> to make a prediction. 
                Add more transactions and try again!</p>`;
            canvas.style.display = 'none';
            return;
        }

        resultDiv.innerHTML = '<p>🧠 Training TensorFlow model...</p>';

        const expenses = data.transactions.filter(t => t.type === 'expense');
        if (expenses.length < 2) {
            resultDiv.innerHTML = `<h4>🤖 AI Spending Prediction</h4>
                <p>Need at least <strong>2 expense entries</strong> to predict. Add more expenses!</p>`;
            canvas.style.display = 'none';
            return;
        }

        // Prepare data: use index as X, amount as Y
        const amounts = expenses.map(e => e.amount);
        const xs = amounts.map((_, i) => i);

        // Normalize data for better training
        const maxX = Math.max(...xs, 1);
        const maxY = Math.max(...amounts, 1);
        const xsNorm = xs.map(x => x / maxX);
        const ysNorm = amounts.map(y => y / maxY);

        // Create TensorFlow tensors
        const xTensor = tf.tensor2d(xsNorm, [xsNorm.length, 1]);
        const yTensor = tf.tensor2d(ysNorm, [ysNorm.length, 1]);

        // Build a simple sequential model
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 8, inputShape: [1], activation: 'relu' }));
        model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1 }));

        model.compile({ optimizer: tf.train.adam(0.05), loss: 'meanSquaredError' });

        // Train the model
        await model.fit(xTensor, yTensor, { epochs: 100, verbose: 0 });

        // Predict next 3 values
        const futureCount = 3;
        const predictions = [];
        for (let i = 0; i < futureCount; i++) {
            const nextX = (xs.length + i) / maxX;
            const pred = model.predict(tf.tensor2d([nextX], [1, 1]));
            const val = pred.dataSync()[0] * maxY;
            predictions.push(Math.max(0, Math.round(val * 100) / 100));
        }

        // Calculate stats
        const avgExpense = amounts.reduce((a, b) => a + b, 0) / amounts.length;
        const predictedAvg = predictions.reduce((a, b) => a + b, 0) / predictions.length;
        const trend = predictedAvg > avgExpense ? '📈 Increasing' : '📉 Decreasing';
        const sym = getCurrencySymbol ? getCurrencySymbol('USD') : '$';

        // Display results
        resultDiv.innerHTML = `<h4>🤖 AI Spending Prediction</h4>
            <p>Based on <strong>${expenses.length}</strong> expense records:</p>
            <p>Average Expense: <strong>${sym}${formatNum(avgExpense)}</strong></p>
            <p>Predicted Next Expenses: <span class="pred-value">${sym}${formatNum(predictedAvg)}</span></p>
            <p>Trend: <strong>${trend}</strong></p>
            <p style="color:#8888aa;font-size:12px;margin-top:8px;">Model: TensorFlow.js Linear Regression (3 layers, 100 epochs)</p>`;

        // Render prediction chart
        canvas.style.display = 'block';
        if (predictionChartInstance) predictionChartInstance.destroy();

        const chartLabels = [
            ...amounts.map((_, i) => `Txn ${i + 1}`),
            ...predictions.map((_, i) => `Pred ${i + 1}`)
        ];
        const actualData = [...amounts, ...Array(futureCount).fill(null)];
        const predData = [...Array(amounts.length - 1).fill(null), amounts[amounts.length - 1], ...predictions];

        predictionChartInstance = new Chart(canvas, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [
                    {
                        label: 'Actual Expenses',
                        data: actualData,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99,102,241,0.1)',
                        fill: true, tension: 0.3, pointRadius: 4
                    },
                    {
                        label: 'Predicted',
                        data: predData,
                        borderColor: '#a855f7',
                        borderDash: [6, 4],
                        backgroundColor: 'rgba(168,85,247,0.1)',
                        fill: true, tension: 0.3, pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: '#ccc' } } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
                    x: { grid: { display: false }, ticks: { color: '#888' } }
                }
            }
        });

        // Clean up tensors
        xTensor.dispose();
        yTensor.dispose();
        model.dispose();

    } catch (err) {
        console.error('Prediction error:', err);
        resultDiv.innerHTML = `<h4>🤖 Prediction Error</h4><p>Something went wrong: ${err.message}</p>`;
    }
}
