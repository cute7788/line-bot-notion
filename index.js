const express = require('express');
const { Client } = require('@line/bot-sdk');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json()); // 確保可以解析 JSON

// 設定 LINE Bot
const config = {
  channelAccessToken:"LINE_ACCESS_TOKEN",
  channelSecret:"LINE_CHANNEL_SECRET",
};
const client = new Client(config);

app.post('/webhook', (req, res) => {
    console.log("收到 LINE Webhook:", req.body);

    // 確保回應 200，避免 LINE 視為錯誤
    res.status(200).send("OK");
});

// 啟動伺服器
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`伺服器運行於 http://localhost:${port}`);
});
