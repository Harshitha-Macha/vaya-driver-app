import connectMongo from '../connectMongo';
import { User, IUser } from '../models/User';
import { Ride, IRide } from '../models/Ride';
import { Location } from '../models/Location';
import { LocationData, Zone, TelegramUpdate } from './types';

export class TelegramBot {
    private readonly token: string;
    private readonly apiUrl: string;

    constructor(token: string) {
        this.token = token;
        this.apiUrl = `https://api.telegram.org/bot${token}`;
    }

    async sendMessage(chatId: number, text: string, keyboard?: any) {
        const response = await fetch(`${this.apiUrl}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                reply_markup: keyboard
            })
        });
        return response.json();
    }

    async sendLanguageSelection(chatId: number) {
        const keyboard = {
            inline_keyboard: [
                [{ text: 'English', callback_data: 'en' }],
                [{ text: 'हिंदी', callback_data: 'hi' }],
                [{ text: 'తెలుగు', callback_data: 'te' }]
            ]
        };
        return this.sendMessage(chatId, 'Select Language:', keyboard);
    }

    async handleRegistration(chatId: number, langCode: string): Promise<IUser> {
        try {
            await connectMongo();
            const user = await User.create({
                telegramId: chatId.toString(),
                preferredLanguage: langCode,
                role: 'USER'
            });
            await this.sendMessage(chatId, this.getWelcomeMessage(langCode));
            return user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async answerCallbackQuery(callbackQueryId: string, text?: string) {
        const response = await fetch(`${this.apiUrl}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                callback_query_id: callbackQueryId,
                text
            })
        });
        return response.json();
    }

    async handleMessage(chatId: number, text: string, language: string) {
        const command = text.split(' ')[0];

        const commands: Record<string, () => Promise<any>> = {
            '/help': () => this.sendHelp(chatId, language),
            '/settings': () => this.sendSettings(chatId, language),
            '/book': () => this.startDistrictSelection(chatId, language),
            '/status': () => this.toggleDriverStatus(chatId, language),
            '/zone': () => this.updateDriverZone(chatId, language)
        };

        if (command in commands) {
            return commands[command]();
        }

        return this.sendDefaultResponse(chatId, language);
    }

    private async sendHelp(chatId: number, language: string) {
        const messages = {
            en: 'Available commands:\n/book - Book a ride\n/settings - Settings\n/help - Show this message',
            hi: 'उपलब्ध कमांड:\n/book - राइड बुक करें\n/settings - सेटिंग्स\n/help - यह संदेश',
            te: 'అందుబాటులో ఉన్న ఆదేశాలు:\n/book - రైడ్ బుక్\n/settings - సెట్టింగ్స్\n/help - సహాయం'
        };
        return this.sendMessage(chatId, messages[language as keyof typeof messages]);
    }

    private async startDistrictSelection(chatId: number, language: string) {
        const districts = await Location.distinct('district');
        const keyboard = {
            inline_keyboard: districts.map(district => [{
                text: district,
                callback_data: `district_${district}`
            }])
        };
        
        const messages = {
            en: 'Select your district:',
            hi: 'अपना जिला चुनें:',
            te: 'మీ జిల్లాను ఎంచుకోండి:'
        };
        
        return this.sendMessage(chatId, messages[language as keyof typeof messages], keyboard);
    }

    async handleDistrictSelection(chatId: number, district: string, language: string): Promise<any> {
        try {
            const towns = await Location.distinct('town', { district });
            if (!towns.length) {
                return this.sendMessage(chatId, 'No towns found in this district');
            }

            const keyboard = {
                inline_keyboard: towns.map(town => [{
                    text: town,
                    callback_data: `town_${district}_${town}`
                }])
            };
            
            const messages = {
                en: 'Select your town/village:',
                hi: 'अपना गांव/शहर चुनें:',
                te: 'మీ గ్రామం/పట్టణాన్ని ఎంచుకోండి:'
            };
            
            return this.sendMessage(
                chatId, 
                messages[language as keyof typeof messages] || messages.en,
                keyboard
            );
        } catch (error) {
            console.error('District selection error:', error);
            throw error;
        }
    }

    async handleTownSelection(chatId: number, district: string, town: string, language: string): Promise<any> {
        try {
            const location = await Location.findOne<LocationData>({ district, town });
            if (!location?.zones?.length) {
                return this.sendMessage(chatId, 'No zones found in this town');
            }

            const keyboard = {
                inline_keyboard: location.zones.map(zone => [{
                    text: zone,
                    callback_data: `zone_${zone}`
                }])
            };
            
            const messages = {
                en: 'Select your zone:',
                hi: 'अपना ज़ोन चुनें:',
                te: 'మీ జోన్ ఎంచుకోండి:'
            };

            await User.findOneAndUpdate(
                { telegramId: chatId.toString() },
                { district, town },
                { new: true }
            );
            
            return this.sendMessage(
                chatId, 
                messages[language as keyof typeof messages] || messages.en,
                keyboard
            );
        } catch (error) {
            console.error('Town selection error:', error);
            throw error;
        }
    }

    async handleZoneSelection(chatId: number, zone: string, language: string): Promise<any> {
        const messages = {
            en: 'Please enter your pickup point details:',
            hi: 'कृपया अपने पिकअप पॉइंट का विवरण दर्ज करें:',
            te: 'దయచేసి మీ పికప్ పాయింట్ వివరాలను నమోదు చేయండి:'
        };
        
        return this.sendMessage(chatId, messages[language as keyof typeof messages]);
    }

    private async startBooking(chatId: number, language: string) {
        const keyboard = {
            keyboard: [[{ text: '📍 Share Location', request_location: true }]],
            resize_keyboard: true,
            one_time_keyboard: true
        };
        return this.sendMessage(chatId, 'Please share your location', keyboard);
    }

    private getWelcomeMessage(language: string): string {
        const messages = {
            en: 'Welcome! You have been successfully registered.',
            hi: 'स्वागत है! आपका पंजीकरण सफल रहा।',
            te: 'స్వాగతం! మీరు విజయవంతంగా నమోదు చేయబడ్డారు.'
        };
        return messages[language as keyof typeof messages] || messages.en;
    }

    private async sendDefaultResponse(chatId: number, language: string) {
        const messages = {
            en: "I don't understand that command. Type /help for available commands.",
            hi: "मैं इस कमांड को नहीं समझता। उपलब्ध कमांड के लिए /help टाइप करें।",
            te: "ఈ ఆదేశం అర్థం కాలేదు. అందుబాటులో ఉన్న ఆదేశాల కోసం /help టైప్ చేయండి."
        };
        return this.sendMessage(chatId, messages[language as keyof typeof messages] || messages.en);
    }

    private async sendSettings(chatId: number, language: string) {
        const keyboard = {
            inline_keyboard: [
                [{ text: 'Change Language 🌐', callback_data: 'settings_language' }],
                [{ text: 'Notifications 🔔', callback_data: 'settings_notifications' }],
                [{ text: 'Profile 👤', callback_data: 'settings_profile' }]
            ]
        };

        const messages = {
            en: 'Settings:\nChoose what you want to change:',
            hi: 'सेटिंग्स:\nचुनें कि आप क्या बदलना चाहते हैं:',
            te: 'సెట్టింగ్స్:\nమీరు ఏమి మార్చాలనుకుంటున్నారో ఎంచుకోండి:'
        };

        return this.sendMessage(
            chatId, 
            messages[language as keyof typeof messages] || messages.en,
            keyboard
        );
    }

    async handleLocation(chatId: number, location: { latitude: number; longitude: number }, language: string) {
        try {
            const ride = await Ride.create({
                userId: chatId.toString(),
                pickupLocation: {
                    type: 'Point',
                    coordinates: [location.longitude, location.latitude]
                },
                status: 'REQUESTED'
            });

            const messages = {
                en: 'Searching for drivers nearby...',
                hi: 'आस-पास के ड्राइवरों की खोज कर रहे हैं...',
                te: 'సమీపంలోని డ్రైవర్లను శోధిస్తోంది...'
            };

            await this.sendMessage(chatId, messages[language as keyof typeof messages]);
            await this.notifyNearbyDrivers(ride);
            return ride;
        } catch (error) {
            console.error('Ride request error:', error);
            throw error;
        }
    }

    private async notifyNearbyDrivers(ride: IRide) {
        const nearbyDrivers = await User.find({
            role: 'DRIVER',
            location: {
                $near: {
                    $geometry: ride.pickupLocation,
                    $maxDistance: 5000 // 5km radius
                }
            }
        });

        const keyboard = {
            inline_keyboard: [[
                { text: '✅ Accept Ride', callback_data: `accept_ride_${ride._id}` }
            ]]
        };

        for (const driver of nearbyDrivers) {
            await this.sendMessage(
                parseInt(driver.telegramId),
                `New ride request!\nDistance: ${this.calculateDistance(ride.pickupLocation)} km`,
                keyboard
            );
        }
    }

    async handleRideAcceptance(driverId: string, rideId: string, language: string) {
        const ride = await Ride.findByIdAndUpdate(rideId, {
            driverId,
            status: 'ACCEPTED',
            acceptTime: new Date()
        }, { new: true });

        if (!ride) return;

        const messages = {
            en: 'Driver is on the way!',
            hi: 'ड्राइवर रास्ते में है!',
            te: 'డ్రైవర్ దారిలో ఉన్నారు!'
        };

        await this.sendMessage(
            parseInt(ride.userId),
            messages[language as keyof typeof messages]
        );
    }

    private async toggleDriverStatus(chatId: number, language: string) {
        const driver = await User.findOne({ telegramId: chatId.toString(), role: 'DRIVER' });
        if (!driver) return;

        driver.isOnline = !driver.isOnline;
        await driver.save();

        const messages = {
            en: `You are now ${driver.isOnline ? 'online' : 'offline'}`,
            hi: `आप अब ${driver.isOnline ? 'ऑनलाइन' : 'ऑफलाइन'} हैं`,
            te: `మీరు ఇప్పుడు ${driver.isOnline ? 'ఆన్‌లైన్‌లో' : 'ఆఫ్‌లైన్‌లో'} ఉన్నారు`
        };

        return this.sendMessage(chatId, messages[language as keyof typeof messages]);
    }

    private async updateDriverZone(chatId: number, language: string): Promise<any> {
        const driver = await User.findOne({ telegramId: chatId.toString(), role: 'DRIVER' });
        if (!driver?.district || !driver?.town) return;

        const location = await Location.findOne<LocationData>({ 
            district: driver.district, 
            town: driver.town 
        });
        
        if (!location?.zones.length) return;

        const keyboard = {
            inline_keyboard: location.zones.map((zoneName: string) => [{
                text: zoneName,
                callback_data: `update_zone_${zoneName}`
            }])
        };

        const messages = {
            en: 'Select your current zone:',
            hi: 'अपना वर्तमान ज़ोन चुनें:',
            te: 'మీ ప్రస్తుత జోన్‌ను ఎంచుకోండి:'
        };

        return this.sendMessage(chatId, messages[language as keyof typeof messages], keyboard);
    }

    private calculateDistance(location: { coordinates: [number, number] }): number {
        // Haversine formula implementation
        // ...implementation details...
        return 0; // Placeholder
    }
}
