import mongoose from 'mongoose';
import config from 'config';
import { log } from './logger';

 
export function connect() {
    const dbUri = config.get<string>("DB_URI");

    return mongoose.connect(dbUri)
        .then(() => {
            log.info('Connected to the DB...');
        
        }).catch((error) => {
            log.error("Could not connect to DB: " + error);
            process.exit(1);
        });
}