import express from 'express';
import config from 'config';
import { connect } from './utils/connect';
import { log } from './utils/logger';
import { routes } from './routes';

const port = config.get<number>('SERVER_PORT');

const app = express();

app.listen(port, async  () => {
    log.info(`App is running on http://localhost:${port}`);

    await connect()

    routes(app);
})