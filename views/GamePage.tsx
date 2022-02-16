import { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import LetterContainer from '../components/LetterContainer';
import KeyboardContainer from '../components/KeyboardContainer';
import InformationPopup from '../components/InformationPopup';

import { generateGrid } from '../utils/generateGrid';
import { checkWordValidity } from '../utils/checkWordValidity';
import { initializeKeyboard } from '../utils/initializeKeyboard';
import { updateColors } from '../utils/updateColors';

import {
    BACKGROUND,
    DARKGRAY,
    LIGHTGRAY,
    YELLOW,
    GREEN
} from '../utils/constants';
import GridBox from '../components/GridBox';

const COLORS = [LIGHTGRAY, DARKGRAY, YELLOW, GREEN];

const GamePage = ({
    route
}: {
    route: RouteProp<
        {
            params: Route;
        },
        'params'
    >;
}) => {
    const { gridLength } = route.params;
    const { gridWidth } = route.params;
    const { currentWord } = route.params;

    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [currentColumn, setCurrentColumn] = useState<number>(0);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupLoading, setPopupLoading] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>('');

    const [disabled, setDisabled] = useState<boolean>(false);

    const [keyboard, setKeyboard] = useState<Letter[][]>(initializeKeyboard());
    const [grid, setGrid] = useState<Letter[][]>(
        generateGrid(gridLength, gridWidth)
    );

    const updateGrid = async () => {
        let empty = false;
        grid[currentLevel].forEach((letter, index) => {
            if (letter.char === '') empty = true;
        });
        if (empty) {
            setPopupTimeout(
                'Du må fylle ut alle bokstavene før du gjetter!',
                false
            );
            return;
        }

        let guess = '';
        grid[currentLevel].forEach((letter, index) => {
            guess += letter.char;
        });
        const valid = await checkWordValidity(guess);

        if (valid) {
            updateColors(
                keyboard,
                setKeyboard,
                grid,
                setGrid,
                currentLevel,
                currentWord
            );
            setCurrentLevel(currentLevel + 1);
            setCurrentColumn(0);

            if (currentWord === guess.toLocaleLowerCase()) {
                setPopupTimeout(
                    'Du tippet riktig! Gå til hovedmenyen for å spille igjen',
                    true
                );
                setDisabled(true);
            } else if (currentLevel + 1 === gridLength) {
                setPopupTimeout(
                    'Du klarte det dessverre ikke denne gangen.',
                    true
                );
                setDisabled(true);
            }
        } else {
            setPopupTimeout('Dette ordet finnes ikke i listene våre', false);
        }
    };

    const onKeyboardPress = (letter: string) => {
        if (!disabled) {
            let tmp = grid;
            if (letter === '!') {
                updateGrid();
            } else if (letter === '<') {
                if (currentColumn > 0) {
                    tmp[currentLevel][currentColumn - 1].char = '';
                    setCurrentColumn(currentColumn - 1);
                }
            } else {
                if (currentColumn < gridWidth) {
                    tmp[currentLevel][currentColumn].char = letter;
                    setCurrentColumn(currentColumn + 1);
                }
            }
            setGrid(tmp);
        }
    };

    const setPopupTimeout = (message: string, done: boolean) => {
        setShowPopup(true);
        setPopupMessage(message);

        if (!done && !popupLoading) {
            setPopupLoading(true);
            setTimeout(() => {
                setPopupLoading(false);
                setShowPopup(false);
                setPopupMessage('');
            }, 3000);
        }
    };

    return (
        <View style={styles.container}>
            <View>
                {grid.map((row, rowIndex) => {
                    return (
                        <View style={styles.gridContainer} key={rowIndex}>
                            {row.map((col, colIndex) => {
                                return (
                                    <LetterContainer
                                        color={COLORS[col.status]}
                                        key={colIndex}
                                    >
                                        <GridBox letter={col.char} />
                                    </LetterContainer>
                                );
                            })}
                        </View>
                    );
                })}
                <InformationPopup
                    message={popupMessage}
                    showPopup={showPopup}
                />

                <KeyboardContainer
                    onKeyboardPress={onKeyboardPress}
                    keyboard={keyboard}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND,
        alignItems: 'center',
        paddingTop: 10
    },
    gridContainer: {
        flexDirection: 'row',
        marginVertical: 8,
        width: '100%'
    }
});

export default GamePage;
