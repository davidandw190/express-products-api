import mongoose from 'mongoose';
import config from 'config';
 
function connect() {
    const dbUri = config.get<string>("DB_URI");

    return mongoose.connect(dbUri)
        .then(() => {
            console.log('Connected to the DB...');
        
        }).catch((error) => {
            console.error("Could not connect to DB: " + error);
            process.exit(1);
        });
        


}