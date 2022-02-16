import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

import { getRandomWord } from '../utils/getRandomWord';
import { getDailyWord } from '../utils/getDailyWord';
import { BACKGROUND, FONT, KEYBOARD, TEXT } from '../utils/constants';

import Logo from '../assets/logo.png';

const MenuPage = ({ navigation }: { navigation: any }) => {
    const MenuButton = ({
        navigate,
        text,
        gridLength,
        daily
    }: {
        navigate: string;
        text: string;
        gridLength?: number;
        daily?: boolean;
    }) => {
        return (
            <Pressable
                style={styles.buttonStyle}
                onPress={() => {
                    navigation.navigate(navigate, {
                        gridLength: gridLength,
                        gridWidth: 5,
                        currentWord: daily ? getDailyWord() : getRandomWord()
                    });
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
            >
                <Text style={styles.textStyle}>{text}</Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <Image source={Logo} style={styles.imageStyle} />
            <MenuButton
                navigate="Daily"
                text="Daglig oppgave"
                gridLength={6}
                daily={true}
            />
            <MenuButton navigate="Standard" text="Standard" gridLength={6} />
            <MenuButton navigate="Standard" text="Utfordring" gridLength={4} />
            <MenuButton navigate="Help" text="Hjelp" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND,
        alignItems: 'center',
        paddingTop: 40
    },
    imageStyle: {
        height: 300,
        width: 300,
        borderRadius: 4
    },
    buttonStyle: {
        width: '70%',
        backgroundColor: KEYBOARD,
        borderRadius: 4,
        marginBottom: 40
    },
    textStyle: {
        fontSize: 24,
        textAlign: 'center',
        paddingVertical: 10,
        color: TEXT,
        fontFamily: FONT
    }
});

export default MenuPage;
