import solutions from '../assets/solutions.json';
export const getRandomWord = () => {
    let words = solutions.words;
    const index = Math.floor(Math.random() * words.length);

    return words[index];
};
