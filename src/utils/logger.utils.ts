import logger from 'pino';
import dayjs from 'dayjs';

/**
 * Custom logger instance with Pino.
 * @remarks This logger is configured with a timestamp using Day.js.
 */
export const log = logger({
  base: { pid: false },
  /**
   * Generates a timestamp in ISO 8601 format using Day.js.
   * @returns A string representing the timestamp.
   */
  timestamp: () => `,"time":"${dayjs().format()}"`,
});
