const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,       // 実際にブラウザを見たい時 → false
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // 1️⃣ HuggingFace 画像生成ページへ移動
  await page.goto(
    "https://huggingface.co/spaces/Nech-C/waiNSFWIllustrious_v140?not-for-all-audiences=true",
    { waitUntil: "networkidle2" }
  );

  // 2️⃣ Propmpt入力欄 → textarea[data-testid="textbox"] に入力
  const prompt = "beautiful girl, sunset lighting, ultra detail";
  await page.waitForSelector('textarea[data-testid="textbox"]');
  await page.type('textarea[data-testid="textbox"]', prompt);

  // 3️⃣ 「Generate / Submit」ボタンを押す（サイトによって ID が変わる可能性あり）
  // ※ ボタンのTextを直接探す方法
  const buttonSelector = 'button';
  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')];
    const target = buttons.find(b => b.textContent.toLowerCase().includes('generate'));
    if (target) target.click();
  });

  // 4️⃣ 画像が生成されるまで待つ。<img class="svelte-1pijsyv"> が出たら取得
  await page.waitForSelector('img.svelte-1pijsyv', { timeout: 120000 }); //2分待機OK

  const imgSrc = await page.$eval('img.svelte-1pijsyv', (img) => img.src);
  console.log("取得したIMG:", imgSrc);

  // 5️⃣ 自分のサイト用の HTML を作成
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>生成画像</title>
    </head>
    <body>
      <h2>生成された画像</h2>
      <img src="${imgSrc}" style="max-width:600px;">
    </body>
    </html>
  `;
  fs.writeFileSync("showImage.html", html);

  // 6️⃣ showImage.html を開く
  const localPath = "file://" + path.resolve(__dirname, "showImage.html");
  await page.goto(localPath);

  // browser.close(); // 好きなタイミングで閉めてOK
})();
