require('dotenv').config();
const express = require('express');
const { Client } = require('@line/bot-sdk');
const axios = require('axios');

const app = express();
app.use(express.json());

// LINE Bot 設定
const lineConfig = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};
const lineClient = new Client(lineConfig);

// Notion API 設定
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_API_KEY = process.env.NOTION_API_KEY;

// 處理 LINE 訊息
app.post('/webhook', async (req, res) => {
    const events = req.body.events;
    for (let event of events) {
        if (event.type === 'message' && event.message.type === 'text') {
            const text = event.message.text;
            const filteredText = filterBankMessage(text);
            if (filteredText) {
                await saveToNotion(filteredText);
            }
        }
    }
    res.status(200).send('OK');
});

// 解析銀行消費訊息
function filterBankMessage(text) {
    const match = text.match(/(消費)(\d+)(元)/);
    if (match) {
        return { amount: match[2], date: new Date().toISOString() };
    }
    return null;
}

// 上傳到 Notion
async function saveToNotion(data) {
    await axios.post('https://api.notion.com/v1/pages', {
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
            "消費金額": { number: parseInt(data.amount) },
            "日期": { date: { start: data.date } }
        }
    }, {
        headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        }
    });
}

app.listen(3000, () => console.log('Server running'));
