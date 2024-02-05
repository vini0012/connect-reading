import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import Home from './home/home';
import Chapters from './chapters/chapters';
import customTheme from "./customTheme";
import { Platform } from "react-native";

const Stack = createStackNavigator();

export default function Routes() {
    const navigationTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: customTheme.colors.black,
            card: customTheme.colors.black,
            text: customTheme.colors.white,
        },
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: customTheme.colors.black,
                    },
                    headerTintColor: customTheme.colors.white,
                    cardStyle: {
                        backgroundColor: customTheme.colors.black,
                    },
                    headerTitleStyle: {
                        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
                        fontSize: 18,
                    }
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ title: 'CONNECT180' }}
                />
                <Stack.Screen
                    name="Chapters"
                    component={Chapters}
                    options={{
                        title: 'CONNECT180',
                        headerTitleStyle: {
                            fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
                            fontSize: 18,
                            marginLeft: -20,
                        }
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
