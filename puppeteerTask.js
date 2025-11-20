// server/puppeteerTask.js
const puppeteer = require("puppeteer");

async function generateImage(prompt) {
  const browser = await puppeteer.launch({
    headless: true,           // 表示したい場合は false
  });
  const page = await browser.newPage();

  // HuggingFace の画像生成サイトへアクセス
  await page.goto(
    "https://huggingface.co/spaces/Nech-C/waiNSFWIllustrious_v140?not-for-all-audiences=true",
    { waitUntil: "networkidle2" }
  );

  // プロンプト（textarea）入力
  await page.waitForSelector('textarea[data-testid="textbox"]', { timeout: 20000 });
  await page.type('textarea[data-testid="textbox"]', prompt);

  // Run ボタン押す
  await page.click('button#component-21');

  // 画像の生成を待つ
  await page.waitForSelector('img.svelte-1pijsyv', { timeout: 60000 });

  // 画像の URL を取得
  const imageUrl = await page.$eval("img.svelte-1pijsyv", img => img.src);

  await browser.close();
  return imageUrl;
}

module.exports = { generateImage };
