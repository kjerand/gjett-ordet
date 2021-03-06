export const updateColors = (
    keyboard: Letter[][],
    setKeyboard: CallableFunction,
    grid: Letter[][],
    setGrid: CallableFunction,
    currentLevel: number,
    currentWord: string
) => {
    let remanining: string[] = [];
    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] !== grid[currentLevel][i].char) {
            remanining.push(currentWord[i]);
        }
    }

    grid[currentLevel].forEach((letter, index) => {
        if (letter.char === currentWord[index]) {
            let tmp = grid;
            tmp[currentLevel][index].status = 3;
            setGrid(tmp);
            updateKeyboard(setKeyboard, keyboard, 3, letter.char);
            return;
        }

        for (let i = 0; i < remanining.length; i++) {
            if (letter.char === remanining[i]) {
                remanining.splice(i, 1);
                let tmp = grid;
                tmp[currentLevel][index].status = 2;
                setGrid(tmp);
                updateKeyboard(setKeyboard, keyboard, 2, letter.char);
                return;
            }
        }
        let tmp = grid;
        tmp[currentLevel][index].status = 1;
        setGrid(tmp);
        updateKeyboard(setKeyboard, keyboard, 1, letter.char);
    });
};

const updateKeyboard = (
    setKeyboard: CallableFunction,
    keyboard: Letter[][],
    status: number,
    letter: string
) => {
    keyboard.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col.char === letter.toUpperCase()) {
                let tmp = keyboard;
                if (status > tmp[rowIndex][colIndex].status) {
                    tmp[rowIndex][colIndex].status = status;
                    setKeyboard(tmp);
                }
            }
        });
    });
};
