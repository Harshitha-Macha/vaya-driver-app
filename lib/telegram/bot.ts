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
        if (!response.ok) {
            console.error('Error sending message:', await response.text());
            throw new Error('Failed to send message');
        }
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

            const messages = {
                en: 'Welcome to Vaya! You have been successfully registered.',
                hi: 'वाया में आपका स्वागत है! आपका पंजीकरण सफल रहा है।',
                te: 'వాయాకి స్వాగతం! మీరు విజయవంతంగా నమోదు చేయబడ్డారు.'
            };

            await this.sendMessage(chatId, messages[langCode as keyof typeof messages]);
            await this.sendWelcomeBack(chatId, langCode);
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
        const user = await User.findOne({ telegramId: chatId.toString() });
        if (!user) return;

        const textToCommandMap: Record<string, string> = {
            '🚗 Book Ride': '/book',
            '⚙️ Settings': '/settings',
            '❓ Help': '/help',
            '🚦 Go Online': '/status',
            '🔴 Go Offline': '/status',
            '📍 Update Zone': '/zone',
            '📊 My Stats': '/stats'
        };

        const command = text.startsWith('/') ? text.split(' ')[0] : text;
        
        const actualCommand = textToCommandMap[command] || command;
        
        if (actualCommand === '/cancel') {
            if (user.awaitingPickupAddress) {
                await User.findOneAndUpdate(
                    { telegramId: chatId.toString() },
                    { awaitingPickupAddress: false }
                );
                const messages = {
                    en: 'Booking cancelled. What would you like to do?',
                    hi: 'बुकिंग रद्द कर दी गई। आप क्या करना चाहेंगे?',
                    te: 'బుకింగ్ రద్దు చేయబడింది. మీరు ఏమి చేయాలనుకుంటున్నారు?'
                };
                return this.sendMessage(chatId, messages[language as keyof typeof messages]);
            }
            return this.sendDefaultResponse(chatId, language);
        }


        if (user.awaitingPickupAddress) {
            if (actualCommand.startsWith('/')) {
                const messages = {
                    en: 'Please enter your pickup address or use /cancel to cancel booking',
                    hi: 'कृपया अपना पिकअप पता दर्ज करें या बुकिंग रद्द करने के लिए /cancel का उपयोग करें',
                    te: 'దయచేసి మీ పికప్ చిరునామాను నమోదు చేయండి లేదా బుకింగ్ రద్దు చేయడానికి /cancel ఉపయోగించండి'
                };
                return this.sendMessage(chatId, messages[language as keyof typeof messages]);
            }
            return this.handlePickupAddress(chatId, text, language);
        }

        const commands: Record<string, () => Promise<any>> = {
            '/help': () => this.sendHelp(chatId, language),
            '/settings': () => this.sendSettings(chatId, language),
            '/book': () => this.startBookingFlow(chatId, language),
            '/status': () => this.toggleDriverStatus(chatId, language),
            '/zone': () => this.updateDriverZone(chatId, language),
            '/stats': () => this.showDriverStats(chatId, language)
        };

        if (actualCommand in commands) {
            return commands[actualCommand]();
        }

        return this.sendDefaultResponse(chatId, language);
    }

    async sendWelcomeBack(chatId: number, language: string) {
        const user = await User.findOne({ telegramId: chatId.toString() });
        if (!user) return;

        const messages = {
            en: user.role === 'DRIVER' ? 
                'Welcome back driver! What would you like to do?' :
                'Welcome back! What would you like to do?',
            hi: user.role === 'DRIVER' ? 
                'वापस स्वागत है ड्राइवर! आप क्या करना चाहेंगे?' :
                'वापस स्वागत है! आप क्या करना चाहेंगे?',
            te: user.role === 'DRIVER' ? 
                'తిరిగి స్వాగతం డ్రైవర్! మీరు ఏమి చేయాలనుకుంటున్నారు?' :
                'తిరిగి స్వాగతం! మీరు ఏమి చేయాలనుకుంటున్నారు?'
        };

        const keyboard = user.role === 'DRIVER' ? {
            keyboard: [
                ['🚦 Go Online', '🔴 Go Offline'],
                ['📍 Update Zone', '📊 My Stats'],
                ['⚙️ Settings']
            ],
            resize_keyboard: true,
            one_time_keyboard: false,
            selective: true
        } : {
            keyboard: [
                ['🚗 Book Ride', '⚙️ Settings'],
                ['❓ Help']
            ],
            resize_keyboard: true,
            one_time_keyboard: false,
            selective: true
        };

        return this.sendMessage(chatId, messages[language as keyof typeof messages], keyboard);
    }

    private async sendHelp(chatId: number, language: string) {
        const messages = {
            en: 'Available commands:\n/book - Book a ride\n/settings - Settings\n/help - Show this message',
            hi: 'उपलब्ध कमांड:\n/book - राइड बुक करें\n/settings - सेटिंग्स\n/help - यह संदेश',
            te: 'అందుబాటులో ఉన్న ఆదేశాలు:\n/book - రైడ్ బుక్\n/settings - సెట్టింగ్స్\n/help - సహాయం'
        };

        const keyboard = {
            keyboard: [
                ['🚗 Book Ride'],
                ['⚙️ Settings', '❓ Help']
            ],
            resize_keyboard: true,
            one_time_keyboard: false,
            selective: true
        };

        return this.sendMessage(chatId, messages[language as keyof typeof messages], keyboard);
    }

    public async startBookingFlow(chatId: number, language: string) {
        const user = await User.findOne({ telegramId: chatId.toString() });
        console.log(user, chatId, language);
        if (!user?.district) {
            return this.startDistrictSelection(chatId, language, true);
        }
        if(!user?.town) {
            return this.startDistrictSelection(chatId, language, true);
        }
        return this.startZoneSelection(chatId, language);
    }

    public async startLocationUpdate(chatId: number, language: string) {
        return this.startDistrictSelection(chatId, language, false);
    }

    public async startDistrictSelection(chatId: number, language: string, isBooking = false) {
        const locations = await Location.find({}).distinct('district');
        const keyboard = {
            inline_keyboard: locations.map(district => [{
                text: district,
                callback_data: `${isBooking ? 'booking_' : ''}district_${district}`
            }])
        };
        return this.sendMessage(chatId, 'Select district:', keyboard);
    }

    private async startZoneSelection(chatId: number, language: string): Promise<any> {
        const user = await User.findOne({ telegramId: chatId.toString() });
        if (!user?.district || !user?.town) return;

        const location = await Location.findOne<LocationData>({ 
            district: user.district, 
            town: user.town 
        });
        
        if (!location?.zones.length) return;

        const keyboard = {
            inline_keyboard: location.zones.map(zone => [{
                text: zone,
                callback_data: `zone_${zone}`
            }])
        };

        return this.sendMessage(
            chatId, 
            `District: ${user.district}\nTown: ${user.town}\nSelect zone for pickup:`, 
            keyboard
        );
    }

    async handleDistrictSelection(chatId: number, district: string, language: string, messageId?: number, isBooking = false): Promise<any> {
        try {
            const towns = await Location.find({ district }).distinct('town');
            await User.findOneAndUpdate(
                { telegramId: chatId.toString() },
                { district },
                { new: true }
            );
            
            const keyboard = {
                inline_keyboard: towns.map(town => [{
                    text: town,
                    callback_data: `town_${district}_${town}`
                }])
            };
            
            const messages = {
                en: `Selected District: ${district}\nNow select your town:`,
                hi: `चयनित जिला: ${district}\nअब अपना शहर चुनें:`,
                te: `ఎంచుకున్న జిల్లా: ${district}\nఇప్పుడు మీ పట్టణాన్ని ఎంచుకోండి:`
            };
            
            if (messageId) {
                return this.editMessage(
                    chatId,
                    messageId,
                    messages[language as keyof typeof messages],
                    keyboard
                );
            }
            return this.sendMessage(
                chatId, 
                messages[language as keyof typeof messages],
                keyboard
            );
        } catch (error) {
            console.error('District selection error:', error);
            throw error;
        }
    }

    async handleTownSelection(chatId: number, district: string, town: string, language: string, messageId?: number): Promise<any> {
        try {
            const user = await User.findOneAndUpdate(
                { telegramId: chatId.toString() },
                { town },
                { new: true }
            );

            if (!user) return;

            const messages = {
                en: `District set to: ${district}\nTown set to: ${town}`,
                hi: `जिला सेट किया गया: ${district}\nशहर सेट किया गया: ${town}`,
                te: `జిల్లా సెట్ చేయబడింది: ${district}\nటౌన్ సెట్ చేయబడింది: ${town}`
            };

            const keyboard = user.role === 'DRIVER' ? {
                inline_keyboard: [
                    [{ text: '📍 Update Zone', callback_data: 'update_zone' }],
                    [{ text: '⚙️ Settings', callback_data: 'open_settings' }]
                ]
            } : {
                inline_keyboard: [
                    [{ text: '🚗 Book Now', callback_data: 'start_booking' }],
                    [{ text: '⚙️ Settings', callback_data: 'open_settings' }]
                ]
            };

            if (messageId) {
                return this.editMessage(chatId, messageId, messages[language as keyof typeof messages], keyboard);
            }

            return this.sendMessage(chatId, messages[language as keyof typeof messages], keyboard);
        } catch (error) {
            throw error;
        }
    }

    async handleZoneSelection(chatId: number, zone: string, language: string, messageId?: number): Promise<any> {
        const messages = {
            en: `Zone set to: ${zone}\n\nPlease enter your pickup address:`,
            hi: `ज़ोन सेट किया गया: ${zone}\n\nकृपया अपना पिकअप पता दर्ज करें:`,
            te: `జోన్ సెట్ చేయబడింది: ${zone}\n\nదయచేసి మీ పికప్ చిరునామాను నమోదు చేయండి:`
        };

        const keyboard = {
            reply_markup: {
                force_reply: true,
                input_field_placeholder: 'Enter pickup address...',
                selective: true
            }
        };

        await User.findOneAndUpdate(
            { telegramId: chatId.toString() },
            { awaitingPickupAddress: true, currentZone: zone },
            { new: true }
        );
        
        return messageId ? 
            this.editMessage(chatId, messageId, messages[language as keyof typeof messages], keyboard) :
            this.sendMessage(chatId, messages[language as keyof typeof messages], keyboard);
    }

    async handlePickupAddress(chatId: number, address: string, language: string) {
        try {
            const user = await User.findOne({ telegramId: chatId.toString() });
            if (!user?.district || !user?.town || !user?.currentZone) {
                return this.sendMessage(chatId, 'Please select your zone first');
            }

            const ride = await Ride.create({
                userId: chatId.toString(),
                district: user.district,
                town: user.town,
                zone: user.currentZone,
                pickupAddress: address,
                status: 'REQUESTED'
            });

            await User.findOneAndUpdate(
                { telegramId: chatId.toString() },
                { awaitingPickupAddress: false }
            );

            const messages = {
                en: 'Searching for drivers in your zone...',
                hi: 'आपके ज़ोन में ड्राइवरों की खोज कर रहे हैं...',
                te: 'మీ జోన్‌లో డ్రైవర్లను వెతుకుతున్నాము...'
            };

            const keyboard = {
                inline_keyboard: [
                    [{ text: '❌ Cancel Booking', callback_data: 'cancel_booking' }]
                ]
            };

            await this.sendMessage(chatId, messages[language as keyof typeof messages], keyboard);
            await this.notifyNearbyDrivers(ride);
            return ride;
        } catch (error) {
            console.error('Ride request error:', error);
            throw error;
        }
    }

    private async notifyNearbyDrivers(ride: IRide) {
        console.log('Notifying drivers for ride:', ride);
        const availableDrivers = await User.find({
            role: 'DRIVER',
            // district: ride.district,
            // town: ride.town,
            // zone: ride.zone,
            // isOnline: true,
        });

        console.log('Available drivers:', availableDrivers);

        if (!availableDrivers.length) {
            const busyDrivers = await User.find({
                role: 'DRIVER',
                district: ride.district,
                town: ride.town,
                zone: ride.zone,
                isOnline: true
            }).limit(3);
            console.log('Busy drivers:', busyDrivers);

            if (busyDrivers.length) {
                await this.sendMessage(
                    parseInt(ride.userId),
                    'All drivers are currently busy. Please wait or try again in a few minutes.'
                );
                for (const driver of busyDrivers) {
                    await this.sendMessage(
                        parseInt(driver.telegramId),
                        `New pending ride in your zone: ${ride.pickupAddress}`
                    );
                }
                return;
            }

            await this.sendMessage(
                parseInt(ride.userId),
                'No drivers available in your zone currently. Please try again later.'
            );
            return;
        }

        const keyboard = {
            inline_keyboard: [[
                { text: '✅ Accept Ride', callback_data: `accept_ride_${ride._id}` }
            ]]
        };

        for (const driver of availableDrivers) {
            await this.sendMessage(
                parseInt(driver.telegramId),
                `New ride request in your zone!\nPickup: ${ride.pickupAddress}`,
                keyboard
            );
        }
    }

    async handleRideAcceptance(driverId: number | string, rideId: string, language: string) {
        const ride = await Ride.findByIdAndUpdate(rideId, {
            driverId: driverId.toString(),
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

    private async showDriverStats(chatId: number, language: string) {
        const driver = await User.findOne({ telegramId: chatId.toString(), role: 'DRIVER' });
        if (!driver) return;

        const completedRides = await Ride.countDocuments({ 
            driverId: chatId.toString(),
            status: 'COMPLETED'
        });

        const messages = {
            en: `📊 Your Stats:\nRating: ⭐${driver.rating?.toFixed(1) || 5.0}\nTotal Rides: ${completedRides}\nStatus: ${driver.isOnline ? '🟢 Online' : '🔴 Offline'}\nCurrent Zone: ${driver.currentZone || 'Not set'}`,
            hi: `📊 आपका प्रदर्शन:\nरेटिंग: ⭐${driver.rating?.toFixed(1) || 5.0}\nकुल सवारियां: ${completedRides}\nस्थिति: ${driver.isOnline ? '🟢 ऑनलाइन' : '🔴 ऑफलाइन'}\nवर्तमान क्षेत्र: ${driver.currentZone || 'Not set'}`,
            te: `📊 మీ స్థితి:\nరేటింగ్: ⭐${driver.rating?.toFixed(1) || 5.0}\nమొత్తం రైడ్లు: ${completedRides}\nస్థితి: ${driver.isOnline ? '🟢 ఆన్‌లైన్' : '🔴 ఆఫ్‌లైన్'}\nప్రస్తుత జోన్: ${driver.currentZone || 'Not set'}`
        };

        return this.sendMessage(chatId, messages[language as keyof typeof messages]);
    }

    private async toggleDriverStatus(chatId: number, language: string) {
        const driver = await User.findOne({ telegramId: chatId.toString(), role: 'DRIVER' });
        if (!driver) return;

        driver.isOnline = !driver.isOnline;
        await driver.save();

        const messages = {
            en: `You are now ${driver.isOnline ? '🟢 Online' : '🔴 Offline'}`,
            hi: `आप अब ${driver.isOnline ? '🟢 ऑनलाइन' : '🔴 ऑफलाइन'} हैं`,
            te: `మీరు ఇప్పుడు ${driver.isOnline ? '🟢 ఆన్‌లైన్' : '🔴 ఆఫ్‌లైన్'} లో ఉన్నారు`
        };

        const keyboard = {
            keyboard: [
                [driver.isOnline ? '🔴 Go Offline' : '🚦 Go Online'],
                ['📍 Update Zone', '📊 My Stats'],
                ['⚙️ Settings']
            ],
            resize_keyboard: true,
            one_time_keyboard: false,
            selective: true
        };

        return this.sendMessage(chatId, messages[language as keyof typeof messages], keyboard);
    }

    public async updateDriverZone(chatId: number, language: string): Promise<any> {
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

    public async handleLanguageSettings(chatId: number, language: string, messageId?: number) {
        const keyboard = {
            inline_keyboard: [
                [{ text: 'English 🇬🇧', callback_data: 'lang_en' }],
                [{ text: 'हिंदी 🇮🇳', callback_data: 'lang_hi' }],
                [{ text: 'తెలుగు 🇮🇳', callback_data: 'lang_te' }],
                [{ text: '◀️ Back', callback_data: 'back_to_settings' }]
            ]
        };

        const messages = {
            en: 'Choose your language:',
            hi: 'अपनी भाषा चुनें:',
            te: 'మీ భాషను ఎంచుకోండి:'
        };

        const text = messages[language as keyof typeof messages];
        return messageId ? 
            this.editMessage(chatId, messageId, text, keyboard) :
            this.sendMessage(chatId, text, keyboard);
    }

    public async handleProfileSettings(chatId: number, language: string, messageId?: number) {
        const user = await User.findOne({ telegramId: chatId.toString() });
        if (!user) return;

        const messages = {
            en: `Profile:\nLanguage: ${language}\nDistrict: ${user.district || 'Not set'}\nTown: ${user.town || 'Not set'}\nZone: ${user.currentZone || 'Not set'}`,
            hi: `प्रोफ़ाइल:\nभाषा: ${language}\nजिला: ${user.district || 'Not set'}\nशहर: ${user.town || 'Not set'}\nक्षेत्र: ${user.currentZone || 'Not set'}`,
            te: `ప్రొఫైల్:\nభాష: ${language}\nజిల్లా: ${user.district || 'Not set'}\nటౌన్: ${user.town || 'Not set'}\nజోన్: ${user.currentZone || 'Not set'}`
        };

        const keyboard = {
            inline_keyboard: [
                [{ text: '🔄 Update Location', callback_data: 'profile_update_location' }],
                [{ text: '◀️ Back', callback_data: 'back_to_settings' }]
            ]
        };

        const text = messages[language as keyof typeof messages];
        return messageId ? 
            this.editMessage(chatId, messageId, text, keyboard) :
            this.sendMessage(chatId, text, keyboard);
    }

    public async handleNotificationSettings(chatId: number, language: string, messageId?: number) {
        const keyboard = {
            inline_keyboard: [
                [{ text: '🔔 All', callback_data: 'notif_all' }],
                [{ text: '🔕 Important Only', callback_data: 'notif_important' }],
                [{ text: '🚫 None', callback_data: 'notif_none' }],
                [{ text: '◀️ Back', callback_data: 'back_to_settings' }]
            ]
        };

        const messages = {
            en: 'Choose notification settings:',
            hi: 'सूचना सेटिंग्स चुनें:',
            te: 'నోటిఫికేషన్ సెట్టింగ్స్ ఎంచుకోండి:'
        };

        const text = messages[language as keyof typeof messages];
        return messageId ? 
            this.editMessage(chatId, messageId, text, keyboard) :
            this.sendMessage(chatId, text, keyboard);
    }

    public async handleLanguageUpdate(chatId: number, messageId: number, langCode: string) {
        const messages = {
            en: '🌐 Language set to English',
            hi: '🌐 भाषा हिंदी में सेट की गई',
            te: '🌐 భాష తెలుగుకి మార్చబడింది'
        };

        await User.findOneAndUpdate(
            { telegramId: chatId.toString() },
            { preferredLanguage: langCode }
        );

        return this.editMessage(
            chatId, 
            messageId, 
            messages[langCode as keyof typeof messages]
        );
    }

    public async editMessage(chatId: number, messageId: number, text: string, keyboard?: any) {
        const payload: any = {
            chat_id: chatId,
            message_id: messageId,
            text,
            parse_mode: 'HTML'
        };

        if (keyboard) {
            payload.reply_markup = keyboard;
        }

        const response = await fetch(`${this.apiUrl}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const resultText = await response.text();

        if (!response.ok) {
            console.error('Error editing message:', resultText);
            throw new Error(`Failed to edit message: ${resultText}`);
        }

        const result = JSON.parse(resultText);
        console.log('Edited message:', result);
        return result;
    }

    public async handleProfileUpdate(chatId: number, zone: string, language: string) {
        try {
            await User.findOneAndUpdate(
                { telegramId: chatId.toString() },
                { currentZone: zone },
                { new: true }
            );

            const messages = {
                en: '✅ Your location has been updated successfully!',
                hi: '✅ आपका स्थान सफलतापूर्वक अपडेट कर दिया गया है!',
                te: '✅ మీ స్థానం విజయవంతంగా నవీకరించబడింది!'
            };

            return this.sendMessage(chatId, messages[language as keyof typeof messages]);
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    }

    public async sendSettings(chatId: number, language: string, messageId?: number) {
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

        const text = messages[language as keyof typeof messages];
        return messageId ? 
            this.editMessage(chatId, messageId, text, keyboard) :
            this.sendMessage(chatId, text, keyboard);
    }

    private getWelcomeMessage(language: string): string {
        const messages = {
            en: 'Welcome! You have been successfully registered. Please select your district.',
            hi: 'स्वागत है! आपका पंजीकरण सफल रहा। कृपया अपना जिला चुनें।',
            te: 'స్వాగతం! మీరు విజయవంతంగా నమోదు చేయబడ్డారు. దయచేసి మీ జిల్లాను ఎంచుకోండి.'
        };
        return messages[language as keyof typeof messages] || messages.en;
    }

    private async sendDefaultResponse(chatId: number, language: string) {
        const user = await User.findOne({ telegramId: chatId.toString() });
        if (!user) return;

        const messages = {
            en: "I don't understand that command. Use the menu buttons below.",
            hi: "मैं इस कमांड को नहीं समझता। नीचे दिए मेनू बटन का उपयोग करें।",
            te: "ఈ ఆదేశం అర్థం కాలేదు. దిగువన ఉన్న మెనూ బటన్లను ఉపయోగించండి."
        };
        
        const keyboard = user.role === 'DRIVER' ? {
            keyboard: [
                ['🚦 Go Online', '🔴 Go Offline'],
                ['📍 Update Zone', '📊 My Stats'],
                ['⚙️ Settings']
            ],
            resize_keyboard: true,
            one_time_keyboard: false,
            selective: true
        } : {
            keyboard: [
                ['🚗 Book Ride', '⚙️ Settings'],
                ['❓ Help']
            ],
            resize_keyboard: true,
            one_time_keyboard: false,
            selective: true
        };

        return this.sendMessage(chatId, messages[language as keyof typeof messages], keyboard);
    }

    public async handleSettings(chatId: number, setting: string, language: string, messageId?: number) {
        const actions: Record<string, () => Promise<any>> = {
            'settings_language': () => this.handleLanguageSettings(chatId, language, messageId),
            'settings_profile': () => this.handleProfileSettings(chatId, language, messageId),
            'settings_notifications': () => this.handleNotificationSettings(chatId, language, messageId)
        };

        const action = setting.split('_')[1]; 
        return actions[`settings_${action}`]?.() || this.sendDefaultResponse(chatId, language);
    }

    public async deleteMessage(chatId: number, messageId?: number) {
        if (!messageId) return;
        
        const response = await fetch(`${this.apiUrl}/deleteMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId
            })
        });
        return response.json();
    }
}
