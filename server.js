// server/server.js
const express = require("express");
const cors = require("cors");
const { generateImage } = require("./puppeteerTask");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "No prompt provided" });

  try {
    const imageUrl = await generateImage(prompt);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: "Puppeteer error", details: error.toString() });
  }
});

// publicフォルダを静的サーバーとして公開
app.use(express.static("public"));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
