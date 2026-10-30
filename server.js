
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// Currency conversion API
app.get("/api/convert", async (req, res) => {
    try {
        const { from, to, amount } = req.query;

        if (!from || !to || !amount) {
            return res.status(400).json({
                error: "Please provide from, to and amount"
            });
        }

        const currencyFrom = from.toLowerCase();
        const currencyTo = to.toLowerCase();
        const value = Number(amount);

        if (!/^[a-z]{3}$/.test(currencyFrom) ||
            !/^[a-z]{3}$/.test(currencyTo) ||
            !Number.isFinite(value) || value <= 0) {
            return res.status(400).json({
                error: "Invalid currency or amount"
            });
        }

        const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currencyFrom}.json`;

        const response = await fetch(url);

        if (!response.ok) {
            return res.status(502).json({
                error: "Currency service unavailable"
            });
        }

        const data = await response.json();
        const rate = data[currencyFrom]?.[currencyTo];

        if (typeof rate !== "number") {
            return res.status(404).json({
                error: "Exchange rate not found"
            });
        }

        res.json({
            from: currencyFrom,
            to: currencyTo,
            amount: value,
            rate: rate,
            convertedAmount: value * rate
        });

    } catch (error) {
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
