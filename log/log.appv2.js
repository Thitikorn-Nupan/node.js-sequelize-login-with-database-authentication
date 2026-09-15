import fs from 'node:fs';
import path from 'node:path';
import winston from 'winston';

const {combine, timestamp, colorize, errors, splat, printf} = winston.format;
const levels = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
    trace: 8
};

function formatMessage(filename, includeColors = false) {
    const line = printf(({timestamp: time, level, message, stack, ...metadata}) => {
        const text = stack || message;
        const extra = Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : '';
        return `${time} ${level}: [${filename}] ${text}${extra}`;
    });
    return combine(
        errors({stack: true}),
        splat(),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        line, // this format as `${time} ${level}: [${filename}] ${text}${extra}`
        // ... (spread syntax)
        // behaves like this when colors are enabled: colorize({ all: true })
        // And like this when colors are disabled: this line below is gone
        ...(includeColors ? [colorize({all: true})] : [])
    );
}

export function createLogger(filename) {
    const logDirectory = path.resolve(process.cwd(), 'file_log');
    fs.mkdirSync(logDirectory, {recursive: true}); // Indicates whether parent folders should be created. If a folder was created, the path to the first created folder will be returned
    return winston.createLogger({
        levels : levels,
        level: 'trace',
        transports: [
            new winston.transports.Console({
                level: 'trace',
                format: formatMessage(filename, true)
            }),
            new winston.transports.File({
                level: 'trace',
                filename: path.join(logDirectory, 'app.log'),
                format: formatMessage(filename)
            })
        ]
    });
}