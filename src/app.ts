import { createServer } from './utils/server.utils';
import { dbConnect } from './utils/db-connect.utils';
import dotenv from 'dotenv';
import { log } from './utils/logger.utils';

const envLoaded = dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });
if (envLoaded.error) {
  console.error('Failed to load environment variables:', envLoaded.error);
  process.exit(1);
}

const port = process.env.SERVER_PORT || 3000;
const host = process.env.SERVER_HOST || 'localhost';
const app = createServer();

app.listen(port, async () => {
  log.info(`App is running on http://${host}:${port}`);

  await dbConnect();
});
