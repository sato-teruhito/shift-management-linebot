// app/api/line-webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Client, WebhookEvent } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events: WebhookEvent[] = body.events;

    const results = await Promise.all(
      events.map(async (event) => {
        if (event.type === 'message' && event.message.type === 'text') {
          const userMessage = event.message.text;

          if (userMessage.startsWith('@シフト提出')) {
            await client.replyMessage(event.replyToken, {
              type: 'text',
              text: 'シフト提出はこちらのフォームからどうぞ！\nhttps://shift-management-linebot.vercel.app/',
            });
          } else if (userMessage.startsWith('@名前')) {
            await client.replyMessage(event.replyToken, {
              type: 'text',
              text: '名前を登録しました（ダミー返信）',
            });
          }
        }

        return Promise.resolve(null);
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
