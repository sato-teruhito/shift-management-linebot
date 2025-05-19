// app/api/line-webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Client, WebhookEvent } from '@line/bot-sdk';
import { supabase } from '@/lib/supabase';

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
          const messageText = userMessage.trim();
          //const userId = event.source.userId;

          if (userMessage.startsWith('@シフト提出')) {
            await client.replyMessage(event.replyToken, {
              type: 'text',
              text: 'シフト提出はこちらのフォームからどうぞ！\nhttps://shift-management-linebot.vercel.app/',
            });
          } else if (userMessage.startsWith('@登録')) {
            /*await client.replyMessage(event.replyToken, {
              type: 'text',
              text: '名前を登録しました（ダミー返信）',
            }); */
            const name = messageText.replace('@登録', '').trim();

            if (name) {
                //supabaseに名前登録
                const { error } = await supabase.from('users').insert([{ name }]);

                if ( error ) {
                    console.error('supabaseへの登録エラー：', error.message);
                } else {
                    console.log(`ユーザ名「${name}」を登録しました`);
                }
            }

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
