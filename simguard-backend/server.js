import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;

// ✅ Enable CORS for React app
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// ✅ Security headers with clean CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],             // Everything defaults to your server
      scriptSrc: ["'self'", "'unsafe-inline'"], // Inline scripts allowed
      styleSrc: ["'self'", "'unsafe-inline'", "https:"], // Tailwind CDN
      imgSrc: ["'self'", "data:"],        // Images from server or base64
      connectSrc: ["'self'", "http://localhost:3000"], // API calls from React
      fontSrc: ["'self'", "https:", "data:"], // Fonts from Google
    },
  },
}));

app.use(bodyParser.json());

// 🔹 Test API (RICA simulation)
app.get("/api/rica/:idNumber", (req, res) => {
  const { idNumber } = req.params;
  if (!/^\d{13}$/.test(idNumber)) return res.status(400).json({ error: "Invalid ID" });

  res.json({
    idNumber,
    simList: [
      { number: "0831234567", status: "active" },
      { number: "0829876543", status: "active" },
      { number: "0845556677", status: "frozen" },
    ]
  });
});

// 🔹 Save settings API
app.post("/api/save-settings", (req, res) => {
  console.log("Settings received:", req.body);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
