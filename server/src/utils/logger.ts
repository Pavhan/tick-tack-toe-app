import config from '@/config';

type Logger = (prefix: string, ...args: unknown[]) => void;

const baseLogger: Logger = (_prefix, ...args) => {
  console.log(...args);
};

const prefixedLogger: Logger = (prefix, ...args) => {
  if (prefix) {
    console.log(`${prefix} `, ...args);
    return;
  }

  console.log(...args);
};

export const logger: Logger = config.isProduction ? baseLogger : prefixedLogger;

export default logger;

