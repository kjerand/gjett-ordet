import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setTheme } from './store/theme';

import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFonts } from 'expo-font';

import { BACKGROUND, FONT, TEXT } from './utils/constants';
import { getCurrentDate } from './utils/getCurrentDate';

import GamePage from './views/GamePage';
import MenuPage from './views/MenuPage';
import TutorialPage from './views/TutorialPage';

const Stack = createNativeStackNavigator();

export default function Screens() {
    const dispatch = useDispatch();
    const { theme } = useSelector((state: RootStateOrAny) => state.theme);

    useEffect(() => {
        AsyncStorage.getItem('@theme').then((data) => {
            if (data) dispatch(setTheme(data));
        });
    }, []);

    const [loaded] = useFonts({
        Oswald: require('./assets/fonts/Oswald-Light.ttf')
    });

    if (!loaded) {
        return <View style={{ backgroundColor: BACKGROUND[theme], flex: 1 }} />;
    }
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: BACKGROUND[theme]
                    },
                    headerTintColor: TEXT,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontFamily: FONT,
                        fontSize: 22
                    },
                    headerBackTitleVisible: false,
                    gestureEnabled: false,
                    animation: 'slide_from_bottom'
                }}
            >
                <Stack.Screen
                    name="Menu"
                    options={{
                        headerShown: false
                    }}
                    component={MenuPage}
                />
                <Stack.Screen
                    name="Daily"
                    component={GamePage}
                    options={({ navigation }) => ({
                        headerTitle: getCurrentDate(),
                        headerLeft: () => (
                            <Feather
                                name="home"
                                size={26}
                                color={TEXT}
                                onPress={() => {
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Medium
                                    );
                                    navigation.navigate('Menu');
                                }}
                            />
                        )
                    })}
                />
                <Stack.Screen
                    name="Standard"
                    component={GamePage}
                    options={({ navigation }) => ({
                        headerTitle: 'Gjett ordet!',
                        headerLeft: () => (
                            <Feather
                                name="home"
                                size={24}
                                color={TEXT}
                                onPress={() => {
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Medium
                                    );
                                    navigation.navigate('Menu');
                                }}
                            />
                        )
                    })}
                />
                <Stack.Screen
                    name="Help"
                    component={TutorialPage}
                    options={({ navigation }) => ({
                        headerTitle: '',
                        headerLeft: () => (
                            <Feather
                                name="home"
                                size={24}
                                color={TEXT}
                                onPress={() => {
                                    Haptics.impactAsync(
                                        Haptics.ImpactFeedbackStyle.Medium
                                    );
                                    navigation.navigate('Menu');
                                }}
                            />
                        )
                    })}
                />
            </Stack.Navigator>
            <StatusBar hidden />
        </NavigationContainer>
    );
}