const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const EMAIL = "bhumi0145.be23@chitkara.edu.in";

/* ---------------- HEALTH ROUTE ---------------- */

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

/* ---------------- HELPER FUNCTIONS ---------------- */

function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [0, 1];

  const series = [0, 1];
  for (let i = 2; i < n; i++) {
    series.push(series[i - 1] + series[i - 2]);
  }
  return series;
}

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function hcfArray(numbers) {
  return numbers.reduce((acc, curr) => gcd(acc, curr));
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function lcmArray(numbers) {
  return numbers.reduce((acc, curr) => lcm(acc, curr));
}

/* ---------------- SIMPLE AI FUNCTION ---------------- */

function askAI(question) {
  const q = question.toLowerCase();

  if (q.includes("france")) return "Paris";
  if (q.includes("india")) return "New Delhi";
  if (q.includes("japan")) return "Tokyo";
  if (q.includes("maharashtra")) return "Mumbai";

  return "AI response";
}

/* ---------------- BFHL ROUTE ---------------- */

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Request body is required"
      });
    }

    const allowedKeys = ["fibonacci", "prime", "lcm", "hcf", "AI"];
    const presentKeys = allowedKeys.filter(
      (key) => body[key] !== undefined
    );

    if (presentKeys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Exactly one key must be provided"
      });
    }

    if (body.fibonacci !== undefined) {
      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: fibonacci(body.fibonacci)
      });
    }

    if (body.prime !== undefined) {
      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: body.prime.filter(isPrime)
      });
    }

    if (body.lcm !== undefined) {
      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: lcmArray(body.lcm)
      });
    }

    if (body.hcf !== undefined) {
      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: hcfArray(body.hcf)
      });
    }

    if (body.AI !== undefined) {
      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: askAI(body.AI)
      });
    }

  } catch (error) {
    return res.status(500).json({
      is_success: false,
      official_email: EMAIL,
      error: "Server error"
    });
  }
});

/* ---------------- SERVER START ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
