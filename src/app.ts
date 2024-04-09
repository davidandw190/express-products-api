import express from 'express';
import config from 'config';
import { dbConnect } from './utils/db-connect.utils';
import { log } from './utils/logger.utils';
import { routes } from './routes';
import { deserializeUser } from './middleware/deserialization.middleware';

const port = config.get<number>('SERVER_PORT');
const host = config.get<string | number>('SERVER_HOST');

const app = express();

app.use(express.json());

app.use(deserializeUser);

app.listen(port, async () => {
  log.info(`App is running on http://${host}:${port}`);

  await dbConnect();

  routes(app);
});
