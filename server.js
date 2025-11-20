const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public')); // index.html を配信
app.use(bodyParser.json());

// ★ Puppeteerを使うAPI ★
app.post('/generate', async (req, res) => {
  const promptText = req.body.prompt;

  const browser = await puppeteer.launch({
    headless: true,  // 自分で動作確認したい場合 false でもOK
  });
  const page = await browser.newPage();

  try {
    await page.goto(
      'https://huggingface.co/spaces/Nech-C/waiNSFWIllustrious_v140?not-for-all-audiences=true',
      { waitUntil: 'networkidle2' }
    );

    // ----- プロンプト入力 -----
    await page.waitForSelector('textarea[data-testid="textbox"]');
    await page.type('textarea[data-testid="textbox"]', promptText);

    // 送信ボタンがある場合はクリック
    // 実際のDOMを確認してセレクタは調整する
    await page.click('button[data-testid="generate-button"], button:contains("Generate")');

    // 画像生成を待機（生成処理が完了するまで）
    await page.waitForSelector('img.svelte-1pijsyv', { timeout: 60000 });

    // 画像URL取得
    const imageUrl = await page.$eval('img.svelte-1pijsyv', img => img.src);

    await browser.close();
    
    res.json({ imageUrl });

  } catch (err) {
    await browser.close();
    console.error(err);
    res.status(500).json({ error: '画像生成に失敗しました' });
  }
});

// サーバー起動
app.listen(3000, () => {
  console.log('http://localhost:3000 で起動中');
});
