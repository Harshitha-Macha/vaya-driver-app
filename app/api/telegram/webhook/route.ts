import { NextRequest, NextResponse } from 'next/server';
import { TelegramBot } from '@/lib/telegram/bot';
import connectMongo from '@/lib/connectMongo';
import { User } from '@/lib/models/User';
import { TelegramUpdate } from '@/lib/telegram/types';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(TELEGRAM_TOKEN);

export async function POST(req: NextRequest) {
    await connectMongo();
    const update: TelegramUpdate = await req.json();
    
    try {
        if ('callback_query' in update && update.callback_query) {
            const { id, from, data } = update.callback_query;
            const user = await User.findOne({ telegramId: from.id.toString() });

            if (!user && ['en', 'hi', 'te'].includes(data)) {
                await bot.handleRegistration(from.id, data);
                await bot.answerCallbackQuery(id);
                return NextResponse.json({ ok: true });
            }

            if (!user) {
                await bot.answerCallbackQuery(id, 'Please start the bot first');
                return NextResponse.json({ ok: false, error: 'User not registered' });
            }

            if (data.startsWith('district_')) {
                const district = data.split('_')[1];
                await bot.handleDistrictSelection(from.id, district, user.preferredLanguage);
            } else if (data.startsWith('town_')) {
                const [_, district, town] = data.split('_');
                if (district && town) {
                    await bot.handleTownSelection(from.id, district, town, user.preferredLanguage);
                }
            } else if (data.startsWith('zone_')) {
                const zone = data.split('_')[1];
                if (zone) {
                    await bot.handleZoneSelection(from.id, zone, user.preferredLanguage);
                }
            } else if (data.startsWith('update_zone_')) {
                const zone = data.split('_')[2];
                if (zone) {
                    await User.findOneAndUpdate(
                        { telegramId: from.id.toString() },
                        { currentZone: zone, updatedAt: new Date() }
                    );
                }
            }
            
            await bot.answerCallbackQuery(id);
            return NextResponse.json({ ok: true });
        }

        if ('message' in update && update.message?.text) {
            const { chat, text } = update.message;
            const user = await User.findOne({ telegramId: chat.id.toString() });

            if (text === '/start') {
                await bot.sendLanguageSelection(chat.id);
                return NextResponse.json({ ok: true });
            }

            if (!user) {
                return NextResponse.json({ ok: false, error: 'User not registered' });
            }

            await bot.handleMessage(chat.id, text, user.preferredLanguage);
            return NextResponse.json({ ok: true });
        }

        if ('message' in update && update.message?.location) {
            const { chat, location } = update.message;
            const user = await User.findOne({ telegramId: chat.id.toString() });

            if (!user) {
                return NextResponse.json({ ok: false, error: 'User not registered' });
            }

            await bot.handleLocation(chat.id, location, user.preferredLanguage);
            return NextResponse.json({ ok: true });
        }

        return NextResponse.json({ ok: false, error: 'Invalid update' });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ 
            ok: false, 
            error: error instanceof Error ? error.message : 'Internal server error' 
        }, { status: 500 });
    }
}

export async function GET() {
    return new Response('Telegram Webhook is active');
}
