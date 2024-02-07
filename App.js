import React, { useState, useEffect } from 'react';
import { NativeBaseProvider } from 'native-base';
import Routes from './src/routes';
import customTheme from './src/customTheme';
import * as Notifications from 'expo-notifications';
import { AppState } from 'react-native';

export default function App() {
    const [appHasOpened, setAppHasOpened] = useState(false);

    async function registerForPushNotificationsAsync() {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    }

    async function resetScheduledNotifications() {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('Todas as notificações agendadas foram canceladas.');
    }

    async function schedulePushNotification() {
        await resetScheduledNotifications();

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "CONNECT180",
                body: "Fala galera! Já leram os capítulos de hoje?",
            },
            trigger: { seconds: 86400, repeats: true },
        });
        console.log('Nova notificação agendada.');
        const notifications = await Notifications.getAllScheduledNotificationsAsync();
        console.log('Notificações agendadas após reset:', notifications);
    }


    useEffect(() => {
        registerForPushNotificationsAsync();

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background' && !appHasOpened) {
                schedulePushNotification();
                setAppHasOpened(true);
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <NativeBaseProvider theme={customTheme}>
            <Routes />
        </NativeBaseProvider>
    );
}
