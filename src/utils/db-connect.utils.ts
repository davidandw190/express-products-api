import { log } from './logger.utils';
import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database.
 * @returns A promise that resolves when the connection is successfully established.
 * @throws Error if connection to the database fails.
 */
export async function dbConnect(): Promise<void> {
  const dbUri = process.env.DB_URI || 'asd';

  return mongoose
    .connect(dbUri)
    .then(() => {
      log.info('Connected to the database.');
    })
    .catch((error: unknown) => {
      log.error('Failed to connect to the database:', error);
      throw new Error('Could not connect to the database.');
    });
}
