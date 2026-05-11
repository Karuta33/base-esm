import chalk from 'chalk';

export const color = (text, colorName) => {
    return !colorName ? chalk.green(text) : chalk.keyword(colorName)(text);
};

export const bgcolor = (text, bgcolorName) => {
    return !bgcolorName ? chalk.green(text) : chalk.bgKeyword(bgcolorName)(text);
};

export const mylog = (text, colorName) => {
    return !colorName 
        ? chalk.greenBright('[ WHATSAPP BOT ] ') + chalk.magentaBright(text) 
        : chalk.greenBright('[ WHATSAPP BOT ] ') + chalk.keyword(colorName)(text);
};

export const infolog = (text) => {
    return chalk.greenBright('[ WHATSAPP BOT ] ') + chalk.magentaBright(text);
};
