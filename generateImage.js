const puppeteer = require("puppeteer");

module.exports = async function generateImage(promptText) {
  const HF_URL =
    "https://huggingface.co/spaces/Nech-C/waiNSFWIllustrious_v140?not-for-all-audiences=true";

  const browser = await puppeteer.launch({
    headless: false,         // true にすると画面非表示
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto(HF_URL, { waitUntil: "networkidle2" });

  // テキストエリアセレクタ（ユーザーの情報に基づく）
  const textareaSelector = 'textarea[data-testid="textbox"]';

  await page.waitForSelector(textareaSelector);
  await page.type(textareaSelector, promptText);

  // Enter or Submit ボタンが必要な場合
  await page.keyboard.press('Enter');

  // 画像生成を待つ / <img> の selector で探す
  const imgSelector = "img.svelte-1pijsyv";
  await page.waitForSelector(imgSelector, { timeout: 120000 });

  // <img> の src を取得
  const imageUrl = await page.$eval(imgSelector, el => el.src);

  await browser.close();
  return imageUrl;    // → server.js に返される
};
