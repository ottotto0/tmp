const express = require("express");
const path = require("path");
const generateImage = require("./puppeteer/generateImage");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// 初期画面
app.get("/", (req, res) => {
  res.render("index", { imageUrl: null, error: null });
});

// プロンプト送信
app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const imageUrl = await generateImage(prompt);
    res.render("index", { imageUrl, error: null });
  } catch (err) {
    res.render("index", { imageUrl: null, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
