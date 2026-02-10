const express = require("express");
const axios = require("axios");
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

/* ---------------- GEMINI AI FUNCTION ---------------- */

async function askAI(question) {
  if (!process.env.GEMINI_KEY) {
    throw new Error("Missing GEMINI_KEY");
  }

  const response = await axios.post(
   `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
    {
      contents: [
        {
          parts: [{ text: question }]
        }
      ]
    }
  );

  return response.data.candidates[0].content.parts[0].text.split(" ")[0];
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

    /* ---- FIBONACCI ---- */
    if (body.fibonacci !== undefined) {
      if (typeof body.fibonacci !== "number") {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "fibonacci must be a number"
        });
      }

      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: fibonacci(body.fibonacci)
      });
    }

    /* ---- PRIME ---- */
    if (body.prime) {
      if (!Array.isArray(body.prime)) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "prime must be an array"
        });
      }

      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: body.prime.filter(isPrime)
      });
    }

    /* ---- LCM ---- */
    if (body.lcm) {
      if (!Array.isArray(body.lcm)) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "lcm must be an array"
        });
      }

      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: lcmArray(body.lcm)
      });
    }

    /* ---- HCF ---- */
    if (body.hcf) {
      if (!Array.isArray(body.hcf)) {
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "hcf must be an array"
        });
      }

      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: hcfArray(body.hcf)
      });
    }

    /* ---- AI ---- */
    if (body.AI) {
      const aiResponse = await askAI(body.AI);

      return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data: aiResponse
      });
    }

  } catch (error) {
    console.log("ERROR:", error.message);
    console.log(error.response?.data);

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
