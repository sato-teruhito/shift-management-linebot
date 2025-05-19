/*import { NextApiRequest, NextApiResponse } from 'next';
import { middleware, Client, ClientConfig, MiddlewareConfig, WebhookEvent } from '@line/bot-sdk';

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
};

const middlewareConfig: MiddlewareConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
};

const client = new Client(clientConfig);
export const configMiddleware = middleware(middlewareConfig);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const events: WebhookEvent[] = req.body.events;

  const results = await Promise.all(
    events.map(async (event) => {
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;

        // 例：シフト提出コマンド
        if (userMessage.startsWith('@シフト提出')) {
          await client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'シフト提出はこちらのフォームからどうぞ！\nhttps://shift-management-linebot.vercel.app/',
          });
        }

        if (userMessage.startsWith('@名前')) {
          await client.replyMessage(event.replyToken, {
            type: 'text',
            text: '名前を登録しました（ダミー返信）',
          });
        }

        // その他の応答
      }

      return Promise.resolve(null);
    })
  );

  res.status(200).json(results);
};

export default handler;*/

// app/api/line-webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { middleware, Client, WebhookEvent } from '@line/bot-sdk';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
};

const client = new Client(config);

export async function POST(req: NextRequest) {
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
        }

        if (userMessage.startsWith('@名前')) {
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
}

