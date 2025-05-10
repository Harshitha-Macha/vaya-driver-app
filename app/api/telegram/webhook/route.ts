import { NextRequest, NextResponse } from 'next/server';
import { TelegramBot } from '@/lib/telegram/bot';
import connectMongo from '@/lib/connectMongo';
import { User } from '@/lib/models/User';
import { TelegramUpdate } from '@/lib/telegram/types';
import { Ride } from '@/lib/models/Ride';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(TELEGRAM_TOKEN);

export async function POST(req: NextRequest) {
    await connectMongo();
    const update: TelegramUpdate = await req.json();
    
    try {
        if ('message' in update && update.message?.text) {
            const { chat, text } = update.message;
            const userDoc = await User.findOne({ telegramId: chat.id.toString() });

            if (text === '/start') {
                if (!userDoc) {
                    await bot.sendLanguageSelection(chat.id);
                } else {
                    await bot.sendWelcomeBack(chat.id, userDoc.preferredLanguage);
                }
                return NextResponse.json({ ok: true });
            }

            if (!userDoc) {
                await bot.sendMessage(chat.id, 'Please start the bot with /start command first');
                return NextResponse.json({ ok: true });
            }

            const commandMap: Record<string, string> = {
                '🚗 Book Ride': '/book',
                '⚙️ Settings': '/settings',
                '❓ Help': '/help',
                '🚦 Go Online': '/status',
                '🔴 Go Offline': '/status',  
                '📍 Update Zone': '/zone',
                '📊 My Stats': '/stats'
            };

            const actualText = commandMap[text] || text;

            if (userDoc) {
                await bot.handleMessage(chat.id, actualText, userDoc.preferredLanguage);
                return NextResponse.json({ ok: true });
            }
        }

        if ('callback_query' in update && update.callback_query) {
            const { id, from, data, message } = update.callback_query;
            const userDoc = await User.findOne({ telegramId: from.id.toString() });

            if (!message) {
                await bot.answerCallbackQuery(id, 'Invalid callback query');
                return NextResponse.json({ ok: false, error: 'Missing message data' });
            }

            if (!userDoc && ['en', 'hi', 'te'].includes(data)) {
                await bot.handleLanguageUpdate(from.id, message.message_id, data);

                const user = await User.findOne({ telegramId: from.id.toString() });
                
                if (user) {
                    await bot.sendWelcomeBack(from.id, data);
                    return NextResponse.json({ ok: true });
                }
                else {
                    const newUser = await bot.handleRegistration(from.id, data);
                    await bot.answerCallbackQuery(id);
                    await bot.startDistrictSelection(from.id, data);
                    return NextResponse.json({ ok: true });
                }
            }

            if (!userDoc) {
                await bot.answerCallbackQuery(id, 'Please start the bot first');
                return NextResponse.json({ ok: false, error: 'User not registered' });
            }

            if (data.startsWith('lang_')) {
                const langCode = data.split('_')[1];
                await bot.handleLanguageUpdate(from.id, message.message_id, langCode);
                await bot.sendSettings(from.id, langCode, message.message_id);
                await bot.answerCallbackQuery(id, '✅ Language updated');
                return NextResponse.json({ ok: true });
            }

            if (data.startsWith('district_')) {
                const district = data.split('_')[1];
                await bot.handleDistrictSelection(from.id, district, userDoc.preferredLanguage, message.message_id, false);
            } else if (data.startsWith('town_')) {
                const [_, district, town] = data.split('_');
                if (district && town) {
                    await bot.handleTownSelection(from.id, district, town, userDoc.preferredLanguage, message.message_id);
                }
            } else if (data.startsWith('zone_')) {
                const zone = data.split('_')[1];
                console.log('Zone selected:', zone);
                if (zone) {
                    await bot.handleZoneSelection(from.id, zone, userDoc.preferredLanguage, message.message_id);
                }
            } else if (data.startsWith('update_zone_')) {
                const zone = data.split('_')[2];
                if (zone) {
                    if (userDoc.role === 'DRIVER') {
                        await User.findOneAndUpdate(
                            { telegramId: from.id.toString() },
                            { currentZone: zone }
                        );
                        await bot.sendMessage(
                            from.id,
                            `Zone updated to: ${zone}`,
                            {
                                keyboard: [
                                    [userDoc.isOnline ? '🔴 Go Offline' : '🚦 Go Online'],
                                    ['📍 Update Zone', '📊 My Stats'],
                                    ['⚙️ Settings']
                                ],
                                resize_keyboard: true,
                                one_time_keyboard: false,
                                selective: true
                            }
                        );
                        await bot.deleteMessage(from.id, message.message_id);
                    } else {
                        await bot.handleZoneSelection(from.id, zone, userDoc.preferredLanguage, message.message_id);
                    }
                }
            } else if (data.startsWith('settings_')) {
                await bot.handleSettings(from.id, data, userDoc.preferredLanguage, message.message_id);
            } else if (data === 'back_to_settings') {
                await bot.sendSettings(from.id, userDoc.preferredLanguage, message.message_id);
            } else if (data === 'update_location') {
                await bot.startDistrictSelection(from.id, userDoc.preferredLanguage);
            } else if (data.startsWith('booking_district_')) {
                const district = data.split('_')[2];
                await bot.handleDistrictSelection(from.id, district, userDoc.preferredLanguage, message.message_id, true);
            } else if (data === 'start_booking') {
                await bot.startBookingFlow(from.id, userDoc.preferredLanguage);
            } else if (data === 'profile_update_location') {
                await bot.startLocationUpdate(from.id, userDoc.preferredLanguage);
            } else if (data.startsWith('profile_district_')) {
                const district = data.split('_')[2];
                await bot.handleDistrictSelection(from.id, district, userDoc.preferredLanguage, message.message_id, false);
            } else if (data.startsWith('profile_town_')) {
                const [_, __, district, town] = data.split('_');
                if (district && town) {
                    await bot.handleTownSelection(from.id, district, town, userDoc.preferredLanguage);
                }
            } else if (data.startsWith('profile_zone_')) {
                const zone = data.split('_')[2];
                if (zone) {
                    await bot.handleProfileUpdate(from.id, zone, userDoc.preferredLanguage);
                }
            } else if (data.startsWith('accept_ride_')) {
                const rideId = data.split('_')[2];
                if (rideId && userDoc.role === 'DRIVER') {
                    await bot.handleRideAcceptance(from.id, rideId, userDoc.preferredLanguage);
                    await bot.deleteMessage(from.id, message.message_id);
                    await bot.sendMessage(
                        from.id,
                        'You accepted the ride. Head to pickup location.',
                        {
                            inline_keyboard: [
                                [{ text: '✅ Picked Up Customer', callback_data: `picked_${rideId}` }],
                                [{ text: '❌ Cancel Ride', callback_data: `cancel_ride_${rideId}` }]
                            ]
                        }
                    );
                }
            } else if (data.startsWith('picked_')) {
                const rideId = data.split('_')[1];
                if (rideId && userDoc.role === 'DRIVER') {
                    await Ride.findByIdAndUpdate(rideId, { status: 'PICKED_UP' });
                    await bot.deleteMessage(from.id, message.message_id);
                    await bot.sendMessage(
                        from.id,
                        'Customer picked up. Have a safe ride!',
                        {
                            inline_keyboard: [
                                [{ text: '🏁 Complete Ride', callback_data: `complete_${rideId}` }]
                            ]
                        }
                    );
                }
            } else if (data.startsWith('complete_')) {
                const rideId = data.split('_')[1];
                if (rideId && userDoc.role === 'DRIVER') {
                    await Ride.findByIdAndUpdate(rideId, { 
                        status: 'COMPLETED',
                        completedAt: new Date()
                    });
                    await User.findOneAndUpdate(
                        { telegramId: from.id.toString() },
                        { 
                            $inc: { totalRides: 1 },
                            lastRideTime: new Date(),
                            currentRide: null
                        }
                    );
                    
                    const ride = await Ride.findById(rideId);
                    if (ride) {
                        await bot.sendMessage(
                            parseInt(ride.userId),
                            'Thank you for using Vaya! We hope you had a great ride. 🙏'
                        );
                    }
                    
                    await bot.deleteMessage(from.id, message.message_id);
                    await bot.sendMessage(
                        from.id,
                        'Ride completed! Would you like to update your zone?',
                        {
                            inline_keyboard: [
                                [{ text: '📍 Update Zone', callback_data: 'update_zone' }],
                                [{ text: '🚦 Continue in Same Zone', callback_data: 'continue_same' }]
                            ]
                        }
                    );
                }
            } else if (data === 'continue_same') {
                await bot.sendMessage(
                    from.id,
                    'You are ready for new rides in your current zone!',
                    {
                        keyboard: [
                            ['🔴 Go Offline'],
                            ['📍 Update Zone', '📊 My Stats'],
                            ['⚙️ Settings']
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: false,
                        selective: true
                    }
                );
            } else if (data === 'update_zone') {
                await bot.updateDriverZone(from.id, userDoc.preferredLanguage);
                await bot.deleteMessage(from.id, message.message_id);
            }
            
            await bot.answerCallbackQuery(id);
            return NextResponse.json({ ok: true });
        }

        return NextResponse.json({ ok: false, error: 'Invalid update' });
    } catch (error) {
        return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    return new Response('Telegram Webhook is active');
}
